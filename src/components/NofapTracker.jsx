import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'nofap_record';
const MILESTONE_TARGETS = [7, 14, 30, 60, 90, 180, 365];

const TRIGGERS = [
  { id: 'stress', label: 'Stres', icon: 'fa-face-frown' },
  { id: 'bored', label: 'Bosan', icon: 'fa-hourglass-half' },
  { id: 'social', label: 'Medsos / HP', icon: 'fa-mobile-screen' },
  { id: 'thoughts', label: 'Pikiran Terlintas', icon: 'fa-brain' },
  { id: 'other', label: 'Lainnya', icon: 'fa-ellipsis' },
];

const todayISO = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const daysBetween = (from, to) => {
  const ms = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(0, Math.floor(ms / 86400000));
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

const formatShortDate = (iso) =>
  new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

const defaultState = () => ({
  startDate: null,
  bestStreak: 0,
  milestones: [],
  streaks: [],
  relapses: [],
});

const NofapTracker = () => {
  const [data, setData] = useState(null);
  const [now, setNow] = useState(new Date());
  const [newStartDate, setNewStartDate] = useState(todayISO());
  const [newMilestoneLabel, setNewMilestoneLabel] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState(todayISO());
  const [showRelapseForm, setShowRelapseForm] = useState(false);
  const [relapseDate, setRelapseDate] = useState(todayISO());
  const [relapseTrigger, setRelapseTrigger] = useState('');
  const [relapseNote, setRelapseNote] = useState('');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    setData(saved ? { ...defaultState(), ...saved } : defaultState());
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const persist = (next) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setData(next);
  };

  if (!data) {
    return (
      <div className="flex justify-center py-24">
        <i className="fas fa-circle-notch fa-spin text-indigo-500 text-3xl"></i>
      </div>
    );
  }

  const currentStreak = data.startDate ? daysBetween(data.startDate, todayISO()) : 0;

  const closeCurrentStreak = (next) => {
    const updated = { ...next };
    if (currentStreak > 0) {
      updated.streaks = [
        ...next.streaks,
        { id: Date.now(), startDate: data.startDate, endDate: todayISO(), days: currentStreak },
      ];
    }
    if (currentStreak > updated.bestStreak) {
      updated.bestStreak = currentStreak;
    }
    return updated;
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!newStartDate) return;
    persist({ ...data, startDate: newStartDate });
  };

  const handleReset = () => {
    if (!confirm('Yakin ingin mereset streak? Streak saat ini akan masuk riwayat dan tanggal mulai diatur ke hari ini.')) return;
    const next = closeCurrentStreak(data);
    if (currentStreak > 0) {
      next.milestones = [
        ...next.milestones,
        { id: Date.now(), label: `Mencapai streak ${currentStreak} hari`, date: todayISO() },
      ];
    }
    next.startDate = todayISO();
    persist(next);
  };

  const handleRelapse = (e) => {
    e.preventDefault();
    if (!relapseTrigger) return;
    const next = closeCurrentStreak(data);
    next.relapses = [
      { id: Date.now(), date: relapseDate, trigger: relapseTrigger, note: relapseNote.trim() },
      ...next.relapses,
    ];
    if (currentStreak > 0) {
      next.milestones = [
        ...next.milestones,
        { id: Date.now(), label: `Mencapai streak ${currentStreak} hari`, date: todayISO() },
      ];
    }
    next.startDate = todayISO();
    persist(next);
    setShowRelapseForm(false);
    setRelapseDate(todayISO());
    setRelapseTrigger('');
    setRelapseNote('');
  };

  const handleChangeStartDate = () => {
    const value = prompt('Ubah tanggal mulai (YYYY-MM-DD):', data.startDate);
    if (value && value.match(/^\d{4}-\d{2}-\d{2}$/)) {
      persist({ ...data, startDate: value });
    }
  };

  const addMilestone = (e, label, date) => {
    if (e) e.preventDefault();
    const finalLabel = (label || newMilestoneLabel).trim();
    const finalDate = date || newMilestoneDate;
    if (!finalLabel || !finalDate) return;
    if (data.milestones.some((m) => m.label === finalLabel)) return;
    persist({
      ...data,
      milestones: [...data.milestones, { id: Date.now(), label: finalLabel, date: finalDate }],
    });
    setNewMilestoneLabel('');
    setNewMilestoneDate(todayISO());
  };

  const deleteMilestone = (id) => {
    persist({ ...data, milestones: data.milestones.filter((m) => m.id !== id) });
  };

  const deleteRelapse = (id) => {
    persist({ ...data, relapses: data.relapses.filter((r) => r.id !== id) });
  };

  const milestones = [...data.milestones].sort((a, b) => (a.date < b.date ? 1 : -1));

  // --- Statistik ---
  const totalCleanDays = data.streaks.reduce((s, st) => s + st.days, 0) + currentStreak;
  const completedDays = data.streaks.map((s) => s.days);
  const avgStreak = completedDays.length
    ? Math.round(completedDays.reduce((a, b) => a + b, 0) / completedDays.length)
    : 0;
  const bestStreak = Math.max(data.bestStreak, ...completedDays, currentStreak);
  const totalRelapses = data.relapses.length;

  // --- Milestone berikutnya ---
  const nextTarget = MILESTONE_TARGETS.find((t) => t > currentStreak) || null;
  const progressPct = nextTarget ? Math.min(100, Math.round((currentStreak / nextTarget) * 100)) : 100;
  const daysToNext = nextTarget ? nextTarget - currentStreak : 0;

  // --- Chart riwayat streak ---
  const recentStreaks = [...data.streaks]
    .sort((a, b) => (a.startDate < b.startDate ? 1 : -1))
    .slice(0, 10);
  const maxStreakDays = Math.max(1, ...recentStreaks.map((s) => s.days));

  // --- Analisa pemicu ---
  const triggerCounts = TRIGGERS.map((t) => ({
    ...t,
    count: data.relapses.filter((r) => r.trigger === t.id).length,
  })).filter((t) => t.count > 0);
  const maxTriggerCount = triggerCounts.length ? Math.max(...triggerCounts.map((t) => t.count)) : 1;

  const stats = [
    { label: 'Total Hari Bersih', value: totalCleanDays, icon: 'fa-calendar-check', color: 'text-blue-500' },
    { label: 'Rata-rata Streak', value: avgStreak, icon: 'fa-chart-line', color: 'text-emerald-500' },
    { label: 'Rekor Terbaik', value: bestStreak, icon: 'fa-trophy', color: 'text-amber-500' },
    { label: 'Total Kambuh', value: totalRelapses, icon: 'fa-rotate-left', color: 'text-red-500' },
  ];

  const clockTime = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const clockDate = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Live Clock */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3">
        <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 md:hidden">
          <i className="fas fa-calendar text-blue-400 mr-1.5"></i>
          {clockDate}
        </p>
        <p className="hidden md:block text-xs md:text-sm text-gray-400">
          <i className="fas fa-calendar text-blue-400 mr-2"></i>
          {clockDate}
        </p>
        <p className="text-3xl md:text-4xl font-extrabold font-['Poppins'] bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent tabular-nums">
          {clockTime} <span className="text-sm md:text-base font-bold text-gray-400 align-middle"><i className="fas fa-clock ml-1"></i> WIB</span>
        </p>
      </div>

      {/* Setup / Tanggal Mulai */}
      {!data.startDate && (
        <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
            <i className="fas fa-fire text-indigo-500 text-2xl"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Mulai Perjalanan</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Pilih tanggal mulai untuk memulai perhitungan streak Anda.
          </p>
          <form onSubmit={handleStart} className="max-w-xs mx-auto space-y-4">
            <input
              type="date"
              value={newStartDate}
              max={todayISO()}
              onChange={(e) => setNewStartDate(e.target.value)}
              className="w-full p-3.5 px-5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none transition-all text-sm dark:text-gray-100 focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
            >
              <i className="fas fa-play mr-2"></i>Mulai
            </button>
          </form>
        </div>
      )}

      {/* Streak Card */}
      {data.startDate && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="flex items-center justify-end gap-2 mb-6 -mt-2">
                <button
                  onClick={() => setShowRelapseForm((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 transition-all"
                >
                  <i className="fas fa-exclamation-triangle"></i> Kambuh
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  <i className="fas fa-rotate-left"></i> Reset
                </button>
              </div>

              <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
                <i className="fas fa-fire text-orange-500 text-2xl"></i>
              </div>

              <div className="text-6xl md:text-7xl font-extrabold font-['Poppins'] bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent leading-none">
                {currentStreak}
              </div>
              <p className="text-sm md:text-base uppercase tracking-widest font-bold text-gray-500 dark:text-gray-400 mt-3">
                Hari Bersih
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                <span className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
                  <i className="fas fa-calendar-alt text-[10px]"></i>
                  Sejak {formatDate(data.startDate)}
                </span>
                <button
                  onClick={handleChangeStartDate}
                  className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <i className="fas fa-pen text-[10px]"></i> Ubah Tanggal
                </button>
              </div>

              {/* Progress ke milestone berikutnya */}
              {nextTarget && (
                <div className="max-w-md mx-auto mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      Progres menuju <span className="text-amber-500">Hari ke-{nextTarget}</span>
                    </span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    <i className="fas fa-hourglass-half mr-1"></i>
                    {daysToNext} hari lagi menuju Hari ke-{nextTarget}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 md:p-6 text-center"
              >
                <i className={`fas ${s.icon} ${s.color} text-lg md:text-xl mb-2`}></i>
                <div className="text-2xl md:text-3xl font-extrabold font-['Poppins'] dark:text-white leading-none">
                  {s.value}
                </div>
                <p className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-gray-400 mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Form Kambuh */}
          {showRelapseForm && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/40 p-6 md:p-8 animate-slideDown">
              <h3 className="text-lg font-bold mb-1 flex items-center text-red-500">
                <i className="fas fa-exclamation-triangle mr-2"></i> Catat Kambuh
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Jangan putus asa — catat dengan jujur supaya bisa belajar dari pemicunya. Streak otomatis di-restart.
              </p>
              <form onSubmit={handleRelapse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      value={relapseDate}
                      max={todayISO()}
                      onChange={(e) => setRelapseDate(e.target.value)}
                      className="w-full p-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none transition-all text-sm dark:text-gray-100 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Pemicu
                    </label>
                    <select
                      value={relapseTrigger}
                      onChange={(e) => setRelapseTrigger(e.target.value)}
                      className="w-full p-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none transition-all text-sm dark:text-gray-100 focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Pilih pemicu...</option>
                      {TRIGGERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                    Catatan <span className="normal-case font-normal">(opsional)</span>
                  </label>
                  <textarea
                    value={relapseNote}
                    onChange={(e) => setRelapseNote(e.target.value)}
                    rows={3}
                    placeholder="Apa yang terjadi? Apa yang bisa diperbaiki..."
                    className="w-full p-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none transition-all text-sm dark:text-gray-100 focus:ring-2 focus:ring-red-500 resize-none"
                  ></textarea>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={!relapseTrigger}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-500/20"
                  >
                    <i className="fas fa-check mr-2"></i>Simpan & Restart
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRelapseForm(false)}
                    className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Riwayat Streak (Chart) */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-chart-bar text-blue-500 mr-2"></i> Riwayat Streak
              </h3>
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold">
                10 terakhir
              </span>
            </div>

            {recentStreaks.length === 0 ? (
              <div className="text-center py-10">
                <i className="fas fa-chart-line text-gray-300 dark:text-gray-700 text-4xl mb-3 block"></i>
                <p className="text-gray-400 text-sm">
                  Belum ada riwayat streak. Streak akan tercatat saat kambuh atau reset.
                </p>
              </div>
            ) : (
              <div className="flex items-end justify-around gap-2 h-44">
                {recentStreaks.map((s) => (
                  <div key={s.id} className="flex-1 flex flex-col items-center justify-end gap-2 h-full min-w-0">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                      {s.days}
                    </span>
                    <div
                      className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-blue-600 to-emerald-400 transition-all"
                      style={{ height: `${Math.max(8, Math.round((s.days / maxStreakDays) * 100))}%` }}
                      title={`${s.days} hari (${formatDate(s.startDate)} - ${formatDate(s.endDate)})`}
                    ></div>
                    <span className="text-[8px] text-gray-400 truncate w-full text-center">
                      {formatShortDate(s.endDate)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Manajemen Kambuh */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-rotate-left text-red-500 mr-2"></i> Riwayat Kambuh
              </h3>
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold">
                {totalRelapses} catatan
              </span>
            </div>

            {/* Analisa Pemicu */}
            {triggerCounts.length > 0 && (
              <div className="mb-8 p-5 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                  <i className="fas fa-search mr-1"></i> Analisa Pemicu
                </h4>
                <div className="space-y-3">
                  {triggerCounts.map((t) => {
                    const isTop = t.count === maxTriggerCount;
                    return (
                      <div key={t.id} className="flex items-center gap-3">
                        <span className={`w-32 shrink-0 text-xs font-medium ${isTop ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                          <i className={`fas ${t.icon} mr-1.5`}></i>
                          {t.label}
                        </span>
                        <div className="flex-grow h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isTop ? 'bg-red-500' : 'bg-indigo-500'}`}
                            style={{ width: `${Math.max(4, (t.count / maxTriggerCount) * 100)}%` }}
                          ></div>
                        </div>
                        <span className="w-6 text-right text-xs font-bold text-gray-500 dark:text-gray-400">
                          {t.count}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {maxTriggerCount > 0 && (
                  <p className="text-xs text-gray-400 mt-4">
                    <i className="fas fa-lightbulb text-amber-500 mr-1"></i>
                    Pemicu paling sering:{' '}
                    <span className="font-bold text-red-500">
                      {triggerCounts.find((t) => t.count === maxTriggerCount)?.label}
                    </span>{' '}
                    — perhatikan pola ini.
                  </p>
                )}
              </div>
            )}

            {/* Daftar Riwayat */}
            <div className="space-y-3">
              {data.relapses.length === 0 ? (
                <div className="text-center py-10">
                  <i className="fas fa-shield-heart text-gray-300 dark:text-gray-700 text-4xl mb-3 block"></i>
                  <p className="text-gray-400 text-sm">Tidak ada catatan kambuh. Terus pertahankan!</p>
                </div>
              ) : (
                data.relapses.map((r) => {
                  const trigger = TRIGGERS.find((t) => t.id === r.trigger);
                  return (
                    <div
                      key={r.id}
                      className="flex items-start justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-50 dark:border-gray-700/50 group/item"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                          <i className={`fas ${trigger?.icon || 'fa-rotate-left'} text-red-500 text-sm`}></i>
                        </span>
                        <div>
                          <p className="text-sm font-bold dark:text-gray-100">
                            {trigger?.label || 'Kambuh'}
                            <span className="ml-2 text-xs font-medium text-gray-400">
                              {formatDate(r.date)}
                            </span>
                          </p>
                          {r.note && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{r.note}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRelapse(r.id)}
                        aria-label="Hapus catatan kambuh"
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-2"
                      >
                        <i className="fas fa-trash-alt text-xs"></i>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pencapaian */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center">
                <i className="fas fa-medal text-amber-500 mr-2"></i> Pencapaian
              </h3>
              <span className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-bold">
                {milestones.length} rekor
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {MILESTONE_TARGETS.map((target) => {
                const exists = data.milestones.some((m) => m.label === `Hari ke-${target}`);
                return (
                  <button
                    key={target}
                    disabled={exists || currentStreak < target}
                    onClick={() => addMilestone(null, `Hari ke-${target}`, todayISO())}
                    className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${
                      exists
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 cursor-default'
                        : currentStreak < target
                          ? 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/50'
                    }`}
                  >
                    {exists ? (
                      <><i className="fas fa-check mr-1"></i> Hari {target}</>
                    ) : (
                      <>+ Hari {target}</>
                    )}
                  </button>
                );
              })}
            </div>

            <form onSubmit={(e) => addMilestone(e)} className="flex flex-col sm:flex-row gap-2 mb-8">
              <input
                type="text"
                value={newMilestoneLabel}
                onChange={(e) => setNewMilestoneLabel(e.target.value)}
                placeholder="Catat pencapaian (misal: Seminggu tanpa kambuh)..."
                className="flex-grow p-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-gray-100 text-sm"
              />
              <input
                type="date"
                value={newMilestoneDate}
                max={todayISO()}
                onChange={(e) => setNewMilestoneDate(e.target.value)}
                className="sm:w-40 p-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-gray-100 text-sm"
              />
              <button
                type="submit"
                aria-label="Simpan pencapaian"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
              >
                <i className="fas fa-plus"></i>
              </button>
            </form>

            <div className="space-y-3">
              {milestones.length === 0 ? (
                <div className="text-center py-10">
                  <i className="fas fa-medal text-gray-300 dark:text-gray-700 text-4xl mb-3 block"></i>
                  <p className="text-gray-400 text-sm">Belum ada pencapaian tercatat.</p>
                </div>
              ) : (
                milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-gray-50 dark:border-gray-700/50 group/item"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                        <i className="fas fa-check text-green-500 text-sm"></i>
                      </span>
                      <div>
                        <p className="text-sm font-bold dark:text-gray-100">{m.label}</p>
                        <p className="text-xs text-gray-400">{formatDate(m.date)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteMilestone(m.id)}
                      aria-label="Hapus pencapaian"
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all p-2"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NofapTracker;
