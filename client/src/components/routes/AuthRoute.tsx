import { lazy } from "react";
import { sleep } from "@/utils/sleep";
import background from "@/assets/background.jpeg";
import { useUserStore } from "@/stores/user.store";
import LogoComponent from "../shared/LogoComponent";
import { Outlet, Navigate, useLocation, matchPath } from "react-router-dom";

import type { LazyPage } from "./LazyRoute";

const existPaths = ["/login", "/register", "/forgot-password"];

export const authLazyPages: LazyPage[] = [
    {
        path: "login",
        component: lazy(async () => sleep().then(() => import("@/pages/auth/Login"))),
    },
    {
        path: "register",
        component: lazy(async () => sleep().then(() => import("@/pages/auth/Register"))),
    },
    {
        path: "forgot-password",
        component: lazy(async () => sleep().then(() => import("@/pages/auth/ForgotPassword"))),
    },
];

export default function AuthRoute() {
    const basePath = "/auth";
    const user = useUserStore((state) => state.user);
    const location = useLocation();

    const isValidPath = existPaths.some((path) =>
        matchPath(
            {
                path: `${basePath}${path}`,
                end: true,
            },
            location.pathname
        )
    );

    if (!user)
        return (
            <div className="flex min-h-screen">
                <div
                    className="fixed bg-no-repeat bg-cover h-screen w-full -z-10"
                    style={{ backgroundImage: `url(${background})` }}
                />
                <div className="absolute top-8 left-8">
                    <LogoComponent />
                </div>

                {isValidPath ? (
                    <div className="flex-1">
                        {/* <Header /> */}
                        <Outlet />
                    </div>
                ) : (
                    <Outlet />
                )}
            </div>
        );
    else return <Navigate to="/home" />;
}
