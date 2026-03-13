import React, { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Beaker, TrendingDown, TrendingUp, AlertTriangle, Droplet } from 'lucide-react';

export const SoilDashboardPage: React.FC = () => {
  const [selectedField, setSelectedField] = useState('Field A');

  // Static mock data for V1 structural visualization
  const fields = ['Field A', 'Field B', 'Field C'];
  const soilMetrics = {
    nitrogen: { value: 0.9, trend: -0.2, target: 1.2, status: 'LOW' },
    phosphorus: { value: 1.5, trend: 0.1, target: 1.4, status: 'OPTIMAL' },
    potassium: { value: 1.1, trend: -0.05, target: 1.2, status: 'OPTIMAL' },
    phLevel: { value: 6.2, trend: -0.3, target: 6.5, status: 'WARNING' },
    moisture: { value: 34, trend: -5, target: 40, status: 'WARNING' }
  };

  const recommendedActions = [
    { title: 'Apply Urea', amount: '35 kg/ha', priority: 'HIGH', reason: 'Nitrogen levels dropped below 1.0% threshold.' },
    { title: 'Add Ag-Lime', amount: '500 kg/ha', priority: 'MEDIUM', reason: 'pH trending downward towards acidic (6.2)' }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in pb-8">
        
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-purple-100 rounded-lg"><Beaker className="w-6 h-6 text-purple-600" /></span>
              Soil Health Diagnostics
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Monitor NPK levels, pH balance, and execute precision fertilization plans.
            </p>
          </div>
          <div className="bg-white border text-sm font-bold border-gray-200 rounded-xl p-1 flex">
            {fields.map(field => (
              <button
                key={field}
                onClick={() => setSelectedField(field)}
                className={`px-4 py-2 rounded-lg transition-all ${selectedField === field ? 'bg-purple-50 text-purple-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {field}
              </button>
            ))}
          </div>
        </div>

        {/* NPK Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <MetricBlock 
            title="Nitrogen (N)" 
            value={`${soilMetrics.nitrogen.value}%`} 
            target={`${soilMetrics.nitrogen.target}%`}
            trend={soilMetrics.nitrogen.trend} 
            status={soilMetrics.nitrogen.status}
          />
          <MetricBlock 
            title="Phosphorus (P)" 
            value={`${soilMetrics.phosphorus.value}%`} 
            target={`${soilMetrics.phosphorus.target}%`}
            trend={soilMetrics.phosphorus.trend} 
            status={soilMetrics.phosphorus.status}
          />
          <MetricBlock 
            title="Potassium (K)" 
            value={`${soilMetrics.potassium.value}%`} 
            target={`${soilMetrics.potassium.target}%`}
            trend={soilMetrics.potassium.trend} 
            status={soilMetrics.potassium.status}
          />
          <MetricBlock 
            title="pH Balance" 
            value={`${soilMetrics.phLevel.value}`} 
            target={`${soilMetrics.phLevel.target}`}
            trend={soilMetrics.phLevel.trend} 
            status={soilMetrics.phLevel.status}
          />

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Nutrient Retention Trends (30 Days)</h3>
              </div>
              
              {/* Fake Chart representation for V1 layout */}
              <div className="h-64 flex items-end justify-between border-b-2 border-l-2 border-gray-100 pb-2 pl-2 relative">
                {/* Y-axis labels */}
                <div className="absolute -left-1 text-[10px] text-gray-400 h-full flex flex-col justify-between py-2">
                  <span>1.5%</span>
                  <span>1.0%</span>
                  <span>0.5%</span>
                </div>
                {/* Nitrogen Line (Fake SVG) */}
                <svg className="absolute w-full h-[80%] bottom-0 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,20 L20,30 L40,40 L60,80 L80,90 L100,95" fill="none" stroke="#a855f7" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0,40 L20,45 L40,50 L60,40 L80,45 L100,40" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke"/>
                </svg>
                {/* X-axis columns */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center h-full justify-end group z-10 w-1/6">
                    <div className="w-full h-full border-r border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-gray-50/50 to-transparent"></div>
                    <span className="text-[10px] text-gray-400 mt-2 font-medium">Wk {i+1}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4">
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-500"></div><span className="text-xs text-gray-600 font-medium">Nitrogen</span></div>
                 <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div><span className="text-xs text-gray-600 font-medium">Phosphorus</span></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
               <h3 className="font-bold text-gray-900 text-lg mb-4">Precision Management Plan</h3>
               <div className="space-y-3">
                 {recommendedActions.map((action, idx) => (
                   <div key={idx} className="flex items-start gap-4 p-4 rounded-xl border border-purple-100 bg-purple-50/30">
                     <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${action.priority === 'HIGH' ? 'text-red-500' : 'text-amber-500'}`} />
                     <div className="flex-1">
                       <h4 className="font-bold text-gray-900">{action.title} <span className="px-2 py-0.5 ml-2 rounded-md bg-white border text-xs font-bold shadow-sm">{action.amount}</span></h4>
                       <p className="text-sm text-gray-600 mt-1">{action.reason}</p>
                     </div>
                     <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                       Schedule Task
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
              <h3 className="font-bold text-lg mb-2 relative z-10 text-purple-200">Soil Moisture Map</h3>
              <p className="text-xs text-gray-400 mb-6 relative z-10">Live interpolation sensor data</p>
              
              {/* Fake heat map rendering */}
              <div className="aspect-square rounded-xl bg-[#2e3e2b] relative overflow-hidden border border-white/10 shadow-inner">
                <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-500/40 rounded-full blur-xl"></div>
                <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-red-500/40 rounded-full blur-xl"></div>
                <div className="absolute top-[40%] right-[30%] w-[30%] h-[50%] bg-yellow-500/40 rounded-full blur-xl"></div>
                
                <div className="absolute bottom-3 left-3 right-3 flex justify-between px-2 py-1.5 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-bold">
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400"></span> Dry</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Okay</div>
                   <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Wet</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-lg">{soilMetrics.moisture.value}%</span>
                </div>
                <button className="text-xs font-bold text-purple-300 hover:text-white transition-colors">View Deep Insights →</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

// Sub-component for clean layout
const MetricBlock = ({ title, value, target, trend, status }: {title: string, value: string, target: string, trend: number, status: string}) => {
  const isHealthy = status === 'OPTIMAL';
  const isWarning = status === 'WARNING';
  
  return (
    <div className={`p-5 rounded-2xl border-2 transition-all ${isWarning || !isHealthy ? 'bg-amber-50/30 border-amber-100 hover:border-amber-200' : 'bg-white border-gray-100 hover:border-purple-200'} shadow-sm relative overflow-hidden`}>
      {isWarning && <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -mr-4 -mt-4" />}
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className={`text-3xl font-black ${isWarning ? 'text-amber-700' : 'text-gray-900'}`}>{value}</span>
        <span className="text-xs font-medium text-gray-400">/ {target} target</span>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
         <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${trend < 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
           {trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
           {Math.abs(trend)}% v. Last Wk
         </div>
         {status !== 'OPTIMAL' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
      </div>
    </div>
  )
}
