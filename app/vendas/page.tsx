"use client";

import { useState } from 'react';
import { useTabacaria } from '@/context/TabacariaContext';
import { 
  ShoppingCart, 
  History, 
  Plus, 
  X, 
  CheckCircle2, 
  ArrowUpRight,
  Hexagon,
  ChevronDown,
  Trash2
} from 'lucide-react';

export default function Vendas() {
  const { products, sales, registerSale, deleteSale } = useTabacaria();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [useBadge, setUseBadge] = useState(false);
  const [success, setSuccess] = useState(false);

  // Calcula o total vendido hoje (estatística rápida)
  const totalVendidoHoje = sales.reduce((acc: number, curr: any) => acc + curr.total, 0);

  const handleFinalize = () => {
    if (!selectedId) return alert("Selecione um produto");
    
    const isSuccess = registerSale(Number(selectedId), useBadge);
    
    if (isSuccess) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setShowModal(false);
        setSelectedId("");
        setUseBadge(false);
      }, 1500);
    }
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
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className="font-mono text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
              Movimentação
            </p>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
              VENDAS
            </h1>
          </div>
          
          <div className="bg-[#111]/50 border border-white/5 backdrop-blur-md rounded-[24px] p-5 min-w-[200px] text-left md:text-right">
            <p className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">
              Total Geral
            </p>
            <p className="text-3xl font-black text-[#AB38F7] leading-none tracking-tighter">
              R$ {totalVendidoHoje.toFixed(2)}
            </p>
          </div>
        </header>

        {/* BOTÃO NOVA VENDA */}
        <button 
          onClick={() => setShowModal(true)}
          className="w-full bg-[#AB38F7] text-white p-5 rounded-full shadow-[0_0_20px_rgba(171,56,247,0.3)] flex items-center justify-center gap-3 font-bold active:scale-95 transition-all hover:bg-[#9625df] mb-12 uppercase tracking-widest text-sm"
        >
          <Plus size={20} />
          Nova Venda
        </button>

        {/* LISTA DE HISTÓRICO */}
        <div className="flex items-center gap-3 mb-6">
          <History size={18} className="text-[#AB38F7]" />
          <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            Últimas Atividades
          </h3>
        </div>

        <div className="space-y-4">
          {sales.length === 0 && (
            <div className="text-center py-16 bg-[#0A0A0A] rounded-[24px] border border-white/5">
              <div className="w-12 h-12 bg-[#111] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                 <ShoppingCart className="w-5 h-5 text-gray-600" />
              </div>
              <p className="text-gray-500 font-medium text-sm">Nenhuma venda registrada hoje.</p>
            </div>
          )}
          
          {sales.map((s: any) => (
            <div key={s.id} className="bg-[#111] p-5 rounded-[24px] border border-white/5 hover:border-[#AB38F7]/50 transition-all flex justify-between items-center group">
              <div className="flex gap-4 items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/10 shrink-0 ${s.discount ? 'text-[#AB38F7] shadow-[0_0_15px_rgba(171,56,247,0.15)] bg-[#AB38F7]/10' : 'text-gray-400 bg-white/5'}`}>
                  {s.discount ? <Hexagon size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">{s.productName}</h4>
                  <p className="font-mono text-[10px] font-bold text-gray-500 mt-1">{s.date}</p>
                </div>
              </div>
              
              {/* 3. Agrupe o preço e o novo botão de deletar em uma div flex */}
              <div className="flex items-center gap-5">
                <div className="text-right flex flex-col items-end gap-1.5">
                  <p className="font-black text-white text-lg tracking-tight">R$ {s.total.toFixed(2)}</p>
                  {s.discount && (
                    <span className="bg-[#AB38F7]/20 text-[#AB38F7] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-[0.1em]">
                      Badge
                    </span>
                  )}
                </div>

                {/* BOTÃO DE DELETAR */}
                <button 
                  onClick={() => deleteSale(s.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-2 opacity-30 hover:opacity-100"
                  title="Remover Venda"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL DE VENDA (DRAWER) */}
        {showModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-end animate-in fade-in duration-300">
            <div className="bg-[#111] w-full max-w-[800px] mx-auto rounded-t-[32px] border-t border-x border-white/10 p-6 md:p-10 pb-12 animate-in slide-in-from-bottom-8 duration-500 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
              
              {success ? (
                <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-[#AB38F7]/20 rounded-full flex items-center justify-center text-[#AB38F7] mb-6 shadow-[0_0_30px_rgba(171,56,247,0.3)]">
                    <CheckCircle2 size={40} />
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Venda Realizada!</h2>
                  <p className="text-gray-400 font-medium">Estoque e lucros atualizados.</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black uppercase text-white tracking-tighter">Finalizar Venda</h2>
                    <button onClick={() => setShowModal(false)} className="bg-white/5 border border-white/10 p-3 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                      <X size={20}/>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Seleção de Produto */}
                    <div className="space-y-3 relative">
                      <label className="font-mono text-[10px] font-bold uppercase ml-2 text-gray-500 tracking-[0.2em]">Selecione o Item</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-[#0A0A0A] border border-white/10 rounded-[24px] p-5 font-bold text-white appearance-none outline-none focus:border-[#AB38F7] transition-colors"
                          value={selectedId}
                          onChange={e => setSelectedId(e.target.value)}
                        >
                          <option value="" className="text-gray-500">Buscar no estoque...</option>
                          {products.map((p: any) => (
                            <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                              {p.name} ({p.stock} un) - R$ {p.salePrice.toFixed(2)}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-5 h-5" />
                      </div>
                    </div>

                    {/* Toggle Desconto Badge */}
                    <div 
                      onClick={() => setUseBadge(!useBadge)}
                      className={`p-5 rounded-[24px] border transition-all flex items-center justify-between cursor-pointer group ${useBadge ? 'border-[#AB38F7] bg-[#AB38F7]/5' : 'border-white/5 bg-[#0A0A0A] hover:border-white/20'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${useBadge ? 'bg-[#AB38F7] text-white shadow-[0_0_15px_rgba(171,56,247,0.3)]' : 'bg-white/5 text-gray-500 border border-white/10 group-hover:text-gray-300'}`}>
                          <Hexagon size={20} />
                        </div>
                        <div>
                          <p className={`font-bold text-sm tracking-wide uppercase ${useBadge ? 'text-[#AB38F7]' : 'text-gray-300'}`}>Desconto Badge</p>
                          <p className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-[0.1em] mt-1">Sócio Especial (20%)</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${useBadge ? 'border-[#AB38F7] bg-[#AB38F7]' : 'border-gray-600'}`}>
                        {useBadge && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>

                    {/* Botão Finalizar */}
                    <div className="pt-6">
                      <button 
                        onClick={handleFinalize}
                        disabled={!selectedId}
                        className={`w-full p-5 rounded-full font-black text-sm uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-3 
                          ${!selectedId 
                            ? 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-gray-200 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                          }`}
                      >
                        <ShoppingCart size={20} />
                        Concluir R$ {selectedId ? (products.find((p:any) => p.id === Number(selectedId))?.salePrice * (useBadge ? 0.8 : 1)).toFixed(2) : "0,00"}
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}