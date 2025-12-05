
import React, { useState, useEffect } from 'react';
import { Home, ScanLine, ShoppingBag, History, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import QRScanner from './components/QRScanner';
import TokenShop from './components/TokenShop';
import TransactionHistory from './components/TransactionHistory';
import UserProfile from './components/UserProfile';
import Onboarding from './components/Onboarding';
import Auth from './components/Auth';
import Notifications from './components/Notifications';
import { Device, Screen, NotificationItem, Language } from './types';
import { TRANSLATIONS } from './translations';

// Data disesuaikan untuk simulasi beban listrik kamar kos
const INITIAL_DEVICES: Device[] = [
  { id: '1', name: 'AC Kamar', type: 'ac', wattage: 550, isOn: true, room: 'Kamar 203' },
  { id: '2', name: 'Magic Com', type: 'other', wattage: 350, isOn: false, room: 'Pojok Kamar' },
  { id: '3', name: 'Laptop Charger', type: 'other', wattage: 65, isOn: true, room: 'Meja Belajar' },
  { id: '4', name: 'Lampu Utama', type: 'light', wattage: 15, isOn: true, room: 'Langit-langit' },
  { id: '5', name: 'Dispenser', type: 'other', wattage: 80, isOn: false, room: 'Pojok Kamar' },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Sisa Token Menipis',
    message: 'Sisa token listrik Anda di bawah 10 kWh. Segera isi ulang untuk menghindari pemadaman.',
    date: '10 Menit lalu',
    type: 'warning',
    read: false
  },
  {
    id: '2',
    title: 'Pembelian Berhasil',
    message: 'Pembelian token Rp 50.000 via Gopay berhasil. Kode Token: 1234-5678-9012. Saldo kWh telah ditambahkan ke akun Anda.',
    date: '2 Jam lalu',
    type: 'success',
    read: true
  },
  {
    id: '3',
    title: 'Update Aplikasi',
    message: 'VoltMate versi 2.0.1 tersedia dengan fitur analisis AI yang lebih baik.',
    date: '2 Hari lalu',
    type: 'info',
    read: true
  }
];

type AppState = 'onboarding' | 'auth' | 'app';

export default function App() {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [devices] = useState<Device[]>(INITIAL_DEVICES);
  
  // Global State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [dailyLimit, setDailyLimit] = useState<number>(10);
  const [language, setLanguage] = useState<Language>('id');

  // Effect to handle RTL for Arabic
  useEffect(() => {
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  }, [language]);

  const handleScanResult = (result: string) => {
    setShowScanner(false);
    alert(`Perangkat IoT Kamar Kos Terdeteksi: ${result}\nBerhasil terhubung ke Meteran Kamar!`);
    setCurrentScreen('dashboard');
  };

  const handleOnboardingFinish = () => {
    setAppState('auth');
  };

  const handleLoginSuccess = () => {
    setAppState('app');
  };

  const handleLogout = () => {
    setAppState('auth');
    setCurrentScreen('dashboard'); 
  };

  const addNotification = (notif: Omit<NotificationItem, 'id' | 'date' | 'read'>) => {
    const newNotif: NotificationItem = {
      id: Date.now().toString(),
      date: 'Baru saja',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const navText = TRANSLATIONS[language].nav;

  // Render Logic based on App State
  if (appState === 'onboarding') {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  if (appState === 'auth') {
    return <Auth onLogin={handleLoginSuccess} />;
  }

  const renderScreen = () => {
    switch(currentScreen) {
      case 'dashboard': 
        return <Dashboard 
          devices={devices} 
          onOpenNotifications={() => setCurrentScreen('notifications')}
          dailyLimit={dailyLimit}
          addNotification={addNotification}
        />;
      case 'shop': return <TokenShop />;
      case 'history': return <TransactionHistory />;
      case 'profile': 
        return <UserProfile 
          onLogout={handleLogout} 
          dailyLimit={dailyLimit}
          setDailyLimit={setDailyLimit}
          language={language}
          setLanguage={setLanguage}
        />;
      case 'notifications': 
        return <Notifications 
          notifications={notifications}
          setNotifications={setNotifications}
          onBack={() => setCurrentScreen('dashboard')} 
        />;
      default: 
        return <Dashboard 
          devices={devices} 
          onOpenNotifications={() => setCurrentScreen('notifications')}
          dailyLimit={dailyLimit}
          addNotification={addNotification}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-slate-900 font-sans overflow-x-hidden selection:bg-[#00E6F6] selection:text-black">
      {/* Main Content Area */}
      <main className="max-w-md mx-auto min-h-screen bg-[#f8fafc] relative shadow-2xl overflow-hidden">
        {renderScreen()}

        {/* QR Scanner Overlay */}
        {showScanner && (
          <QRScanner 
            onClose={() => setShowScanner(false)} 
            onScan={handleScanResult} 
          />
        )}

        {/* Bottom Navigation - Hide if on notifications screen */}
        {currentScreen !== 'notifications' && (
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-lg border-t border-gray-200 px-6 py-4 z-40">
            <div className="flex justify-between items-center">
              
              <NavButton 
                active={currentScreen === 'dashboard'} 
                onClick={() => setCurrentScreen('dashboard')}
                icon={<Home size={24} />} 
                label={navText.home}
              />
              
              <NavButton 
                active={currentScreen === 'shop'} 
                onClick={() => setCurrentScreen('shop')}
                icon={<ShoppingBag size={24} />} 
                label={navText.token}
              />

              {/* Floating Scan Button */}
              <div className="relative -top-8">
                <button 
                  onClick={() => setShowScanner(true)}
                  className="w-16 h-16 rounded-full bg-[#00E6F6] text-white shadow-[0_0_20px_rgba(0,230,246,0.4)] flex items-center justify-center transform transition-transform active:scale-95 border-4 border-[#f8fafc]"
                >
                  <ScanLine size={30} strokeWidth={2.5} />
                </button>
              </div>

              <NavButton 
                active={currentScreen === 'history'} 
                onClick={() => setCurrentScreen('history')}
                icon={<History size={24} />} 
                label={navText.history}
              />

              <NavButton 
                active={currentScreen === 'profile'} 
                onClick={() => setCurrentScreen('profile')}
                icon={<User size={24} />} 
                label={navText.profile}
              />

            </div>
          </div>
        )}
      </main>
      
      {/* Desktop warning for simulation */}
      <div className="hidden lg:flex fixed top-4 right-4 bg-white/80 backdrop-blur p-4 rounded-xl max-w-xs text-sm text-gray-600 shadow-lg border border-gray-200 z-50">
        <p>Aplikasi ini didesain untuk tampilan mobile. Resize browser Anda untuk pengalaman terbaik.</p>
      </div>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center space-y-1 transition-colors ${
      active ? 'text-[#006E7F]' : 'text-gray-400 hover:text-gray-600'
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
