"use client"

import { useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

export default function Home() {
  const [transaction, setTransaction] = useState<Transaction[]>([])
  const getTransactions = async () => {
    try{
      const rest = await api.get<Transaction[]>("transactions/")
      setTransaction(rest.data)
      toast.success("Transactions chargées")

    }catch(error){
      console.log('Erreur chargement transactions', error);
      toast.error("Erreur de chargement des transactions")

    }
    
    
  }

  useEffect(() => {
      getTransactions()
    }, []);
  return (
    <button className="btn btn-sm">
      test
    </button>
  );

}
