import { useState } from "react";

export function ToogleDarkMode() {
    const [theme, setTheme] = useState("light");
    if (theme === "light") {
        setTheme("dark");
    } else {
        setTheme("light");
    }
}