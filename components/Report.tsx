
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Zap, TrendingDown, LayoutGrid, Award, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { FinalReport, BillData } from '../types';

interface ReportProps {
  report: FinalReport;
  billData: BillData;
}

export const Report: React.FC<ReportProps> = ({ report, billData }) => {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={240} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Award className="mr-2" size={14} /> Consulente Strategico Certificato
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">Il Verdetto dell'Auditor</h1>
          <p className="text-xl text-blue-100 opacity-90 leading-relaxed font-light italic">
            "{report.verdict}"
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Potenziale Risparmio Annuo</p>
            <h4 className="text-3xl font-bold text-slate-900">€{report.savingsModeling.yearlySavings.toFixed(2)}</h4>
            <p className="text-xs text-green-500 font-bold mt-1">≈ {((report.savingsModeling.yearlySavings / 1200) * 100).toFixed(1)}% del budget</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Consumo Annuo Analizzato</p>
            <h4 className="text-3xl font-bold text-slate-900">{billData.annualConsumption} kWh</h4>
            <p className="text-xs text-slate-400 font-medium mt-1">Potenza Impegnata: {billData.powerCommitted} kW</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-start space-x-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Rating Contrattuale</p>
            <h4 className="text-3xl font-bold text-slate-900">{billData.alphaSpread > 0.05 ? 'Migliorabile' : 'Eccellente'}</h4>
            <p className="text-xs text-slate-400 font-medium mt-1">Spread rilevato: {billData.alphaSpread} €/kWh</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Savings Chart */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <LayoutGrid className="mr-2 text-blue-600" size={20} /> Modellazione del Risparmio
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={report.savingsModeling.currentVsOptimizedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="cost" radius={[10, 10, 0, 0]} barSize={50}>
                  {report.savingsModeling.currentVsOptimizedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#94a3b8' : '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-4 text-sm text-slate-500 text-center italic">
            Confronto tra costo stimato attuale e costo con efficientamento e cambio tariffe.
          </p>
        </div>

        {/* Behavioral Analysis */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
            <CheckCircle2 className="mr-2 text-green-600" size={20} /> Analisi Comportamentale
          </h3>
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter mb-2">Slot Orari Ideali</p>
            <p className="text-lg font-semibold text-slate-800">{report.behaviorAnalysis.idealHours}</p>
          </div>
          <ul className="space-y-4">
            {report.behaviorAnalysis.tips.map((tip, i) => (
              <li key={i} className="flex items-start space-x-3">
                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <span className="text-[10px] font-bold">{i + 1}</span>
                </div>
                <span className="text-sm text-slate-600 leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Market Intelligence */}
      <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900 flex items-center">
              <ArrowUpRight className="mr-2 text-blue-600" size={24} /> Market Intelligence
            </h3>
            <p className="text-slate-500">I migliori fornitori aggiornati ai parametri PUN correnti.</p>
          </div>
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex items-center text-amber-800 text-xs font-medium">
            <AlertTriangle className="mr-2" size={14} /> Stime basate su profilo di consumo rilevato.
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-bold text-slate-400 uppercase text-xs">Fornitore</th>
                <th className="pb-4 font-bold text-slate-400 uppercase text-xs">Tipo Indice</th>
                <th className="pb-4 font-bold text-slate-400 uppercase text-xs">Spread (€/kWh)</th>
                <th className="pb-4 font-bold text-slate-400 uppercase text-xs">Quota Fissa (€/anno)</th>
                <th className="pb-4 font-bold text-slate-400 uppercase text-xs text-right">Costo Annuo Est.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {report.marketIntelligence.map((offer, idx) => (
                <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                  <td className="py-5 font-bold text-slate-900">{offer.name}</td>
                  <td className="py-5 text-slate-600 text-sm">{offer.punBase}</td>
                  <td className="py-5 font-mono text-sm text-blue-600">+{offer.spread.toFixed(4)}</td>
                  <td className="py-5 text-slate-600 text-sm">€{offer.fixedCost}/anno</td>
                  <td className="py-5 text-right font-extrabold text-slate-900">€{offer.estimatedYearlyCost.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button 
          onClick={() => window.print()}
          className="px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center shadow-xl shadow-slate-200"
        >
          Scarica Report Completo (PDF)
        </button>
      </div>
    </div>
  );
};
