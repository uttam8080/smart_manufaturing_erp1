"use client";

import React, { useState } from "react";
import { ExpenseRecord, ExpenseCategory, FinanceDepartment, PaymentStatus } from "@/types/finance";
import { X, PlusCircle, AlertCircle, IndianRupee } from "lucide-react";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: ExpenseRecord) => void;
  existingCount: number;
}

const CATEGORIES: ExpenseCategory[] = [
  "Maintenance",
  "Electricity",
  "Salary",
  "Logistics",
  "Software",
  "Utilities",
  "Raw Materials",
  "Packaging Materials",
  "Other",
];

const DEPARTMENTS: FinanceDepartment[] = [
  "Production",
  "Quality",
  "Maintenance",
  "Inventory",
  "Procurement",
  "Workforce",
  "Administration",
  "Finance",
];

const PAYMENT_STATUSES: PaymentStatus[] = ["Paid", "Pending", "Overdue"];

export function AddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
  existingCount,
}: AddExpenseModalProps) {
  const nextIdNum = 100 + existingCount + 1;
  const [expenseId, setExpenseId] = useState(`EXP-2026-${nextIdNum}`);
  const [category, setCategory] = useState<ExpenseCategory>("Maintenance");
  const [department, setDepartment] = useState<FinanceDepartment>("Production");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Paid");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError("Please enter a valid expense description.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Please specify a valid expense amount in INR.");
      return;
    }

    const newExpense: ExpenseRecord = {
      id: `exp_${Date.now()}`,
      expenseId: expenseId.trim() || `EXP-2026-${nextIdNum}`,
      date,
      category,
      department,
      description: description.trim(),
      amount: Number(amount),
      paymentStatus,
      paymentMethod,
    };

    onAddExpense(newExpense);
    onClose();
    // Reset
    setDescription("");
    setAmount("");
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-200">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Log Operational Expense</h3>
            <p className="text-xs text-slate-600 font-medium">Record factory overheads, utility bills, maintenance charges & service payouts</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expense ID <span className="text-emerald-700">*</span>
              </label>
              <input
                type="text"
                value={expenseId}
                onChange={(e) => setExpenseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date <span className="text-emerald-700">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Expense Category <span className="text-emerald-700">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-emerald-700">*</span>
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as FinanceDepartment)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Justification <span className="text-emerald-700">*</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Monthly maintenance overhaul on conveyor line and lubrication..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount (₹ INR) <span className="text-emerald-700">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value === "" ? "" : Number(e.target.value));
                  if (error) setError("");
                }}
                placeholder="e.g. 75000"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Payment Status <span className="text-emerald-700">*</span>
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {PAYMENT_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <IndianRupee className="w-4 h-4" />
              Save Expense Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
