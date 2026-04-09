import { create } from 'zustand';
import { persist, StateStorage, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv'; 


const storage = createMMKV({ id: 'finance-manager-storage' });

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
  type: TransactionType;
}

interface AppState {
  isDarkMode: boolean;
  transactions: Transaction[];
  userName: string | null;
  toggleTheme: () => void;
  addTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  setUserName: (name: string) => void;
  setTheme: (isDark: boolean) => void;
  logout: () => void;
}

export const useStore = create<AppState>()(
  persist(
    set => ({
      isDarkMode: true,
      transactions: [],
      userName: null,

      toggleTheme: () => set(state => ({ isDarkMode: !state.isDarkMode })),

      setTheme: isDark => set({ isDarkMode: isDark }),

      addTransaction: transaction =>
        set(state => ({
          transactions: [transaction, ...state.transactions],
        })),

      deleteTransaction: id =>
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id),
        })),
      setUserName: name => set({ userName: name }),

      logout: () => set({ userName: null, transactions: [] }),
    }),
    {
      name: 'finance-manager-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
