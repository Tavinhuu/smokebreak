import { useState, useEffect } from 'react';

export const useTabacaria = () => {
  const [partners, setPartners] = useState({ s1: 0, s2: 0, s3: 0, s4: 0, badge: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('badge_db');
    if (data) {
      const parsed = JSON.parse(data);
      setPartners(parsed.partners);
      setProducts(parsed.products);
      setSales(parsed.sales);
    }
  }, []);

  const saveData = (newPartners: any, newProducts: any, newSales: any) => {
    localStorage.setItem('badge_db', JSON.stringify({ partners: newPartners, products: newProducts, sales: newSales }));
  };

  const addProduct = (product: any) => {
    const updated = [...products, { ...product, id: Date.now() }];
    setProducts(updated);
    saveData(partners, updated, sales);
  };

  const deleteProduct = (id: number) => {
    if (confirm("Deseja remover este produto?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      saveData(partners, updated, sales);
    }
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
    let valorBadgeDaVenda = 0;
    let valorParaSocios = salePrice;

    if (useBadgeDiscount) {
      valorBadgeDaVenda = salePrice * 0.20;
      valorParaSocios = salePrice * 0.80;
    }

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
      date: new Date().toLocaleString()
    }, ...sales];

    setPartners(newPartners);
    setProducts(newProducts);
    setSales(newSales);
    saveData(newPartners, newProducts, newSales);
  };

  return { 
    partners, products, sales, 
    addProduct, registerSale, deleteProduct, updateProduct 
  };
};