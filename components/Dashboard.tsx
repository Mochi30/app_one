import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Zap, Wifi, WifiOff, Bell, ArrowRight, Loader, CheckCircle, AlertCircle, BatteryWarning, Clock } from 'lucide-react';
import { UsageData, Period, Device, NotificationItem } from '../types';

interface DashboardProps {
  devices: Device[];
  onOpenNotifications: () => void;
  dailyLimit: number;
  addNotification: (notif: Omit<NotificationItem, 'id' | 'date' | 'read'>) => void;
}

const DAILY_DATA: UsageData[] = [
  { name: '00:00', kwh: 0.2, cost: 300 },
  { name: '04:00', kwh: 0.1, cost: 150 },
  { name: '08:00', kwh: 1.2, cost: 1800 },
  { name: '12:00', kwh: 2.5, cost: 3750 },
  { name: '16:00', kwh: 1.8, cost: 2700 },
  { name: '20:00', kwh: 3.1, cost: 4650 },
  { name: '23:59', kwh: 1.5, cost: 2250 },
];

const WEEKLY_DATA: UsageData[] = [
  { name: 'Sen', kwh: 8, cost: 12000 },
  { name: 'Sel', kwh: 10, cost: 15000 },
  { name: 'Rab', kwh: 7, cost: 10500 },
  { name: 'Kam', kwh: 9, cost: 13500 },
  { name: 'Jum', kwh: 12, cost: 18000 },
  { name: 'Sab', kwh: 15, cost: 22500 },
  { name: 'Min', kwh: 14, cost: 21000 },
];

const MONTHLY_DATA: UsageData[] = [
  { name: 'Mg 1', kwh: 45, cost: 67500 },
  { name: 'Mg 2', kwh: 50, cost: 75000 },
  { name: 'Mg 3', kwh: 48, cost: 72000 },
  { name: 'Mg 4', kwh: 55, cost: 82500 },
];

const Dashboard: React.FC<DashboardProps> = ({ devices, onOpenNotifications, dailyLimit, addNotification }) => {
  const [period, setPeriod] = useState<Period>(Period.DAILY);
  const [data, setData] = useState<UsageData[]>(DAILY_DATA);
  const [totalPower, setTotalPower] = useState<number>(0);
  const [iotConnected, setIotConnected] = useState<boolean>(true);
  
  // State Token & Saldo
  const [remainingKwh, setRemainingKwh] = useState<number>(14.5);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenStatus, setTokenStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  
  // State for Daily Usage Simulation
  const [todayUsage, setTodayUsage] = useState<number>(8.5); // Start at 8.5 kWh
  const [limitAlertSent, setLimitAlertSent] = useState(false);
  
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef(addNotification); // Keep ref to avoid effect dependency loops

  // Update ref if prop changes
  useEffect(() => {
    notificationRef.current = addNotification;
  }, [addNotification]);

  useEffect(() => {
    switch (period) {
      case Period.DAILY: setData(DAILY_DATA); break;
      case Period.WEEKLY: setData(WEEKLY_DATA); break;
      case Period.MONTHLY: setData(MONTHLY_DATA); break;
    }
  }, [period]);

  // Real-time power simulation & IoT Heartbeat & Daily Usage
  useEffect(() => {
    const calculatePower = () => {
      const active = devices.filter(d => d.isOn).reduce((acc, curr) => acc + curr.wattage, 0);
      setTotalPower(active);
    };
    calculatePower();
    
    const interval = setInterval(() => {
      // Simulate Connection jitter
      if (Math.random() > 0.98) setIotConnected(prev => !prev);
      else setIotConnected(true);

      if (iotConnected) {
        setTotalPower(prev => {
           // Base power from active devices + random fluctuation
           const base = devices.filter(d => d.isOn).reduce((acc, curr) => acc + curr.wattage, 0);
           const fluctuation = Math.random() * 10 - 5;
           const val = base + fluctuation;
           return val < 0 ? 0 : Math.round(val);
        });
        
        // Simulate accumulating daily usage slowly
        setTodayUsage(prev => prev + 0.005); 
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [devices, iotConnected]);

  // Check against Daily Limit
  useEffect(() => {
    if (todayUsage > dailyLimit && !limitAlertSent) {
      notificationRef.current({
        title: 'Batas Harian Terlampaui',
        message: `Penggunaan listrik hari ini (${todayUsage.toFixed(2)} kWh) telah melebihi batas yang Anda tetapkan (${dailyLimit} kWh).`,
        type: 'alert'
      });
      setLimitAlertSent(true);
    } else if (todayUsage < dailyLimit && limitAlertSent) {
      // Reset if limit is increased manually by user
      setLimitAlertSent(false);
    }
  }, [todayUsage, dailyLimit, limitAlertSent]);

  const handleTokenSubmit = () => {
    // Basic validation: strip spaces/dashes, check length
    const cleanToken = tokenInput.replace(/[^0-9]/g, '');
    
    if (cleanToken.length !== 20) {
      setTokenStatus('error');
      setTimeout(() => setTokenStatus('idle'), 3000);
      return;
    }

    setTokenStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setTokenStatus('success');
      setTokenInput('');
      setRemainingKwh(prev => prev + 20); // Tambah saldo dummy
      
      // Reset status after success animation
      setTimeout(() => {
        setTokenStatus('idle');
      }, 3000);
    }, 2000);
  };

  return (
    <div className="space-y-6 pb-24 px-4 pt-6 animate-fade-in">
      {/* Header with IoT Status */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kos Mawar Indah</h1>
          <p className="text-gray-500 text-sm">Halo, Budi - <span className="text-[#006E7F] font-semibold">Kamar 203</span></p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 rounded-full bg-white text-gray-500 hover:text-[#006E7F] border border-gray-200 shadow-sm active:scale-95 transition-transform"
          >
            <Bell size={20} />
            {/* Red dot indicator for unread notifications */}
            <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-50 rounded-full border border-white"></span>
          </button>
          
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border shadow-sm bg-white ${
            iotConnected 
              ? 'border-[#00E6F6] text-[#006E7F]' 
              : 'border-red-500 text-red-500'
          }`}>
            {iotConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
            <span className="text-xs font-bold hidden sm:inline">{iotConnected ? 'Online' : 'Check'}</span>
          </div>
        </div>
      </div>

      {/* Info Grid (Token & Est) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border flex flex-col justify-between shadow-sm relative overflow-hidden bg-white text-slate-900 border-gray-200">
           <div className="flex justify-between items-start mb-2">
             <div className="p-1.5 rounded-lg bg-[#00E6F6]/10">
                <BatteryWarning size={18} className="text-[#006E7F]" />
             </div>
           </div>
           <div>
             <p className="text-xs text-gray-500">Sisa Token</p>
             <p className="text-2xl font-bold">{remainingKwh.toFixed(1)} <span className="text-sm font-medium opacity-80">kWh</span></p>
           </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
           <div className="flex justify-between items-start mb-2">
             <div className="p-1.5 rounded-lg bg-yellow-50">
                <Clock size={18} className="text-yellow-600" />
             </div>
           </div>
           <div>
             <p className="text-xs text-gray-500">Estimasi Habis</p>
             <p className="text-2xl font-bold text-slate-900">3 <span className="text-sm font-medium text-gray-500">Hari</span></p>
           </div>
        </div>
      </div>

      {/* Main Power Card */}
      <div className="bg-gradient-to-br from-[#006E7F] to-[#0f172a] p-6 rounded-3xl shadow-[0_10px_20px_rgba(0,110,127,0.2)] border border-[#00E6F6]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#00E6F6] blur-[80px] opacity-20 rounded-full"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-[#00E6F6]/20 rounded-full">
                <Zap className="text-[#00E6F6]" size={20} />
              </div>
              <p className="text-[#00E6F6] font-medium">Beban Listrik Real-time</p>
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
             <h2 className="text-5xl font-bold text-white tracking-tighter">
               {totalPower}
             </h2>
             <span className="text-xl text-gray-300 font-medium">Watt</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
             <div>
                <p className="text-xs text-gray-400">Tegangan</p>
                <p className="text-white font-bold">221 V</p>
             </div>
             <div>
                <p className="text-xs text-gray-400">Arus</p>
                <p className="text-white font-bold">{(totalPower / 220).toFixed(2)} A</p>
             </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#00E6F6]/20 flex justify-between items-end">
             <p className="text-gray-400 text-sm">
               Estimasi biaya: <span className="text-white font-bold">Rp {(totalPower * 0.0014).toFixed(0)} / jam</span>
             </p>
             <div className="text-right">
                <p className="text-[10px] text-gray-400">Hari Ini</p>
                <p className={`text-sm font-bold ${todayUsage > dailyLimit ? 'text-red-400' : 'text-[#00E6F6]'}`}>
                  {todayUsage.toFixed(2)} / {dailyLimit} kWh
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Quick Token Entry Section */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500">
               <Zap size={18} fill="currentColor" />
            </div>
            <h3 className="font-bold text-slate-900">Isi Token Listrik</h3>
          </div>
        </div>

        {tokenStatus === 'success' ? (
          <div className="flex flex-col items-center justify-center py-4 bg-green-50 rounded-xl border border-green-100 animate-fade-in">
             <CheckCircle className="text-green-500 mb-2" size={32} />
             <p className="font-bold text-green-700">Token Berhasil Diisi!</p>
             <p className="text-xs text-green-600">Saldo kWh telah bertambah</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <input 
                ref={tokenInputRef}
                type="text" 
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Masukkan 20 digit kode token"
                disabled={tokenStatus === 'loading'}
                className={`w-full bg-gray-50 border ${tokenStatus === 'error' ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00E6F6]'} rounded-xl py-3 px-4 text-slate-900 font-mono tracking-widest text-sm outline-none transition-all`}
                maxLength={24} // Allow for spaces/dashes
              />
              {tokenStatus === 'error' && (
                 <div className="absolute right-3 top-3.5 text-red-500">
                    <AlertCircle size={18} />
                 </div>
              )}
            </div>
            
            {tokenStatus === 'error' && (
               <p className="text-xs text-red-500 ml-1">Kode token harus terdiri dari 20 digit angka.</p>
            )}

            <button 
              onClick={handleTokenSubmit}
              disabled={tokenStatus === 'loading' || !tokenInput}
              className="w-full bg-slate-900 text-white font-medium py-3 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tokenStatus === 'loading' ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <>
                  <span>Isi Sekarang</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Chart Section */}
      <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-900 font-bold text-lg">Grafik Pemakaian</h3>
          <div className="flex bg-gray-100 rounded-lg p-1 space-x-1">
            {Object.values(Period).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  period === p ? 'bg-white text-[#006E7F] shadow-sm' : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorKwh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00E6F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00E6F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#006E7F' }}
                labelStyle={{ color: '#64748b' }}
              />
              <Area 
                type="monotone" 
                dataKey="kwh" 
                stroke="#00E6F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorKwh)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;