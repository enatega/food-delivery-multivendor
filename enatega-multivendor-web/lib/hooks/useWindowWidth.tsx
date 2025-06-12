import { useState, useEffect } from "react";

export const useWindowWidth = (): number => {
    const [width, setWidth] = useState<number>(0);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        handleResize(); // initial call
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return width;
};
