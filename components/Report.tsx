
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Zap, TrendingDown, LayoutGrid, Award, ArrowUpRight, CheckCircle2, AlertTriangle, ShieldCheck, Download, Loader2
} from 'lucide-react';
import { FinalReport, BillData } from '../types';

interface ReportProps {
  report: FinalReport;
  billData: BillData;
}

export const Report: React.FC<ReportProps> = ({ report, billData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = () => {
    setIsGenerating(true);
    
    // Piccolo delay per assicurarsi che il DOM sia pronto dopo il cambio di stato isGenerating
    setTimeout(() => {
      const element = document.getElementById('report-content');
      if (!element) {
        setIsGenerating(false);
        return;
      }

      const opt = {
        margin: [10, 10],
        filename: `Audit_Energetico_360_${billData.providerName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          letterRendering: true,
          backgroundColor: '#ffffff' // Forza sfondo bianco
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // @ts-ignore
      html2pdf().set(opt).from(element).save().then(() => {
        setIsGenerating(false);
      }).catch((err: any) => {
        console.error("Errore generazione PDF:", err);
        setIsGenerating(false);
        window.print(); // Fallback
      });
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      {/* Container con ID per l'esportazione */}
      <div id="report-content" className="bg-white space-y-10 pb-10 rounded-[40px] overflow-hidden">
        
        {/* Hero Header - Ottimizzato per PDF (meno trasparenze complesse) */}
        <div className="bg-[#0f172a] p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
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

        <div className="px-10 space-y-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start space-x-4">
              <div className="bg-green-100 text-green-600 p-3 rounded-2xl">
                <TrendingDown size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Risparmio Potenziale</p>
                <h4 className="text-2xl font-bold text-slate-900">€{report.savingsModeling.yearlySavings.toFixed(2)}/anno</h4>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start space-x-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                <Zap size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Volume Analizzato</p>
                <h4 className="text-2xl font-bold text-slate-900">{billData.annualConsumption} kWh</h4>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-start space-x-4">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <ShieldCheck size={28} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Rating Contrattuale</p>
                <h4 className="text-2xl font-bold text-slate-900">{billData.alphaSpread > 0.05 ? 'Migliorabile' : 'Ottimo'}</h4>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Savings Chart - Disattivata animazione per PDF */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
                <LayoutGrid className="mr-2 text-blue-600" size={18} /> Proiezione Costi
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={report.savingsModeling.currentVsOptimizedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: 'none' }}
                    />
                    <Bar 
                      dataKey="cost" 
                      radius={[8, 8, 0, 0]} 
                      barSize={40}
                      isAnimationActive={false} // CRITICO: Disattivato per cattura PDF
                    >
                      {report.savingsModeling.currentVsOptimizedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#cbd5e1' : '#2563eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Behavioral Analysis */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                <CheckCircle2 className="mr-2 text-green-600" size={18} /> Strategia Operativa
              </h3>
              <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 mb-4">
                <p className="text-xs font-bold text-blue-400 uppercase mb-1">Miglior Finestra di Carico</p>
                <p className="text-md font-bold text-blue-900">{report.behaviorAnalysis.idealHours}</p>
              </div>
              <ul className="space-y-3">
                {report.behaviorAnalysis.tips.map((tip, i) => (
                  <li key={i} className="flex items-start space-x-3 text-sm text-slate-600">
                    <div className="mt-1 w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {i + 1}
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Market Intelligence Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <ArrowUpRight className="mr-2 text-blue-600" size={20} /> Market Intelligence (Benchmark)
            </h3>
            <div className="overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase">Provider</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase">Spread</th>
                    <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase text-right">Costo Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {report.marketIntelligence.map((offer, idx) => (
                    <tr key={idx}>
                      <td className="py-4 text-sm font-bold text-slate-800">{offer.name}</td>
                      <td className="py-4 text-xs text-blue-600 font-mono">+{offer.spread.toFixed(4)}</td>
                      <td className="py-4 text-sm text-right font-black text-slate-900">€{offer.estimatedYearlyCost.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pulsante di download - Escluso dal PDF via no-print e logica DOM */}
      <div className="flex justify-center pt-6 no-print">
        <button 
          onClick={handleDownload}
          disabled={isGenerating}
          className={`
            px-10 py-5 bg-[#0f172a] text-white font-bold rounded-2xl transition-all active:scale-95 flex items-center shadow-xl
            ${isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-blue-700'}
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-3 animate-spin" size={24} />
              Generazione documento...
            </>
          ) : (
            <>
              <Download className="mr-3" size={24} />
              Esporta Report Forense (PDF)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
