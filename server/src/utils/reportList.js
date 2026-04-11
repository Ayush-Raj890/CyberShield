import {
  normalizeReportCategory,
  normalizeReportSeverity,
  normalizeReportSourceChannel,
  normalizeReportStatus,
  REPORT_SEVERITY_RANKS,
  REPORT_STATUS_RANKS
} from "../constants/reportTaxonomy.js";

const DEFAULT_LIMIT = 10;

const toStringValue = (value) => String(value ?? "").trim();
const toSearchValue = (value) => toStringValue(value).toLowerCase();

const matchesSearch = (report, search) => {
  if (!search) return true;

  const haystack = [
    report.title,
    report.description,
    report.category,
    report.subcategory,
    report.severity,
    report.sourceChannel,
    report.status,
    report.contactEmail
  ]
    .filter(Boolean)
    .map(toSearchValue)
    .join(" ");

  return haystack.includes(search);
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
  const category = query.category ? normalizeReportCategory(toStringValue(query.category)) : "";
  const subcategory = toStringValue(query.subcategory);
  const status = query.status ? normalizeReportStatus(toStringValue(query.status)) : "";
  const severity = toStringValue(query.severity);
  const source = toStringValue(query.source || query.sourceChannel);
  const sort = toStringValue(query.sort || "newest");

  const filtered = reports.filter((report) => {
    const normalizedCategory = normalizeReportCategory(report.category);
    const normalizedStatus = normalizeReportStatus(report.status);
    const normalizedSeverity = normalizeReportSeverity(report.severity);
    const normalizedSource = normalizeReportSourceChannel(report.sourceChannel);

    if (category && normalizedCategory !== category) return false;
    if (subcategory && toStringValue(report.subcategory) !== subcategory) return false;
    if (status && normalizedStatus !== status) return false;
    if (severity && normalizedSeverity !== severity) return false;
    if (source && normalizedSource !== source) return false;
    if (!matchesSearch(report, search)) return false;

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
  const totalPages = total > 0 ? Math.ceil(total / limit) : 0;
  const safePage = totalPages > 0 ? Math.min(page, totalPages) : 1;
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
