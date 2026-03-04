"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// ⚠️ COLE AQUI AS SUAS CREDENCIAIS DO FIREBASE:
const firebaseConfig = {

  apiKey: "AIzaSyCgKYpraJ8ToQ4YIN8Xjzvh7hsDW5Qd4dM",

  authDomain: "smole-6b668.firebaseapp.com",

  projectId: "smole-6b668",

  storageBucket: "smole-6b668.firebasestorage.app",

  messagingSenderId: "102845676519",

  appId: "1:102845676519:web:8267f3c11a869edca41b42",

  measurementId: "G-7Y5EF0M38R"

};



// Inicializa a conexão com o banco
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TabacariaContext = createContext<any>(null);

export const TabacariaProvider = ({ children }: { children: React.ReactNode }) => {
  const [partners, setPartners] = useState({ s1: 0, s2: 0, s3: 0, s4: 0, badge: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [isDbLoaded, setIsDbLoaded] = useState(false);

  useEffect(() => {
    // onSnapshot faz a mágica do TEMPO REAL. 
    // Sempre que o banco mudar na nuvem, os estados do app atualizam sozinhos.
    const unsubscribe = onSnapshot(doc(db, "smokebreak", "dados_gerais"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setPartners(data.partners || { s1: 0, s2: 0, s3: 0, s4: 0, badge: 0 });
        setProducts(data.products || []);
        setSales(data.sales || []);
      }
      setIsDbLoaded(true);
    });

    return () => unsubscribe();
  }, []);

  const saveData = async (newPartners: any, newProducts: any, newSales: any) => {
    // Atualiza a interface instantaneamente pro app não parecer lento
    setPartners(newPartners);
    setProducts(newProducts);
    setSales(newSales);
    
    // Salva a nova informação na nuvem
    try {
      await setDoc(doc(db, "smokebreak", "dados_gerais"), {
        partners: newPartners,
        products: newProducts,
        sales: newSales
      });
    } catch (error) {
      console.error("Erro ao salvar no banco:", error);
      alert("Erro de conexão. Ação não foi salva na nuvem.");
    }
  };

  const addProduct = (product: any) => {
    const updated = [...products, { ...product, id: Date.now() }];
    saveData(partners, updated, sales);
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    saveData(partners, updated, sales);
  };

  const updateProduct = (id: number, updatedProduct: any) => {
    const updated = products.map(p => p.id === id ? { ...updatedProduct, id } : p);
    saveData(partners, updated, sales);
  };

  const registerSale = (productId: number, useBadgeDiscount: boolean) => {
    const productIndex = products.findIndex(p => p.id === productId);
    const product = products[productIndex];
    if (!product || product.stock <= 0) return alert("Estoque insuficiente!");

    const salePrice = product.salePrice;
    const valorBadgeDaVenda = useBadgeDiscount ? salePrice * 0.20 : 0;
    const valorParaSocios = useBadgeDiscount ? salePrice * 0.80 : salePrice;
    const sharePerPartner = valorParaSocios / 4;

    const newPartners = {
      s1: partners.s1 + sharePerPartner,
      s2: partners.s2 + sharePerPartner,
      s3: partners.s3 + sharePerPartner,
      s4: partners.s4 + sharePerPartner,
      badge: partners.badge + valorBadgeDaVenda
    };

    const newProducts = [...products];
    newProducts[productIndex].stock -= 1;

    const newSales = [{
      id: Date.now(),
      productId: product.id, 
      productName: product.name,
      total: salePrice,
      discount: useBadgeDiscount,
      date: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    }, ...sales];

    saveData(newPartners, newProducts, newSales);
    return true;
  };

  const deleteSale = (saleId: number) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    if (!confirm("Tem certeza que deseja remover esta venda? O estoque e o caixa serão revertidos para todos os sócios.")) return;

    const salePrice = sale.total;
    const useBadgeDiscount = sale.discount;
    const valorBadgeDaVenda = useBadgeDiscount ? salePrice * 0.20 : 0;
    const valorParaSocios = useBadgeDiscount ? salePrice * 0.80 : salePrice;
    const sharePerPartner = valorParaSocios / 4;

    const newPartners = {
      s1: partners.s1 - sharePerPartner,
      s2: partners.s2 - sharePerPartner,
      s3: partners.s3 - sharePerPartner,
      s4: partners.s4 - sharePerPartner,
      badge: partners.badge - valorBadgeDaVenda
    };

    const newProducts = [...products];
    const productIndex = newProducts.findIndex(p => p.id === sale.productId || p.name === sale.productName);
    
    if (productIndex !== -1) {
      newProducts[productIndex] = {
        ...newProducts[productIndex],
        stock: newProducts[productIndex].stock + 1 
      };
    }

    const newSales = sales.filter(s => s.id !== saleId);

    saveData(newPartners, newProducts, newSales);
  };

  return (
    <TabacariaContext.Provider value={{ 
      partners, products, sales, addProduct, deleteProduct, updateProduct, registerSale, deleteSale, isDbLoaded 
    }}>
      {children}
    </TabacariaContext.Provider>
  );
};

export const useTabacaria = () => useContext(TabacariaContext);