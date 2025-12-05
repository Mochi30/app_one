
import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, Home, Edit2, Save, X, ArrowDown, Gauge, Globe, Check } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface UserProfileProps {
  onLogout: () => void;
  dailyLimit: number;
  setDailyLimit: (limit: number) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLogout, dailyLimit, setDailyLimit, language, setLanguage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showLimitSettings, setShowLimitSettings] = useState(false);
  const [infoEnabled, setInfoEnabled] = useState(true);
  
  // Local state for limit input to handle saving
  const [tempLimit, setTempLimit] = useState(dailyLimit.toString());
  
  const [userData, setUserData] = useState({
    name: 'Budi Santoso',
    room: 'Kamar 203',
    email: 'budi@example.com',
    phone: '0812-3456-7890'
  });

  const [tempData, setTempData] = useState(userData);

  // Helper for Translation
  const t = TRANSLATIONS[language].profile;

  const handleEdit = () => {
    setTempData(userData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUserData(tempData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSaveLimit = () => {
    const num = parseFloat(tempLimit);
    if (!isNaN(num) && num > 0) {
      setDailyLimit(num);
      setShowLimitSettings(false);
    }
  };

  const toggleLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <div className="pb-24 pt-6 min-h-screen relative animate-fade-in">
      {/* Header Profile */}
      <div className="px-6 mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#006E7F] to-[#00E6F6] p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
               <User size={40} className="text-[#006E7F]" />
            </div>
          </div>
          {!isEditing ? (
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{userData.name}</h2>
              <p className="text-[#006E7F] font-medium">{userData.room}</p>
              <div className="flex items-center mt-2 space-x-2">
                 <div className="px-2 py-0.5 bg-[#00E6F6]/10 rounded text-[#006E7F] text-xs font-bold border border-[#00E6F6]/30">{t.premium}</div>
                 <div className="px-2 py-0.5 bg-green-500/10 rounded text-green-600 text-xs border border-green-500/30">{t.active}</div>
              </div>
            </div>
          ) : (
            <div className="flex-1 ml-2">
              <p className="text-[#006E7F] text-sm mb-1 font-bold">{t.edit}</p>
            </div>
          )}
        </div>
        
        {!isEditing ? (
          <button 
            onClick={handleEdit}
            className="p-2 bg-white rounded-full text-gray-400 hover:text-[#006E7F] border border-gray-200 shadow-sm"
          >
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex space-x-2">
             <button onClick={handleSave} className="p-2 bg-[#00E6F6]/10 text-[#006E7F] rounded-full border border-[#00E6F6]/50 hover:bg-[#00E6F6]/20">
                <Save size={18} />
             </button>
             <button onClick={handleCancel} className="p-2 bg-red-500/10 text-red-500 rounded-full border border-red-500/50 hover:bg-red-500/20">
                <X size={18} />
             </button>
          </div>
        )}
      </div>

      {/* Edit Form Area */}
      {isEditing && (
        <div className="px-6 mb-6 animate-fade-in">
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t.name}</label>
                <input 
                  type="text" 
                  value={tempData.name}
                  onChange={(e) => setTempData({...tempData, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-slate-900 text-sm focus:border-[#00E6F6] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                <input 
                  type="email" 
                  value={tempData.email}
                  onChange={(e) => setTempData({...tempData, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-slate-900 text-sm focus:border-[#00E6F6] outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t.phone}</label>
                <input 
                  type="tel" 
                  value={tempData.phone}
                  onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-slate-900 text-sm focus:border-[#00E6F6] outline-none"
                />
              </div>
           </div>
        </div>
      )}

      {/* Kost Info Card */}
      <div className="mx-4 mb-6 bg-white border border-gray-200 shadow-sm p-5 rounded-3xl relative">
        <h3 className="text-slate-900 font-bold mb-3 flex items-center">
            <Home className="mr-2 text-[#006E7F]" size={18} />
            {t.housing_info}
        </h3>
        <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t.dorm_name}</span>
                <span className="text-slate-900 font-medium">Kos Mawar Indah</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">{t.meter_id}</span>
                <span className="text-[#006E7F] font-mono font-bold">14028829100</span>
            </div>
             <div className="flex justify-between items-center">
                <span className="text-gray-500">{t.usage_month}</span>
                <div className="flex items-center text-yellow-600 font-bold">
                   <ArrowDown size={14} className="mr-1" />
                   <span>124.5 kWh</span>
                </div>
            </div>
        </div>
      </div>

      {/* Balance/Savings Card - Removed Button */}
      <div className="mx-4 mb-8 bg-gradient-to-r from-[#006E7F] to-[#004e5a] p-6 rounded-3xl relative overflow-hidden shadow-xl border border-[#00E6F6]/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
        <p className="text-gray-200 text-sm mb-1">{t.total_savings}</p>
        <h3 className="text-3xl font-bold text-white">Rp 54.000</h3>
        {/* Button removed as requested */}
      </div>

      {/* Menu Options */}
      <div className="px-4 space-y-3">
        <p className="text-gray-400 text-sm font-semibold ml-2 uppercase tracking-wider">{t.settings_title}</p>
        
        {/* Removed 'Perangkat Kamar' Button */}

        <button 
          onClick={() => {
            setTempLimit(dailyLimit.toString());
            setShowLimitSettings(true);
          }}
          className="w-full bg-white p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform border border-gray-200 shadow-sm hover:border-[#00E6F6]"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-[#00E6F6]/10 rounded-lg text-[#006E7F]"><Gauge size={20} /></div>
            <div className="text-left">
              <span className="text-slate-900 font-medium block">{t.daily_limit}</span>
              <span className="text-xs text-gray-500">{t.current_limit}: {dailyLimit} kWh / hari</span>
            </div>
          </div>
          <Settings size={18} className="text-gray-400 group-hover:text-[#006E7F] transition-colors" />
        </button>

        {/* Info Pemilik - Toggle Functional */}
        <button 
          onClick={() => setInfoEnabled(!infoEnabled)}
          className="w-full bg-white p-4 rounded-xl flex items-center justify-between group active:scale-[0.98] transition-transform border border-gray-200 shadow-sm hover:border-[#00E6F6]"
        >
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-[#00E6F6]/10 rounded-lg text-[#006E7F]"><Bell size={20} /></div>
            <span className="text-slate-900 font-medium">{t.landlord_info}</span>
          </div>
          
          {/* Functional Toggle Switch */}
          <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${infoEnabled ? 'bg-[#00E6F6]' : 'bg-gray-300'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${infoEnabled ? 'left-7' : 'left-1'}`}></div>
          </div>
        </button>

        {/* Language Selection */}
        <div className="w-full bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-4 mb-3">
            <div className="p-2 bg-[#00E6F6]/10 rounded-lg text-[#006E7F]"><Globe size={20} /></div>
            <span className="text-slate-900 font-medium">{t.language}</span>
          </div>
          <div className="flex space-x-2">
            {(['id', 'en', 'ar'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border flex items-center justify-center space-x-1 transition-all ${
                  language === lang 
                    ? 'bg-[#00E6F6]/10 border-[#00E6F6] text-[#006E7F]' 
                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
                }`}
              >
                <span>{lang.toUpperCase()}</span>
                {language === lang && <Check size={14} />}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full mt-8 p-4 rounded-xl flex items-center justify-center space-x-2 text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-bold">{t.logout}</span>
        </button>
      </div>

      {/* Bottom Sheet: Daily Limit Settings */}
      {showLimitSettings && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowLimitSettings(false)}></div>
           <div className="relative bg-white w-full max-w-md rounded-t-3xl border-t border-gray-200 shadow-2xl p-6 animate-slide-up">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">{t.daily_limit}</h3>
                <button onClick={() => setShowLimitSettings(false)}><X className="text-gray-400" /></button>
              </div>
              
              <div className="mb-6">
                 <p className="text-sm text-gray-500 mb-4">
                   Masukkan batas penggunaan listrik harian. Anda akan menerima notifikasi jika penggunaan hari ini melebihi batas ini.
                 </p>
                 
                 <div className="relative">
                   <input 
                      type="number"
                      value={tempLimit}
                      onChange={(e) => setTempLimit(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-2xl font-bold text-center text-[#006E7F] focus:border-[#00E6F6] outline-none"
                   />
                   <span className="absolute right-8 top-5 text-gray-400 font-medium">kWh</span>
                 </div>
              </div>

              <button 
                onClick={handleSaveLimit}
                className="w-full bg-[#006E7F] hover:bg-[#005a69] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#006E7F]/20 active:scale-95"
              >
                {t.save}
              </button>
           </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default UserProfile;
