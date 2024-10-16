import { createRoot } from "react-dom/client";
import { StrictMode, lazy, Suspense } from "react";

import { getKcContextMock } from "./login/KcPageStory";
import "./main.css";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "register.ftl",
        overrides: {}
    });
}

const KcLoginThemePage = lazy(() => import("./login/KcPage"));

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Suspense>
            {(() => {
                switch (window.kcContext?.themeType) {
                    case "login":
                        return <KcLoginThemePage kcContext={window.kcContext} />;
                }
                return <h1>No Keycloak Context</h1>;
            })()}
        </Suspense>
    </StrictMode>
);
