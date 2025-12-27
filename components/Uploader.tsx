
import React, { useCallback } from 'react';
import { Upload, FileText, Camera } from 'lucide-react';

interface UploaderProps {
  onUpload: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onUpload, isLoading }) => {
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mimeType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      onUpload(base64, mimeType);
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-3xl shadow-xl border border-blue-50 text-center">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full text-blue-600">
        <Upload size={32} />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-3">Analisi Forense Energetica</h2>
      <p className="text-gray-500 mb-8">
        Carica la tua bolletta (PDF o Immagine) per avviare la diagnosi tecnica AI.
      </p>
      
      <div className="relative group">
        <label className={`
          flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer
          transition-all duration-300
          ${isLoading ? 'bg-gray-50 border-gray-300 pointer-events-none' : 'border-blue-200 hover:border-blue-400 bg-blue-50/30 hover:bg-blue-50'}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isLoading ? (
              <div className="flex flex-col items-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-3"></div>
                <p className="text-sm text-blue-600 font-bold uppercase tracking-tight">Scansione forense in corso...</p>
                <p className="text-xs text-blue-400 mt-1">Analisi parametri PCV e Spread</p>
              </div>
            ) : (
              <>
                <div className="flex space-x-3 mb-3">
                  <FileText className="w-8 h-8 text-red-400" />
                  <Camera className="w-8 h-8 text-blue-400" />
                </div>
                <p className="mb-2 text-sm text-gray-700 px-4">
                  <span className="font-semibold text-blue-600">Carica PDF</span> o scatta una foto
                </p>
                <p className="text-xs text-gray-400 font-medium tracking-tight">Supporto multi-pagina per PDF nativi</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange} 
            accept="image/*,application/pdf"
            disabled={isLoading}
          />
        </label>
      </div>
      
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
          <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center mb-2">
            <FileText className="text-blue-600" size={14} />
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">PDF Nativo</p>
          <p className="text-[10px] text-slate-500 leading-tight">Migliore per l'estrazione di tabelle di consumo.</p>
        </div>
        <div className="p-4 bg-slate-50 rounded-xl text-left border border-slate-100">
          <div className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center mb-2">
            <Camera className="text-slate-600" size={14} />
          </div>
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Foto/OCR</p>
          <p className="text-[10px] text-slate-500 leading-tight">Analisi istantanea tramite intelligenza visiva.</p>
        </div>
      </div>
    </div>
  );
};
