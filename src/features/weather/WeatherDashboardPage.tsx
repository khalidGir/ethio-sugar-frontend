import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Cloud, CloudRain, Sun, Wind, Zap, Brain, Thermometer, Droplets, AlertTriangle, ArrowRight } from 'lucide-react';

export const WeatherDashboardPage: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState('Zone North');

  // Hardcoded map regions for V1
  const regions = ['Zone North', 'Zone South', 'Factory Surround'];

  // Mock Gemini AI Insight data based on project spec
  const geminiForecast = {
    summary: 'Heavy rainfall pattern developing over Zone North. 85% probability of >15mm precipitation within the next 48 hours. Humidity levels will exceed 80% creating optimal conditions for Maize Leaf Spot.',
    action: 'Halt all fungicide applications to prevent runoff wash-off.',
    confidence: 94,
    status: 'WARNING'
  };

  const next7Days = [
    { day: 'Mon', temp: 28, condition: 'Sun', chanceRain: '10%' },
    { day: 'Tue', temp: 26, condition: 'Cloud', chanceRain: '30%' },
    { day: 'Wed', temp: 24, condition: 'CloudRain', chanceRain: '85%' },
    { day: 'Thu', temp: 22, condition: 'CloudRain', chanceRain: '90%' },
    { day: 'Fri', temp: 25, condition: 'Cloud', chanceRain: '40%' },
    { day: 'Sat', temp: 27, condition: 'Sun', chanceRain: '15%' },
    { day: 'Sun', temp: 29, condition: 'Sun', chanceRain: '0%' },
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pb-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-blue-100 rounded-lg"><Cloud className="w-6 h-6 text-blue-600" /></span>
              Weather Intelligence
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Micro-climate forecasting integrated with Gemini AI risk modeling.
            </p>
          </div>
          <div className="bg-white border text-sm font-bold border-gray-200 rounded-xl p-1 flex">
            {regions.map(reg => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-4 py-2 rounded-lg transition-all ${selectedRegion === reg ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Weather View */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Hero Widget */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <CloudRain className="absolute bottom-4 right-10 w-48 h-48 text-white/5 blur-sm" />
               
               <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div>
                   <h2 className="text-lg font-bold text-blue-200 mb-1 tracking-wide uppercase">{selectedRegion}</h2>
                   <div className="flex items-center gap-4">
                     <span className="text-7xl font-black tracking-tighter">24°</span>
                     <div className="flex flex-col">
                       <span className="text-2xl font-bold flex items-center gap-2">
                         <CloudRain className="w-6 h-6 text-blue-300" /> Rain Showers
                       </span>
                       <span className="text-blue-200 font-medium tracking-wide text-sm mt-1">Feels like 26°</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl w-full md:w-auto">
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-blue-200 uppercase font-bold tracking-wider flex items-center gap-1"><Wind className="w-4 h-4"/> Wind</span>
                     <span className="text-lg font-bold">14 km/h <span className="text-xs font-normal">NE</span></span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-blue-200 uppercase font-bold tracking-wider flex items-center gap-1"><Droplets className="w-4 h-4"/> Humidity</span>
                     <span className="text-lg font-bold">78%</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-blue-200 uppercase font-bold tracking-wider flex items-center gap-1"><Thermometer className="w-4 h-4"/> Dew Point</span>
                     <span className="text-lg font-bold">20°</span>
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs text-blue-200 uppercase font-bold tracking-wider flex items-center gap-1"><Sun className="w-4 h-4"/> UV Index</span>
                     <span className="text-lg font-bold">1.2 <span className="text-xs font-normal">Low</span></span>
                   </div>
                 </div>
               </div>
            </div>

            {/* AI Risk Overlay Card */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-6 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4 transition-all" />
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center border border-blue-200">
                    <Brain className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                   <h3 className="text-xs font-black text-blue-600 tracking-widest uppercase">Gemini Forecasting Overlay</h3>
                   <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold ring-1 ring-inset ring-red-600/20">
                     <Zap className="w-3 h-3" /> ACTION REQUIRED
                   </span>
                 </div>
              </div>

              <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 mb-4">
                 <p className="text-gray-800 text-sm leading-relaxed font-medium">
                   <strong className="text-gray-900 block mb-1">Observation:</strong> 
                   {geminiForecast.summary}
                 </p>
                 <div className="mt-3 pt-3 border-t border-red-200/50 flex items-center justify-between">
                   <p className="text-red-800 text-sm font-bold flex items-center gap-2">
                     <AlertTriangle className="w-4 h-4" /> 
                     {geminiForecast.action}
                   </p>
                 </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <button className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-sm text-center">
                  Review Affected Tasks
                </button>
                <button className="px-4 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  Dismiss Overlay
                </button>
              </div>
            </div>

          </div>

          {/* Right Sidebar - 7 Day Forecast */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-sm relative col-span-1 border-t-4 border-t-amber-400">
             <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
               <CalendarIcon /> 7-Day Precision Guide
             </h3>

             <div className="space-y-1">
               {next7Days.map((day, idx) => {
                 const isToday = idx === 0;
                 return (
                   <div key={day.day} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                     isToday ? 'bg-amber-50/50 border border-amber-200' : 'hover:bg-gray-50 border border-transparent'
                   }`}>
                     <span className={`w-8 font-bold ${isToday ? 'text-amber-700' : 'text-gray-600'}`}>{day.day}</span>
                     
                     <div className="flex items-center justify-center gap-3 w-24">
                        {day.condition === 'Sun' && <Sun className="w-5 h-5 text-amber-500" />}
                        {day.condition === 'Cloud' && <Cloud className="w-5 h-5 text-gray-400" />}
                        {day.condition === 'CloudRain' && <CloudRain className="w-5 h-5 text-blue-500" />}
                        
                        <span className={`text-xs font-bold w-10 text-right ${parseInt(day.chanceRain) > 50 ? 'text-blue-600' : 'text-gray-400'}`}>
                          {day.chanceRain}
                        </span>
                     </div>
                     
                     <span className={`font-black w-12 text-right ${isToday ? 'text-amber-700' : 'text-gray-900'}`}>{day.temp}°</span>
                   </div>
                 )
               })}
             </div>

             <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
               <span className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2 block">Optimal Spray Window</span>
               <div className="flex items-center gap-2 font-bold text-gray-900">
                 No optimal windows in <br/>next 72 hours.
               </div>
             </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

// Helper SVG
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)
