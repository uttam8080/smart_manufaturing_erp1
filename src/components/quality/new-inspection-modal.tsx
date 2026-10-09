"use client";

import React, { useState } from "react";
import {
  QualityInspection,
  QualityDefect,
  InspectionStatus,
  ProductName,
  PRODUCT_NAMES,
  DefectTypeName,
  QUALITY_INSPECTORS,
} from "@/types/quality";
import {
  X,
  Plus,
  ClipboardCheck,
  Calendar,
  User,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface NewInspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newInspection: QualityInspection, newDefect?: QualityDefect) => void;
}

const DEFECT_TYPES: DefectTypeName[] = [
  "Burnt Product",
  "Broken Product",
  "Incorrect Weight",
  "Packaging Defect",
];

export function NewInspectionModal({
  isOpen,
  onClose,
  onSubmit,
}: NewInspectionModalProps) {
  const [productionOrderId, setProductionOrderId] = useState("PO-2026-012");
  const [product, setProduct] = useState<ProductName>("Classic Butter Biscuit");
  const [batchNumber, setBatchNumber] = useState("BATCH-2026-1120");
  const [inspectionDate, setInspectionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [inspectorName, setInspectorName] = useState("Elena Rostova");
  const [inspectedQuantity, setInspectedQuantity] = useState<number>(4000);
  const [passedQuantity, setPassedQuantity] = useState<number>(3980);
  const [failedQuantity, setFailedQuantity] = useState<number>(20);
  const [status, setStatus] = useState<InspectionStatus>("Passed");
  const [notes, setNotes] = useState(
    "AQL Level II standard sampling inspection completed. Organoleptic and physical parameters nominal."
  );

  // Optional Defect fields if failed
  const [defectType, setDefectType] = useState<DefectTypeName>("Burnt Product");
  const [rootCause, setRootCause] = useState("");
  const [correctiveAction, setCorrectiveAction] = useState("");

  if (!isOpen) return null;

  const handleInspectedChange = (val: number) => {
    setInspectedQuantity(val);
    const fail = Math.max(0, val - passedQuantity);
    setFailedQuantity(fail);
    if (fail > 100) setStatus("Failed");
    else if (fail > 0) setStatus("Conditional");
    else setStatus("Passed");
  };

  const handlePassedChange = (val: number) => {
    setPassedQuantity(val);
    const fail = Math.max(0, inspectedQuantity - val);
    setFailedQuantity(fail);
    if (fail > 100) setStatus("Failed");
    else if (fail > 0) setStatus("Conditional");
    else setStatus("Passed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inspectionNum = `QC-2026-${randomSuffix}`;
    const inspectionId = `qc_${Date.now()}`;

    let generatedDefect: QualityDefect | undefined = undefined;

    if (failedQuantity > 0 && (status === "Failed" || status === "Conditional")) {
      generatedDefect = {
        id: `def_${Date.now()}`,
        qualityDefectId: `DEF-2026-${randomSuffix + 100}`,
        inspectionId: inspectionId,
        inspectionNumber: inspectionNum,
        productionOrderId,
        product,
        batchNumber,
        defectType,
        defectQuantity: failedQuantity,
        severity: status === "Failed" ? "High" : "Medium",
        rootCause:
          rootCause.trim() ||
          `${defectType} observed during sampling on ${product} lot. Root cause investigation initiated.`,
        correctiveAction:
          correctiveAction.trim() ||
          "Isolate affected lot, notify line supervisor, and verify machine calibration.",
        status: "Open",
        detectedAt: new Date().toISOString(),
        assignedEngineer: `${inspectorName} (QA)`,
      };
    }

    const newInspection: QualityInspection = {
      id: inspectionId,
      inspectionId,
      inspectionNumber: inspectionNum,
      productionOrderId,
      product,
      batchNumber,
      inspectionDate: new Date(inspectionDate).toISOString(),
      inspectorEmployeeId: "EMP-QA-01",
      inspectorName,
      inspectedQuantity,
      passedQuantity,
      failedQuantity,
      status,
      notes,
      defects: generatedDefect ? [generatedDefect] : [],
    };

    onSubmit(newInspection, generatedDefect);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-6 max-h-[88vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Record Quality Inspection</h3>
              <p className="text-xs text-slate-600 font-medium">
                Log a new lot verification audit and automatic defect non-conformance
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs overflow-y-auto flex-1 pr-2 custom-scrollbar">
          {/* Production Order & Product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Production Order *
              </label>
              <input
                type="text"
                value={productionOrderId}
                onChange={(e) => setProductionOrderId(e.target.value)}
                placeholder="e.g. PO-2026-012"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Target Product SKU *
              </label>
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value as ProductName)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
              >
                {PRODUCT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Batch Number & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Batch Number *
              </label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="e.g. BATCH-2026-1120"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono font-bold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Inspection Date *
              </label>
              <input
                type="date"
                value={inspectionDate}
                onChange={(e) => setInspectionDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Inspector & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Assigned Inspector *
              </label>
              <select
                value={inspectorName}
                onChange={(e) => setInspectorName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-semibold text-xs focus:outline-none focus:border-cyan-500 focus:bg-white cursor-pointer"
                required
              >
                {QUALITY_INSPECTORS.map((insp) => (
                  <option key={insp} value={insp}>
                    {insp} (Certified QA)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Inspection Decision *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InspectionStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-cyan-500 focus:bg-white font-bold cursor-pointer"
              >
                <option value="Passed">Passed (100% Conforming)</option>
                <option value="Conditional">Conditional (Rework / Resample)</option>
                <option value="Failed">Failed (Quarantine / Scrap)</option>
                <option value="Pending">Pending Lab Analysis</option>
              </select>
            </div>
          </div>

          {/* Quantities */}
          <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Inspected Qty *
              </label>
              <input
                type="number"
                min="1"
                value={inspectedQuantity}
                onChange={(e) => handleInspectedChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-700 mb-1">
                Passed Qty *
              </label>
              <input
                type="number"
                min="0"
                value={passedQuantity}
                onChange={(e) => handlePassedChange(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-emerald-700 font-mono font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-rose-700 mb-1">
                Failed Qty
              </label>
              <input
                type="number"
                min="0"
                value={failedQuantity}
                onChange={(e) => setFailedQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-rose-700 font-mono font-bold"
              />
            </div>
          </div>

          {/* If failed/conditional, show defect creation fields */}
          {(status === "Failed" || status === "Conditional" || failedQuantity > 0) && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Non-Conformance Defect Mode Registration</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Primary Defect Mode *
                </label>
                <select
                  value={defectType}
                  onChange={(e) => setDefectType(e.target.value as DefectTypeName)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-semibold text-xs"
                >
                  {DEFECT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Root Cause Synopsis
                </label>
                <input
                  type="text"
                  placeholder="e.g. Temperature over-bake or packaging seal tear..."
                  value={rootCause}
                  onChange={(e) => setRootCause(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Auditor Remarks & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium text-xs focus:outline-none focus:border-cyan-500 focus:bg-white resize-none leading-relaxed"
            />
          </div>

          {/* Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Submitting updates the inspection registry, recalibrates plant pass rate, and logs any non-conformance tickets into mock state.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer border border-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 rounded-lg transition-colors shadow-md shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Record Inspection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
