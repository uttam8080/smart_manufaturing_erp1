"use client";

import React, { useState } from "react";
import { AIInsightItem, AIInsightSeverity } from "@/types/dashboard";
import {
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  X,
  Zap,
} from "lucide-react";

interface AIOperationsInsightsProps {
  insights: AIInsightItem[];
}

export function AIOperationsInsights({ insights }: AIOperationsInsightsProps) {
  const [selectedInsight, setSelectedInsight] = useState<AIInsightItem | null>(null);

  const getSeverityBadge = (severity: AIInsightSeverity) => {
    switch (severity) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-300 shadow-2xs">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            High Severity
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-300 shadow-2xs">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Medium Severity
          </span>
        );
      case "Low":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-50 text-cyan-800 border border-cyan-300 shadow-2xs">
            <Info className="w-3 h-3 text-cyan-600" />
            Low Severity
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                AI Operations Insights
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-50 text-cyan-800 border border-cyan-200">
                PROTOTYPE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Automated anomaly detection, predictive failure alerts, and yield optimizations
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
          {insights.length} Actionable Insight{insights.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Insights Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex flex-col justify-between p-4 rounded-xl bg-slate-50/70 border border-slate-200 hover:border-cyan-300 hover:bg-white transition-all group space-y-3 shadow-2xs"
          >
            <div className="space-y-2">
              {/* Category & Severity */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-cyan-800">
                  {insight.category}
                </span>
                {getSeverityBadge(insight.severity)}
              </div>

              {/* Title */}
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-cyan-800 transition">
                {insight.title}
              </h3>

              {/* Explanation */}
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {insight.explanation}
              </p>

              {/* Recommended Action Card */}
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 block mb-1">
                  💡 Recommended Action:
                </span>
                <p className="text-slate-700 font-medium text-[11px] leading-snug">
                  {insight.recommendedAction}
                </p>
              </div>
            </div>

            {/* Bottom button & timestamp */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500 font-mono font-medium">
                {insight.timestamp}
              </span>

              <button
                onClick={() => setSelectedInsight(insight)}
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-800 hover:text-cyan-900 group-hover:translate-x-0.5 transition"
              >
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal / Deep-Dive Simulation */}
      {selectedInsight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white border border-slate-200 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(selectedInsight.severity)}
                    <span className="text-xs text-slate-500 font-mono font-medium">
                      {selectedInsight.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {selectedInsight.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedInsight(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                  Analysis & Diagnostic
                </span>
                <p className="text-slate-700 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {selectedInsight.explanation}
                </p>
              </div>

              <div>
                <span className="text-cyan-800 font-bold uppercase tracking-wider block mb-1 text-[10px]">
                  Prescribed Operational Resolution
                </span>
                <p className="text-slate-800 font-medium leading-relaxed bg-cyan-50/60 p-3 rounded-xl border border-cyan-200">
                  {selectedInsight.recommendedAction}
                </p>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-600 pt-1">
                <span>Impact Estimate: <strong className="text-slate-900 font-bold">{selectedInsight.impact}</strong></span>
                <span className="font-mono font-medium">Observed {selectedInsight.timestamp}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedInsight(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  alert(`Work Order / Inspection Ticket drafted for "${selectedInsight.title}"`);
                  setSelectedInsight(null);
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-xs font-bold text-white shadow-xs transition"
              >
                Create Corrective Action Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
