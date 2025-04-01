import { sleep } from "@/utils/sleep";
import { lazy, useEffect } from "react";
import Header from "@/layouts/user/Header";
import { useAuthActions } from "@/hooks/auth/useAuth";
import background from "@/assets/background.jpeg";
import { useUserStore } from "@/stores/user.store";
import { Outlet, Navigate, useLocation, matchPath } from "react-router-dom";

import type { LazyPage } from "./LazyRoute";

const existPaths = ["/home", "/profile", "/qr/scan", "/qr/:fingerprint"];

export const userLazyPages: LazyPage[] = [
    {
        path: "home",
        component: lazy(async () => sleep().then(() => import("@/pages/user/Home"))),
    },
    {
        path: "profile",
        component: lazy(async () => sleep().then(() => import("@/pages/user/Profile"))),
    },
    {
        path: "qr/scan",
        component: lazy(async () => sleep().then(() => import("@/pages/user/QRScan"))),
    },
    {
        path: "qr/:fingerprint",
        component: lazy(async () => sleep().then(() => import("@/pages/user/QRAction"))),
    },
];

export default function UserRoute() {
    const basePath = "/";
    const location = useLocation();
    const { verifyAction } = useAuthActions();
    const user = useUserStore((state) => state.user);

    useEffect(() => {
        try {
            verifyAction.mutate();
        } catch (e) {}
    }, []);

    const isValidPath = existPaths.some((path) =>
        matchPath(
            {
                path: `${basePath}${path}`,
                end: true,
            },
            location.pathname
        )
    );
    const isScan = location.pathname.includes("/qr/scan");
    if (user)
        return (
            <div className="flex min-h-screen">
                <div
                    className="fixed bg-no-repeat bg-cover bg-center h-screen w-full -z-10"
                    style={{ backgroundImage: `url(${background})` }}
                />
                {isValidPath ? (
                    <div className={isScan ? "relative flex flex-1" : "flex flex-col flex-1"}>
                        {isScan ? (
                            <>
                                <div className="absolute w-full">
                                    <Header />
                                </div>
                                <div className="size-full flex-1 flex">
                                    <Outlet />
                                </div>
                            </>
                        ) : (
                            <>
                                <Header />
                                <Outlet />
                            </>
                        )}
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        );
    else return <Navigate to="/auth/login" />;
}
