"use client";

import React from "react";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Factory,
  Briefcase,
  Clock,
  CalendarDays,
  Percent,
  CreditCard,
} from "lucide-react";

interface FinanceKpiCardsProps {
  totalRevenue?: number;
  productionCost?: number;
  procurementCost?: number;
  operationalExpenses?: number;
  grossProfit?: number;
  profitMargin?: number;
  pendingPayments?: number;
  monthlyExpenses?: number;
}

export function FinanceKpiCards({
  totalRevenue = 8500000,
  productionCost = 4200000,
  procurementCost = 1850000,
  operationalExpenses = 820000,
  grossProfit = 1630000,
  profitMargin = 19.1,
  pendingPayments = 650000,
  monthlyExpenses = 1240000,
}: FinanceKpiCardsProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      subtext: "Current fiscal month turnover",
      icon: IndianRupee,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50 border-emerald-200",
      trend: "+4.2% vs last month",
      trendUp: true,
    },
    {
      title: "Production Cost",
      value: formatCurrency(productionCost),
      subtext: "Direct manufacturing & batch run",
      icon: Factory,
      iconColor: "text-cyan-700",
      iconBg: "bg-cyan-50 border-cyan-200",
      trend: "49.4% of total revenue",
      trendUp: false,
    },
    {
      title: "Procurement Cost",
      value: formatCurrency(procurementCost),
      subtext: "Raw materials & packaging input",
      icon: ShoppingBag,
      iconColor: "text-purple-700",
      iconBg: "bg-purple-50 border-purple-200",
      trend: "Across 4 active suppliers",
      trendUp: true,
    },
    {
      title: "Operational Expenses",
      value: formatCurrency(operationalExpenses),
      subtext: "Plant utilities, logistics & tech",
      icon: Briefcase,
      iconColor: "text-amber-700",
      iconBg: "bg-amber-50 border-amber-200",
      trend: "Within approved limits",
      trendUp: true,
    },
    {
      title: "Gross Profit",
      value: formatCurrency(grossProfit),
      subtext: "Revenue minus direct costs",
      icon: TrendingUp,
      iconColor: "text-emerald-700",
      iconBg: "bg-emerald-50 border-emerald-200",
      trend: "+₹1,80,000 above target",
      trendUp: true,
    },
    {
      title: "Profit Margin",
      value: `${profitMargin}%`,
      subtext: "Net operational margin",
      icon: Percent,
      iconColor: "text-cyan-700",
      iconBg: "bg-cyan-50 border-cyan-200",
      trend: "Benchmark: 18.0%",
      trendUp: true,
    },
    {
      title: "Pending Payments",
      value: formatCurrency(pendingPayments),
      subtext: "Payables awaiting disbursement",
      icon: Clock,
      iconColor: "text-rose-700",
      iconBg: "bg-rose-50 border-rose-200",
      trend: "2 invoices overdue",
      trendUp: false,
    },
    {
      title: "Monthly Expenses",
      value: formatCurrency(monthlyExpenses),
      subtext: "Cumulative overheads logged",
      icon: CreditCard,
      iconColor: "text-blue-700",
      iconBg: "bg-blue-50 border-blue-200",
      trend: "Current billing cycle",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl border border-slate-200 bg-white p-4 hover:border-slate-300 transition-all shadow-sm flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 tracking-tight">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-tight">
                {card.subtext}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              {card.trendUp ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="truncate">{card.trend}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
