"use client";

import React from "react";
import { SimulationResults } from "@/types/digital-twin";
import {
  Boxes,
  Clock,
  Gauge,
  AlertTriangle,
  TrendingUp,
  IndianRupee,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";

interface TwinKpiCardsProps {
  results: SimulationResults | null;
  productUnit?: string;
}

export function TwinKpiCards({ results, productUnit = "Units" }: TwinKpiCardsProps) {
  if (!results) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { title: "Simulated Demand", icon: Boxes, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
          { title: "Net Available Time", icon: Clock, color: "text-cyan-700", bg: "bg-cyan-50 border-cyan-200" },
          { title: "Estimated Capacity", icon: Gauge, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
          { title: "Shortfall / Surplus", icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
          { title: "Delivery Lag", icon: TrendingUp, color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200" },
          { title: "Cost Impact", icon: IndianRupee, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 truncate">
                {item.title}
              </span>
              <div className={`p-1.5 rounded-lg border ${item.bg}`}>
                <item.icon className={`w-4 h-4 ${item.color}`} />
              </div>
            </div>
            <div className="text-xl font-extrabold font-mono text-slate-400">--</div>
            <span className="text-xs font-medium text-slate-500 mt-1">Awaiting scenario run</span>
          </div>
        ))}
      </div>
    );
  }

  const isShortfall = (results.productionShortfall || 0) > 0;
  const isSurplus = (results.productionSurplus || 0) > 0;
  const delayHours = results.estimatedDelayHours || 0;
  const costImpact = results.estimatedCostImpact || 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {/* 1. Simulated Demand */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-blue-400 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Simulated Demand
          </span>
          <div className="p-1.5 rounded-lg bg-blue-100 border border-blue-300 text-blue-800 shrink-0">
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <span className="text-2xl font-black font-mono text-slate-900">
            {results.simulatedDemand.toLocaleString()}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5">{productUnit}</span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          Base: {results.originalDemand.toLocaleString()} {productUnit}
        </span>
      </div>

      {/* 2. Net Operating Hours */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-cyan-400 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Operating Time
          </span>
          <div className="p-1.5 rounded-lg bg-cyan-100 border border-cyan-300 text-cyan-800 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <span className="text-2xl font-black font-mono text-slate-900">
            {results.netOperatingHours}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5">Hours</span>
        </div>
        <span className="text-xs font-semibold text-slate-600 truncate">
          {results.downtimeHours > 0 ? `-${results.downtimeHours}h downtime` : "0h downtime"} • {results.extraShiftHours > 0 ? `+${results.extraShiftHours}h shift` : "Standard shift"}
        </span>
      </div>

      {/* 3. Estimated Capacity */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-purple-400 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Est. Capacity
          </span>
          <div className="p-1.5 rounded-lg bg-purple-100 border border-purple-300 text-purple-800 shrink-0">
            <Gauge className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <span className="text-2xl font-black font-mono text-slate-900">
            {results.estimatedCapacity !== null ? results.estimatedCapacity.toLocaleString() : "N/A"}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5">{productUnit}</span>
        </div>
        <span className="text-xs font-semibold text-slate-600 truncate">
          {results.throughputRatePerHour ? `@ ${results.throughputRatePerHour} ${productUnit}/hr` : "No throughput rate"}
        </span>
      </div>

      {/* 4. Shortfall / Surplus */}
      <div
        className={`p-4 rounded-2xl border-2 shadow-sm transition-all flex flex-col justify-between ${
          isShortfall
            ? "bg-rose-50 border-rose-300 hover:border-rose-400"
            : isSurplus
            ? "bg-emerald-50 border-emerald-300 hover:border-emerald-400"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Balance
          </span>
          <div
            className={`p-1.5 rounded-lg border shrink-0 ${
              isShortfall
                ? "bg-rose-100 border-rose-300 text-rose-800"
                : "bg-emerald-100 border-emerald-300 text-emerald-800"
            }`}
          >
            {isShortfall ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          </div>
        </div>
        <div className="my-1.5">
          <span
            className={`text-2xl font-black font-mono ${
              isShortfall ? "text-rose-800" : isSurplus ? "text-emerald-800" : "text-slate-900"
            }`}
          >
            {isShortfall
              ? `-${results.productionShortfall?.toLocaleString()}`
              : `+${results.productionSurplus?.toLocaleString()}`}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5">{productUnit}</span>
        </div>
        <span
          className={`text-xs font-extrabold uppercase tracking-wider ${
            isShortfall ? "text-rose-800" : "text-emerald-800"
          }`}
        >
          {isShortfall ? "Shortfall Deficit" : "Capacity Buffer"}
        </span>
      </div>

      {/* 5. Delivery Lag */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-400 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Delivery Lag
          </span>
          <div className="p-1.5 rounded-lg bg-indigo-100 border border-indigo-300 text-indigo-800 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <span
            className={`text-2xl font-black font-mono ${
              delayHours > 0 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {delayHours > 0 ? `+${delayHours}` : "0.0"}
          </span>
          <span className="text-xs font-bold text-slate-600 ml-1.5">Hours</span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          {delayHours > 0 ? "Production delay expected" : "On-schedule target"}
        </span>
      </div>

      {/* 6. Cost Impact */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-400 transition-all flex flex-col justify-between">
        <div className="flex items-start justify-between gap-1 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Cost Impact
          </span>
          <div className="p-1.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 shrink-0">
            <IndianRupee className="w-4 h-4" />
          </div>
        </div>
        <div className="my-1.5">
          <span
            className={`text-2xl font-black font-mono ${
              costImpact > 0 ? "text-amber-700" : "text-emerald-700"
            }`}
          >
            {costImpact > 0 ? `+₹${costImpact.toLocaleString()}` : `₹${costImpact.toLocaleString()}`}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-600">
          Est. total: ₹{results.simulatedCost?.toLocaleString() || "0"}
        </span>
      </div>
    </div>
  );
}
