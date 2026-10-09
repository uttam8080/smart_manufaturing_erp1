"use client";

import React from "react";
import { FactoryHealthScore } from "@/types/bi";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
  Building2,
} from "lucide-react";

interface FactoryHealthOverviewProps {
  scores: FactoryHealthScore[];
}

export function FactoryHealthOverview({ scores }: FactoryHealthOverviewProps) {
  const getStatusBadge = (status: FactoryHealthScore["status"]) => {
    switch (status) {
      case "Healthy":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Healthy
          </span>
        );
      case "Watch":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Watch
          </span>
        );
      case "Attention Required":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-300">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Attention Required
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700";
    if (score >= 80) return "text-amber-700";
    return "text-rose-700";
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return "bg-emerald-500";
    if (score >= 80) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Factory Health Overview & Pillar Health Scores
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Composite operational indices across manufacturing throughput, product quality, floor operations & fiscal stability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
          <Building2 className="w-3.5 h-3.5 text-cyan-700" />
          <span>Unified Enterprise Multi-Pillar Index: <strong className="text-emerald-700 font-mono font-bold">88.5 / 100</strong></span>
        </div>
      </div>

      {/* 4 Major Area Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {scores.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-slate-900">{s.area}</span>
                {getStatusBadge(s.status)}
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className={`text-3xl font-extrabold font-mono ${getScoreColor(s.currentScore)}`}>
                    {s.currentScore}
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-medium">/ 100</span>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold">
                  {s.trendUp ? (
                    <span className="text-emerald-700 flex items-center gap-0.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {s.trend}
                    </span>
                  ) : (
                    <span className="text-amber-700 flex items-center gap-0.5">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {s.trend}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-3">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(s.currentScore)}`}
                  style={{ width: `${s.currentScore}%` }}
                />
              </div>

              <p className="text-xs text-slate-700 leading-relaxed font-medium line-clamp-2" title={s.summary}>
                {s.summary}
              </p>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Prev Period: <strong className="text-slate-800 font-mono font-bold">{s.previousScore}</strong></span>
              <span className="text-slate-500 font-medium">Benchmark: 85+</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
