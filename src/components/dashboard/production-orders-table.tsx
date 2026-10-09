"use client";

import React from "react";
import {
  OrderPriorityType,
  OrderStatusType,
  ProductionOrderItem,
} from "@/types/dashboard";
import { ClipboardList, ArrowUpRight, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProductionOrdersTableProps {
  orders: ProductionOrderItem[];
}

export function ProductionOrdersTable({ orders }: ProductionOrdersTableProps) {
  const getStatusBadge = (status: OrderStatusType) => {
    switch (status) {
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            In Progress
          </span>
        );
      case "Delayed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            Delayed
          </span>
        );
      case "Scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
            <Clock className="w-3 h-3 text-slate-500" />
            Scheduled
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: OrderPriorityType) => {
    switch (priority) {
      case "Urgent":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-300">
            Urgent
          </span>
        );
      case "High":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300">
            High
          </span>
        );
      case "Normal":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-300">
            Normal
          </span>
        );
      case "Low":
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-cyan-600" />
            Recent Production Orders
          </h2>
          <p className="text-xs text-slate-600 font-medium mt-0.5">
            Active shop floor batches and job execution progress
          </p>
        </div>

        <Link
          href="/production"
          className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 hover:text-cyan-900 transition"
        >
          <span>View All Production Orders</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-700 uppercase tracking-wider text-[10px] font-bold">
              <th className="pb-3 font-bold">Order Number</th>
              <th className="pb-3 font-bold">Product SKU</th>
              <th className="pb-3 font-bold text-right">Planned</th>
              <th className="pb-3 font-bold text-right">Produced</th>
              <th className="pb-3 font-bold text-center">Efficiency</th>
              <th className="pb-3 font-bold text-center">Status</th>
              <th className="pb-3 font-bold text-center">Priority</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 pr-3 font-mono font-bold text-cyan-800 whitespace-nowrap">
                  {order.orderNumber}
                  <div className="text-[10px] text-slate-500 font-sans font-normal">
                    {order.targetLine}
                  </div>
                </td>

                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-900">{order.product}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Due: {order.dueDate}</div>
                </td>

                <td className="py-3.5 px-3 text-right font-mono text-slate-600 font-medium whitespace-nowrap">
                  {order.plannedQuantity.toLocaleString()} {order.unit}
                </td>

                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                  {order.producedQuantity.toLocaleString()} {order.unit}
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <div className="inline-flex flex-col items-center">
                    <span
                      className={`font-mono font-bold ${
                        order.efficiency >= 95
                          ? "text-emerald-700"
                          : order.efficiency > 0
                          ? "text-amber-700"
                          : "text-slate-500"
                      }`}
                    >
                      {order.efficiency}%
                    </span>
                    <div className="w-14 h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full rounded-full ${
                          order.efficiency >= 95
                            ? "bg-emerald-500"
                            : order.efficiency > 0
                            ? "bg-amber-500"
                            : "bg-slate-400"
                        }`}
                        style={{ width: `${Math.min(order.efficiency, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  {getStatusBadge(order.status)}
                </td>

                <td className="py-3.5 pl-3 text-center whitespace-nowrap">
                  {getPriorityBadge(order.priority)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
