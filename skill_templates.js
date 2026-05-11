// skillTemplates.js
// Reference file for all 9 AI Agent skill templates
// Used for: card display, thinking animation, personalization flags, batch logic
// Loaded as a plain browser script — no ES module syntax

var SKILLS = [
  {
    id: "order-status",
    title: "Order status, tracking or delivery timing",
    subtitle: "Handled automatically",
    intents: ["Order / Status", "Shipping / Delay", "Shipping / Delivered Not Received"],
    batch: 1,
    tags: [], // Ready to go
    hardcodedValues: [
      { field: "processing_threshold_days", default: 5, label: "Days before flagging unshipped order as delayed" },
      { field: "delivery_delay_threshold_days", default: 9, label: "Days in transit before apologizing and handing over" },
    ],
    actions: [], // No actions — Shopify data only
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking fulfillment and shipment status",
      "Retrieving tracking information",
    ],
  },
  {
    id: "returns-exchanges",
    title: "Returns and exchanges",
    subtitle: "Handled automatically",
    intents: [
      "Return / Request", "Return / Status", "Return / Information", "Return / Other",
      "Exchange / Request", "Exchange / Status", "Exchange / Other",
    ],
    batch: 2, // Requires Loop or AfterShip — skip for M1 if not connected
    tags: ["needs-review", "connect-app"],
    hardcodedValues: [
      { field: "return_window_days", default: 60, label: "Days from purchase within which returns/exchanges are accepted" },
      { field: "processing_time_business_days", default: 10, label: "Business days to process return after item received" },
      { field: "refund_timeline_business_days", default: "3–5", label: "Business days for refund to appear after processing" },
      { field: "return_portal_url", default: null, label: "Return portal URL" },
    ],
    actions: ["Send return portal link"], // Requires Loop or AfterShip
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking return eligibility",
      "Retrieving return portal link",
    ],
  },
  {
    id: "damaged-defective",
    title: "Item is damaged, defective, broken or not working as expected",
    subtitle: "Handled automatically",
    intents: ["Order / Damaged", "Product / Quality Issues"],
    batch: 1,
    tags: ["needs-review"],
    hardcodedValues: [
      { field: "claim_window_days", default: 30, label: "Days after delivery within which damage claims are accepted" },
    ],
    actions: ["Reship Order"], // Shopify native — auto-connected
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking claim eligibility",
      "Reviewing order and customer tags for risk",
      "Preparing resolution options",
    ],
  },
  {
    id: "missing-items",
    title: "One or more items missing from an order",
    subtitle: "Handled automatically",
    intents: ["Order / Missing Item"],
    batch: 1,
    tags: [],
    hardcodedValues: [
      { field: "report_window_days", default: 30, label: "Days after delivery within which missing item claims are accepted" },
    ],
    actions: [], // No actions — hands over if item confirmed missing
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking delivery and fulfillment status",
      "Identifying reported missing items",
    ],
  },
  {
    id: "order-cancellation",
    title: "Order cancellation",
    subtitle: "Handled automatically",
    intents: ["Order / Cancel"],
    batch: 1,
    tags: ["needs-review"],
    hardcodedValues: [
      { field: "cancellation_window_hours", default: 1, label: "Hours after order placement within which cancellation is allowed" },
    ],
    actions: ["Cancel Order"], // Shopify native — auto-connected
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking cancellation eligibility",
      "Preparing some options",
    ],
  },
  {
    id: "subscription-cancellations",
    title: "Subscription cancellations",
    subtitle: "Handled automatically",
    intents: ["Subscription / Cancel"],
    batch: 2, // Requires subscription provider — skip for M1 if not connected
    tags: ["needs-review", "connect-app"],
    hardcodedValues: [
      { field: "subscription_portal_url", default: null, label: "Self-service subscription portal URL" },
    ],
    actions: ["Cancel Subscription", "Cancel Order"], // Requires Recharge, Loop, Bold, etc.
    thinkingSteps: [
      "Locating the customer's subscription",
      "Checking subscription status",
      "Preparing some options",
    ],
  },
  {
    id: "promo-codes",
    title: "Promo codes and free shipping",
    subtitle: "Handled automatically",
    intents: ["Promotion & Discount / Information", "Promotion & Discount / Issue", "Promotion & Discount / Other"],
    batch: 1,
    tags: [], // Ready to go
    hardcodedValues: [], // No hardcoded policy values
    actions: [], // No actions — informational only
    thinkingSteps: [
      "Checking applied discount codes on the order",
      "Reviewing promo code validity",
    ],
  },
  {
    id: "shipping-address",
    title: "Shipping address updates or edits in an order",
    subtitle: "Handled automatically",
    intents: ["Shipping / Change Address"],
    batch: 1,
    tags: ["needs-review"],
    hardcodedValues: [
      { field: "address_change_window_hours", default: 2, label: "Hours after order placement within which address changes are allowed" },
    ],
    actions: ["Update Shipping Address"], // Shopify native — auto-connected
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking if address change is still possible",
      "Preparing some options",
    ],
  },
  {
    id: "product-edits",
    title: "Product edits in an order (replace product, remove product)",
    subtitle: "Handled automatically",
    intents: ["Order / Edit"],
    batch: 1,
    tags: ["needs-review"],
    hardcodedValues: [
      { field: "edit_window_hours", default: 2, label: "Hours after order placement within which product edits are allowed" },
    ],
    actions: ["Remove Order Item", "Replace Order Item"], // Shopify native — auto-connected
    thinkingSteps: [
      "Looking up the customer's order",
      "Checking if the order is still editable",
      "Preparing some options",
    ],
  },
];

// Ordered by ticket volume (descending) — use this for display order
var SKILLS_BY_VOLUME = [
  "order-status",
  "returns-exchanges",
  "damaged-defective",
  "order-cancellation",
  "missing-items",
  "promo-codes",
  "shipping-address",
  "product-edits",
];

// Top skills shown during onboarding (volume-ordered, includes batch 2 skills like returns-exchanges)
// Ready-to-enable first, then needs-review (progression of effort + value)
var ONBOARDING_SKILLS = [
  "order-status",
  "missing-items",
  "promo-codes",
  "returns-exchanges",
  "damaged-defective",
  "order-cancellation",
];

// Helper: get skill by id
var getSkill = function (id) { return SKILLS.find(function (s) { return s.id === id; }); };

// Helper: get skills in volume order
var getSkillsOrdered = function () {
  return SKILLS_BY_VOLUME.map(function (id) { return getSkill(id); }).filter(Boolean);
};

// Helper: get batch 1 skills only
var getBatch1Skills = function () {
  return getSkillsOrdered().filter(function (s) { return s.batch === 1; });
};

// Helper: get skills shown during onboarding
var getOnboardingSkills = function () {
  return ONBOARDING_SKILLS.map(function (id) { return getSkill(id); }).filter(Boolean);
};
