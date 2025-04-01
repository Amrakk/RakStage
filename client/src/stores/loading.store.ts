import { create } from "zustand";

interface LoadingStore {
    isLoading?: boolean;
    setLoading: (state: boolean) => void;
}

export const useLoadingStore = create<LoadingStore>()((set) => ({
    isLoading: false,
    setLoading: (state: boolean) => set({ isLoading: state }),
}));
