"use client"

import { Activity, useEffect, useState } from "react";
import api from "./api";
import toast from "react-hot-toast";
import { ActivityIcon, ArrowDownCircle, ArrowUpCircle, Trash, TrendingDown, TrendingUp, Wallet } from "lucide-react";

type Transaction = {
  id: string;
  text: string;
  amount: number;
  created_at: string;
}

export default function Home() {
  const [transaction, setTransactions] = useState<Transaction[]>([])
  const getTransactions = async () => {
    try{
      const res = await api.get<Transaction[]>("transactions/")
      setTransactions(res.data)
      toast.success("Transactions chargées")

    } catch (error: any) {
  if (error.response) {
    // Le serveur a répondu avec un code statut hors de la plage 2xx
    console.log("Données d'erreur du backend :", error.response.data);
    console.log("Statut HTTP :", error.response.status);
  } else if (error.request) {
    // La requête a été envoyée mais aucune réponse n'a été reçue (CORS ou serveur éteint)
    console.log("Aucune réponse du serveur :", error.request);
  } else {
    // Erreur lors de la configuration de la requête
    console.log("Erreur de configuration :", error.message);
  }
  toast.error("Erreur de chargement des transactions");
}
    
    
  }

  const deleteTransaction = async (id: string) => {
    try{
      await api.delete(`transactions/${id}`)
      getTransactions()
      toast.success("Transactions supprimé avec success")

    } catch (error: any) {
  if (error.response) {
    // Le serveur a répondu avec un code statut hors de la plage 2xx
    console.log("Données d'erreur du backend :", error.response.data);
    console.log("Statut HTTP :", error.response.status);
  } else if (error.request) {
    // La requête a été envoyée mais aucune réponse n'a été reçue (CORS ou serveur éteint)
    console.log("Aucune réponse du serveur :", error.request);
  } else {
    // Erreur lors de la configuration de la requête
    console.log("Erreur de configuration :", error.message);
  }
  toast.error("Erreur suppression transaction");
}

  useEffect(() => {
      getTransactions()
    }, []);

  
  const amounts = transaction.map((t) => Number(t.amount) || 0)
  const balance = amounts.reduce((acc, item) => acc + item, 0) || 0
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0) || 0
  const expense = amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) || 0
  const ratio = income > 0 ? Math.min((Math.abs(expense) / income) * 100, 100) : 0

  const formatDate = (dateString: string) => {
    const d= new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="w-2/3 flex flex-col gap-4">
      <div className="flex justify-between rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex flex-col gap-1">
          <div className="badge badge-soft">
            <Wallet className="w-4 h-4"/>
            Votre solde

          </div>
          <div className="stat-value">
            {balance.toFixed(2)} e
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-success">
            <ArrowUpCircle className="w-4 h-4"/>
            Revenus

          </div>
          <div className="stat-value">
            {income.toFixed(2)} e
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="badge badge-soft badge-error">
            <ArrowDownCircle className="w-4 h-4"/>
            Dépenses

          </div>
          <div className="stat-value">
            {expense.toFixed(2)} e
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5 p-5">
        <div className="flex justify-between items-center mb-1">
          
            <div className="badge badge-soft badge-warning gap-1">
              <ActivityIcon className="w-4 h-4" />
              Dépenses vs Revenus
            </div>
            <div> {ratio.toFixed(0)}%</div>
        
        </div>
        <progress className="progress progress-warning w-full" value={ratio} max={100}>

        </progress>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-warning/10 border-dashed bg-warning/5">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        <th>#</th>
        <th>Description</th>
        <th>Montant</th>
        <th>Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      
      {transaction.map((t, index) => (
        <tr
          key={t.id}
        >
        <th>{index + 1}</th>
        <td>{t.text}</td>
        <td className="font-semibold flex items-center gap-2">
          {t.amount > 0 ? (
            <TrendingUp className="text-success w-6 h-6"/>
          ) : (
            <TrendingDown className="text-success w-6 h-6"/>
          )}

          {t.amount > 0 ? `+${t.amount}` : `-${t.amount}`}
        </td>
        <td>
          {formatDate(t.created_at)}
        </td>
        <td>
          <button 
            onClick={() => deleteTransaction(t.id) } 
            className="btn btn-sm btn-error btn-soft" 
            title="supprimer"
          >
            <Trash className="w-4 h-4"/>
          </button>
        </td>
      </tr>
      ))}
      
    </tbody>
  </table>
</div>
    </div>
  );

}
}
