// Configuration URLs.
// Triple Pixel is the only MSP-specific document in Configuration.
// Everything else in Configuration is shared across platforms.
var CONFIGURATION_URLS = {
  triplePixelByMsp: {
    shopify: "https://example.com/shopify/triple-pixel",
    woocommerce: "https://example.com/woocommerce/triple-pixel",
    bigcommerce: "https://example.com/bigcommerce/triple-pixel",
    custom: "https://example.com/custom/triple-pixel"
  },
  headlessTriplePixel: "https://example.com/headless/triple-pixel",
  sharedItems: {
    integrations: "https://example.com/integrations",
    utms: "https://example.com/utms",
    sonarSend: "https://example.com/sonar-send",
    sonarOptimize: "https://example.com/sonar-optimize",
    postPurchaseSurvey: "https://example.com/post-purchase-survey",
    cogs: "https://example.com/cogs",
    shippingCosts: "https://example.com/shipping-costs",
    handlingFees: "https://example.com/handling-fees",
    expenses: "https://example.com/expenses",
    subscriptionOrders: "https://example.com/subscription-orders",
    affiliatesAndInfluencers: "https://example.com/affiliates-and-influencers"
  },
  addonCallouts: {
    conversion: {
      badgeLabel: "Add-on",
      title: "Conversion",
      description: "",
      items: [
        { label: "Set up Custom Events", url: "https://example.com/add-ons/conversion/setup-custom-events" }
      ]
    }
  }
};

function getConfigurationItems(triplePixelUrl) {
  return [
    { itemKey: "triplePixel", label: "Install your Triple Pixel", url: triplePixelUrl },
    { label: "Connect Integrations", url: CONFIGURATION_URLS.sharedItems.integrations },
    { label: "Add required UTMs", url: CONFIGURATION_URLS.sharedItems.utms },
    {
      itemKey: "sonar",
      label: "Enable",
      linkLabelWhenSingleLink: true,
      links: [
        { linkKey: "sonarSend", label: "Sonar Send", url: CONFIGURATION_URLS.sharedItems.sonarSend },
        { linkKey: "sonarOptimize", label: "Sonar Optimize", url: CONFIGURATION_URLS.sharedItems.sonarOptimize }
      ]
    },
    { label: "Configure and install your Post Purchase Survey", url: CONFIGURATION_URLS.sharedItems.postPurchaseSurvey },
    {
      itemKey: "costs",
      label: "Define",
      links: [
        { linkKey: "cogs", label: "COGS", url: CONFIGURATION_URLS.sharedItems.cogs },
        { linkKey: "shippingCosts", label: "Shipping Costs", url: CONFIGURATION_URLS.sharedItems.shippingCosts },
        { linkKey: "handlingFees", label: "Handling Fees", url: CONFIGURATION_URLS.sharedItems.handlingFees },
        { linkKey: "expenses", label: "Expenses", url: CONFIGURATION_URLS.sharedItems.expenses }
      ]
    },
    {
      itemKey: "mapping",
      label: "Map",
      linkJoinStyle: "comma",
      links: [
        { linkKey: "subscriptionOrders", label: "Subscription Orders", url: CONFIGURATION_URLS.sharedItems.subscriptionOrders },
        { linkKey: "affiliatesAndInfluencers", label: "Affiliates and Influencers", url: CONFIGURATION_URLS.sharedItems.affiliatesAndInfluencers }
      ]
    }
  ];
}

// Activation URLs.
// Activation docs are shared across MSPs. Package and included add-on callouts layer on below.
var ACTIVATION_URLS = {
  sharedItems: {
    summaryDashboard: "https://example.com/activation/summary-dashboard",
    attributionDashboard: "https://example.com/activation/attribution-dashboard",
    creativeAnalysis: "https://example.com/activation/creative-analysis",
    cohortAnalysis: "https://example.com/activation/cohort-analysis",
    customerSegments: "https://example.com/activation/customer-segments",
    aiVisibility: "https://example.com/activation/ai-visibility",
    moby: "https://example.com/activation/moby"
  },
  packageAdditions: {
    professional: {
      mmm: "https://example.com/activation/mmm",
      incrementality: "https://example.com/activation/incrementality"
    }
  },
  addonCallouts: {
    retention: {
      badgeLabel: "Add-on",
      title: "Retention",
      description: "",
      items: [
        { label: "Sync customer segments", url: "https://example.com/add-ons/retention/sync-customer-segments" }
      ]
    }
  }
};

function getActivationItems() {
  return [
    { itemKey: "summaryDashboard", label: "Summary Dashboard", url: ACTIVATION_URLS.sharedItems.summaryDashboard },
    { itemKey: "attributionDashboard", label: "Attribution Dashboard", url: ACTIVATION_URLS.sharedItems.attributionDashboard },
    { itemKey: "creativeAnalysis", label: "Creative Analysis", url: ACTIVATION_URLS.sharedItems.creativeAnalysis },
    { itemKey: "cohortAnalysis", label: "Cohort Analysis", url: ACTIVATION_URLS.sharedItems.cohortAnalysis },
    { itemKey: "customerSegments", label: "Customer Segments", url: ACTIVATION_URLS.sharedItems.customerSegments },
    { itemKey: "aiVisibility", label: "AI Visibility", url: ACTIVATION_URLS.sharedItems.aiVisibility },
    { itemKey: "moby", label: "Moby", url: ACTIVATION_URLS.sharedItems.moby }
  ];
}

function getProfessionalActivationItems() {
  return [
    { itemKey: "mmm", label: "Getting Started with MMM", url: ACTIVATION_URLS.packageAdditions.professional.mmm },
    { itemKey: "incrementality", label: "Getting Started with Incrementality", url: ACTIVATION_URLS.packageAdditions.professional.incrementality }
  ];
}

window.BOOKING_PAGE_LINKS = {
  // Booking link routing.
  // The page accepts `?cohort=` and swaps regional booking URLs when supported.
  // `?cohort=growth` switches the page into the office-hours quickstart layout.
  // `?msp=custom` can also override those booking URLs with custom-team routers.
  bookingRouting: {
    cohortQueryParam: "cohort"
  },

  // Main booking buttons on each region card.
  // `dataLinkKey` must match the `data-link` attribute in index.html.
  bookingButtons: {
    americasCard: {
      label: "Book Americas",
      dataLinkKey: "americas",
      url: "https://example.com/americas",
      mspUrls: {
        custom: "https://example.com/custom/americas"
      },
      cohortUrls: {
        smb: "https://example.com/smb/americas",
        mm: "https://example.com/mm/americas",
        ent: "https://example.com/ent/americas"
      }
    },
    emeaCard: {
      label: "Book EMEA",
      dataLinkKey: "emea",
      url: "https://example.com/emea",
      mspUrls: {
        custom: "https://example.com/custom/emea"
      },
      cohortUrls: {
        smb: "https://example.com/smb/emea",
        mm: "https://example.com/mm/emea",
        ent: "https://example.com/ent/emea"
      }
    },
    apacCard: {
      label: "Book APAC",
      dataLinkKey: "apac",
      url: "https://example.com/apac",
      mspUrls: {
        custom: "https://example.com/custom/apac"
      },
      cohortUrls: {
        smb: "https://example.com/smb/apac",
        mm: "https://example.com/mm/apac",
        ent: "https://example.com/ent/apac"
      }
    }
  },

  // Secondary coverage link under "Need full team coverage?"
  // `dataLinkKey` must match the `data-link` attribute in index.html.
  additionalCoverageLink: {
    worldwideAvailability: {
      label: "View worldwide availability",
      dataLinkKey: "worldwide",
      url: "https://example.com/worldwide",
      mspUrls: {
        custom: "https://example.com/custom/worldwide"
      },
      cohortUrls: {
        smb: "https://example.com/smb/worldwide",
        mm: "https://example.com/mm/worldwide",
        ent: "https://example.com/ent/worldwide"
      }
    }
  },

  // Session buttons shown when `?cohort=growth` is active.
  growthExperience: {
    officeHoursSheet: {
      functionPath: "/.netlify/functions/office-hours-config",
      sheetId: "1Z9guUZ4pvaDmb_HNl4tAeo9YUaMC8I_v-YhY6zuohLM",
      sheetName: "OfficeHours",
      sheetUrl: "https://docs.google.com/spreadsheets/d/1Z9guUZ4pvaDmb_HNl4tAeo9YUaMC8I_v-YhY6zuohLM/edit?usp=sharing"
    },
    officeHoursTuesday: {
      label: "Tuesday - 3-4 PM ET",
      day: "Tuesday",
      dayIndex: 2,
      startTimeEt: "3:00 PM",
      endTimeEt: "4:00 PM",
      dataLinkKey: "officeHoursTuesday",
      url: "https://triplewhale.zoom.us/j/84126057531"
    },
    officeHoursWednesday: {
      label: "Wednesday - 5-6 PM ET",
      day: "Wednesday",
      dayIndex: 3,
      startTimeEt: "5:00 PM",
      endTimeEt: "6:00 PM",
      dataLinkKey: "officeHoursWednesday",
      url: "https://triplewhale.zoom.us/j/84126057531"
    },
    officeHoursThursday: {
      label: "Thursday - 10-11 AM ET",
      day: "Thursday",
      dayIndex: 4,
      startTimeEt: "10:00 AM",
      endTimeEt: "11:00 AM",
      dataLinkKey: "officeHoursThursday",
      url: "https://triplewhale.zoom.us/j/84126057531"
    }
  },

  // Resource routing for the two onboarding cards.
  // The page accepts `?msp=`, `?headless=`, `?package=`, `?hasConversion=`, and `?hasRetention=` query params.
  // Matching is case-insensitive. Missing, empty, or unknown MSP values fall back to Shopify.
  resourceRouting: {
    queryParam: "msp",
    defaultMsp: "shopify",
    headlessQueryParam: "headless",
    defaultHeadless: false,
    packageQueryParam: "package",
    defaultPackage: "advanced",
    featureFlagQueryParams: {
      conversion: "hasConversion",
      retention: "hasRetention"
    }
  },

  // Onboarding resource content for the two info cards.
  // `sectionKey` must match `data-resource-section` / `data-resource-list` in index.html.
  checklistSections: {
    beforeKickoff: {
      timingLabel: "Initial account setup",
      title: "Configuration",
      description: "Complete as much setup as you can before your kickoff so we can validate faster on the call and create a clear path into activation.",
      sectionKey: "beforeKickoff",
      headlessItemOverrides: {
        triplePixel: {
          url: CONFIGURATION_URLS.headlessTriplePixel
        }
      },
      itemsByMsp: {
        shopify: getConfigurationItems(CONFIGURATION_URLS.triplePixelByMsp.shopify),
        woocommerce: getConfigurationItems(CONFIGURATION_URLS.triplePixelByMsp.woocommerce),
        bigcommerce: getConfigurationItems(CONFIGURATION_URLS.triplePixelByMsp.bigcommerce),
        custom: getConfigurationItems(CONFIGURATION_URLS.triplePixelByMsp.custom)
      },
      packageOverrides: {
        starter: {
          hiddenLinkKeysByItemKey: {
            sonar: ["sonarOptimize"]
          }
        }
      },
      calloutFlag: "conversion",
      callout: CONFIGURATION_URLS.addonCallouts.conversion
    },
    kickoffOutcomes: {
      timingLabel: "Once configured",
      title: "Activation",
      description: "After your kickoff, your team should know what is configured, what still needs to be finished, and what to focus on as activation begins.",
      sectionKey: "kickoffOutcomes",
      items: getActivationItems(),
      packageOverrides: {
        starter: {
          hiddenItemKeys: ["creativeAnalysis", "cohortAnalysis", "customerSegments"]
        },
        professional: {
          additionalItems: getProfessionalActivationItems()
        }
      },
      calloutFlag: "retention",
      callout: ACTIVATION_URLS.addonCallouts.retention
    }
  }
};
