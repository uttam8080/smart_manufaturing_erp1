"use client";

import React from "react";
import { Users, AlertTriangle, CheckCircle2, TrendingUp, Layers } from "lucide-react";

interface WorkforceCapacityProps {
  requiredWorkforce?: number;
  availableWorkforce?: number;
  allocatedWorkforce?: number;
}

export function WorkforceCapacity({
  requiredWorkforce = 84,
  availableWorkforce = 74,
  allocatedWorkforce = 74,
}: WorkforceCapacityProps) {
  const capacityGap = requiredWorkforce - availableWorkforce;
  const capacityRate = Math.min(100, Math.round((availableWorkforce / requiredWorkforce) * 100));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Workforce Capacity & Manning Ratio
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Plant headcount demand vs actual floor availability with automated capacity gap computation
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-300">
          Capacity Index: {capacityRate}%
        </span>
      </div>

      {/* 4 Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-5">
        {/* Required */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs text-slate-600 font-bold block mb-1">Required Workforce</span>
          <div className="text-2xl font-black font-mono text-slate-900">
            {requiredWorkforce} <span className="text-xs text-slate-500 font-sans font-medium">staff</span>
          </div>
          <span className="text-[10px] text-slate-500 font-bold block mt-1">Full shift quota</span>
        </div>

        {/* Available */}
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300">
          <span className="text-xs text-emerald-800 font-bold block mb-1">Available Workforce</span>
          <div className="text-2xl font-black font-mono text-emerald-900">
            {availableWorkforce} <span className="text-xs text-emerald-700 font-sans font-medium">present</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold block mt-1">Present on shift</span>
        </div>

        {/* Allocated */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-300">
          <span className="text-xs text-blue-800 font-bold block mb-1">Allocated to Lines</span>
          <div className="text-2xl font-black font-mono text-blue-900">
            {allocatedWorkforce} <span className="text-xs text-blue-700 font-sans font-medium">assigned</span>
          </div>
          <span className="text-[10px] text-blue-700 font-bold block mt-1">100% Manning Rate</span>
        </div>

        {/* Capacity Gap */}
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300">
          <span className="text-xs text-rose-800 font-bold block mb-1">Capacity Gap</span>
          <div className="text-2xl font-black font-mono text-rose-900">
            -{capacityGap} <span className="text-xs text-rose-700 font-sans font-medium">shortage</span>
          </div>
          <span className="text-[10px] text-rose-700 font-bold block mt-1">
            Requires cross-deployment
          </span>
        </div>
      </div>

      {/* Visual Capacity Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-slate-700 font-bold">
          <span>Overall Plant Staffing Fulfillment</span>
          <span className="font-mono font-black text-slate-900">{capacityRate}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${capacityRate}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] text-slate-600 font-medium pt-0.5">
          <span>0 Staff</span>
          <span>Target Threshold: &gt;95%</span>
          <span>{requiredWorkforce} Staff (100%)</span>
        </div>
      </div>
    </div>
  );
}
