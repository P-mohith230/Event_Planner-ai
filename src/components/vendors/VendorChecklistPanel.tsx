import React, { useState } from "react";
import { VendorItem, SupportedCurrency } from "@/types/schema";
import { formatCurrency } from "@/lib/engines/budget";
import { ProvenanceBadge } from "../common/ProvenanceBadge";
import {
  Briefcase,
  CheckCircle,
  FileText,
  Plus,
  PhoneCall,
  DollarSign,
} from "lucide-react";

interface VendorChecklistPanelProps {
  vendors: VendorItem[];
  currency: SupportedCurrency;
  onUpdateStatus: (
    id: string,
    status: "not-contacted" | "contacted" | "quoted" | "booked"
  ) => void;
  onAddVendor: (vendor: VendorItem) => void;
}

export function VendorChecklistPanel({
  vendors,
  currency,
  onUpdateStatus,
  onAddVendor,
}: VendorChecklistPanelProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  // New vendor form state
  const [newRole, setNewRole] = useState("");
  const [newCategory, setNewCategory] = useState("Catering");
  const [newEstimatedDollars, setNewEstimatedDollars] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const bookedCount = vendors.filter((v) => v.status === "booked").length;

  const filteredVendors =
    filterStatus === "all"
      ? vendors
      : vendors.filter((v) => v.status === filterStatus);

  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;

    const estMinor = newEstimatedDollars
      ? Math.round(parseFloat(newEstimatedDollars) * 100)
      : undefined;

    const newVendor: VendorItem = {
      id: `v-custom-${Date.now()}`,
      category: newCategory.trim() || "General",
      role: newRole.trim(),
      status: "not-contacted",
      estimatedCostMinor: estMinor,
      provenance: "user-entered",
      notes: newNotes.trim() || undefined,
    };

    onAddVendor(newVendor);
    setNewRole("");
    setNewEstimatedDollars("");
    setNewNotes("");
    setIsAdding(false);
  };

  const getStatusBadge = (status: VendorItem["status"]) => {
    switch (status) {
      case "booked":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "quoted":
        return "bg-sky-100 text-sky-800 border-sky-300 font-semibold";
      case "contacted":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  return (
    <div className="space-y-6" aria-label="Vendor Checklist Workspace">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-violet-600" />
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">Vendor Management Checklist</h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {bookedCount} of {vendors.length} vendors contracted & confirmed
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Pills */}
          <div className="flex gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
            {(["all", "not-contacted", "contacted", "quoted", "booked"] as const).map(
              (st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-colors ${
                    filterStatus === st
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {st.replace("-", " ")}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Vendor</span>
          </button>
        </div>
      </div>

      {/* Add Vendor Form */}
      {isAdding && (
        <form onSubmit={handleCreateVendor} className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
            Add Vendor Checklist Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="new-vendor-role" className="block text-xs font-semibold text-stone-700 mb-1">
                Vendor Role / Company
              </label>
              <input
                id="new-vendor-role"
                type="text"
                required
                placeholder="e.g. Blue Ridge Videography"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="new-vendor-category" className="block text-xs font-semibold text-stone-700 mb-1">
                Service Category
              </label>
              <input
                id="new-vendor-category"
                type="text"
                required
                placeholder="e.g. Photography, Catering"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="new-vendor-estimate" className="block text-xs font-semibold text-stone-700 mb-1">
                Estimated Cost ({currency})
              </label>
              <input
                id="new-vendor-estimate"
                type="number"
                min="0"
                step="10"
                placeholder="e.g. 1500"
                value={newEstimatedDollars}
                onChange={(e) => setNewEstimatedDollars(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
              />
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="new-vendor-notes" className="block text-xs font-semibold text-stone-700 mb-1">
              Notes & Contract Terms
            </label>
            <input
              id="new-vendor-notes"
              type="text"
              placeholder="e.g. Deposit required 60 days before"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold rounded-lg"
            >
              Save Vendor
            </button>
          </div>
        </form>
      )}

      {/* Vendor Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.id}
            className="p-4 bg-white rounded-xl border border-stone-200 shadow-sm flex flex-col justify-between hover:border-stone-300 transition-colors"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">{vendor.role}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-600 mt-1 inline-block">
                    {vendor.category}
                  </span>
                </div>
                <ProvenanceBadge provenance={vendor.provenance} />
              </div>

              {vendor.notes && (
                <p className="text-xs text-stone-600 mt-2 bg-stone-50 p-2 rounded-lg border border-stone-100">
                  {vendor.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <div>
                {vendor.confirmedCostMinor ? (
                  <span className="text-xs font-bold text-emerald-700">
                    Quote Confirmed: {formatCurrency(vendor.confirmedCostMinor, currency)}
                  </span>
                ) : vendor.estimatedCostMinor ? (
                  <span className="text-xs font-medium text-stone-500">
                    Est: {formatCurrency(vendor.estimatedCostMinor, currency)}
                  </span>
                ) : (
                  <span className="text-xs text-stone-400">Quote Pending</span>
                )}
              </div>

              {/* Status Select */}
              <select
                value={vendor.status}
                onChange={(e) =>
                  onUpdateStatus(
                    vendor.id,
                    e.target.value as "not-contacted" | "contacted" | "quoted" | "booked"
                  )
                }
                className={`text-xs px-2.5 py-1 rounded-lg border capitalize font-semibold cursor-pointer ${getStatusBadge(
                  vendor.status
                )}`}
              >
                <option value="not-contacted">Not Contacted</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="booked">Booked & Confirmed</option>
              </select>
            </div>
          </div>
        ))}

        {filteredVendors.length === 0 && (
          <div className="col-span-2 p-8 bg-white rounded-xl border border-stone-200 text-center text-xs text-stone-500">
            No vendors found for status &quot;{filterStatus}&quot;.
          </div>
        )}
      </div>
    </div>
  );
}

