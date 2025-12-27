
import React, { useState } from 'react';
import { Send, CheckCircle, ChevronRight } from 'lucide-react';
import { InterviewResponse } from '../types';

const QUESTIONS = [
  {
    id: 'grandi-carichi',
    title: 'Grandi Carichi',
    question: 'Parliamo degli elettrodomestici energivori. Quanto spesso usi lavatrice, lavastoviglie, asciugatrice e forno? In che orari solitamente?'
  },
  {
    id: 'thermal',
    title: 'Thermal Management',
    question: 'Dettagli su Aria Condizionata (split o inverter?) e integrazione riscaldamento (Usi pompe di calore o scaldabagno elettrico?)'
  },
  {
    id: 'kitchen',
    title: 'Kitchen & Hot Water',
    question: 'Che tipo di piano cottura hai? (Induzione vs Gas) E per l’acqua calda sanitaria, usi Boiler Elettrico o Caldaia a Gas?'
  },
  {
    id: 'lifestyle',
    title: 'Daily Lifestyle',
    question: 'Quante stanze ha la casa? Che tipo di lampadine usi (LED?) Hai carichi attivi h24 (Server, PC fisso) o sistemi di ricarica per auto/bici elettriche?'
  }
];

interface InterviewProps {
  onComplete: (responses: InterviewResponse[]) => void;
  isLoading: boolean;
}

export const Interview: React.FC<InterviewProps> = ({ onComplete, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [responses, setResponses] = useState<InterviewResponse[]>([]);

  const handleNext = () => {
    if (!currentAnswer.trim()) return;

    const newResponses = [...responses, { 
      step: QUESTIONS[currentIndex].title, 
      answer: currentAnswer 
    }];
    
    setResponses(newResponses);
    setCurrentAnswer('');

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newResponses);
    }
  };

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border border-blue-50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Fase 2: Protocollo Strategico</h2>
          <h3 className="text-2xl font-bold text-gray-900">{currentQuestion.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-400">Step {currentIndex + 1} di {QUESTIONS.length}</p>
          <div className="w-32 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-700 mb-4 leading-relaxed">
          {currentQuestion.question}
        </label>
        <textarea
          autoFocus
          className="w-full p-5 rounded-2xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none text-gray-800 min-h-[120px]"
          placeholder="Scrivi qui i dettagli..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          disabled={isLoading}
        ></textarea>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {responses.map((_, idx) => (
            <div key={idx} className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center text-green-600">
              <CheckCircle size={14} />
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!currentAnswer.trim() || isLoading}
          className={`
            inline-flex items-center px-8 py-3 rounded-full font-bold text-white transition-all duration-300
            ${!currentAnswer.trim() || isLoading 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-95'}
          `}
        >
          {isLoading ? (
            <span className="flex items-center">
              Elaborazione Report... <div className="ml-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </span>
          ) : (
            <>
              {currentIndex === QUESTIONS.length - 1 ? 'Genera Verdetto' : 'Continua'}
              <ChevronRight className="ml-2" size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
