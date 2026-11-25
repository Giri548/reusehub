import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import PublicNavbar from '../../components/layout/PublicNavbar';
import Footer from '../../components/layout/Footer';
import ResourceCard from '../../components/common/ResourceCard';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORIES, CONDITIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function BrowsePage({ embedded = false, basePath = '/resources' }) {
  const { resources } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'All';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [condition, setCondition] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const paramCat = searchParams.get('category');
    if (paramCat) setCategory(paramCat);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = resources.filter((r) => r.status === 'Active');

    if (category !== 'All') {
      list = list.filter((r) => r.category === category);
    }
    if (condition !== 'All') {
      list = list.filter((r) => r.condition === condition);
    }
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.donorOrg?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'newest') {
      list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } else if (sortBy === 'quantity') {
      list = [...list].sort((a, b) => b.availableQuantity - a.availableQuantity);
    }

    return list;
  }, [resources, query, category, condition, sortBy]);

  const handleCategoryChange = (nextCat) => {
    setCategory(nextCat);
    if (!embedded) {
      if (nextCat === 'All') {
        searchParams.delete('category');
      } else {
        searchParams.set('category', nextCat);
      }
      setSearchParams(searchParams, { replace: true });
    }
  };

  const resetFilters = () => {
    setQuery('');
    handleCategoryChange('All');
    setCondition('All');
    setSortBy('newest');
  };

  const content = (
    <div className={embedded ? 'space-y-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8'}>
      {!embedded && (
        <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-3xl p-8 text-white shadow-lg">
          <h1 className="text-2xl sm:text-4xl font-extrabold">Browse Community Resources</h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 max-w-2xl">
            Search verified surplus books, furniture, electronics, and stationery available for free pickup.
          </p>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by item name, neighborhood, donor, or tag..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:block" />
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Conditions</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 bg-white focus:outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest First</option>
              <option value="quantity">Most Available</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
              category === 'All'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            All Categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => handleCategoryChange(c.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors ${
                category === c.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {c.name}
            </button>
          ))}

          {(query || category !== 'All' || condition !== 'All') && (
            <button
              onClick={resetFilters}
              className="ml-auto text-xs font-semibold text-rose-600 hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 font-medium">
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> available{' '}
          {filtered.length === 1 ? 'resource' : 'resources'}
        </p>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No matching resources found"
          description="Try clearing your search keyword or selecting another category."
          action={
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Clear All Filters
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((res) => (
            <ResourceCard key={res.id} resource={res} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PublicNavbar />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}
