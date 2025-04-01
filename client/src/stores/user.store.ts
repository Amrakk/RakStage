import { create } from "zustand";
import { UserDetail } from "@/models/user";
import { persist } from "zustand/middleware";

interface UserStore {
    lastUserId?: string;
    setLastUserId: (id?: string) => void;
    user?: UserDetail;
    setUser: (user?: UserDetail) => void;
}

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            user: undefined,
            setUser: (user?: UserDetail) => set({ user }),
            lastUserId: undefined,
            setLastUserId: (id?: string) => set({ lastUserId: id }),
        }),
        { name: "user" }
    )
);
