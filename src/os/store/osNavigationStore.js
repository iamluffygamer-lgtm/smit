import { create } from "zustand";

let resizeTimer = null;
let autoModeListenerAttached = false;


export const useOsNavigationStore = create((set, get) => ({

    mode: "desktop", // "desktop" | "mobile"


    mobileStack: [],

    openMobileApp(appId, props = {}) {
        if (get().mode !== "mobile") return;

        set((state) => ({
            mobileStack: [
                ...state.mobileStack,
                {
                    instanceId: `mobile-${Date.now()}-${Math.random()
                        .toString(36)
                        .slice(2)}`,
                    appId,
                    props,
                },
            ],
        }));
    },

    closeMobileApp() {
        if (get().mode !== "mobile") return;

        set((state) => ({
            mobileStack: state.mobileStack.slice(0, -1),
        }));
    },

    goHome() {
        set({ mobileStack: [] });
    },

    /* -------------------------------------------
       Mode Switching
    ------------------------------------------- */
    setMode(nextMode) {
        const current = get().mode;
        if (current === nextMode) return;

        if (nextMode === "desktop") {
            // IMPORTANT: clear mobile-only state
            set({
                mode: "desktop",
                mobileStack: [],
            });
        } else {
            set({ mode: "mobile" });
        }
    },

    /* -------------------------------------------
       Auto Mobile Detection
    ------------------------------------------- */
    initAutoMode() {
        if (autoModeListenerAttached) return;
        autoModeListenerAttached = true;

        const detectMode = () => {
            const width = window.innerWidth;
            const isTouch =
                "ontouchstart" in window || navigator.maxTouchPoints > 0;
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            const shouldBeMobile = width <= 768 || isTouch;

            const currentMode = get().mode;

            if (shouldBeMobile && currentMode !== "mobile") {
                get().setMode("mobile");
            }

            if (!shouldBeMobile && currentMode !== "desktop") {
                get().setMode("desktop");
            }
        };

        const onResize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(detectMode, 200);
        };

        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", detectMode);

        detectMode();
    },
}));
