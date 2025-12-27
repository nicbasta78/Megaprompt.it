
import React, { useState } from 'react';
import { AuditPhase, BillData, InterviewResponse, FinalReport } from './types';
import { extractBillData, generateFinalReport } from './services/geminiService';
import { Uploader } from './components/Uploader';
import { Interview } from './components/Interview';
import { Report } from './components/Report';
import { Zap, ShieldAlert, Cpu } from 'lucide-react';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AuditPhase>(AuditPhase.IDLE);
  const [billData, setBillData] = useState<BillData | null>(null);
  const [report, setReport] = useState<FinalReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBillUpload = async (base64: string, mimeType: string) => {
    setPhase(AuditPhase.EXTRACTING);
    setError(null);
    try {
      const data = await extractBillData(base64, mimeType);
      setBillData(data);
      setPhase(AuditPhase.INTERVIEW);
    } catch (err) {
      console.error(err);
      setError("Errore durante l'analisi del documento. Assicurati che il file sia leggibile.");
      setPhase(AuditPhase.IDLE);
    }
  };

  const handleInterviewComplete = async (responses: InterviewResponse[]) => {
    if (!billData) return;
    setPhase(AuditPhase.GENERATING_REPORT);
    try {
      const finalReport = await generateFinalReport(billData, responses);
      setReport(finalReport);
      setPhase(AuditPhase.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("Errore nella generazione del report finale.");
      setPhase(AuditPhase.INTERVIEW);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-6 py-4 mb-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">ENERGY AUDITOR</h1>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest uppercase opacity-80">Market Strategist 360</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium text-slate-500">
              <Cpu size={16} />
              <span>Analisi AI</span>
            </div>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="text-xs font-bold text-slate-400 px-3 py-1 rounded-full border border-slate-100">
              PROTOCOLLO V4.2
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="px-4">
        {error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center space-x-3 text-red-600">
            <ShieldAlert size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {phase === AuditPhase.IDLE || phase === AuditPhase.EXTRACTING ? (
          <Uploader onUpload={handleBillUpload} isLoading={phase === AuditPhase.EXTRACTING} />
        ) : phase === AuditPhase.INTERVIEW || phase === AuditPhase.GENERATING_REPORT ? (
          <Interview 
            onComplete={handleInterviewComplete} 
            isLoading={phase === AuditPhase.GENERATING_REPORT} 
          />
        ) : phase === AuditPhase.COMPLETED && report && billData ? (
          <Report report={report} billData={billData} />
        ) : null}
      </main>

      {/* Progress Footer (Mobile-first) */}
      {phase !== AuditPhase.COMPLETED && phase !== AuditPhase.IDLE && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 md:hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
             <div className="flex space-x-1">
                <div className={`w-3 h-3 rounded-full ${phase === AuditPhase.EXTRACTING || phase === AuditPhase.UPLOADING ? 'bg-blue-600' : 'bg-green-500'}`}></div>
                <div className={`w-3 h-3 rounded-full ${phase === AuditPhase.INTERVIEW ? 'bg-blue-600 animate-pulse' : phase === AuditPhase.GENERATING_REPORT ? 'bg-green-500' : 'bg-slate-200'}`}></div>
                <div className={`w-3 h-3 rounded-full ${phase === AuditPhase.GENERATING_REPORT ? 'bg-blue-600 animate-pulse' : 'bg-slate-200'}`}></div>
             </div>
             <p className="text-xs font-bold text-slate-500 uppercase">
                {phase.replace('_', ' ')}
             </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
