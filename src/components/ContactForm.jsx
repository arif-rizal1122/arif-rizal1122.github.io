import React, { useState } from 'react';

const ContactForm = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(''); // Clear status before starting
    
    const form = e.target;
    const data = new FormData(form);
    const formObject = Object.fromEntries(data.entries());
    
    try {
      /**
       * ⚠️ CATATAN TENTANG CORS:
       * Google Apps Script tidak mendukung CORS untuk POST secara native dari browser lain.
       * Menggunakan 'no-cors' akan mengirim data tetapi browser TIDAK bisa membaca responnya.
       * Hasilnya akan selalu dianggap "Opaque" (berhasil dikirim tapi status tidak diketahui).
       */
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbweGcFkom2pKuuxf5fYQAVaIujTrWJ_65Kd2P_FW2jjfcKn0zDBboed1Rz0d8SSo3fX/exec';
      
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Penting untuk menghindari CORS error di browser
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formObject),
      });

      // Karena no-cors, kita asumsikan berhasil jika tidak ada error jaringan
      setStatus('SUCCESS');
      form.reset();
    } catch (err) {
      console.error('Submission error:', err);
      setStatus('ERROR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 md:p-12 rounded-[2.5rem] shadow-2xl border-blue-100 dark:border-gray-800">
      {status === 'SUCCESS' ? (
        <div className="text-center py-12 reveal active">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-3xl"></i>
          </div>
          <h3 className="text-2xl font-bold mb-4 dark:text-white">Pesan Terkirim!</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">Terima kasih telah menghubungi saya. Saya akan segera membalas pesan Anda dalam waktu 1x24 jam.</p>
          <button onClick={() => setStatus('')} className="text-blue-600 font-bold hover:underline">Kirim pesan lain &rarr;</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="subject" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Subjek</label>
            <input
              type="text"
              name="subject"
              id="subject"
              required
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="Kerjasama Proyek"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="message" className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Pesan</label>
            <textarea
              name="message"
              id="message"
              required
              rows="5"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
              placeholder="Tulis pesan Anda di sini..."
            ></textarea>
          </div>
          
          {status === 'ERROR' && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-500 text-sm font-medium border border-red-100 dark:border-red-900/20">
              <i className="fas fa-exclamation-circle mr-2"></i> Terjadi kesalahan. Silakan coba lagi nanti.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              <>
                Kirim Pesan
                <i className="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;