import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import illustration1 from '../assets/auth_illustration.png';
import illustration2 from '../assets/team_illustration.png';
import illustration3 from '../assets/growth_illustration.png';

const slides = [
  {
    image: illustration1,
    title: <>Master Your <span className="text-[#F5601A]">Workflow</span></>,
    description: "The ultimate platform for project management and team collaboration."
  },
  {
    image: illustration2,
    title: <>Collaborate <span className="text-[#F5601A]">Better</span></>,
    description: "Connect with your team in real-time and achieve more together."
  },
  {
    image: illustration3,
    title: <>Track Your <span className="text-[#F5601A]">Growth</span></>,
    description: "Visualize progress with powerful analytics and reporting tools."
  }
];

const AuthLayout = () => {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#fcfdfd] font-sans flex items-center justify-center p-0 sm:p-6 md:p-8">
      <div className="flex w-full max-w-[1100px] bg-white sm:rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.05),0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden min-h-[700px] relative z-10 border border-[#f1f5f9]">
        
        {/* Left Side: Illustration Panel (Carousel) */}
        <div className="hidden lg:flex w-[48%] bg-white p-12 flex-col items-center justify-center relative border-r border-[#f1f5f9]">
          <div className="relative z-10 flex flex-col items-center text-center max-w-[400px] w-full">
            <div className="mb-12 w-full h-[300px] flex items-center justify-center relative">
              {slides.map((slide, idx) => (
                <img 
                  key={idx}
                  src={slide.image} 
                  alt="Illustration" 
                  className={`absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out ${
                    idx === activeSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                  }`}
                />
              ))}
            </div>
            
            <div className="h-[120px]">
              {slides.map((slide, idx) => (
                <div 
                  key={idx}
                  className={`transition-all duration-700 ${
                    idx === activeSlide ? 'opacity-100 scale-100' : 'fixed opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  <h1 className="text-3xl font-extrabold text-[#1a2e2a] tracking-tight mb-3 font-heading leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-[#64748b] text-[15px] font-medium leading-relaxed px-6">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2.5 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                    idx === activeSlide ? 'bg-[#F5601A] w-6' : 'bg-[#cbd5e1]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="w-full lg:w-[52%] flex flex-col bg-white relative">
          <div className="absolute top-8 left-8 sm:left-12">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#f8fafc] text-[#64748b] hover:bg-[#F5601A] hover:text-white transition-all duration-300"
            >
              <ArrowLeft size={18} />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-14 lg:p-16">
            <div className="w-full max-w-[360px]">
              <Outlet />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthLayout;
