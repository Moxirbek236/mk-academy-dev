import { ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, RefreshCcw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useState } from 'react';

export function Tasks() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      type: 'multiple_choice',
      q: 'Choose the correct synonym for "Accomplish".',
      options: ['Fail', 'Achieve', 'Destroy', 'Delay'],
      correct: 1
    },
    {
      type: 'fill_in_blank',
      q: 'She tried to _______ him to join the team.',
      options: ['Determine', 'Hypothesis', 'Persuade', 'Generate'],
      correct: 2
    },
    {
      type: 'multiple_choice',
      q: 'Which word means "very important"?',
      options: ['Fascinating', 'Significant', 'Accomplish', 'Hypothesis'],
      correct: 1
    }
  ];

  const handleNext = () => {
    if (selected === questions[currentStep].correct) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        setSelected(null);
      } else {
        setShowResult(true);
      }
    }
  };

  if (showResult) {
    return (
      <div className="pb-8 h-full flex flex-col items-center justify-center pt-10 text-center animate-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-6 animate-bounce">
          <CheckCircle2 size={48} strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Ajoyib!</h2>
        <p className="text-gray-500 font-medium px-8 mb-8">
          Siz Unit {id} barcha vazifalarini muvaffaqiyatli yakunladingiz.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#3D855A] text-white font-bold py-4 px-10 rounded-[20px] shadow-[0_10px_20px_-10px_rgba(61,133,90,0.5)] active:translate-y-1 transition-all flex items-center gap-2"
        >
          Asosiyga qaytish <ChevronRight size={18} strokeWidth={3} />
        </button>
      </div>
    );
  }

  const progressPercentage = ((currentStep + 1) / questions.length) * 100;
  const isCorrect = selected === questions[currentStep].correct;

  return (
    <div className="pb-24 animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full bg-white shadow-sm border border-gray-100 text-gray-600 active:scale-95 transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Vazifalar</h2>
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-2">
            <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#3D855A] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(61,133,90,0.4)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-extrabold text-[#3D855A]">{currentStep + 1}/{questions.length}</span>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white p-6 rounded-[28px] shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)] border border-gray-100 mb-8 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[10px] font-extrabold text-[#3D855A] bg-[#F2F8F5] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {questions[currentStep].type === 'fill_in_blank' ? 'Bo\'sh joyni to\'ldiring' : 'To\'g\'ri javobni tanlang'}
          </span>
          <AlertCircle size={16} strokeWidth={2.5} className="text-gray-300" />
        </div>
        <h3 className="font-extrabold text-gray-900 text-[22px] mt-4 leading-tight">
          {questions[currentStep].q.split('"').map((part, i) => (
            i % 2 === 1 
              ? <span key={i} className="text-[#3D855A]">"{part}"</span> 
              : <span key={i}>{part}</span>
          ))}
        </h3>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-3.5 relative z-10">
        {questions[currentStep].options.map((option, idx) => {
          const isSelected = selected === idx;
          const showSuccess = isSelected && isCorrect;
          const showError = isSelected && !isCorrect;

          return (
            <button 
              key={idx}
              onClick={() => setSelected(idx)}
              className={`p-5 rounded-[20px] border-2 text-left transition-all flex justify-between items-center group relative overflow-hidden
                ${showSuccess ? 'border-[#3D855A] bg-[#F2F8F5] shadow-[0_4px_16px_-8px_rgba(61,133,90,0.4)]' : ''}
                ${showError ? 'border-red-400 bg-red-50 text-red-600 shadow-[0_4px_16px_-8px_rgba(248,113,113,0.4)]' : ''}
                ${!isSelected ? 'border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50' : ''}
              `}
            >
              <span className={`font-extrabold text-lg relative z-10 ${showSuccess ? 'text-[#3D855A]' : ''}`}>{option}</span>
              
              <div className="relative z-10">
                {showSuccess && <CheckCircle2 size={24} strokeWidth={3} className="text-[#3D855A] animate-in zoom-in duration-300" />}
                {showError && <RefreshCcw size={20} strokeWidth={3} className="text-red-400 animate-spin" />}
                {!isSelected && <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300 transition-colors" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="mt-8 relative z-10 animate-in slide-in-from-bottom duration-300">
        <button 
          onClick={handleNext}
          disabled={selected === null || !isCorrect}
          className={`w-full font-extrabold py-4 rounded-[20px] shadow-lg active:translate-y-1 transition-all flex items-center justify-center gap-2
            ${isCorrect 
              ? 'bg-[#3D855A] text-white shadow-[#3D855A]/30' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
            }
          `}
        >
          {selected !== null && !isCorrect ? "To'g'ri javobni toping" : 'Keyingisi'} 
          {isCorrect && <ChevronRight size={20} strokeWidth={3} />}
        </button>
      </div>
    </div>
  );
}