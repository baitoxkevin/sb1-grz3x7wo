import { useState, useCallback, useRef } from 'react';
import { startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';

interface CacheEntry {
  data: Project[];
  timestamp: number;
}

interface Cache {
  [key: string]: CacheEntry;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const PREFETCH_MONTHS = 1; // Number of months to prefetch in each direction

export function useCalendarCache() {
  const [isLoading, setIsLoading] = useState(false);
  const cache = useRef<Cache>({});
  const prefetchController = useRef<AbortController | null>(null);

  const getCacheKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  const isCacheValid = (entry: CacheEntry) => {
    return Date.now() - entry.timestamp < CACHE_DURATION;
  };

  const fetchProjects = async (startDate: Date, endDate: Date) => {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        title,
        client:client_id(full_name),
        client_id,
        manager_id,
        status,
        priority,
        start_date,
        end_date,
        crew_count,
        filled_positions,
        working_hours_start,
        working_hours_end,
        event_type,
        venue_address,
        venue_details,
        supervisors_required
      `)
      .or(
        `and(start_date.gte.${startDate.toISOString()},start_date.lte.${endDate.toISOString()}),` +
        `and(end_date.gte.${startDate.toISOString()},end_date.lte.${endDate.toISOString()}),` +
        `and(start_date.lte.${startDate.toISOString()},end_date.gte.${endDate.toISOString()})`
      )
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  };

  const prefetchMonthData = async (date: Date) => {
    // Cancel any existing prefetch
    if (prefetchController.current) {
      prefetchController.current.abort();
    }
    prefetchController.current = new AbortController();

    try {
      // Prefetch previous and next months
      const months = [
        subMonths(date, PREFETCH_MONTHS),
        addMonths(date, PREFETCH_MONTHS)
      ];

      await Promise.all(months.map(async (monthDate) => {
        const cacheKey = getCacheKey(monthDate);
        if (cache.current[cacheKey] && isCacheValid(cache.current[cacheKey])) {
          return;
        }

        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const data = await fetchProjects(monthStart, monthEnd);

        cache.current[cacheKey] = {
          data,
          timestamp: Date.now()
        };
      }));
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      console.error('Error prefetching calendar data:', error);
    }
  };

  const getMonthData = useCallback(async (date: Date) => {
    const cacheKey = getCacheKey(date);
    setIsLoading(true);

    try {
      // Check cache first
      if (cache.current[cacheKey] && isCacheValid(cache.current[cacheKey])) {
        return cache.current[cacheKey].data;
      }

      // Fetch current month data
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const data = await fetchProjects(monthStart, monthEnd);

      // Update cache
      cache.current[cacheKey] = {
        data,
        timestamp: Date.now()
      };

      // Start prefetching adjacent months
      prefetchMonthData(date);

      return data;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invalidateCache = useCallback((date?: Date) => {
    if (date) {
      const cacheKey = getCacheKey(date);
      delete cache.current[cacheKey];
    } else {
      cache.current = {};
    }
  }, []);

  return {
    getMonthData,
    invalidateCache,
    isLoading
  };
}