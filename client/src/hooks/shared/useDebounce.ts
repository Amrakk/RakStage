import debounce from "lodash/debounce";
import { useRef, useEffect, useCallback } from "react";

export function useDebounce(cb: Function, delay: number) {
    const options = { leading: true, trailing: true };
    const cbRef = useRef(cb);

    useEffect(() => {
        cbRef.current = cb;
    });

    return useCallback(
        debounce((...args) => cbRef.current(...args), delay, options),
        [delay]
    );
}
