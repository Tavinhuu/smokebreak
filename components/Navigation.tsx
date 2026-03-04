"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Início', path: '/', icon: LayoutDashboard },
    { name: 'Estoque', path: '/estoque', icon: Package },
    { name: 'Vendas', path: '/vendas', icon: ShoppingCart },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#0A0A0A]/80 backdrop-blur-2xl border-t border-white/5">
      <div className="max-w-[800px] mx-auto px-8 pt-3 pb-5 md:pb-3 flex justify-between items-center">
        
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`relative flex flex-col items-center justify-center gap-1.5 transition-all duration-300 w-16 ${
                isActive ? 'text-[#AB38F7]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {/* Indicador de item ativo (Brilho Neon) */}
              {isActive && (
                <div className="absolute -top-3 w-8 h-[3px] bg-[#AB38F7] rounded-b-full shadow-[0_0_12px_rgba(171,56,247,0.6)] animate-in fade-in zoom-in duration-300" />
              )}
              
              <Icon 
                strokeWidth={isActive ? 2.5 : 2} 
                size={24} 
                className={`transition-all duration-300 ${isActive ? 'drop-shadow-[0_0_10px_rgba(171,56,247,0.4)] scale-110' : 'scale-100'}`} 
              />
              
              <span className={`font-mono text-[9px] uppercase tracking-[0.15em] transition-all duration-300 ${isActive ? 'font-black' : 'font-bold'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

      </div>
    </nav>
  );
}