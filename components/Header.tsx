import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-[80px] flex items-center justify-between px-6 md:px-10 z-50 bg-white/60 backdrop-blur-xl border-b border-gray-100/50">
      {/* Logo Section */}
      <div className="flex items-center space-x-3 group cursor-pointer">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-360">
          <div className="w-2 h-2 bg-white rounded-full"></div>
        </div>
        <span className="font-bold tracking-tighter text-2xl uppercase">Neo</span>
      </div>
      
      {/* Navigation Links */}
      <div className="hidden md:flex space-x-12 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
        <Link href="/" className="hover:text-black transition-colors duration-300 relative group">
          Carousel
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <Link href="/carousel-2" className="hover:text-black transition-colors duration-300 relative group">
          carousel2
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
        <a href="#" className="hover:text-black transition-colors duration-300 relative group">
          Order
          <span className="absolute -bottom-1 left-0 w-0 h-px bg-black transition-all duration-300 group-hover:w-full"></span>
        </a>
      </div>
      
      {/* CTA Section */}
      <div>
        <button className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all active:scale-95">
          Pre-Order
        </button>
      </div>
    </nav>
  );
};

export default Header;
