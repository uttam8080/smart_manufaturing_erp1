'use client';

import React, { useState, useEffect } from 'react';
import { 
  ProblemSimulationResponse, 
  DecisionOption, 
  SituationType, 
  PriorityTradeoff 
} from '@/types/decision-simulation';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  DollarSign, 
  Sparkles, 
  RefreshCw, 
  Save, 
  Check, 
  HelpCircle,
  Truck,
  Wrench,
  BarChart3,
  Flame,
  FileCheck
} from 'lucide-react';

interface Props {
  metadata?: any;
}

export function AiDecisionStudio({ metadata }: Props) {
  // Scenario Inputs
  const [situationType, setSituationType] = useState<SituationType>('RAW_MATERIAL_DELAY');
  const [delayHours, setDelayHours] = useState<number>(2);
  const [selectedOrderId, setSelectedOrderId] = useState<number>(4);
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>(3);
  const [priority, setPriority] = useState<PriorityTradeoff>('BALANCED');
  const [managerNotes, setManagerNotes] = useState<string>('');

  // Simulation State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<ProblemSimulationResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<'OPTION_A' | 'OPTION_B' | 'OPTION_C'>('OPTION_B');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Persistence State
  const [isSavingDecision, setIsSavingDecision] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isApplyingToErp, setIsApplyingToErp] = useState<boolean>(false);
  const [applySuccessMsg, setApplySuccessMsg] = useState<string | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<any[]>([]);

  // Load decision history
  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/digital-twin/history');
      const data = await res.json();
      if (data.status === 'success') {
        setDecisionHistory(data.data || []);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Run initial simulation on load
  const runSimulation = async () => {
    setIsSimulating(true);
    setErrorMsg(null);
    setSaveSuccessMsg(null);
    setApplySuccessMsg(null);

    try {
      const res = await fetch('/api/digital-twin/simulate-problem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          situation_type: situationType,
          delay_hours: delayHours,
          production_order_id: selectedOrderId,
          material_id: selectedMaterialId,
          priority: priority
        })
      });

      const json = await res.json();
      if (json.status === 'success' && json.data) {
        setSimulationResult(json.data);
        setSelectedOption(json.data.recommended_option || 'OPTION_B');
      } else {
        setErrorMsg(json.error || 'Failed to simulate scenario.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection error');
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, []);

  // Save manager decision to PostgreSQL audit storage
  const handleSaveDecision = async () => {
    if (!simulationResult) return;
    setIsSavingDecision(true);
    setSaveSuccessMsg(null);

    const chosenOpt = simulationResult.options.find(o => o.option_id === selectedOption);
    if (!chosenOpt) return;

    try {
      const res = await fetch('/api/digital-twin/record-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: simulationResult.scenario_id,
          scenario_code: simulationResult.scenario_code,
          situation_type: situationType,
          selected_option: selectedOption,
          option_title: chosenOpt.title,
          manager_id: 'MGR-001',
          manager_name: 'Production Operations Manager',
          manager_notes: managerNotes || `Selected ${chosenOpt.title} to optimize ${priority}`,
          priority_tradeoff: priority,
          estimated_delay_hours: chosenOpt.metrics.predicted_delay_hours,
          estimated_extra_cost: chosenOpt.metrics.extra_cost,
          estimated_capacity_utilization: chosenOpt.metrics.capacity_utilization_pct,
          options_data: simulationResult.options,
          problem_summary: simulationResult.problem_summary
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setSaveSuccessMsg(`Decision successfully logged to PostgreSQL audit storage (ID: #${json.data.id}).`);
        fetchHistory();
      } else {
        setErrorMsg(json.error || 'Failed to save decision.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to save decision.');
    } finally {
      setIsSavingDecision(false);
    }
  };

  // Safe apply approved changes to ERP
  const handleApplyToErp = async () => {
    if (!simulationResult) return;
    const confirmApprove = window.confirm(
      `Apply approved adjustments for ${selectedOption} to live ERP production schedules?\n\nThis will safely update the operational queue inside a PostgreSQL transaction.`
    );
    if (!confirmApprove) return;

    setIsApplyingToErp(true);
    setApplySuccessMsg(null);

    try {
      const res = await fetch('/api/digital-twin/apply-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario_id: simulationResult.scenario_id,
          selected_option: selectedOption,
          manager_id: 'MGR-001',
          confirmation_token: 'MGR-CONFIRM-99'
        })
      });

      const json = await res.json();
      if (json.status === 'success') {
        setApplySuccessMsg(`Operational changes successfully applied to ERP! ${json.applied_summary.changes_applied?.join(', ')}`);
        fetchHistory();
      } else {
        setErrorMsg(json.error || 'Failed to apply decision.');
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to apply decision.');
    } finally {
      setIsApplyingToErp(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 rounded-2xl p-6 text-slate-900 border border-indigo-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600" /> AI Digital Twin Decision Studio
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 shadow-xs">
                PostgreSQL Operational Twin
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              AI Problem-Solving & What-If Decision Engine
            </h1>
            <p className="text-slate-700 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed font-medium">
              Simulate operational disruptions, evaluate 3 AI-synthesized mitigation strategies (Option A, B, and C), 
              compare trade-offs across cost, delays, and capacity, and record verified management decisions to the ERP.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              disabled={isSimulating}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50 tracking-wide"
            >
              <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
              {isSimulating ? 'Evaluating AI Options...' : 'Run What-If Simulation'}
            </button>
          </div>
        </div>
      </div>

      {/* Disruption Situation Selector (5 Situations) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>Step 1: Select Factory Disruption Situation</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
          {/* Situation 1 */}
          <button
            type="button"
            onClick={() => setSituationType('RAW_MATERIAL_DELAY')}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              situationType === 'RAW_MATERIAL_DELAY'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                <Truck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                Primary
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900">1. Material Delay</div>
            <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Flour / Sugar shipment delayed by 2h
            </div>
          </button>

          {/* Situation 2 */}
          <button
            type="button"
            onClick={() => setSituationType('MACHINE_BREAKDOWN')}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              situationType === 'MACHINE_BREAKDOWN'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Wrench className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Active
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900">2. Machine Breakdown</div>
            <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Baking oven down for 3h
            </div>
          </button>

          {/* Situation 3 */}
          <button
            type="button"
            onClick={() => setSituationType('DEMAND_SPIKE')}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              situationType === 'DEMAND_SPIKE'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <TrendingUp className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Active
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900">3. Demand Spike</div>
            <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Customer order +50% surge
            </div>
          </button>

          {/* Situation 4 */}
          <button
            type="button"
            onClick={() => setSituationType('QUALITY_DEFECT_SURGE')}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              situationType === 'QUALITY_DEFECT_SURGE'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Active
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900">4. Quality Defect</div>
            <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Defect rate rises 2% → 8%
            </div>
          </button>

          {/* Situation 5 */}
          <button
            type="button"
            onClick={() => setSituationType('URGENT_ORDER')}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              situationType === 'URGENT_ORDER'
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-md ring-2 ring-indigo-500/20'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <Flame className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                Active
              </span>
            </div>
            <div className="font-bold text-sm text-slate-900">5. Urgent VIP Order</div>
            <div className="text-xs text-slate-600 font-medium mt-1 leading-snug">
              Dispatch needed 1 day earlier
            </div>
          </button>
        </div>

        {/* Dynamic Inputs Panel */}
        <div className="mt-6 pt-5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Affected Production Order
            </label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(Number(e.target.value))}
              className="w-full text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 shadow-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value={4}>Order #4 — Coconut Biscuit (Batch BAT-2026-004)</option>
              <option value={2}>Order #2 — Chocolate Biscuit (Batch BAT-2026-002)</option>
              <option value={5}>Order #5 — Chocolate Biscuit (Batch BAT-2026-005)</option>
              <option value={7}>Order #7 — Coconut Biscuit (Batch BAT-TEST-0020)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Delayed Raw Material
            </label>
            <select
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(Number(e.target.value))}
              className="w-full text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 shadow-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value={3}>Wheat Flour (RM-FLR-001)</option>
              <option value={10}>Vanilla Extract Formulation 0105</option>
              <option value={11}>Vanilla Extract Formulation 8303</option>
              <option value={4}>Biscuit Packaging Wrapper (PK-WRP-001)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Disruption Duration:
              </label>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                {delayHours} Hours
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="8"
              step="0.5"
              value={delayHours}
              onChange={(e) => setDelayHours(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-2"
            />
            <div className="flex justify-between text-xs font-bold text-slate-500 mt-1">
              <span>0.5h</span>
              <span>2.0h</span>
              <span>4.0h</span>
              <span>8.0h</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
              Optimization Priority Focus
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as PriorityTradeoff)}
              className="w-full text-sm font-bold rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-slate-900 shadow-xs focus:bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="BALANCED">⚖️ Balanced (SLA + Cost + Output)</option>
              <option value="DELIVERY_FIRST">🚀 Delivery First (Protect Customer SLA)</option>
              <option value="COST_MINIMIZE">💰 Minimize Cost (₹0 Extra Outlay)</option>
              <option value="THROUGHPUT_MAX">⚡ Max Throughput (Keep Lines 100%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm font-semibold flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Save / Apply Success Alerts */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-semibold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {applySuccessMsg && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-blue-800 text-sm font-semibold flex items-center gap-3 shadow-xs">
          <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <span>{applySuccessMsg}</span>
        </div>
      )}

      {/* AI Scenario Results: Three Options (A, B, C) */}
      {simulationResult && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <span>Step 2: AI Evaluated Strategies (Options A, B & C)</span>
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                Evaluated against live production parameters for Batch #{simulationResult.problem_summary.affected_production_order.batch_number}
              </p>
            </div>
            <div className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span>Safety Guarantee:</span>
              <span className="text-emerald-700 font-extrabold">Read-Only Operational Twin</span>
            </div>
          </div>

          {/* 3 Option Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {simulationResult.options.map((option) => {
              const isSelected = selectedOption === option.option_id;
              const isRecommended = option.is_recommended;

              return (
                <div
                  key={option.option_id}
                  onClick={() => setSelectedOption(option.option_id)}
                  className={`rounded-2xl p-5 border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Top recommendation badge */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-extrabold ${
                          option.option_id === 'OPTION_A' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          option.option_id === 'OPTION_B' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-purple-100 text-purple-800 border border-purple-300'
                        }`}>
                          {option.option_id === 'OPTION_A' ? 'Option A' : option.option_id === 'OPTION_B' ? 'Option B' : 'Option C'}
                        </span>
                        <span className="text-xs font-bold text-slate-600">
                          {option.badge_label}
                        </span>
                      </div>

                      {isRecommended && (
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Best Choice
                        </span>
                      )}
                    </div>

                    {/* Title & Strategy */}
                    <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                      {option.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mt-2 leading-relaxed">
                      {option.strategy_description}
                    </p>

                    {/* KPI Metrics Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-xs font-bold text-slate-500">Predicted Delay</div>
                        <div className={`text-base font-black mt-0.5 ${
                          option.metrics.predicted_delay_hours === 0 ? 'text-emerald-700' :
                          option.metrics.predicted_delay_hours <= 1 ? 'text-amber-700' : 'text-rose-700'
                        }`}>
                          +{option.metrics.predicted_delay_hours} hrs
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500">Extra Expense</div>
                        <div className="text-base font-black text-slate-900 mt-0.5">
                          ₹{option.metrics.extra_cost.toLocaleString('en-IN')}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500">Capacity Util.</div>
                        <div className="text-base font-black text-indigo-700 mt-0.5">
                          {option.metrics.capacity_utilization_pct}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500">Customer Delivery</div>
                        <div className={`text-xs font-black mt-1 px-2 py-0.5 rounded-md inline-block ${
                          option.metrics.customer_delivery_impact === 'ON_TIME' || option.metrics.customer_delivery_impact === 'EARLY'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {option.metrics.customer_delivery_impact === 'EARLY' ? '✓ Early' :
                           option.metrics.customer_delivery_impact === 'ON_TIME' ? '✓ On-Time' : '⚠ Delayed'}
                        </div>
                      </div>
                    </div>

                    {/* Suitability Score Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-bold mb-1.5">
                        <span className="text-slate-700">AI Suitability Score</span>
                        <span className="text-indigo-700 font-extrabold">{option.suitability_score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden border border-slate-300">
                        <div 
                          className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${option.suitability_score}%` }}
                        />
                      </div>
                    </div>

                    {/* Trade-offs summary */}
                    <div className="mt-4 space-y-2 text-xs sm:text-sm">
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
                        <span className="font-bold text-emerald-800">✓ Benefit: </span>
                        <span className="text-slate-800 font-medium">{option.trade_offs.pros[0]}</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200">
                        <span className="font-bold text-rose-800">✕ Trade-off: </span>
                        <span className="text-slate-800 font-medium">{option.trade_offs.cons[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Radio Selection at bottom */}
                  <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      {isSelected ? '✓ Selected for Action' : 'Click to select this plan'}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-600 text-white' 
                        : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 font-bold" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Recommendation Summary Box */}
          <div className="p-5 rounded-xl bg-indigo-50 border border-indigo-200 text-sm flex items-start gap-3.5 shadow-xs">
            <Sparkles className="w-6 h-6 text-indigo-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-extrabold text-base text-indigo-950">
                AI Recommendation: {simulationResult.recommended_option === 'OPTION_A' ? 'Option A' : simulationResult.recommended_option === 'OPTION_B' ? 'Option B' : 'Option C'}
              </span>
              <p className="text-indigo-900 font-medium text-xs sm:text-sm mt-1 leading-relaxed">
                {simulationResult.recommendation_rationale}
              </p>
            </div>
          </div>

          {/* Step 3: Manager Decision & Action Approval Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <span>Step 3: Factory Manager Decision Approval</span>
              </h3>
              <span className="text-xs font-bold text-slate-600">
                Selected Plan: <span className="text-indigo-700 font-extrabold">{selectedOption}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                  Manager Rationale / Decision Notes (Audit Trail)
                </label>
                <input
                  type="text"
                  placeholder="Enter reason for selecting this option (e.g. Prioritizing VIP Customer Order SLA over changeover expense)..."
                  value={managerNotes}
                  onChange={(e) => setManagerNotes(e.target.value)}
                  className="w-full text-sm font-semibold rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs"
                />
              </div>

              <div className="flex items-end gap-2.5">
                <button
                  type="button"
                  onClick={handleSaveDecision}
                  disabled={isSavingDecision}
                  className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-extrabold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingDecision ? 'Saving...' : 'Save Audit Log'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyToErp}
                  disabled={isApplyingToErp}
                  className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 tracking-wide"
                >
                  <Zap className="w-4 h-4" />
                  <span>{isApplyingToErp ? 'Applying...' : 'Approve & Apply to ERP'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decision Audit History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>Decision History & Operational Audit Trail</span>
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            {decisionHistory.length} Persistent Decisions Logged
          </span>
        </div>

        {decisionHistory.length === 0 ? (
          <div className="p-8 text-center text-sm font-medium text-slate-600 bg-slate-50 rounded-xl border border-slate-200">
            No saved decisions in PostgreSQL yet. Run a simulation above and save your first decision.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-extrabold text-xs border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3.5 rounded-l-lg">Scenario Code</th>
                  <th className="py-3 px-3.5">Situation</th>
                  <th className="py-3 px-3.5">Chosen Option</th>
                  <th className="py-3 px-3.5">Manager Notes</th>
                  <th className="py-3 px-3.5">Delay / Cost</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5 rounded-r-lg">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {decisionHistory.map((item: any) => (
                  <tr key={item.decision_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3.5 font-mono font-extrabold text-indigo-700">{item.scenario_code}</td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">{item.situation_type?.replace(/_/g, ' ')}</td>
                    <td className="py-3.5 px-3.5">
                      <span className="px-2.5 py-1 rounded-md font-extrabold text-xs bg-slate-100 text-slate-800 border border-slate-200">
                        {item.selected_option}
                      </span>
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600 max-w-xs truncate">{item.manager_notes}</td>
                    <td className="py-3.5 px-3.5 font-bold text-slate-900">
                      +{item.estimated_delay_hours}h / ₹{Number(item.estimated_extra_cost).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3.5">
                      {item.applied_to_erp ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Applied to ERP
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 border border-blue-300">
                          Recorded
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3.5 text-slate-600 font-semibold">{new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
