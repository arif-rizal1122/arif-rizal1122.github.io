import React, { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Update glass effect for navbar
      setScrolled(currentScrollY > 20);
      // Update visibility for Scroll to Top button
      setShowScrollTop(currentScrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(prev => !prev);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const navLinks = [
    { name: 'Beranda', href: '/#beranda' },
    { name: 'Tentang', href: '/#tentang' },
    { name: 'Proyek', href: '/projects' },
    { name: 'Blog', href: '/blog' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Notes', href: '/notes' },
    { name: 'Kontak', href: '/contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed z-50 transition-all duration-500 ease-out left-0 right-0 
          ${scrolled 
            ? 'top-3 mx-3 md:top-0 md:mx-0 py-2.5 md:py-4 glass rounded-2xl md:rounded-none shadow-lg shadow-blue-500/10 border border-white/5 dark:border-white/10' 
            : 'top-0 py-3 md:py-6 bg-transparent'
          }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo — compact saat scrolled di mobile */}
          <a
            href="/"
            className="font-bold font-['Poppins'] bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent hover:scale-105 transition-transform shrink-0"
          >
            <span className={`md:hidden transition-all duration-300 ${scrolled ? 'text-sm' : 'text-base'}`}>
              {scrolled ? 'AR' : 'Arif Rizal'}
            </span>
            <span className="hidden md:inline text-2xl">Arif Rizal</span>
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300 hover:text-blue-400 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          {/* Mobile Toggle — ikon berubah antara bars dan X */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isOpen
                  ? 'bg-blue-600 text-white rotate-90 shadow-lg shadow-blue-500/30'
                  : 'text-gray-200 hover:bg-white/10'
              }`}
              aria-label={isOpen ? 'Tutup menu' : 'Buka menu'}
            >
              <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars-staggered'} text-base`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`fixed inset-0 z-[60] md:hidden transition-all duration-500 ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Backdrop — klik area gelap untuk tutup */}
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={toggleMenu}
          />

          {/* Drawer Panel */}
          <div
            className={`absolute top-0 right-0 w-[72%] max-w-[280px] h-full bg-slate-900 shadow-2xl flex flex-col transform transition-transform duration-500 ease-in-out ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/5">
              <span className="text-sm font-bold font-['Poppins'] bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Navigasi
              </span>
              <button
                onClick={toggleMenu}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all"
                aria-label="Tutup menu"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            {/* Nav Links — proporsional, tidak terlalu besar */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link, i) => (
                  <a 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 active:scale-95 transition-all duration-200"
                    style={{ transitionDelay: isOpen ? `${i * 25}ms` : '0ms' }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 shrink-0"></span>
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Footer / CTA */}
            <div className="p-4 border-t border-white/5">
              <a
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block w-full p-4 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-transform duration-200"
              >
                <p className="text-[9px] font-bold uppercase tracking-widest mb-1 opacity-80">
                  Siap Projek Baru?
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Hubungi Saya</span>
                  <i className="fas fa-arrow-right text-[10px]"></i>
                </div>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Floating Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-[100] p-4 rounded-2xl glass shadow-2xl shadow-blue-500/20 border border-white/10 transition-all duration-500 transform hover:scale-110 active:scale-90 group
          ${showScrollTop ? 'translate-y-0 opacity-100 visible' : 'translate-y-20 opacity-0 invisible'}`}
        aria-label="Kembali ke atas"
      >
        <i className="fas fa-arrow-up text-blue-400 group-hover:text-blue-300 group-hover:-translate-y-1 transition-all duration-300"></i>
      </button>
    </>
  );
};

export default Navbar;