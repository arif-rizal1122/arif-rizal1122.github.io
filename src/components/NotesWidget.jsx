import React, { useState, useEffect } from 'react';

const NotesWidget = () => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('personal_notes') || '';
    setNotes(savedNotes);
  }, []);

  const handleNotesChange = (e) => {
    const val = e.target.value;
    setNotes(val);
    localStorage.setItem('personal_notes', val);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <i className="fas fa-sticky-note text-yellow-500 mr-2"></i> Quick Notes
      </h3>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder="Tulis ide atau catatan cepat di sini..."
        className="w-full h-96 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all dark:text-gray-100 font-mono text-sm"
      ></textarea>
      <div className="mt-4 flex justify-between items-center">
        <p className="text-xs text-gray-500">Tersimpan otomatis di browser ini.</p>
        <button 
          onClick={() => { if(confirm('Hapus semua catatan?')) { setNotes(''); localStorage.removeItem('personal_notes'); } }}
          className="text-xs text-red-500 hover:text-red-600 transition-colors"
        >
          Hapus Semua
        </button>
      </div>
    </div>
  );
};

export default NotesWidget;
