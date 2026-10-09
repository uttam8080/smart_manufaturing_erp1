"use client";

import React from "react";
import { MachineItem } from "@/types/machines";
import { RiskIndicator } from "./risk-indicator";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Wrench,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";

interface PredictiveMaintenanceCardProps {
  machines: MachineItem[];
  onScheduleMaintenance: (machine: MachineItem) => void;
  onViewMachine: (machine: MachineItem) => void;
}

export function PredictiveMaintenanceCard({
  machines,
  onScheduleMaintenance,
  onViewMachine,
}: PredictiveMaintenanceCardProps) {
  const [showAll, setShowAll] = React.useState(false);

  // Filter for machines with warnings, critical, high or elevated risk
  const flaggedMachines = machines.filter(
    (m) =>
      m.prediction.riskLevel === "Critical" ||
      m.prediction.riskLevel === "High" ||
      m.prediction.riskLevel === "Medium" ||
      m.prediction.riskScore > 30 ||
      m.status === "Warning" ||
      m.status === "Maintenance"
  );

  const displayedMachines = (showAll ? machines : (flaggedMachines.length > 0 ? flaggedMachines : machines)).sort(
    (a, b) => b.prediction.riskScore - a.prediction.riskScore
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                Predictive Maintenance AI Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                AI / ML PROTOTYPE
              </span>
              {flaggedMachines.length > 0 && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                  {flaggedMachines.length} Action Required
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-0.5 font-medium">
              Anomaly detection & early failure prediction model focusing on equipment requiring preventative service
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {flaggedMachines.length > 0 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-50 border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            >
              {showAll ? `Show Flagged Only (${flaggedMachines.length})` : `Show All (${machines.length})`}
            </button>
          )}
          <span className="text-xs font-mono font-bold text-cyan-800 hidden md:inline">
            {machines.length} Models Synchronized
          </span>
        </div>
      </div>

      {/* Prediction Cards Grid Container with vertical scrollbar when expanded */}
      <div
        className={`${
          showAll || displayedMachines.length > 3
            ? "max-h-[560px] overflow-y-auto pr-2 space-y-4 custom-scrollbar"
            : ""
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedMachines.map((machine) => {
            const pred = machine.prediction;
            const isCritical = pred.riskLevel === "Critical";
            const isHigh = pred.riskLevel === "High";

            return (
              <div
                key={machine.id}
                className={`flex flex-col justify-between p-4.5 rounded-xl transition-all space-y-3.5 ${
                  isCritical || isHigh
                    ? "bg-amber-50/40 border-2 border-amber-300 shadow-sm"
                    : "bg-white border border-slate-200 hover:border-slate-300 shadow-xs"
                }`}
              >
                <div className="space-y-3">
                  {/* Top header: Code, Name, Risk indicator */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-200">
                    <div>
                      <span className="font-mono text-xs font-bold text-cyan-800 tracking-wider">
                        {machine.machineCode}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide mt-0.5">
                        {machine.machineName}
                      </h3>
                    </div>

                    <RiskIndicator
                      riskLevel={pred.riskLevel}
                      riskScore={pred.riskScore}
                      showMeter={false}
                    />
                  </div>

                  {/* Main Risk Factor Badge */}
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Primary Failure Risk Factor
                    </span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {pred.mainRiskFactor}
                    </span>
                  </div>

                  {/* Prediction Explanation */}
                  <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200 text-xs">
                    <p className="text-slate-800 text-xs font-medium leading-relaxed">
                      {pred.prediction}
                    </p>
                  </div>

                  {/* Prescribed Action */}
                  <div className="p-3 rounded-lg bg-cyan-50/70 border border-cyan-200 text-xs space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-900 block">
                      💡 Prescribed Maintenance Action:
                    </span>
                    <p className="text-slate-900 text-xs font-semibold leading-relaxed">
                      {pred.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onViewMachine(machine)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Activity className="w-3.5 h-3.5 text-cyan-600" />
                    <span>View Telemetry</span>
                  </button>

                  <button
                    onClick={() => onScheduleMaintenance(machine)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer ${
                      isCritical || isHigh
                        ? "bg-amber-600 hover:bg-amber-700 text-white border border-amber-600"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-600"
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Schedule PM</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
