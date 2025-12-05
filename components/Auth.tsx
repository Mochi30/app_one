import React, { useState } from 'react';
import { Mail, Lock, User, Zap, ArrowRight, Smartphone, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  // State untuk Mode (Default selalu Login/Masuk)
  const [isLogin, setIsLogin] = useState(true);
  
  // State Form
  const [name, setName] = useState('');
  const [meterId, setMeterId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        // --- LOGIKA LOGIN ---
        const storedUser = localStorage.getItem('voltmate_user');
        
        // Cek apakah data user ada
        if (!storedUser) {
          setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');
          setIsLoading(false);
          return;
        }

        const userData = JSON.parse(storedUser);
        
        // Validasi Email & Password
        if (userData.email === email && userData.password === password) {
          onLogin(); // Login Sukses
        } else {
          setError('Email atau password salah.');
        }

      } else {
        // --- LOGIKA REGISTER ---
        if (!name || !email || !password || !meterId) {
          setError('Semua kolom wajib diisi.');
          setIsLoading(false);
          return;
        }

        const newUser = {
          name,
          email,
          password,
          meterId,
          balance: 0
        };

        // Simpan ke Local Storage
        localStorage.setItem('voltmate_user', JSON.stringify(newUser));
        
        setSuccessMsg('Pendaftaran berhasil! Data tersimpan. Silakan masuk.');
        setIsLogin(true); // Pindah ke layar login otomatis setelah daftar
        setPassword(''); // Reset password field
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const toggleMode = () => {
    setError('');
    setSuccessMsg('');
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-[#00E6F6]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#00E6F6]/30 shadow-lg shadow-[#00E6F6]/20">
              <Zap className="text-[#006E7F]" size={32} />
           </div>
           <h1 className="text-2xl font-bold text-slate-900 mb-2">
             {isLogin ? 'Masuk ke VoltMate' : 'Registrasi Akun'}
           </h1>
           <p className="text-gray-500 text-sm">
             {isLogin ? 'Silakan masuk dengan akun yang terdaftar.' : 'Isi data diri Anda untuk mulai menggunakan aplikasi.'}
           </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-600 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-xl flex items-start space-x-3 text-green-600 text-sm">
            <Zap size={18} className="mt-0.5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Form Input hanya muncul jika Register */}
          {!isLogin && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Pengguna"
                    className="w-full bg-white border border-gray-200 focus:border-[#00E6F6] rounded-xl py-3 pl-12 pr-4 text-slate-900 outline-none transition-all focus:ring-4 focus:ring-[#00E6F6]/10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 ml-1">ID Meteran</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    value={meterId}
                    onChange={(e) => setMeterId(e.target.value)}
                    placeholder="Contoh: 1402..."
                    className="w-full bg-white border border-gray-200 focus:border-[#00E6F6] rounded-xl py-3 pl-12 pr-4 text-slate-900 outline-none transition-all focus:ring-4 focus:ring-[#00E6F6]/10"
                  />
                </div>
              </div>
            </>
          )}

          {/* Email & Password selalu muncul */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="email@domain.com"
                className="w-full bg-white border border-gray-200 focus:border-[#00E6F6] rounded-xl py-3 pl-12 pr-4 text-slate-900 outline-none transition-all focus:ring-4 focus:ring-[#00E6F6]/10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white border border-gray-200 focus:border-[#00E6F6] rounded-xl py-3 pl-12 pr-12 text-slate-900 outline-none transition-all focus:ring-4 focus:ring-[#00E6F6]/10"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#006E7F] hover:bg-[#005a69] text-white font-bold py-4 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-[#006E7F]/20 transition-all active:scale-95 mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isLogin ? 'Masuk' : 'Daftar Akun'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? 'Belum punya akun?' : 'Sudah punya akun?'}
            <button 
              onClick={toggleMode}
              className="text-[#00E6F6] font-bold ml-1 hover:text-[#00acc1] transition-colors"
            >
              {isLogin ? 'Daftar Sekarang' : 'Masuk Disini'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;