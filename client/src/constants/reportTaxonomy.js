export const REPORT_TAXONOMY = {
  PHISHING_IMPERSONATION: {
    label: "Phishing & Impersonation",
    subcategories: [
      { value: "EMAIL_PHISHING", label: "Email Phishing" },
      { value: "SMISHING", label: "Smishing (SMS Phishing)" },
      { value: "VISHING", label: "Vishing (Voice Scam)" },
      { value: "BUSINESS_EMAIL_COMPROMISE", label: "Business Email Compromise" },
      { value: "FAKE_SUPPORT_SCAM", label: "Fake Support Scam" },
      { value: "IMPERSONATION_SCAM", label: "Impersonation Scam" }
    ]
  },
  FINANCIAL_FRAUD: {
    label: "Financial Fraud",
    subcategories: [
      { value: "UPI_SCAM", label: "UPI Scam" },
      { value: "BANK_FRAUD", label: "Bank Fraud" },
      { value: "CREDIT_CARD_FRAUD", label: "Credit Card Fraud" },
      { value: "REFUND_SCAM", label: "Refund Scam" },
      { value: "LOTTERY_SCAM", label: "Lottery Scam" },
      { value: "INVESTMENT_SCAM", label: "Investment Scam" },
      { value: "CRYPTO_SCAM", label: "Crypto Scam" },
      { value: "LOAN_SCAM", label: "Loan Scam" }
    ]
  },
  ACCOUNT_SECURITY: {
    label: "Account Security",
    subcategories: [
      { value: "ACCOUNT_TAKEOVER", label: "Account Takeover" },
      { value: "OTP_THEFT", label: "OTP Theft" },
      { value: "PASSWORD_THEFT", label: "Password Theft" },
      { value: "FAKE_LOGIN_PAGE", label: "Fake Login Page" },
      { value: "CREDENTIAL_LEAK", label: "Credential Leak" },
      { value: "SOCIAL_MEDIA_HACK", label: "Social Media Hack" },
      { value: "ACCOUNT_RECOVERY_SCAM", label: "Account Recovery Scam" }
    ]
  },
  MARKETPLACE_COMMERCE: {
    label: "Marketplace & Commerce",
    subcategories: [
      { value: "FAKE_DELIVERY_SCAM", label: "Fake Delivery Scam" },
      { value: "MARKETPLACE_SELLER_SCAM", label: "Marketplace Seller Scam" },
      { value: "FAKE_SELLER", label: "Fake Seller" },
      { value: "RENTAL_SCAM", label: "Rental Scam" },
      { value: "TICKET_SCAM", label: "Ticket Scam" }
    ]
  },
  EMPLOYMENT_SCAMS: {
    label: "Employment Scams",
    subcategories: [{ value: "FAKE_JOB_OFFER", label: "Fake Job Offer" }]
  },
  MALWARE_TECH_ABUSE: {
    label: "Malware & Tech Abuse",
    subcategories: [
      { value: "MALWARE_LINK", label: "Malware Link" },
      { value: "RANSOMWARE", label: "Ransomware" },
      { value: "SPYWARE", label: "Spyware" },
      { value: "APK_SCAM", label: "APK Scam" },
      { value: "REMOTE_ACCESS_SCAM", label: "Remote Access Scam" },
      { value: "QR_SCAM", label: "QR Scam" }
    ]
  },
  HARASSMENT_ABUSE: {
    label: "Harassment & Abuse",
    subcategories: [
      { value: "HARASSMENT", label: "Harassment" },
      { value: "EXTORTION", label: "Extortion" },
      { value: "BLACKMAIL", label: "Blackmail" }
    ]
  },
  IDENTITY_DATA_THEFT: {
    label: "Identity / Data Theft",
    subcategories: [
      { value: "IDENTITY_THEFT", label: "Identity Theft" },
      { value: "DATA_LEAK", label: "Data Leak" },
      { value: "KYC_FRAUD", label: "KYC Fraud" }
    ]
  },
  OTHER: {
    label: "Other",
    subcategories: [{ value: "SUSPICIOUS_OTHER", label: "Suspicious Other" }]
  }
};

export const REPORT_CATEGORY_OPTIONS = Object.entries(REPORT_TAXONOMY).map(([value, config]) => ({
  value,
  label: config.label
}));

export const REPORT_SEVERITY_OPTIONS = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" }
];

export const REPORT_SOURCE_CHANNEL_OPTIONS = [
  { value: "SMS", label: "SMS" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TELEGRAM", label: "Telegram" },
  { value: "PHONE_CALL", label: "Phone Call" },
  { value: "WEBSITE", label: "Website" },
  { value: "MARKETPLACE", label: "Marketplace" },
  { value: "UNKNOWN", label: "Unknown" }
];

export const REPORT_STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "NEED_MORE_INFO", label: "Need More Info" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
  { value: "DUPLICATE", label: "Duplicate" },
  { value: "FALSE_POSITIVE", label: "False Positive" },
  { value: "ESCALATED", label: "Escalated" },
  { value: "SENSITIVE_HOLD", label: "Sensitive Hold" },
  { value: "ARCHIVED", label: "Archived" }
];

export const REPORT_PUBLIC_STATUS_VALUES = new Set([
  "SUBMITTED",
  "UNDER_REVIEW",
  "INVESTIGATING",
  "NEED_MORE_INFO",
  "RESOLVED",
  "CLOSED"
]);

const LEGACY_LABELS = {
  PENDING: "Submitted",
  REVIEWED: "Under Review",
  PHISHING: "Phishing & Impersonation",
  SCAM: "Financial Fraud",
  HARASSMENT: "Harassment & Abuse"
};

export const REPORT_SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "severity", label: "Severity High → Low" },
  { value: "status", label: "Status" },
  { value: "sensitive", label: "Sensitive First" }
];

export const REPORT_CATEGORY_ALIASES = {
  PHISHING: "PHISHING_IMPERSONATION",
  SCAM: "FINANCIAL_FRAUD",
  HARASSMENT: "HARASSMENT_ABUSE",
  OTHER: "OTHER"
};

export const REPORT_STATUS_ALIASES = {
  PENDING: "SUBMITTED",
  REVIEWED: "UNDER_REVIEW",
  RESOLVED: "RESOLVED"
};

export const normalizeReportCategory = (value) => REPORT_CATEGORY_ALIASES[value] || value || "OTHER";

export const normalizeReportStatus = (value) => REPORT_STATUS_ALIASES[value] || value || "SUBMITTED";

export const normalizeReportSeverity = (value) => value || "LOW";

export const normalizeReportSourceChannel = (value) => value || "UNKNOWN";

export const getSubcategoryOptions = (category) => REPORT_TAXONOMY[normalizeReportCategory(category)]?.subcategories || [];

export const getCategoryLabel = (category) => REPORT_TAXONOMY[normalizeReportCategory(category)]?.label || category;

export const getSubcategoryLabel = (subcategory) => {
  for (const category of Object.values(REPORT_TAXONOMY)) {
    const found = category.subcategories.find((option) => option.value === subcategory);
    if (found) return found.label;
  }
  return subcategory;
};

export const getSourceChannelLabel = (value) =>
  REPORT_SOURCE_CHANNEL_OPTIONS.find((option) => option.value === normalizeReportSourceChannel(value))?.label || value;

export const getStatusLabel = (value) =>
  REPORT_STATUS_OPTIONS.find((option) => option.value === normalizeReportStatus(value))?.label || LEGACY_LABELS[value] || value;
