import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Pencil,
  PauseCircle,
  PlayCircle,
  Lock,
  Trash2,
  X,
} from 'lucide-react';
import StatusBadge from '../../components/common/StatusBadge';
import ResourceImage from '../../components/common/ResourceImage';
import EmptyState from '../../components/common/EmptyState';
import ConfirmModal from '../../components/common/ConfirmModal';
import { CATEGORIES, CONDITIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export default function MyListingsPage() {
  const {
    currentUser,
    resources,
    updateResource,
    deleteResource,
    toggleResourceStatus,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const myListings = resources.filter((r) => r.donorId === currentUser?.id);
  const filtered = myListings.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditSave = (e) => {
    e.preventDefault();
    if (!editItem.title.trim() || Number(editItem.quantity) < 1) {
      showToast('Title and valid quantity are required.', 'error');
      return;
    }
    updateResource(editItem.id, {
      title: editItem.title,
      category: editItem.category,
      condition: editItem.condition,
      quantity: Number(editItem.quantity),
      location: editItem.location,
      description: editItem.description,
    });
    setEditItem(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex flex-1 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your listings..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-medium bg-white focus:outline-none focus:border-emerald-500"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <Link
          to="/donor/create"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Listing
        </Link>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No listings match your filter"
          description="Create a new resource listing or clear your search filter."
          action={
            <Link
              to="/donor/create"
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
            >
              Create Resource Listing
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row gap-5"
            >
              <div className="w-full md:w-44 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <ResourceImage
                  src={item.images?.[0]}
                  alt={item.title}
                  category={item.category}
                  className="w-full h-full"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                      {item.category}
                    </span>
                    <StatusBadge status={item.status} />
                    <StatusBadge status={item.condition} size="xs" />
                  </div>
                  <span className="text-xs text-slate-400">Posted {item.createdAt}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500 pt-1">
                  <span className="text-emerald-700 font-bold">
                    {item.availableQuantity} of {item.quantity} available
                  </span>
                  <span>Location: {item.location}</span>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex md:flex-col justify-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                <button
                  onClick={() => setEditItem({ ...item })}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>

                {item.status === 'Active' ? (
                  <button
                    onClick={() => toggleResourceStatus(item.id, 'Paused')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-200 text-xs font-bold text-amber-700 hover:bg-amber-50"
                  >
                    <PauseCircle className="h-3.5 w-3.5" />
                    Pause
                  </button>
                ) : item.status === 'Paused' ? (
                  <button
                    onClick={() => toggleResourceStatus(item.id, 'Active')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    Resume
                  </button>
                ) : null}

                {item.status !== 'Closed' && (
                  <button
                    onClick={() => toggleResourceStatus(item.id, 'Closed')}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Close
                  </button>
                )}

                <button
                  onClick={() => setDeleteTarget(item)}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Listing Modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Resource Listing</h3>
              <button
                onClick={() => setEditItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={editItem.category}
                    onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Condition
                  </label>
                  <select
                    value={editItem.condition}
                    onChange={(e) => setEditItem({ ...editItem, condition: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white"
                  >
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={editItem.quantity}
                    onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editItem.location}
                    onChange={(e) => setEditItem({ ...editItem, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editItem.description}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Resource Listing?"
        message={`This will permanently remove "${deleteTarget?.title}". Existing completed records remain in history.`}
        confirmLabel="Delete Listing"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          deleteResource(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
