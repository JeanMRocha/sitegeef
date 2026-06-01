import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Tests for common Supabase query patterns used across admin actions
 * Validates pagination, filtering, and data transformation logic
 */

describe('Supabase Query Patterns', () => {
  describe('pagination calculation', () => {
    function calculateOffset(page: number, pageSize: number) {
      return (page - 1) * pageSize;
    }

    it('calculates correct offset for page 1', () => {
      expect(calculateOffset(1, 20)).toBe(0);
    });

    it('calculates correct offset for page 2', () => {
      expect(calculateOffset(2, 20)).toBe(20);
    });

    it('calculates correct offset for page 3', () => {
      expect(calculateOffset(3, 20)).toBe(40);
    });

    it('handles custom page size', () => {
      expect(calculateOffset(2, 50)).toBe(50);
      expect(calculateOffset(3, 10)).toBe(20);
    });

    it('returns 0 for page 1 regardless of size', () => {
      expect(calculateOffset(1, 5)).toBe(0);
      expect(calculateOffset(1, 100)).toBe(0);
    });
  });

  describe('search filter building', () => {
    function buildSearchFilter(search: string, fields: string[]): string | null {
      if (!search || !search.trim()) {
        return null;
      }

      const escapedSearch = search.trim().replace(/%/g, '\\%');
      return fields
        .map((field) => `${field}.ilike.%${escapedSearch}%`)
        .join(',');
    }

    it('returns null for empty search', () => {
      expect(buildSearchFilter('', ['nome'])).toBeNull();
      expect(buildSearchFilter('   ', ['nome'])).toBeNull();
    });

    it('builds single field filter', () => {
      expect(buildSearchFilter('test', ['nome'])).toBe('nome.ilike.%test%');
    });

    it('builds multi-field OR filter', () => {
      const result = buildSearchFilter('john', ['nome', 'email', 'telefone']);
      expect(result).toBe('nome.ilike.%john%,email.ilike.%john%,telefone.ilike.%john%');
    });

    it('escapes special characters in search', () => {
      const result = buildSearchFilter('test%value', ['campo']);
      expect(result).toBe('campo.ilike.%test\\%value%');
    });

    it('trims whitespace from search', () => {
      expect(buildSearchFilter('  test  ', ['campo'])).toBe('campo.ilike.%test%');
    });
  });

  describe('status filter application', () => {
    function shouldApplyFilter<T extends { status?: string }>(
      item: T,
      statusFilter?: string
    ): boolean {
      if (!statusFilter) {
        return true;
      }
      return item.status === statusFilter;
    }

    it('returns true when no filter provided', () => {
      expect(shouldApplyFilter({ status: 'ativa' })).toBe(true);
      expect(shouldApplyFilter({ status: 'inativa' })).toBe(true);
    });

    it('returns true when status matches filter', () => {
      expect(shouldApplyFilter({ status: 'ativa' }, 'ativa')).toBe(true);
      expect(shouldApplyFilter({ status: 'rascunho' }, 'rascunho')).toBe(true);
    });

    it('returns false when status does not match filter', () => {
      expect(shouldApplyFilter({ status: 'ativa' }, 'inativa')).toBe(false);
      expect(shouldApplyFilter({ status: 'rascunho' }, 'ativa')).toBe(false);
    });

    it('handles items without status field', () => {
      expect(shouldApplyFilter({}, 'ativa')).toBe(false);
    });
  });

  describe('join/reduce pattern for relationships', () => {
    type RelatedItem = { parent_id: string; value: string };
    type Parent = { id: string; values?: RelatedItem[] };

    function mapRelatedData<T extends { id: string }>(
      parents: T[],
      relatedItems: RelatedItem[],
      keyField: 'parent_id' = 'parent_id'
    ): T[] {
      const relatedByParentId = relatedItems.reduce((acc: Record<string, RelatedItem[]>, item) => {
        const key = item[keyField as keyof RelatedItem] as string;
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {});

      return parents.map((parent) => ({
        ...parent,
        values: relatedByParentId[parent.id] || [],
      }));
    }

    it('returns unchanged parents when no related items', () => {
      const parents: Parent[] = [{ id: '1' }, { id: '2' }];
      const result = mapRelatedData(parents, []);
      expect(result).toEqual([
        { id: '1', values: [] },
        { id: '2', values: [] },
      ]);
    });

    it('maps related items to parent', () => {
      const parents: Parent[] = [{ id: '1' }, { id: '2' }];
      const related: RelatedItem[] = [
        { parent_id: '1', value: 'a' },
        { parent_id: '1', value: 'b' },
        { parent_id: '2', value: 'c' },
      ];

      const result = mapRelatedData(parents, related);
      expect(result[0].values).toHaveLength(2);
      expect(result[1].values).toHaveLength(1);
      expect(result[0].values?.[0].value).toBe('a');
    });

    it('preserves order of parents', () => {
      const parents: Parent[] = [{ id: '3' }, { id: '1' }, { id: '2' }];
      const related: RelatedItem[] = [{ parent_id: '2', value: 'x' }];

      const result = mapRelatedData(parents, related);
      expect(result[0].id).toBe('3');
      expect(result[1].id).toBe('1');
      expect(result[2].id).toBe('2');
    });
  });

  describe('range calculation for pagination', () => {
    function calculateRange(page: number, pageSize: number) {
      const offset = (page - 1) * pageSize;
      return {
        start: offset,
        end: offset + pageSize - 1,
      };
    }

    it('calculates correct range for page 1', () => {
      expect(calculateRange(1, 20)).toEqual({ start: 0, end: 19 });
    });

    it('calculates correct range for page 2', () => {
      expect(calculateRange(2, 20)).toEqual({ start: 20, end: 39 });
    });

    it('works with different page sizes', () => {
      expect(calculateRange(1, 50)).toEqual({ start: 0, end: 49 });
      expect(calculateRange(2, 50)).toEqual({ start: 50, end: 99 });
    });
  });

  describe('error handling in query chains', () => {
    function safeFilterData<T>(
      data: T[] | null,
      filterFn: (item: T) => boolean,
      fallback: T[] = []
    ): T[] {
      if (!data) {
        return fallback;
      }
      return data.filter(filterFn);
    }

    it('returns fallback when data is null', () => {
      expect(safeFilterData(null, () => true)).toEqual([]);
      expect(safeFilterData(null, () => true, [{ id: '1' }])).toEqual([{ id: '1' }]);
    });

    it('filters data when available', () => {
      const data = [{ id: '1', active: true }, { id: '2', active: false }];
      const result = safeFilterData(data, (item) => (item as any).active);
      expect(result).toHaveLength(1);
    });

    it('returns empty array for empty data', () => {
      expect(safeFilterData([], () => true)).toEqual([]);
    });
  });
});
