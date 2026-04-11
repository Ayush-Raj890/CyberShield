import {
  REPORT_CATEGORY_VALUES,
  REPORT_SEVERITY_VALUES,
  REPORT_SOURCE_CHANNEL_VALUES,
  REPORT_STATUS_VALUES,
  REPORT_SUBCATEGORY_VALUES,
  normalizeReportCategory,
  normalizeReportSeverity,
  normalizeReportSourceChannel,
  normalizeReportStatus,
  REPORT_SEVERITY_RANKS,
  REPORT_STATUS_RANKS
} from "../constants/reportTaxonomy.js";

const DEFAULT_LIMIT = 10;
const VALID_SORT_VALUES = new Set(["newest", "oldest", "severity", "status", "sensitive"]);

const toStringValue = (value) => String(value ?? "").trim();
const toSearchValue = (value) => toStringValue(value).toLowerCase();
const toQueryToken = (value) => toStringValue(value)
  .replace(/[^A-Za-z0-9]+/g, "_")
  .replace(/_+/g, "_")
  .replace(/^_|_$/g, "")
  .toUpperCase();

const normalizeQueryCategory = (value) => {
  const token = toQueryToken(value);
  if (!token) return "";
  const normalized = normalizeReportCategory(token);
  return REPORT_CATEGORY_VALUES.includes(normalized) ? normalized : "";
};

const normalizeQuerySubcategory = (value) => {
  const token = toQueryToken(value);
  return token && REPORT_SUBCATEGORY_VALUES.includes(token) ? token : "";
};

const normalizeQueryStatus = (value) => {
  const token = toQueryToken(value);
  if (!token) return "";
  const normalized = normalizeReportStatus(token);
  return REPORT_STATUS_VALUES.includes(normalized) ? normalized : "";
};

const normalizeQuerySeverity = (value) => {
  const token = toQueryToken(value);
  return token && REPORT_SEVERITY_VALUES.includes(token) ? token : "";
};

const normalizeQuerySource = (value) => {
  const token = toQueryToken(value);
  if (!token) return "";
  const normalized = normalizeReportSourceChannel(token);
  return REPORT_SOURCE_CHANNEL_VALUES.includes(normalized) ? normalized : "";
};

const matchesSearch = (report, search) => {
  if (!search) return true;

  const haystack = [
    report.title,
    report.description,
    report.category,
    report.subcategory,
    report.severity,
    report.sourceChannel,
    report.status
  ]
    .filter(Boolean)
    .map(toSearchValue)
    .join(" ");

  return haystack.includes(search);
};

const matchesSearchWithScope = (report, search, includeContactEmail = false) => {
  if (!includeContactEmail) {
    return matchesSearch(report, search);
  }

  const emailHaystack = [report.contactEmail].filter(Boolean).map(toSearchValue).join(" ");
  return matchesSearch(report, search) || emailHaystack.includes(search);
};

const getSeverityRank = (value) => REPORT_SEVERITY_RANKS[normalizeReportSeverity(value)] || 0;
const getStatusRank = (value) => REPORT_STATUS_RANKS[normalizeReportStatus(value)] || 0;

export const getListPagination = (query, maxLimit, fallbackLimit = DEFAULT_LIMIT) => {
  const rawPage = Number(query.page);
  const rawLimit = Number(query.limit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0
    ? Math.min(Math.floor(rawLimit), maxLimit)
    : Math.min(fallbackLimit, maxLimit);

  return { page, limit };
};

export const filterAndSortReports = (reports, query = {}) => {
  const search = toSearchValue(query.q || query.search);
  const category = normalizeQueryCategory(query.category);
  const subcategory = normalizeQuerySubcategory(query.subcategory);
  const status = normalizeQueryStatus(query.status);
  const severity = normalizeQuerySeverity(query.severity);
  const source = normalizeQuerySource(query.source || query.sourceChannel);
  const includeContactEmail = String(query.includeContactEmail || query.internalSearch || "").toLowerCase() === "true";
  const sort = VALID_SORT_VALUES.has(toStringValue(query.sort || "newest").toLowerCase())
    ? toStringValue(query.sort || "newest").toLowerCase()
    : "newest";

  const filtered = reports.filter((report) => {
    const normalizedCategory = normalizeReportCategory(report.category);
    const normalizedStatus = normalizeReportStatus(report.status);
    const normalizedSeverity = normalizeReportSeverity(report.severity);
    const normalizedSource = normalizeReportSourceChannel(report.sourceChannel);
    const normalizedSubcategory = normalizeQuerySubcategory(report.subcategory);

    if (category && normalizedCategory !== category) return false;
    if (subcategory && normalizedSubcategory !== subcategory) return false;
    if (status && normalizedStatus !== status) return false;
    if (severity && normalizedSeverity !== severity) return false;
    if (source && normalizedSource !== source) return false;
    if (search && !matchesSearchWithScope(report, search, includeContactEmail)) return false;

    return true;
  });

  const sorted = [...filtered].sort((left, right) => {
    switch (sort) {
      case "oldest":
        return new Date(left.createdAt) - new Date(right.createdAt);
      case "severity": {
        const rankDelta = getSeverityRank(right.severity) - getSeverityRank(left.severity);
        return rankDelta || new Date(right.createdAt) - new Date(left.createdAt);
      }
      case "status": {
        const rankDelta = getStatusRank(left.status) - getStatusRank(right.status);
        return rankDelta || new Date(right.createdAt) - new Date(left.createdAt);
      }
      case "sensitive":
        return Number(right.isSensitive) - Number(left.isSensitive) || new Date(right.createdAt) - new Date(left.createdAt);
      case "newest":
      default:
        return new Date(right.createdAt) - new Date(left.createdAt);
    }
  });

  return sorted;
};

export const paginateReports = (reports, page, limit) => {
  const total = reports.length;
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const items = reports.slice(start, start + limit);
  const hasNextPage = safePage * limit < total;

  return {
    items,
    pagination: {
      page: safePage,
      limit,
      total,
      totalPages,
      hasNextPage
    }
  };
};
