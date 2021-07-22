"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntercom = void 0;
const vue_1 = require("vue");
const intercomSetup = (settings) => {
    const installed = vue_1.ref(false);
    const ready = vue_1.ref(false);
    const visible = vue_1.ref(false);
    const unreadCount = vue_1.ref(0);
    const loadScript = () => {
        const script = document.createElement("script");
        script.async = true;
        if (settings && settings.app_id) {
            script.src = `https://widget.intercom.io/widget/${settings.app_id}`;
            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript.parentNode)
                firstScript.parentNode.insertBefore(script, firstScript);
            else
                throw new Error("Could not add Intercom source code to page");
            script.onload = () => init();
        }
        else {
            throw new Error("Missing Intercom app_id");
        }
    };
    const init = () => {
        callIntercom("onHide", () => (visible.value = false));
        callIntercom("onShow", () => (visible.value = true));
        callIntercom("onUnreadCountChange", (newUnreadCount) => (unreadCount.value = newUnreadCount));
        window.intercomSettings = { ...settings };
        ready.value = true;
    };
    const callIntercom = (...args) => {
        window.Intercom(...args);
    };
    const isReady = () => {
        return new Promise((resolve, _reject) => {
            if (ready.value) {
                resolve(true);
            }
            else {
                setTimeout(async () => {
                    if (ready.value) {
                        resolve(true);
                    }
                    else {
                        await isReady();
                        resolve(true);
                    }
                }, 100);
            }
        });
    };
    const boot = async (options) => {
        await isReady();
        if (!options?.app_id) {
            options.app_id = settings.app_id;
        }
        callIntercom("boot", options);
    };
    const shutdown = async () => {
        await isReady();
        callIntercom("shutdown");
    };
    const update = async (options) => {
        //TODO is this correct? we were using deconstruct, but I think that was wrong. Needs testing
        await isReady();
        callIntercom("update", options);
    };
    const show = async () => {
        await isReady();
        callIntercom("show");
    };
    const onShow = async (callback) => {
        await isReady();
        callIntercom("onShow", callback);
    };
    const hide = async () => {
        await isReady();
        callIntercom("hide");
    };
    const onHide = async (callback) => {
        await isReady();
        callIntercom("onHide", callback);
    };
    const showMessages = async () => {
        await isReady();
        callIntercom("showMessages");
    };
    const showNewMessage = async (content) => {
        await isReady();
        callIntercom("showNewMessage", typeof content === "string" ? content : "");
    };
    const trackEvent = async (name, ...metadata) => {
        await isReady();
        callIntercom("trackEvent", ...[name, ...metadata]);
    };
    const getVisitorId = async () => {
        await isReady();
        callIntercom("getVisitorId");
    };
    const startTour = async (tourId) => {
        await isReady();
        callIntercom("startTour", tourId);
    };
    return {
        installed,
        ready,
        visible,
        unreadCount,
        loadScript,
        init,
        callIntercom,
        isReady,
        boot,
        shutdown,
        update,
        show,
        onShow,
        hide,
        onHide,
        showMessages,
        showNewMessage,
        trackEvent,
        getVisitorId,
        startTour,
    };
};
const intercomSymbol = Symbol("Intercom");
const useIntercom = () => {
    return vue_1.inject(intercomSymbol);
};
exports.useIntercom = useIntercom;
const intercomPlugin = {
    install: (app, settings) => {
        const intercom = intercomSetup(settings);
        vue_1.provide(intercomSymbol, intercom);
        app.config.globalProperties.$intercom = intercom;
        app.mixin({
            created() {
                if (!intercom.installed.value) {
                    const loaded = () => intercom.loadScript();
                    if (document.readyState === "complete") {
                        loaded();
                    }
                    // @ts-ignore
                    else if (window.attachEvent) {
                        // @ts-ignore
                        window.attachEvent("onload", loaded);
                    }
                    else {
                        window.addEventListener("load", loaded, false);
                    }
                    intercom.installed.value = true;
                }
            },
        });
    },
};
exports.default = intercomPlugin;
