export default function ReportFiltersToolbar({
  filters,
  onChange,
  onClear,
  activeChips,
  totalCount,
  visibleCount,
  categoryOptions,
  subcategoryOptions,
  statusOptions,
  severityOptions,
  sourceOptions,
  sortOptions
}) {
  const hasActiveFilters = activeChips.length > 0;
  const countLabel = typeof totalCount === "number" ? `Showing ${visibleCount} of ${totalCount} reports` : `${visibleCount} reports`;

  return (
    <div className="card mb-4 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 flex-1">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Search</span>
            <input
              className="input"
              placeholder="Search reports"
              value={filters.q}
              onChange={(event) => onChange("q", event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
            <select
              className="input"
              value={filters.category}
              onChange={(event) => onChange("category", event.target.value)}
            >
              <option value="">All categories</option>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Subcategory</span>
            <select
              className="input"
              value={filters.subcategory}
              disabled={!filters.category}
              onChange={(event) => onChange("subcategory", event.target.value)}
            >
              <option value="">{filters.category ? "All subcategories" : "Select a category first"}</option>
              {subcategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Status</span>
            <select
              className="input"
              value={filters.status}
              onChange={(event) => onChange("status", event.target.value)}
            >
              <option value="">All statuses</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Severity</span>
            <select
              className="input"
              value={filters.severity}
              onChange={(event) => onChange("severity", event.target.value)}
            >
              <option value="">All severities</option>
              {severityOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Source</span>
            <select
              className="input"
              value={filters.source}
              onChange={(event) => onChange("source", event.target.value)}
            >
              <option value="">All sources</option>
              {sourceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Sort</span>
            <select
              className="input"
              value={filters.sort}
              onChange={(event) => onChange("sort", event.target.value)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <div className="text-sm text-slate-500">{countLabel}</div>
          <button
            type="button"
            className="btn btn-outline"
            onClick={onClear}
            disabled={!hasActiveFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.onRemove}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-700 transition-colors hover:bg-slate-100"
            >
              <span>{chip.label}</span>
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
