"use client";

import React, { useState } from "react";
import { ExpenseRecord, PaymentStatus } from "@/types/finance";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit2,
  Building,
  Check,
  X,
} from "lucide-react";

interface ExpenseTableProps {
  expenses: ExpenseRecord[];
  onDeleteExpense?: (id: string) => void;
  onUpdateStatus?: (id: string, newStatus: PaymentStatus) => void;
}

export function ExpenseTable({
  expenses,
  onDeleteExpense,
  onUpdateStatus,
}: ExpenseTableProps) {
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRecord | null>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Paid
          </span>
        );
      case "Overdue":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Overdue
          </span>
        );
      case "Pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" />
            Pending
          </span>
        );
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Maintenance":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-amber-50 text-amber-800 border border-amber-300 font-bold">Maintenance</span>;
      case "Electricity":
      case "Utilities":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-blue-50 text-blue-800 border border-blue-300 font-bold">{category}</span>;
      case "Salary":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold">Salary</span>;
      case "Logistics":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-pink-50 text-pink-800 border border-pink-300 font-bold">Logistics</span>;
      case "Software":
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-purple-50 text-purple-800 border border-purple-300 font-bold">Software</span>;
      default:
        return <span className="px-2 py-0.5 rounded-lg text-[11px] bg-slate-100 text-slate-800 border border-slate-200 font-bold">{category}</span>;
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Operational Expenses Log</h3>
              <p className="text-xs text-slate-600 font-medium">Plant floor recurring liabilities, service contracts & utility bills</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span>Filtered Expenses: <strong className="text-slate-900 font-bold">{expenses.length} records</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-800 font-black">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3">Expense ID</th>
                <th className="py-3.5 px-3">Date</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">Description</th>
                <th className="py-3.5 px-3 text-right">Amount</th>
                <th className="py-3.5 px-3 text-center">Status</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-medium">
                    No expense records match the current filter.
                  </td>
                </tr>
              ) : (
                expenses.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-cyan-800 whitespace-nowrap">
                      {e.expenseId}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-700 font-medium whitespace-nowrap">
                      {e.date}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">{getCategoryBadge(e.category)}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-700 font-medium">
                      <span className="inline-flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        {e.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-900 font-medium max-w-xs truncate" title={e.description}>
                      {e.description}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                      {formatCurrency(e.amount)}
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">{getStatusBadge(e.paymentStatus)}</td>
                    <td className="py-3.5 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedExpense(e)}
                          title="View Expense Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-cyan-800 border border-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {onUpdateStatus && e.paymentStatus !== "Paid" && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(e.id, "Paid")}
                            title="Mark as Paid"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteExpense && (
                          <button
                            type="button"
                            onClick={() => onDeleteExpense(e.id)}
                            title="Delete Record"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expense Detail Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">Expense Record Details</h3>
              <span className="font-mono text-xs text-cyan-800 font-bold">{selectedExpense.expenseId}</span>
            </div>
            <div className="space-y-2.5 text-xs text-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Date Logged:</span>
                <span className="font-mono font-bold text-slate-900">{selectedExpense.date}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Category & Department:</span>
                <span className="font-bold text-slate-900">{selectedExpense.category} • {selectedExpense.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Amount:</span>
                <span className="text-sm font-black text-emerald-800 font-mono">{formatCurrency(selectedExpense.amount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Payment Status:</span>
                <div>{getStatusBadge(selectedExpense.paymentStatus)}</div>
              </div>
              {selectedExpense.paymentMethod && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Payment Mode:</span>
                  <span className="font-bold text-slate-900">{selectedExpense.paymentMethod}</span>
                </div>
              )}
              {selectedExpense.invoiceRef && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600 font-medium">Invoice Ref:</span>
                  <span className="font-mono font-bold text-cyan-800">{selectedExpense.invoiceRef}</span>
                </div>
              )}
              <div className="pt-1">
                <span className="text-slate-600 font-medium block mb-1">Operational Justification:</span>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 leading-relaxed font-medium">
                  {selectedExpense.description}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-3">
              <button
                type="button"
                onClick={() => setSelectedExpense(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
