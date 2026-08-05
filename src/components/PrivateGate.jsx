import React, { useState, useEffect } from 'react';

const ACCESS_KEY = 'private_access_granted';
const REFERRAL_CODE = 'buka1122';

const PrivateGate = ({ children }) => {
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(true);
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const granted = localStorage.getItem(ACCESS_KEY) === 'true';
    if (granted) setUnlocked(true);
    setChecking(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().toLowerCase() === REFERRAL_CODE) {
      localStorage.setItem(ACCESS_KEY, 'true');
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLock = () => {
    localStorage.removeItem(ACCESS_KEY);
    setUnlocked(false);
    setCode('');
    setError(false);
  };

  if (checking) {
    return (
      <div className="flex justify-center py-24">
        <i className="fas fa-circle-notch fa-spin text-indigo-500 text-3xl"></i>
      </div>
    );
  }

  if (!unlocked) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <i className="fas fa-lock text-indigo-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Area Pribadi</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Masukkan kode referal Anda untuk mengakses halaman ini.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(false);
              }}
              placeholder="Kode referal..."
              autoComplete="off"
              className={`w-full p-3.5 px-5 bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none transition-all text-sm dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 ${
                error ? 'border-red-400 dark:border-red-500' : 'border-gray-200 dark:border-gray-700'
              }`}
            />
            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 flex items-center justify-center gap-1.5">
                <i className="fas fa-exclamation-circle"></i> Kode referal salah, coba lagi.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <i className="fas fa-unlock-alt mr-2"></i>Buka Halaman
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleLock}
          className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-red-500 hover:border-red-200 dark:hover:border-red-500/30 transition-all"
        >
          <i className="fas fa-lock"></i> Kunci Halaman
        </button>
      </div>
      {children}
    </div>
  );
};

export default PrivateGate;
