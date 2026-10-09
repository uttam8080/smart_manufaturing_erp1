"use client";

import React from "react";
import {
  Factory,
  Cpu,
  Flame,
  CheckCircle2,
  Package,
  Activity,
  AlertTriangle,
  Zap,
  ArrowRight,
} from "lucide-react";

interface TwinVisualizerProps {
  machineName: string;
  machineStatus: string;
  productName: string;
  downtimeHours: number;
  netHours: number;
  utilizationPct?: number;
  isSimulating: boolean;
}

export function TwinVisualizer({
  machineName,
  machineStatus,
  productName,
  downtimeHours,
  netHours,
  utilizationPct = 92.5,
  isSimulating,
}: TwinVisualizerProps) {
  const isDown = downtimeHours > 0;

  return (
    <div className="rounded-2xl bg-white text-slate-900 p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600">
            <Factory className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Factory Line Topology & Virtual Digital Twin
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                LIVE TOPOLOGY
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Interactive process flow for {productName} on {machineName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-slate-700 font-medium">
            <Activity className="w-3.5 h-3.5 text-cyan-600" />
            Line Flow: <strong className="text-slate-900 font-bold">{isDown ? `${netHours}h Active Window` : "Continuous"}</strong>
          </span>
        </div>
      </div>

      {/* Production Stages Flow */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {/* Step 1: Raw Material Kneading */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
              Stage 1: Prep
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Cpu className="w-4 h-4 text-cyan-600 shrink-0" />
            <span className="text-xs">Mixer & Extruder</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Flour tare, fat emulsion & high-speed dough kneading.
          </p>
          <div className="text-[10px] text-emerald-700 font-mono font-bold pt-1 border-t border-slate-200">
            Status: Synchronized
          </div>
        </div>

        {/* Step 2: Thermal Baking Oven (Target Simulated Asset) */}
        <div
          className={`p-4 rounded-xl border transition-all space-y-2 ${
            isDown
              ? "bg-amber-50 border-amber-300 shadow-xs"
              : "bg-cyan-50/40 border-cyan-200"
          }`}
        >
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[10px] text-cyan-700">
              Stage 2: Thermal Zone
            </span>
            <span
              className={`w-2 h-2 rounded-full ${
                isDown ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
              }`}
            />
          </div>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Flame className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs truncate">{machineName}</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Radiant heat zones & continuous conveyor bake cycle.
          </p>
          <div className="text-[10px] font-mono font-bold pt-1 border-t border-slate-200 flex justify-between">
            <span className={isDown ? "text-amber-800" : "text-emerald-700"}>
              {isDown ? `Downtime: -${downtimeHours}h` : "Nominal Uptime"}
            </span>
            <span className="text-slate-600">{netHours}h Window</span>
          </div>
        </div>

        {/* Step 3: Optical QA Sorter */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
              Stage 3: QA Audit
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="text-xs">Optical Sorter & QC</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Weight tare check, crust colorimeter & defect reject.
          </p>
          <div className="text-[10px] text-purple-700 font-mono font-bold pt-1 border-t border-slate-200">
            Pass Rate: 98.3%
          </div>
        </div>

        {/* Step 4: Flow-Wrap Packaging Line */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
              Stage 4: Packaging
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            <Package className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs">Flow-Wrap & Carton</span>
          </div>
          <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
            Sealing film wrapping, lot coding & case collating.
          </p>
          <div className="text-[10px] text-cyan-700 font-mono font-bold pt-1 border-t border-slate-200">
            Output: {productName}
          </div>
        </div>
      </div>
    </div>
  );
}
