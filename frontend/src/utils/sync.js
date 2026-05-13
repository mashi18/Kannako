const STORAGE_KEY = 'kanakko_offline_txns';

export function getOfflineTransactions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addOfflineTransaction(txn) {
  const txns = getOfflineTransactions();
  txns.push({ ...txn, _offlineId: Date.now().toString(), createdAt: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(txns));
}

export function clearOfflineTransactions() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPendingSyncCount() {
  return getOfflineTransactions().length;
}
