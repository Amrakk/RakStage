import { lazy } from "react";
import { sleep } from "@/utils/sleep";
// import { useUserStore } from "@/stores/user.store";
import { Outlet, Navigate, useLocation, matchPath } from "react-router-dom";

import type { LazyPage } from "./LazyRoute";

const existPaths = ["/dashboard", "/users/:id?"];

export const adminLazyPages: LazyPage[] = [
    {
        path: "dashboard",
        component: lazy(async () => sleep().then(() => import("@/pages/admin/Dashboard"))),
    },
    // {
    //     path: "users",
    //     component: lazy(async () => sleep().then(() => import("@/pages/Admin/Users/Users"))),
    // },
    // {
    //     path: "users/:id",
    //     component: lazy(async () => sleep().then(() => import("@/pages/Admin/Users/Details"))),
    // },
];

export default function AdminRoute() {
    const basePath = "/admin";
    // const user = useUserStore((state) => state.user);
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

    // if (user?.role === USER_ROLE.ADMIN)
    if (true)
        return (
            <>
                {isValidPath ? (
                    <div className="flex bg-gray-100 min-h-screen">
                        <aside className="w-72 bg-black text-white p-6">{/* <Sidebar /> */}</aside>
                        <div className="flex-1">
                            {/* <Header /> */}
                            <Outlet />
                        </div>
                    </div>
                ) : (
                    <Outlet />
                )}
            </>
        );
    else return <Navigate to="/home" />;
}
