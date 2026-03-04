"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const TabacariaContext = createContext<any>(null);

export const TabacariaProvider = ({ children }: { children: React.ReactNode }) => {
  const [partners, setPartners] = useState({ s1: 0, s2: 0, s3: 0, s4: 0, badge: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('badge_db');
    if (data) {
      const parsed = JSON.parse(data);
      setPartners(parsed.partners || { s1: 0, s2: 0, s3: 0, s4: 0, badge: 0 });
      setProducts(parsed.products || []);
      setSales(parsed.sales || []);
    }
  }, []);

  const saveData = (p: any, prod: any, s: any) => {
    localStorage.setItem('badge_db', JSON.stringify({ partners: p, products: prod, sales: s }));
  };

  const addProduct = (product: any) => {
    const updated = [...products, { ...product, id: Date.now() }];
    setProducts(updated);
    saveData(partners, updated, sales);
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    saveData(partners, updated, sales);
  };

  const updateProduct = (id: number, updatedProduct: any) => {
    const updated = products.map(p => p.id === id ? { ...updatedProduct, id } : p);
    setProducts(updated);
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
      productName: product.name,
      total: salePrice,
      discount: useBadgeDiscount,
      date: new Date().toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })
    }, ...sales];

    setPartners(newPartners);
    setProducts(newProducts);
    setSales(newSales);
    saveData(newPartners, newProducts, newSales);
    return true;
  };

  return (
    <TabacariaContext.Provider value={{ partners, products, sales, addProduct, deleteProduct, updateProduct, registerSale }}>
      {children}
    </TabacariaContext.Provider>
  );
};

export const useTabacaria = () => useContext(TabacariaContext);