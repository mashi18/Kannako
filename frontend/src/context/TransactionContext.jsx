import { createContext, useContext, useState, useCallback } from 'react';
import { transactions as txnApi, ledger as ledgerApi } from '../utils/api';
import { getOfflineTransactions, addOfflineTransaction } from '../utils/sync';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await txnApi.list(params);
      setTransactions(data.transactions);
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLedgers = useCallback(async (search = '') => {
    try {
      const data = await ledgerApi.list(search);
      setLedgers(data.ledgers);
      return data.ledgers;
    } catch {
      return [];
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await txnApi.stats();
      setStats(data);
      return data;
    } catch {
      return null;
    }
  }, []);

  const addTransaction = async (txnData) => {
    try {
      const data = await txnApi.create(txnData);
      setTransactions(prev => [data.transaction, ...prev]);
      return data;
    } catch {
      addOfflineTransaction(txnData);
      return { offline: true };
    }
  };

  const createLedger = async (name, phone = '') => {
    const data = await ledgerApi.create({ name, phone });
    setLedgers(prev => [data.ledger, ...prev]);
    return data.ledger;
  };

  const pendingSync = getOfflineTransactions().length;

  return (
    <TransactionContext.Provider value={{
      transactions, ledgers, stats, loading, pendingSync,
      fetchTransactions, fetchLedgers, fetchStats,
      addTransaction, createLedger, setLedgers,
    }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
}
