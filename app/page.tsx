"use client";

import { useTabacaria } from "@/context/TabacariaContext";
import { Wallet, Users, Hexagon } from "lucide-react";

export default function Home() {
  const { partners } = useTabacaria();

  const socioList = [
    { label: 'Sócio 01', val: partners.s1 },
    { label: 'Sócio 02', val: partners.s2 },
    { label: 'Sócio 03', val: partners.s3 },
    { label: 'Sócio 04', val: partners.s4 },
  ];

  return (
    <div className="min-h-screen bg-[#121212] font-sans text-gray-200 relative overflow-x-hidden selection:bg-[#AB38F7] selection:text-white flex flex-col">
      
      {/* --- BACKGROUND LAYER --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-[#AB38F7]/10 opacity-30 blur-[150px] rounded-full mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-900/10 opacity-30 blur-[150px] rounded-full" />
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 max-w-[800px] mx-auto px-6 pt-32 md:pt-40 pb-20 w-full flex-grow">
        
        {/* HEADER */}
        <header className="mb-12">
          <p className="font-mono text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
            Visão Geral
          </p>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
            SMOKE BREAK
          </h1>
        </header>

        {/* SESSÃO PRINCIPAL: SÓCIOS (AGORA EM DESTAQUE) */}
        <div className="flex items-center gap-3 mb-6">
          <Users size={18} className="text-[#AB38F7]" />
          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Divisão de Sócios
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-12">
          {socioList.map((s, i) => (
            <div 
              key={i} 
              className="bg-[#111] p-6 md:p-8 rounded-[24px] border border-white/5 hover:border-[#AB38F7]/50 transition-all group relative overflow-hidden shadow-lg"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#AB38F7]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex justify-between items-start mb-4">
                <p className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  {s.label}
                </p>
                <div className="w-2 h-2 rounded-full bg-[#AB38F7]/20 group-hover:bg-[#AB38F7] transition-colors shadow-[0_0_10px_rgba(171,56,247,0)] group-hover:shadow-[0_0_10px_rgba(171,56,247,0.5)]"></div>
              </div>
              
              <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                R$ {s.val.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* SESSÃO SECUNDÁRIA: SALDO BADGE (AGORA MENOR E DISCRETO) */}
        <div className="flex items-center gap-3 mb-4">
          <Hexagon size={16} className="text-gray-500" />
          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Fundo do Sistema
          </h3>
        </div>

        <div className="bg-[#0A0A0A] p-4 md:p-5 rounded-[20px] border border-white/5 flex flex-row justify-between items-center max-w-sm hover:bg-white/[0.02] transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <Wallet size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-300 uppercase tracking-wide">Saldo Badge</p>
              <p className="font-mono text-[10px] font-medium text-gray-500 uppercase">Reserva</p>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-xl font-black text-[#AB38F7] tracking-tight">
              R$ {partners.badge.toFixed(2)}
            </span>
          </div>
        </div>

      </main>
    </div>
  );
}