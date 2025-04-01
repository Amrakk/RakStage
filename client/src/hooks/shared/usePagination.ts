import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PaginationLimitOptions } from "@/constants";

export default function usePagination() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page") ?? "1");
    const limitPage = parseInt(searchParams.get("limit") ?? "10");

    const changePage = useCallback(
        (page?: number, limit?: number) => {
            setSearchParams((params) => {
                if (page) params.set("page", page.toString());
                else params.delete("page");

                if (limit) params.set("limit", limit.toString());
                else params.delete("limit");

                return params;
            });
        },
        [setSearchParams]
    );

    useEffect(() => {
        if (!PaginationLimitOptions.some((value) => value.name === limitPage.toString())) {
            changePage(1, 10);
        }
    }, [limitPage, changePage]);

    useEffect(() => {
        changePage(1, limitPage);
    }, [limitPage]);

    return { currentPage, limitPage, changePage };
}
