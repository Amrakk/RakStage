import Loading from "../shared/Loading";
import React, { Suspense } from "react";
import { NotFound } from "@/pages/errors/NotFound";
import { Navigate, Route } from "react-router-dom";

export type LazyPage = {
    path: string;
    component: React.LazyExoticComponent<() => React.ReactElement>;
};

type Props = {
    lazyPages: LazyPage[];
};

export default function LazyRoute(props: Props) {
    return (
        <>
            <Route path="" element={<Navigate to="/home" />} />
            {props.lazyPages.map((LazyPage) => (
                <Route
                    key={LazyPage.path}
                    path={LazyPage.path}
                    element={
                        <Suspense fallback={<Loading manual={true} />}>
                            <LazyPage.component />
                        </Suspense>
                    }
                />
            ))}
            <Route path="*" element={<NotFound />} />
        </>
    );
}
