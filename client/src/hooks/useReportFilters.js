import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCategoryLabel,
  getSourceChannelLabel,
  getStatusLabel,
  getSubcategoryLabel,
  getSubcategoryOptions,
  REPORT_TAXONOMY,
  REPORT_CATEGORY_OPTIONS,
  REPORT_SEVERITY_OPTIONS,
  REPORT_SOURCE_CHANNEL_OPTIONS,
  REPORT_SORT_OPTIONS,
  REPORT_STATUS_OPTIONS
} from "../constants/reportTaxonomy";

export const DEFAULT_REPORT_FILTERS = {
  q: "",
  category: "",
  subcategory: "",
  status: "",
  severity: "",
  source: "",
  sort: "newest",
  page: 1
};

const getDefaultFilters = (defaultSort) => ({
  ...DEFAULT_REPORT_FILTERS,
  sort: defaultSort
});

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;
const toQueryToken = (value) => String(value ?? "")
  .trim()
  .replace(/[^A-Za-z0-9]+/g, "_")
  .replace(/_+/g, "_")
  .replace(/^_|_$/g, "")
  .toUpperCase();

const REPORT_CATEGORY_VALUES = new Set(REPORT_CATEGORY_OPTIONS.map((option) => option.value));
const REPORT_STATUS_VALUES = new Set(REPORT_STATUS_OPTIONS.map((option) => option.value));
const REPORT_SEVERITY_VALUES = new Set(REPORT_SEVERITY_OPTIONS.map((option) => option.value));
const REPORT_SOURCE_VALUES = new Set(REPORT_SOURCE_CHANNEL_OPTIONS.map((option) => option.value));
const REPORT_SUBCATEGORY_VALUES = new Set(
  Object.values(REPORT_TAXONOMY).flatMap((category) => category.subcategories.map((option) => option.value))
);

const normalizeCategoryValue = (value) => {
  const token = toQueryToken(value);
  return REPORT_CATEGORY_VALUES.has(token) ? token : "";
};

const normalizeSubcategoryValue = (value) => {
  const token = toQueryToken(value);
  return REPORT_SUBCATEGORY_VALUES.has(token) ? token : "";
};

const normalizeStatusValue = (value) => {
  const token = toQueryToken(value);
  return REPORT_STATUS_VALUES.has(token) ? token : "";
};

const normalizeSeverityValue = (value) => {
  const token = toQueryToken(value);
  return REPORT_SEVERITY_VALUES.has(token) ? token : "";
};

const normalizeSourceValue = (value) => {
  const token = toQueryToken(value);
  return REPORT_SOURCE_VALUES.has(token) ? token : "";
};

const normalizeFilters = (filters, defaultSort) => ({
  q: filters.q || "",
  category: normalizeCategoryValue(filters.category),
  subcategory: normalizeSubcategoryValue(filters.subcategory),
  status: normalizeStatusValue(filters.status),
  severity: normalizeSeverityValue(filters.severity),
  source: normalizeSourceValue(filters.source),
  sort: REPORT_SORT_OPTIONS.some((option) => option.value === filters.sort) ? filters.sort : defaultSort,
  page: isPositiveInteger(filters.page) ? filters.page : 1
});

const parseFiltersFromSearch = (search, defaultSort) => {
  const params = new URLSearchParams(search);
  return normalizeFilters({
    q: params.get("q") || "",
    category: params.get("category") || "",
    subcategory: params.get("subcategory") || "",
    status: params.get("status") || "",
    severity: params.get("severity") || "",
    source: params.get("source") || "",
    sort: params.get("sort") || defaultSort,
    page: Number(params.get("page") || 1)
  }, defaultSort);
};

const buildSearchString = (filters, defaultSort) => {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.subcategory) params.set("subcategory", filters.subcategory);
  if (filters.status) params.set("status", filters.status);
  if (filters.severity) params.set("severity", filters.severity);
  if (filters.source) params.set("source", filters.source);
  if (filters.sort) params.set("sort", filters.sort);
  if (filters.page > 1) params.set("page", String(filters.page));

  return params.toString();
};

const buildFilterChips = (filters, removeFilter, defaultSort) => {
  const chips = [];

  if (filters.q) {
    chips.push({ key: "q", label: `Search: ${filters.q}`, onRemove: () => removeFilter("q") });
  }

  if (filters.category) {
    chips.push({
      key: "category",
      label: `Category: ${getCategoryLabel(filters.category)}`,
      onRemove: () => removeFilter("category")
    });
  }

  if (filters.subcategory) {
    chips.push({
      key: "subcategory",
      label: `Subcategory: ${getSubcategoryLabel(filters.subcategory)}`,
      onRemove: () => removeFilter("subcategory")
    });
  }

  if (filters.status) {
    chips.push({
      key: "status",
      label: `Status: ${getStatusLabel(filters.status)}`,
      onRemove: () => removeFilter("status")
    });
  }

  if (filters.severity) {
    chips.push({
      key: "severity",
      label: `Severity: ${filters.severity}`,
      onRemove: () => removeFilter("severity")
    });
  }

  if (filters.source) {
    chips.push({
      key: "source",
      label: `Source: ${getSourceChannelLabel(filters.source)}`,
      onRemove: () => removeFilter("source")
    });
  }

  if (filters.sort && filters.sort !== defaultSort) {
    const sortLabel = REPORT_SORT_OPTIONS.find((option) => option.value === filters.sort)?.label || filters.sort;
    chips.push({ key: "sort", label: `Sort: ${sortLabel}`, onRemove: () => removeFilter("sort") });
  }

  return chips;
};

const isCategoryCompatible = (category, subcategory) => {
  if (!category || !subcategory) return true;
  return getSubcategoryOptions(category).some((option) => option.value === subcategory);
};

export function useReportFilters({ defaultSort = DEFAULT_REPORT_FILTERS.sort } = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(() => parseFiltersFromSearch(location.search, defaultSort));

  useEffect(() => {
    setFilters((current) => {
      const parsed = parseFiltersFromSearch(location.search, defaultSort);
      return JSON.stringify(parsed) === JSON.stringify(current) ? current : parsed;
    });
  }, [defaultSort, location.search]);

  const serializedFilters = useMemo(() => buildSearchString(filters, defaultSort), [defaultSort, filters]);

  useEffect(() => {
    const currentSearch = location.search.startsWith("?") ? location.search.slice(1) : location.search;
    if (currentSearch === serializedFilters) return;

    navigate(
      {
        pathname: location.pathname,
        search: serializedFilters ? `?${serializedFilters}` : ""
      },
      { replace: true }
    );
  }, [location.pathname, location.search, navigate, serializedFilters]);

  const setFilter = (key, value) => {
    setFilters((current) => {
      if (key === "page") {
        return { ...current, page: Number.isFinite(Number(value)) ? Math.max(1, Math.floor(Number(value))) : 1 };
      }

      if (key === "category") {
        const nextCategory = value;
        const nextSubcategory = nextCategory && isCategoryCompatible(nextCategory, current.subcategory)
          ? current.subcategory
          : "";
        return {
          ...current,
          category: nextCategory,
          subcategory: nextSubcategory,
          page: 1
        };
      }

      return {
        ...current,
        [key]: value,
        page: 1
      };
    });
  };

  const removeFilter = (key) => {
    setFilters((current) => {
      if (key === "sort") {
        return { ...current, sort: defaultSort, page: 1 };
      }

      if (key === "page") {
        return { ...current, page: 1 };
      }

      return { ...current, [key]: DEFAULT_REPORT_FILTERS[key], page: 1 };
    });
  };

  const clearFilters = () => setFilters(getDefaultFilters(defaultSort));

  const activeChips = useMemo(() => buildFilterChips(filters, removeFilter, defaultSort), [defaultSort, filters, removeFilter]);
  const hasActiveFilters = activeChips.length > 0;

  return {
    filters,
    setFilter,
    removeFilter,
    clearFilters,
    activeChips,
    hasActiveFilters,
    queryString: serializedFilters,
    categoryOptions: REPORT_CATEGORY_OPTIONS,
    severityOptions: REPORT_SEVERITY_OPTIONS,
    sourceOptions: REPORT_SOURCE_CHANNEL_OPTIONS,
    statusOptions: REPORT_STATUS_OPTIONS,
    sortOptions: REPORT_SORT_OPTIONS
  };
}
