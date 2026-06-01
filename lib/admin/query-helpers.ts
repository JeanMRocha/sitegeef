/**
 * Shared Supabase query helpers for admin modules
 * Reduces duplication across 27+ admin CRUD modules
 * Each admin module can import and reuse these patterns
 */

/**
 * Calculate pagination offset for Supabase range queries
 * @example
 * const offset = calculateOffset(2, 20) // => 20
 * query.range(offset, offset + pageSize - 1)
 */
export function calculateOffset(page: number, pageSize: number): number {
  return (page - 1) * pageSize;
}

/**
 * Calculate pagination range for Supabase range() parameter
 * @example
 * const range = calculateRange(2, 20) // => { start: 20, end: 39 }
 * query.range(range.start, range.end)
 */
export function calculateRange(page: number, pageSize: number) {
  const offset = calculateOffset(page, pageSize);
  return {
    start: offset,
    end: offset + pageSize - 1,
  };
}

/**
 * Build multi-field OR search filter for Supabase
 * Supports ilike pattern matching across multiple fields
 * @example
 * const filter = buildSearchFilter('john', ['nome', 'email'])
 * // => 'nome.ilike.%john%,email.ilike.%john%'
 * query.or(filter)
 */
export function buildSearchFilter(search: string, fields: string[]): string | null {
  if (!search || !search.trim()) {
    return null;
  }

  const escapedSearch = search.trim().replace(/%/g, '\\%');
  return fields
    .map((field) => `${field}.ilike.%${escapedSearch}%`)
    .join(',');
}

/**
 * Apply a search filter directly to a Supabase query builder.
 * Keeps the filter building logic centralized while avoiding repeated branching.
 */
export function applySearchFilter<T extends { or: (filter: string) => T }>(
  query: T,
  search: string | undefined,
  fields: string[]
): T {
  const filter = buildSearchFilter(search || '', fields);
  return filter ? query.or(filter) : query;
}

/**
 * Apply an inclusive date range filter to a Supabase query builder.
 */
export function applyDateRangeFilter<T extends {
  gte: (field: string, value: string) => T;
  lte: (field: string, value: string) => T;
}>(
  query: T,
  field: string,
  start?: string | null,
  end?: string | null
): T {
  if (!start || !end) {
    return query;
  }

  return query.gte(field, start).lte(field, end);
}

/**
 * Apply status filter to items
 * Used for filtering records by status field
 * @example
 * const active = records.filter(r => shouldApplyFilter(r, 'ativa'))
 */
export function shouldApplyStatusFilter<T extends { status?: string }>(
  item: T,
  statusFilter?: string
): boolean {
  if (!statusFilter) {
    return true;
  }
  return item.status === statusFilter;
}

/**
 * Map related data from separate query to parent records
 * Reduces N+1 queries by using single fetch + reduce pattern
 * @example
 * const pessoas = [{ id: '1' }, { id: '2' }]
 * const vinculos = [{ pessoa_id: '1', tipo: 'admin' }]
 * const mapped = mapRelatedData(pessoas, vinculos, 'pessoa_id', 'vinculos')
 * // => [{ id: '1', vinculos: [...] }, { id: '2', vinculos: [] }]
 */
export function mapRelatedData<
  Parent extends { id: string },
  Related extends Record<string, unknown>,
>(
  parents: Parent[],
  relatedItems: Related[],
  parentIdField: keyof Related = 'parent_id' as keyof Related,
  targetField: string = 'related'
): (Parent & Record<string, Related[]>)[] {
  if (!relatedItems.length) {
    return parents.map((p) => ({
      ...p,
      [targetField]: [],
    }));
  }

  const relatedByParentId = relatedItems.reduce<Record<string, Related[]>>((acc, item) => {
    const key = String(item[parentIdField]);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return parents.map((parent) => ({
    ...parent,
    [targetField]: relatedByParentId[parent.id] || [],
  }));
}

/**
 * Safe data transformation with fallback
 * Handles null/undefined data gracefully
 * @example
 * const filtered = safeFilterData(data, item => item.active)
 */
export function safeFilterData<T>(
  data: T[] | null | undefined,
  filterFn: (item: T) => boolean,
  fallback: T[] = []
): T[] {
  if (!data) {
    return fallback;
  }
  return data.filter(filterFn);
}

/**
 * Build range query parameters object
 * Used in Supabase range() calls
 * @example
 * const { start, end } = getRangeParams(1, 20)
 * query.range(start, end)
 */
export function getRangeParams(page: number, pageSize: number) {
  const offset = calculateOffset(page, pageSize);
  return {
    start: offset,
    end: offset + pageSize - 1,
  };
}

/**
 * Count total pages given total items and page size
 * @example
 * const pages = getTotalPages(100, 20) // => 5
 */
export function getTotalPages(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize);
}

/**
 * Validate page number is within valid range
 * @example
 * const validPage = getValidPage(5, 3) // => 3 (if only 3 pages exist)
 */
export function getValidPage(requestedPage: number, totalPages: number): number {
  if (requestedPage < 1) return 1;
  if (requestedPage > totalPages) return totalPages;
  return requestedPage;
}
