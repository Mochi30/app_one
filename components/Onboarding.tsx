import React, { useState } from 'react';
import { Zap, Wifi, CreditCard, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onFinish: () => void;
}

const SLIDES = [
  {
    id: 1,
    title: "Monitoring Listrik",
    subtitle: "Real-time & Akurat",
    desc: "Pantau penggunaan listrik kamar kosmu kapan saja. Tidak ada lagi tagihan kaget di akhir bulan.",
    icon: <Zap size={64} className="text-[#00E6F6]" />,
  },
  {
    id: 2,
    title: "Kendali Pintar",
    subtitle: "IoT Terintegrasi",
    desc: "Cek tegangan, arus, dan daya aktif perangkat elektronikmu langsung dari smartphone.",
    icon: <Wifi size={64} className="text-[#00E6F6]" />,
  },
  {
    id: 3,
    title: "Beli Token",
    subtitle: "Cepat & Mudah",
    desc: "Token habis tengah malam? Beli langsung di aplikasi dengan berbagai metode pembayaran instan.",
    icon: <CreditCard size={64} className="text-[#00E6F6]" />,
  }
];

const Onboarding: React.FC<OnboardingProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col justify-between p-6 animate-fade-in relative overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-[#00E6F6]/20 blur-2xl rounded-full transform scale-150"></div>
          <div className="relative bg-white p-8 rounded-full shadow-[0_10px_40px_-10px_rgba(0,230,246,0.3)] border border-gray-50">
             {SLIDES[currentSlide].icon}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {SLIDES[currentSlide].title}
        </h2>
        <h3 className="text-xl text-[#006E7F] font-medium mb-4">
          {SLIDES[currentSlide].subtitle}
        </h3>
        <p className="text-gray-500 leading-relaxed text-sm max-w-xs">
          {SLIDES[currentSlide].desc}
        </p>
      </div>

      {/* Footer Section: Indicators & Buttons */}
      <div className="w-full flex flex-col items-center pb-8 space-y-8">
        
        {/* Indicators (Dots) - Placed below content */}
        <div className="flex space-x-2">
          {SLIDES.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-[#00E6F6]' : 'w-2 bg-gray-200'
              }`} 
            />
          ))}
        </div>

        {/* Action Buttons - Placed below indicators */}
        <div className="w-full space-y-3">
          <button 
            onClick={handleNext}
            className="w-full bg-[#006E7F] hover:bg-[#005a69] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#006E7F]/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>{currentSlide === SLIDES.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}</span>
            <ArrowRight size={20} />
          </button>

          <button 
            onClick={onFinish}
            className="w-full text-gray-400 font-medium text-sm py-2 hover:text-[#006E7F] transition-colors"
          >
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;