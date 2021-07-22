import { App, ref } from "vue";

type messengerAttributes = {
  app_id?: string;
  custom_launcher_selector?: string;
  alignment?: string;
  vertical_padding?: number;
  horizontal_padding?: number;
  hide_default_launcher?: boolean;
  session_duration?: number;
  action_color?: string;
  background_color?: string;

  email?: string;
  user_id?: string;
  created_at?: number;
  name?: string;
  phone?: string;
  last_request_at?: number;
  unsubscribed_from_emails?: boolean;
  language_override?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_term?: string;
  avatar?: {
    type?: string;
    image_url?: string;
  };
  user_hash?: string;
  company?: company;
  companies?: company[];
  [key: string]: any;
};

type company = {
  type?: string;
  id?: string;
  created_at?: number;
  remote_created_at?: number;
  updated_at?: number;
  last_request_at?: number;
  company_id?: string;
  name?: string;
  custom_attributes?: object;
  session_count?: number;
  monthly_spend?: number;
  user_count?: number;
  plan?: {
    type?: string;
    id?: string;
    name?: string;
  };
  size?: number;
  website?: string;
  industry?: string;
};

declare global {
  interface Window {
    intercomSettings: any;
    Intercom: any;
  }
}

const intercomSetup = (settings: messengerAttributes) => {
  const installed = ref(false);
  const ready = ref(false);
  const visible = ref(false);
  const unreadCount = ref(0);

  const loadScript = () => {
    const script = document.createElement("script");
    script.async = true;
    if (settings && settings.app_id) {
      script.src = `https://widget.intercom.io/widget/${settings.app_id}`;
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript.parentNode) firstScript.parentNode.insertBefore(script, firstScript);
      else throw new Error("Could not add Intercom source code to page");
      script.onload = () => init();
    } else {
      throw new Error("Missing Intercom app_id");
    }
  };

  const init = () => {
    callIntercom("onHide", () => (visible.value = false));
    callIntercom("onShow", () => (visible.value = true));
    callIntercom("onUnreadCountChange", (newUnreadCount: number) => (unreadCount.value = newUnreadCount));
    window.intercomSettings = { ...settings };
    ready.value = true;
  };

  const callIntercom = (...args: any[]) => {
    window.Intercom(...args);
  };

  const isReady = () => {
    return new Promise((resolve, _reject) => {
      if (ready.value) {
        resolve(true);
      } else {
        setTimeout(async () => {
          if (ready.value) {
            resolve(true);
          } else {
            await isReady();
            resolve(true);
          }
        }, 100);
      }
    });
  };

  const boot = async (options: messengerAttributes) => {
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

  const update = async (options: messengerAttributes) => {
    //TODO is this correct? we were using deconstruct, but I think that was wrong. Needs testing
    await isReady();
    callIntercom("update", options);
  };

  const show = async () => {
    await isReady();
    callIntercom("show");
  };

  const onShow = async (callback: () => void) => {
    await isReady();
    callIntercom("onShow", callback);
  };

  const hide = async () => {
    await isReady();
    callIntercom("hide");
  };

  const onHide = async (callback: () => void) => {
    await isReady();
    callIntercom("onHide", callback);
  };

  const showMessages = async () => {
    await isReady();
    callIntercom("showMessages");
  };

  const showNewMessage = async (content: string) => {
    await isReady();
    callIntercom("showNewMessage", typeof content === "string" ? content : "");
  };

  const trackEvent = async (name: string, ...metadata: any[]) => {
    await isReady();
    callIntercom("trackEvent", ...[name, ...metadata]);
  };

  const getVisitorId = async () => {
    await isReady();
    callIntercom("getVisitorId");
  };

  const startTour = async (tourId: number) => {
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

// @ts-ignore
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $intercom: ReturnType<typeof intercomSetup>;
  }
}

const intercomPlugin = {
  install: (app: App, settings: messengerAttributes) => {
    const intercom = intercomSetup(settings);

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
          } else {
            window.addEventListener("load", loaded, false);
          }
          intercom.installed.value = true;
        }
      },
    });
  },
};

export default intercomPlugin;
