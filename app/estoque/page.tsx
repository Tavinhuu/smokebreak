"use client";

import { useState } from 'react';
import { useTabacaria } from '@/context/TabacariaContext';
import { Plus, Trash2, PackageOpen, X, Hexagon } from 'lucide-react';

export default function Estoque() {
  const { products, addProduct, deleteProduct } = useTabacaria();
  const [showModal, setShowModal] = useState(false);
  const [newProd, setNewProd] = useState({ name: '', stock: 0, costPrice: 0, salePrice: 0 });

  const handleAdd = () => {
    if (!newProd.name) return;
    addProduct({ 
      ...newProd, 
      stock: Number(newProd.stock), 
      costPrice: Number(newProd.costPrice), 
      salePrice: Number(newProd.salePrice) 
    });
    setNewProd({ name: '', stock: 0, costPrice: 0, salePrice: 0 });
    setShowModal(false);
  };

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
        <header className="mb-12 flex justify-between items-end gap-6">
          <div>
            <p className="font-mono text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              Administração
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              ESTOQUE
            </h1>
          </div>
          
          <button 
            onClick={() => setShowModal(true)} 
            className="w-14 h-14 bg-[#AB38F7] text-white rounded-full shadow-[0_0_20px_rgba(171,56,247,0.3)] flex items-center justify-center shrink-0 active:scale-95 transition-all hover:bg-[#9625df]"
          >
            <Plus size={24} />
          </button>
        </header>

        {/* LISTA DE PRODUTOS */}
        <div className="space-y-4">
          {products.length === 0 && (
            <div className="text-center py-20 bg-[#0A0A0A] rounded-[32px] border border-white/5">
              <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                 <PackageOpen className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium text-sm">Seu estoque está vazio.</p>
            </div>
          )}

          {products.map((p: any) => {
            const isLowStock = Number(p.stock) <= 5;
            
            return (
              <div key={p.id} className="bg-[#111] p-5 rounded-[24px] border border-white/5 hover:border-[#AB38F7]/50 transition-all flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                  
                  {/* Ícone com lógica de cor para estoque baixo (Vibe Badgr) */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center border shrink-0 transition-colors
                    ${isLowStock 
                      ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.15)]' 
                      : 'bg-white/5 text-[#AB38F7] border-white/10 group-hover:bg-[#AB38F7]/10'
                    }`}
                  >
                    {isLowStock ? <PackageOpen size={20} /> : <Hexagon size={20} />}
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base uppercase tracking-wide leading-tight mb-1">
                      {p.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded ${isLowStock ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-gray-400'}`}>
                        {p.stock} UN
                      </span>
                      <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                        • R$ {Number(p.salePrice || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botão de Deletar */}
                <button 
                  onClick={() => {
                    if(confirm("Remover este produto?")) deleteProduct(p.id);
                  }} 
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/5 text-gray-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/10 transition-all shrink-0"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })}
        </div>

        {/* MODAL DE CADASTRO (DRAWER) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end animate-in fade-in duration-300">
            <div className="bg-[#111] w-full max-w-[800px] mx-auto rounded-t-[32px] border-t border-x border-white/10 p-6 md:p-10 pb-12 animate-in slide-in-from-bottom-8 duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black uppercase text-white tracking-tighter">Novo Produto</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="bg-white/5 border border-white/10 p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={20}/>
                </button>
              </div>
              
              <div className="space-y-6">
                
                {/* Input Nome */}
                <div className="space-y-3">
                  <label className="font-mono text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-[0.2em]">
                    Nome do Produto
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Essência de Menta..." 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-[24px] p-5 font-bold text-white placeholder-gray-600 outline-none focus:border-[#AB38F7] transition-colors" 
                    value={newProd.name} 
                    onChange={e => setNewProd({...newProd, name: e.target.value})} 
                  />
                </div>

                {/* Grid Estoque / Preço */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-[0.2em]">
                      Estoque Atual
                    </label>
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-[24px] p-5 font-bold text-white placeholder-gray-600 outline-none focus:border-[#AB38F7] transition-colors" 
                      value={newProd.stock || ''} 
                      onChange={e => setNewProd({...newProd, stock: Number(e.target.value)})} 
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-[0.2em]">
                      Preço (R$)
                    </label>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-[24px] p-5 font-black text-[#AB38F7] placeholder-[#AB38F7]/30 outline-none focus:border-[#AB38F7] transition-colors" 
                      value={newProd.salePrice || ''} 
                      onChange={e => setNewProd({...newProd, salePrice: Number(e.target.value)})} 
                    />
                  </div>
                </div>

                {/* Botão Salvar */}
                <div className="pt-4">
                  <button 
                    onClick={handleAdd} 
                    className="w-full bg-[#AB38F7] text-white font-black text-sm uppercase tracking-widest p-5 rounded-full shadow-[0_0_20px_rgba(171,56,247,0.3)] mt-4 active:scale-95 hover:bg-[#9625df] transition-all"
                  >
                    Salvar Produto
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}