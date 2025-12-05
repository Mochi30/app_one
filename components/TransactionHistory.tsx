import React, { useState } from 'react';
import { History, ArrowDownLeft, Clock, AlertCircle, X, Copy, Share2, CheckCircle, Receipt } from 'lucide-react';
import { Transaction } from '../types';

const TRANSACTIONS: Transaction[] = [
  { id: 'TX1', date: '2023-10-24 14:30', amount: 100000, kwh: 67.5, status: 'success', paymentMethod: 'Gopay', tokenCode: '4421-5521-9928-1120' },
  { id: 'TX2', date: '2023-10-10 09:15', amount: 50000, kwh: 33.8, status: 'success', paymentMethod: 'BCA VA', tokenCode: '1120-9928-5521-4421' },
  { id: 'TX3', date: '2023-09-28 18:45', amount: 200000, kwh: 135.0, status: 'failed', paymentMethod: 'OVO' },
  { id: 'TX4', date: '2023-09-15 10:00', amount: 50000, kwh: 33.8, status: 'success', paymentMethod: 'Dana', tokenCode: '8821-3321-4412-5500' },
];

const TransactionHistory: React.FC = () => {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-[#006E7F]';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-500';
      default: return 'text-slate-900';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'success': return 'bg-[#00E6F6]/10';
      case 'pending': return 'bg-yellow-100';
      case 'failed': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="pb-24 px-4 pt-6 space-y-6 min-h-screen">
      <h2 className="text-2xl font-bold text-slate-900 flex items-center">
        <History className="mr-3 text-[#00E6F6]" />
        Riwayat Transaksi
      </h2>

      <div className="space-y-4">
        {TRANSACTIONS.map((tx) => (
          <button 
            key={tx.id} 
            onClick={() => setSelectedTx(tx)}
            className="w-full text-left bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex justify-between items-center active:scale-[0.98] transition-all hover:border-[#00E6F6]/50"
          >
            <div className="flex items-start space-x-4">
              <div className={`mt-1 p-2 rounded-full ${getStatusBg(tx.status)} ${getStatusColor(tx.status)}`}>
                {tx.status === 'success' ? <ArrowDownLeft size={20} /> : 
                 tx.status === 'pending' ? <Clock size={20} /> : <AlertCircle size={20} />}
              </div>
              <div>
                <p className="font-bold text-slate-900 text-lg">Rp {tx.amount.toLocaleString('id-ID')}</p>
                <p className="text-gray-500 text-xs mb-1">{tx.date}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 border border-gray-200">{tx.paymentMethod}</span>
                  {tx.tokenCode && (
                     <span className="text-xs text-[#006E7F] font-mono tracking-wider font-medium">● Token Tersedia</span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Listrik</p>
              <p className="text-lg font-bold text-[#006E7F]">{tx.kwh} kWh</p>
            </div>
          </button>
        ))}
      </div>

      {/* Detail Modal / Bottom Sheet */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedTx(null)}
          ></div>
          
          <div className="relative bg-white w-full max-w-md rounded-t-3xl border-t border-gray-200 shadow-2xl p-6 animate-slide-up max-h-[85vh] overflow-y-auto">
            {/* Handle Bar */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${getStatusBg(selectedTx.status)}`}>
                {selectedTx.status === 'success' ? <CheckCircle size={40} className={getStatusColor(selectedTx.status)} /> : 
                 selectedTx.status === 'pending' ? <Clock size={40} className={getStatusColor(selectedTx.status)} /> : 
                 <AlertCircle size={40} className={getStatusColor(selectedTx.status)} />}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">
                {selectedTx.status === 'success' ? 'Transaksi Berhasil' : 
                 selectedTx.status === 'pending' ? 'Menunggu Pembayaran' : 'Transaksi Gagal'}
              </h3>
              <p className="text-gray-500 text-sm">{selectedTx.date}</p>
            </div>

            {/* Token Section */}
            {selectedTx.status === 'success' && selectedTx.tokenCode && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-center relative overflow-hidden">
                <p className="text-gray-500 text-xs mb-2 uppercase tracking-widest">Kode Token (Stroom)</p>
                <p className="text-2xl font-mono font-bold text-[#006E7F] tracking-widest mb-3">
                  {selectedTx.tokenCode.replace(/-/g, ' ')}
                </p>
                <button 
                  onClick={() => selectedTx.tokenCode && handleCopyToken(selectedTx.tokenCode)}
                  className="mx-auto flex items-center space-x-2 bg-white text-[#006E7F] border border-[#006E7F]/30 hover:bg-[#00E6F6]/5 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  <span>{copied ? 'Disalin!' : 'Salin Kode'}</span>
                </button>
              </div>
            )}

            {/* Details List */}
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">ID Referensi</span>
                <span className="text-slate-900 font-mono text-sm">{selectedTx.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Metode Pembayaran</span>
                <span className="text-slate-900 text-sm font-medium">{selectedTx.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Jumlah kWh</span>
                <span className="text-slate-900 text-sm font-medium">{selectedTx.kwh} kWh</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Biaya Admin</span>
                <span className="text-slate-900 text-sm font-medium">Rp 2.500</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-900 font-bold">Total Bayar</span>
                <span className="text-[#006E7F] text-xl font-bold">Rp {selectedTx.amount.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-slate-700 py-3 rounded-xl border border-gray-200 hover:bg-gray-200 transition">
                <Share2 size={18} />
                <span>Bagikan</span>
              </button>
              <button 
                onClick={() => setSelectedTx(null)}
                className="bg-[#00E6F6] text-white font-bold py-3 rounded-xl hover:bg-[#00cce0] transition shadow-lg shadow-[#00E6F6]/30"
              >
                Tutup
              </button>
            </div>
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

export default TransactionHistory;