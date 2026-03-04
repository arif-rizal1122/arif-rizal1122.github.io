import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

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
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'glass py-3 shadow-lg shadow-blue-500/5' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="/" className="text-2xl font-bold font-['Poppins'] bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent transform hover:scale-105 transition-transform">
          Arif Rizal
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name}
              href={link.href} 
              className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-blue-400 transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleMenu}
            className="text-gray-200 focus:outline-none p-2 rounded-xl hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={toggleMenu}></div>
        <div className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-gray-900 shadow-2xl p-10 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <span className="text-xl font-bold font-['Poppins'] text-gradient">Menu</span>
            <button onClick={toggleMenu} className="text-gray-400 hover:text-white">
               <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          <div className="flex flex-col space-y-8">
            {navLinks.map((link, i) => (
              <a 
                key={link.name}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-2xl font-bold text-white hover:text-blue-600 transition-colors"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="absolute bottom-10 left-10 right-10">
             <div className="p-8 rounded-[2rem] bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                <p className="text-xs font-bold uppercase tracking-widest mb-4 opacity-80">Ready to work?</p>
                <a href="/contact" className="font-bold text-lg hover:underline block">Get in touch &rarr;</a>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
