// frontend/src/services/api.js
import { useEffect, useState } from "react";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL:", API_URL);

export function useApiData() {
  const [projeler, setProjeler] = useState([]);
  const [revizyonlar, setRevizyonlar] = useState([]);
  const [istatistikler, setIstatistikler] = useState({});
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState(null);

  const verileriYukle = async () => {
    try {
      setYukleniyor(true);
      const [p, r, i] = await Promise.all([
        axios.get(`${API_URL}/api/projeler`),
        axios.get(`${API_URL}/api/revizyonlar`),
        axios.get(`${API_URL}/api/istatistikler`)
      ]);
  
      console.log("İstatistik verisi:", i.data); // ✔️ burada olmalı
  
      setProjeler(p.data);
      setRevizyonlar(r.data);
      setIstatistikler(i.data);
    } catch (err) {
      console.error(err);
      setHata(err);
    } finally {
      setYukleniyor(false);
    }
  };
  
 

  useEffect(() => {
    verileriYukle();
  }, []);

  return { projeler, revizyonlar, istatistikler, yukleniyor, hata, verileriYukle };
}
