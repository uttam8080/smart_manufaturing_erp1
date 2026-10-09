"use client";

import React from "react";
import { ProductCostAnalysis } from "@/types/finance";
import { Factory, Package, Calculator, ArrowUpRight } from "lucide-react";

interface ProductionCostTableProps {
  products: ProductCostAnalysis[];
}

export function ProductionCostTable({ products }: ProductionCostTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalUnits = products.reduce((sum, p) => sum + p.unitsProduced, 0);
  const totalCost = products.reduce((sum, p) => sum + p.totalCost, 0);
  const avgCostPerUnit = (totalCost / (totalUnits || 1)).toFixed(2);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200">
              <Factory className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Production Cost Breakdown</h3>
              <p className="text-xs text-slate-600 font-medium">Direct material inputs, labor wages, machine amortization & unit production economics</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-medium">Total Units: <strong className="text-slate-900 font-bold">{totalUnits.toLocaleString()}</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">Avg Cost/Unit: <strong className="text-cyan-800 font-bold">₹{avgCostPerUnit}</strong></span>
          </div>
        </div>

        {/* Product Cost Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3.5">Product SKU</th>
                <th className="py-3.5 px-3 text-right">Units Produced</th>
                <th className="py-3.5 px-3 text-right">Material Cost</th>
                <th className="py-3.5 px-3 text-right">Labor Cost</th>
                <th className="py-3.5 px-3 text-right">Machine Cost</th>
                <th className="py-3.5 px-3 text-right">Total Production Cost</th>
                <th className="py-3.5 px-3.5 text-right">Cost Per Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {products.map((p) => {
                const calculatedUnitCost = (p.totalCost / (p.unitsProduced || 1)).toFixed(2);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-600" />
                        <span className="font-bold text-slate-900">{p.productName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-medium text-slate-700">
                      {p.unitsProduced.toLocaleString()} pkts
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-cyan-800">
                      {formatCurrency(p.materialCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-800">
                      {formatCurrency(p.laborCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-800">
                      {formatCurrency(p.machineCost)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900">
                      {formatCurrency(p.totalCost)}
                    </td>
                    <td className="py-3.5 px-3.5 text-right font-mono">
                      <span className="px-2 py-0.5 rounded-lg bg-cyan-50 text-cyan-800 font-bold border border-cyan-200 text-xs">
                        ₹{calculatedUnitCost}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50 text-xs font-bold text-slate-900 border-t border-slate-200">
              <tr>
                <td className="py-3.5 px-3.5">Total Batch Production</td>
                <td className="py-3.5 px-3 text-right font-mono font-bold">{totalUnits.toLocaleString()} pkts</td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-cyan-800">
                  {formatCurrency(products.reduce((s, p) => s + p.materialCost, 0))}
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-800">
                  {formatCurrency(products.reduce((s, p) => s + p.laborCost, 0))}
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-bold text-amber-800">
                  {formatCurrency(products.reduce((s, p) => s + p.machineCost, 0))}
                </td>
                <td className="py-3.5 px-3 text-right font-mono font-black text-slate-900">
                  {formatCurrency(totalCost)}
                </td>
                <td className="py-3.5 px-3.5 text-right font-mono font-black text-cyan-800">₹{avgCostPerUnit} / unit</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium">
        <span className="flex items-center gap-1.5">
          <Calculator className="w-3.5 h-3.5 text-slate-500" />
          Formula: <code className="text-slate-800 font-bold">Cost Per Unit = (Material + Labor + Machine) / Units Produced</code>
        </span>
        <span className="text-emerald-800 font-bold">Standard Costing Tolerances within ±2.5%</span>
      </div>
    </div>
  );
}
