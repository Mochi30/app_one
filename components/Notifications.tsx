import React, { useState, useRef } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle, Info, CheckCheck, Share2, Trash2, X, Square, CheckSquare, Bell } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsProps {
  onBack: () => void;
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
}

const Notifications: React.FC<NotificationsProps> = ({ onBack, notifications, setNotifications }) => {
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  
  // Selection Mode State
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Refs for Long Press Logic
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // --- DELETE LOGIC ---

  const handleDeleteAll = () => {
    if (notifications.length === 0) return;
    if (confirm('Hapus semua notifikasi?')) {
      setNotifications([]);
      setIsSelectionMode(false);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    if (confirm(`Hapus ${selectedIds.size} notifikasi terpilih?`)) {
      setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
      setIsSelectionMode(false);
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSingle = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setSelectedNotif(null);
  };

  // --- SELECTION INTERACTION (Long Press on Item) ---

  const startPress = (id: string) => {
    if (isSelectionMode) return; // If already in selection mode, ignore long press start
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setIsSelectionMode(true);
      setSelectedIds(new Set([id]));
      
      // Haptic feedback if supported
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500); // 500ms threshold
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    
    // Auto exit selection mode if no items selected
    if (newSet.size === 0) {
       // Optional: setIsSelectionMode(false); 
       // Keeping it active is usually better UX until explicit close
    }
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    if (isLongPress.current) {
      // If click event fired after a long press detected, ignore the click action
      return;
    }

    if (isSelectionMode) {
      toggleSelection(notif.id);
    } else {
      // Normal behavior: Mark as read and open detail
      setNotifications(prev => prev.map(n => 
        n.id === notif.id ? { ...n, read: true } : n
      ));
      setSelectedNotif(notif);
    }
  };

  const handleHeaderTrashClick = () => {
    if (isSelectionMode) {
      handleDeleteSelected();
    } else {
      handleDeleteAll();
    }
  };

  const handleShare = () => {
    if (navigator.share && selectedNotif) {
      navigator.share({
        title: selectedNotif.title,
        text: selectedNotif.message,
      }).catch(console.error);
    } else {
      alert("Fitur bagikan dibuka (Simulasi)");
    }
  };

  const getIcon = (type: string, size: number = 20) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-500" size={size} />;
      case 'warning': return <AlertTriangle className="text-yellow-500" size={size} />;
      case 'alert': return <AlertTriangle className="text-red-500" size={size} />;
      default: return <Info className="text-[#006E7F]" size={size} />;
    }
  };

  const getBgColor = (type: string) => {
     switch (type) {
      case 'success': return 'bg-green-100 border-green-200';
      case 'warning': return 'bg-yellow-100 border-yellow-200';
      case 'alert': return 'bg-red-100 border-red-200';
      default: return 'bg-[#00E6F6]/10 border-[#00E6F6]/30';
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 min-h-screen bg-[#f8fafc] animate-fade-in relative select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
            <button 
              onClick={() => {
                setIsSelectionMode(false);
                setSelectedIds(new Set());
              }}
              className="p-2 rounded-full hover:bg-gray-200 text-slate-900 transition-colors"
            >
              <X size={24} />
            </button>
          ) : (
            <button 
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-200 text-slate-900 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          
          <h2 className="text-xl font-bold text-slate-900">
            {isSelectionMode ? `${selectedIds.size} Dipilih` : 'Notifikasi'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Mark Read Button (Only in Normal Mode) */}
          {!isSelectionMode && notifications.some(n => !n.read) && (
            <button 
              onClick={handleMarkAllRead}
              className="p-2 text-[#006E7F] hover:bg-[#00E6F6]/10 rounded-full transition-colors"
              title="Tandai semua dibaca"
            >
              <CheckCheck size={18} />
            </button>
          )}

          {/* Trash Button */}
          {notifications.length > 0 && (
            <button 
              onClick={handleHeaderTrashClick}
              className={`p-2 rounded-full transition-all duration-300 ${
                isSelectionMode 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'text-red-500 hover:bg-red-50'
              }`}
              title={isSelectionMode ? "Hapus Terpilih" : "Hapus Semua"}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className="relative"
            >
              <button 
                onContextMenu={(e) => e.preventDefault()}
                onTouchStart={() => startPress(notif.id)}
                onMouseDown={() => startPress(notif.id)}
                onTouchEnd={endPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onClick={() => handleNotificationClick(notif)}
                className={`w-full text-left p-4 rounded-2xl border flex items-start space-x-4 shadow-sm transition-all active:scale-[0.98] ${
                  isSelectionMode && selectedIds.has(notif.id)
                    ? 'bg-[#00E6F6]/5 border-[#00E6F6]'
                    : notif.read 
                      ? 'bg-white border-gray-100 opacity-80' 
                      : 'bg-white border-[#00E6F6] shadow-md shadow-[#00E6F6]/5'
                }`}
              >
                {/* Selection Checkbox */}
                {isSelectionMode && (
                  <div className="flex items-center justify-center h-full pt-1">
                     {selectedIds.has(notif.id) ? (
                        <CheckSquare className="text-[#006E7F]" size={24} />
                     ) : (
                        <Square className="text-gray-300" size={24} />
                     )}
                  </div>
                )}

                <div className={`p-2 rounded-full ${getBgColor(notif.type)} shrink-0 transition-transform ${isSelectionMode ? 'scale-90' : ''}`}>
                  {getIcon(notif.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-bold text-sm ${notif.read ? 'text-gray-600' : 'text-slate-900'}`}>
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.date}</span>
                  </div>
                  <p className={`text-xs leading-relaxed line-clamp-2 ${notif.read ? 'text-gray-400' : 'text-gray-600'}`}>
                    {notif.message}
                  </p>
                </div>
                {!notif.read && !isSelectionMode && (
                  <div className="w-2 h-2 rounded-full bg-[#00E6F6] mt-2 shrink-0 animate-pulse"></div>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-20 text-gray-400">
            <Bell size={48} className="mb-4 opacity-20" />
            <p>Tidak ada notifikasi saat ini</p>
          </div>
        )}
      </div>

      {/* Detail Modal / Bottom Sheet */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedNotif(null)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-t-3xl border-t border-gray-200 shadow-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Handle Bar */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="text-center mb-6">
               <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${getBgColor(selectedNotif.type)}`}>
                 {getIcon(selectedNotif.type, 40)}
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-1">{selectedNotif.title}</h3>
               <p className="text-gray-400 text-sm">{selectedNotif.date}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-8">
               <p className="text-slate-700 leading-relaxed text-sm">
                 {selectedNotif.message}
               </p>
            </div>

            {/* Action Buttons */}
            {selectedNotif.type === 'success' ? (
              <div className="grid grid-cols-2 gap-3">
                 <button 
                    onClick={handleShare}
                    className="flex items-center justify-center space-x-2 bg-white text-[#006E7F] border border-[#006E7F]/30 py-3 rounded-xl font-medium hover:bg-[#00E6F6]/5 active:scale-95 transition-all"
                 >
                    <Share2 size={18} />
                    <span>Bagikan</span>
                 </button>
                 <button 
                    onClick={() => setSelectedNotif(null)}
                    className="flex items-center justify-center space-x-2 bg-[#006E7F] text-white py-3 rounded-xl font-bold hover:bg-[#005a69] active:scale-95 transition-all shadow-lg shadow-[#006E7F]/20"
                 >
                    <ArrowLeft size={18} />
                    <span>Kembali</span>
                 </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={() => handleDeleteSingle(selectedNotif.id)}
                  className="w-full text-red-500 font-medium py-3 rounded-xl hover:bg-red-50 active:scale-95 transition-all flex items-center justify-center space-x-2 border border-transparent hover:border-red-100"
                >
                  <Trash2 size={18} />
                  <span>Hapus Notifikasi</span>
                </button>
                <button 
                  onClick={() => setSelectedNotif(null)}
                  className="w-full bg-[#00E6F6] text-white font-bold py-3 rounded-xl hover:bg-[#00cce0] active:scale-95 transition-all shadow-lg shadow-[#00E6F6]/30"
                >
                  Tutup
                </button>
              </div>
            )}
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

export default Notifications;