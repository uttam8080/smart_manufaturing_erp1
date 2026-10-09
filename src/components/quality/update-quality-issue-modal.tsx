"use client";

import React, { useState, useEffect } from "react";
import { QualityDefect, DefectStatus } from "@/types/quality";
import {
  X,
  FileEdit,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  HelpCircle,
} from "lucide-react";

interface UpdateQualityIssueModalProps {
  defect: QualityDefect | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDefect: QualityDefect) => void;
}

export function UpdateQualityIssueModal({
  defect,
  isOpen,
  onClose,
  onSave,
}: UpdateQualityIssueModalProps) {
  const [status, setStatus] = useState<DefectStatus>("Open");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");
  const [assignedEngineer, setAssignedEngineer] = useState("");

  useEffect(() => {
    if (defect) {
      setStatus(defect.status);
      setRootCause(defect.rootCause || "");
      setCorrectiveAction(defect.correctiveAction || "");
      setAssignedEngineer(defect.assignedEngineer || "Elena Rostova (QA Lead)");
    }
  }, [defect]);

  if (!isOpen || !defect) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: QualityDefect = {
      ...defect,
      status,
      rootCause: rootCause.trim(),
      correctiveAction: correctiveAction.trim(),
      assignedEngineer: assignedEngineer.trim(),
    };
    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[88vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Update Quality Issue (CAPA)</h3>
              <p className="text-xs text-slate-600 font-medium">
                {defect.qualityDefectId} • {defect.product} ({defect.defectType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {/* Status Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Non-Conformance Status *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["Open", "Investigating", "Resolved", "Closed"] as DefectStatus[]).map((st) => {
                const isSelected = status === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatus(st)}
                    className={`py-2 px-3 rounded-lg font-bold border transition-all text-center cursor-pointer ${
                      isSelected
                        ? st === "Open"
                          ? "bg-rose-100 border-rose-400 text-rose-900 ring-2 ring-rose-300"
                          : st === "Investigating"
                          ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300"
                          : st === "Resolved"
                          ? "bg-blue-100 border-blue-400 text-blue-900 ring-2 ring-blue-300"
                          : "bg-emerald-100 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assigned Engineer */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Assigned QA / Process Engineer
            </label>
            <input
              type="text"
              value={assignedEngineer}
              onChange={(e) => setAssignedEngineer(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
            />
          </div>

          {/* Root Cause */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Root Cause Analysis (5-Why / Fishbone) *
            </label>
            <textarea
              rows={3}
              value={rootCause}
              onChange={(e) => setRootCause(e.target.value)}
              placeholder="Describe what mechanism caused the non-conformance..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-cyan-500 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Corrective Action */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Corrective & Preventive Action (CAPA) *
            </label>
            <textarea
              rows={3}
              value={correctiveAction}
              onChange={(e) => setCorrectiveAction(e.target.value)}
              placeholder="Detail actions taken to prevent recurrence and verify effectiveness..."
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-cyan-500 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Saving will update the quality defect registry and recalculate overall plant quality score in mock state.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 rounded-lg transition-colors shadow-md shadow-cyan-600/20 cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
