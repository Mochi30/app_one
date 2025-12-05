import React, { useState } from 'react';
import { Zap, CheckCircle, CreditCard, ChevronRight, Wallet, Building2, Landmark, Share2, Home } from 'lucide-react';
import { TokenPackage } from '../types';

const PACKAGES: TokenPackage[] = [
  { id: '1', price: 20000, kwh: 13.5, name: 'Paket Hemat' },
  { id: '2', price: 50000, kwh: 33.8, name: 'Paket Mingguan' },
  { id: '3', price: 100000, kwh: 67.5, name: 'Paket Bulanan' },
  { id: '4', price: 200000, kwh: 135.0, name: 'Paket Sultan' },
  { id: '5', price: 500000, kwh: 337.5, name: 'Paket Bisnis' },
  { id: '6', price: 1000000, kwh: 675.0, name: 'Paket Industri' },
];

interface PaymentMethod {
  id: string;
  name: string;
  type: 'wallet' | 'bank' | 'card';
  icon: React.ReactNode;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'gopay', name: 'GoPay', type: 'wallet', icon: <Wallet size={18} /> },
  { id: 'ovo', name: 'OVO', type: 'wallet', icon: <Wallet size={18} /> },
  { id: 'dana', name: 'DANA', type: 'wallet', icon: <Wallet size={18} /> },
  { id: 'bca', name: 'BCA Virtual Acc', type: 'bank', icon: <Building2 size={18} /> },
  { id: 'mandiri', name: 'Mandiri VA', type: 'bank', icon: <Landmark size={18} /> },
  { id: 'cc', name: 'Kartu Debit/Kredit', type: 'card', icon: <CreditCard size={18} /> },
];

const TokenShop: React.FC = () => {
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>('gopay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBuy = () => {
    if (!selectedPackageId) return;
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
      // Auto close removed to allow user interaction with buttons
    }, 1500);
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
    setSelectedPackageId(null);
    setSelectedPaymentId('gopay');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pembelian Token Listrik Berhasil',
        text: 'Saya baru saja membeli token listrik di VoltMate. Kode Token: 1234 5678 9012 3456 7890',
      }).catch(console.error);
    } else {
      alert("Fitur bagikan dibuka (Simulasi)");
    }
  };

  const getSelectedPaymentName = () => {
    return PAYMENT_METHODS.find(p => p.id === selectedPaymentId)?.name || 'Pembayaran';
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-fade-in p-6 text-center">
        <div className="w-20 h-20 bg-[#00E6F6]/10 rounded-full flex items-center justify-center mb-6 animate-bounce-small">
          <CheckCircle size={48} className="text-[#00E6F6]" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Pembelian Berhasil!</h2>
        <p className="text-gray-500 mb-6">Token listrik Anda telah ditambahkan ke riwayat transaksi.</p>
        
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg w-full max-w-xs mb-8">
          <p className="text-sm text-gray-500 mb-1">Metode Pembayaran</p>
          <p className="text-slate-900 font-medium mb-3">{getSelectedPaymentName()}</p>
          
          <div className="h-px bg-gray-100 w-full mb-3"></div>

          <p className="text-sm text-gray-500 mb-1">Kode Token</p>
          <p className="text-xl font-mono text-[#006E7F] font-bold tracking-wider mb-4">
            1234 5678 9012 3456 7890
          </p>
          <p className="text-xs text-center text-gray-400">
            Salin kode ini dan masukkan ke meteran Anda.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center space-x-2 bg-white text-[#006E7F] border border-[#006E7F]/30 py-3 rounded-xl font-medium hover:bg-[#00E6F6]/5 active:scale-95 transition-all"
          >
            <Share2 size={18} />
            <span>Bagikan</span>
          </button>
          
          <button 
            onClick={handleCloseSuccess}
            className="flex items-center justify-center space-x-2 bg-[#006E7F] text-white py-3 rounded-xl font-bold hover:bg-[#005a69] active:scale-95 transition-all shadow-lg shadow-[#006E7F]/20"
          >
            <Home size={18} />
            <span>Kembali</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-40 px-4 pt-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900">Beli Token</h2>
        <div className="bg-[#006E7F]/10 px-3 py-1 rounded-full text-[#006E7F] text-sm font-medium">
          ID: 14028829100
        </div>
      </div>

      {/* Package Grid */}
      <div className="grid grid-cols-2 gap-4">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            onClick={() => setSelectedPackageId(pkg.id)}
            className={`relative p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden group shadow-sm ${
              selectedPackageId === pkg.id
                ? 'bg-white border-[#00E6F6] ring-2 ring-[#00E6F6]/20'
                : 'bg-white border-gray-200 hover:border-[#00E6F6]'
            }`}
          >
            <div className={`absolute top-0 right-0 p-2 transition-opacity ${selectedPackageId === pkg.id ? 'opacity-20' : 'opacity-5'}`}>
              <Zap size={48} className="text-[#006E7F]" />
            </div>
            <p className="text-gray-500 text-xs mb-1">{pkg.name}</p>
            <h3 className="text-xl font-bold text-slate-900 mb-1">
              {pkg.price.toLocaleString('id-ID')}
            </h3>
            <p className="text-[#006E7F] text-sm font-medium">
              {pkg.kwh} kWh
            </p>
          </button>
        ))}
      </div>

      {/* Payment Sheet Overlay */}
      {selectedPackageId && (
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
           {/* Backdrop to close */}
           <div 
             className="absolute bottom-0 w-full h-screen bg-black/30 backdrop-blur-sm -z-10"
             onClick={() => setSelectedPackageId(null)}
           ></div>

           <div className="bg-white rounded-t-3xl border-t border-gray-200 shadow-2xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-4">Konfirmasi Pembayaran</h3>
            
            <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-gray-500 text-xs">Total Tagihan</p>
                <p className="text-2xl font-bold text-[#006E7F]">
                  Rp {PACKAGES.find(p => p.id === selectedPackageId)?.price.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">Daya</p>
                <p className="text-slate-900 font-medium">{PACKAGES.find(p => p.id === selectedPackageId)?.kwh} kWh</p>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <p className="text-slate-900 font-medium mb-3 text-sm">Pilih Metode Pembayaran</p>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentId(method.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                      selectedPaymentId === method.id
                        ? 'bg-[#00E6F6]/5 border-[#00E6F6] text-slate-900'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${selectedPaymentId === method.id ? 'bg-[#00E6F6]/20 text-[#006E7F]' : 'bg-gray-100 text-gray-400'}`}>
                        {method.icon}
                      </div>
                      <span className="font-medium text-sm">{method.name}</span>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      selectedPaymentId === method.id ? 'border-[#00E6F6]' : 'border-gray-300'
                    }`}>
                      {selectedPaymentId === method.id && <div className="w-3 h-3 bg-[#00E6F6] rounded-full"></div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleBuy}
              disabled={isProcessing}
              className="w-full bg-[#00E6F6] text-white font-bold py-4 rounded-xl hover:bg-[#00cce0] transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-[#00E6F6]/30"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Bayar Sekarang</span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
            
            <button 
              onClick={() => setSelectedPackageId(null)}
              className="w-full text-gray-500 text-sm font-medium mt-4 py-2 hover:text-slate-900"
            >
              Batalkan
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

export default TokenShop;