function jsonResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}

function parseCsv(text) {
  var rows = [];
  var row = [];
  var value = "";
  var index = 0;
  var insideQuotes = false;

  while (index < text.length) {
    var char = text[index];
    var nextChar = text[index + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        value += '"';
        index += 2;
        continue;
      }

      if (char === '"') {
        insideQuotes = false;
        index += 1;
        continue;
      }

      value += char;
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      index += 1;
      continue;
    }

    if (char === ",") {
      row.push(value);
      value = "";
      index += 1;
      continue;
    }

    if (char === "\r" && nextChar === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      index += 2;
      continue;
    }

    if (char === "\n" || char === "\r") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      index += 1;
      continue;
    }

    value += char;
    index += 1;
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows;
}

function trimCell(value) {
  return value === null || typeof value === "undefined" ? "" : String(value).trim();
}

function normalizeHeader(value) {
  return trimCell(value).toLowerCase();
}

function sanitizeSheetId(value) {
  var normalizedValue = trimCell(value);
  return /^[A-Za-z0-9_-]+$/.test(normalizedValue) ? normalizedValue : null;
}

function sanitizeSheetName(value) {
  var normalizedValue = trimCell(value || "OfficeHours");

  if (!normalizedValue || /[\r\n]/.test(normalizedValue) || normalizedValue.length > 120) {
    return null;
  }

  return normalizedValue;
}

function parseEnabledValue(value) {
  var normalizedValue = trimCell(value).toLowerCase();

  if (!normalizedValue) {
    return false;
  }

  return normalizedValue === "true"
    || normalizedValue === "yes"
    || normalizedValue === "y"
    || normalizedValue === "1";
}

function getDayMeta(dayValue) {
  var normalizedValue = trimCell(dayValue).toLowerCase();
  var dayMap = {
    sun: { label: "Sunday", index: 0 },
    sunday: { label: "Sunday", index: 0 },
    mon: { label: "Monday", index: 1 },
    monday: { label: "Monday", index: 1 },
    tue: { label: "Tuesday", index: 2 },
    tues: { label: "Tuesday", index: 2 },
    tuesday: { label: "Tuesday", index: 2 },
    wed: { label: "Wednesday", index: 3 },
    wednesday: { label: "Wednesday", index: 3 },
    thu: { label: "Thursday", index: 4 },
    thur: { label: "Thursday", index: 4 },
    thurs: { label: "Thursday", index: 4 },
    thursday: { label: "Thursday", index: 4 },
    fri: { label: "Friday", index: 5 },
    friday: { label: "Friday", index: 5 },
    sat: { label: "Saturday", index: 6 },
    saturday: { label: "Saturday", index: 6 }
  };

  return dayMap[normalizedValue] || null;
}

function parseClockTime(value) {
  var normalizedValue = trimCell(value)
    .replace(/\./g, "")
    .replace(/\s+/g, " ")
    .toUpperCase();
  var match = normalizedValue.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);

  if (!match) {
    return null;
  }

  var hour = parseInt(match[1], 10);
  var minute = parseInt(match[2] || "0", 10);
  var meridiem = match[3];

  if (isNaN(hour) || isNaN(minute) || hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }

  var hour24 = hour % 12;
  if (meridiem === "PM") {
    hour24 += 12;
  }

  return {
    hour24: hour24,
    minute: minute,
    label: (hour % 12 || 12) + ":" + String(minute).padStart(2, "0") + " " + meridiem,
    totalMinutes: (hour24 * 60) + minute
  };
}

function formatTimePart(timeDetails, includeMeridiem) {
  var hour = timeDetails.hour24 % 12 || 12;
  var minuteLabel = timeDetails.minute ? ":" + String(timeDetails.minute).padStart(2, "0") : "";
  var meridiem = timeDetails.hour24 >= 12 ? "PM" : "AM";

  return hour + minuteLabel + (includeMeridiem ? " " + meridiem : "");
}

function buildTimeRange(startTime, endTime) {
  var startMeridiem = startTime.hour24 >= 12 ? "PM" : "AM";
  var endMeridiem = endTime.hour24 >= 12 ? "PM" : "AM";

  return formatTimePart(startTime, startMeridiem !== endMeridiem) + "-" + formatTimePart(endTime, true);
}

function compareSessions(firstSession, secondSession) {
  if (firstSession.dayIndex !== secondSession.dayIndex) {
    return firstSession.dayIndex - secondSession.dayIndex;
  }

  return firstSession.startMinutes - secondSession.startMinutes;
}

function buildSessionFromRow(rowData) {
  if (!parseEnabledValue(rowData.enabled)) {
    return null;
  }

  var dayMeta = getDayMeta(rowData.day);
  var startTime = parseClockTime(rowData.start_time_et);
  var endTime = parseClockTime(rowData.end_time_et);
  var zoomUrl = trimCell(rowData.zoom_url);

  if (!dayMeta || !startTime || !endTime || !/^https?:\/\//i.test(zoomUrl)) {
    return null;
  }

  return {
    dayLabel: dayMeta.label,
    dayIndex: dayMeta.index,
    startTimeEt: startTime.label,
    endTimeEt: endTime.label,
    startMinutes: startTime.totalMinutes,
    endMinutes: endTime.totalMinutes,
    timeRange: buildTimeRange(startTime, endTime),
    zoomUrl: zoomUrl
  };
}

exports.handler = async function (event) {
  var query = event && event.queryStringParameters ? event.queryStringParameters : {};
  var sheetId = sanitizeSheetId(query.sheetId);
  var sheetName = sanitizeSheetName(query.sheetName);

  if (!sheetId || !sheetName) {
    return jsonResponse(400, {
      error: "Missing or invalid Google Sheet settings."
    });
  }

  var csvUrl = "https://docs.google.com/spreadsheets/d/" + sheetId + "/gviz/tq?tqx=out:csv&sheet=" + encodeURIComponent(sheetName);

  try {
    var upstreamResponse = await fetch(csvUrl, {
      headers: {
        Accept: "text/csv"
      }
    });

    if (!upstreamResponse.ok) {
      return jsonResponse(502, {
        error: "Unable to load office hours data from Google Sheets."
      });
    }

    var csvText = await upstreamResponse.text();
    var rows = parseCsv(csvText).filter(function (row) {
      return Array.isArray(row) && row.some(function (cell) {
        return trimCell(cell) !== "";
      });
    });

    if (!rows.length) {
      return jsonResponse(200, {
        source: "google-sheet",
        sheetId: sheetId,
        sheetName: sheetName,
        sessions: []
      });
    }

    var headers = rows[0].map(normalizeHeader);
    var sessions = rows.slice(1)
      .map(function (cells) {
        var rowData = {};

        headers.forEach(function (header, index) {
          if (!header) {
            return;
          }

          rowData[header] = trimCell(cells[index]);
        });

        return buildSessionFromRow(rowData);
      })
      .filter(function (session) { return !!session; })
      .sort(compareSessions);

    return jsonResponse(200, {
      source: "google-sheet",
      sheetId: sheetId,
      sheetName: sheetName,
      sessions: sessions
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Unable to refresh office hours data right now."
    });
  }
};
