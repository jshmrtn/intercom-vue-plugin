import { PluginObject } from "vue";

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

type Intercom = {
  visible: boolean;
  ready: boolean;
  installed: boolean;
  unreadCount: number;
  init(): void;
  boot(options: messengerAttributes): void;
  shutdown(): void;
  update(options: messengerAttributes): void;
  show(): void;
  onShow(fn: () => void): void;
  hide(): void;
  onHide(fn: () => void): void;
  showMessages(): void;
  showNewMessage(): void;
  trackEvent(): void;
  getVisitorId(): void;
  startTour(): void;
};

declare global {
  interface Window {
    intercomSettings: any;
    Intercom: any;
  }
}

// @ts-ignore
declare module "vue/types/vue" {
  interface Vue {
    $intercom: Intercom;
  }
  interface VueConstructor {
    $intercom: Intercom;
  }
}

const intercomVuePlugin: PluginObject<messengerAttributes> = {
  install: (Vue, settings) => {
    const intercom = new Vue({
      data() {
        return {
          installed: false,
          ready: false,
          visible: false,
          unreadCount: 0,
        };
      },
      methods: {
        loadScript() {
          const script = document.createElement("script");
          script.async = true;
          if (settings && settings.app_id) {
            script.src = `https://widget.intercom.io/widget/${settings.app_id}`;
            const firstScript = document.getElementsByTagName("script")[0];
            if (firstScript.parentNode)
              firstScript.parentNode.insertBefore(script, firstScript);
            else throw new Error("Could not add Intercom source code to page");
            script.onload = () => this.$intercom.init();
          } else {
            throw new Error("Missing Intercom app_id");
          }
        },
        init() {
          this.callIntercom("onHide", () => (this.$intercom.visible = false));
          this.callIntercom("onShow", () => (this.$intercom.visible = true));
          this.callIntercom(
            "onUnreadCountChange",
            (unreadCount: number) => (this.unreadCount = unreadCount)
          );
          window.intercomSettings = { ...settings };
          this.$intercom.ready = true;
        },
        callIntercom(...args: any[]) {
          window.Intercom(...args);
        },
        isReady() {
          return new Promise((resolve, reject) => {
            if (this.$intercom.ready) {
              resolve(true);
            } else {
              setTimeout(async () => {
                if (this.$intercom.ready) {
                  resolve(true);
                } else {
                  await this.isReady();
                  resolve(true);
                }
              }, 100);
            }
          });
        },
        async boot(options: messengerAttributes) {
          await this.isReady();
          if (!options?.app_id) {
            // @ts-ignore
            options.app_id = settings.app_id;
          }
          this.callIntercom("boot", options);
        },
        async shutdown() {
          await this.isReady();
          this.callIntercom("shutdown");
        },
        async update(options: messengerAttributes) {
          //TODO is this correct? we were using deconstruct, but I think that was wrong. Needs testing
          await this.isReady();
          this.callIntercom("update", options);
        },
        async show() {
          await this.isReady();
          this.callIntercom("show");
        },
        async onShow(callback: () => void) {
          await this.isReady();
          this.callIntercom("onShow", callback);
        },
        async hide() {
          await this.isReady();
          this.callIntercom("hide");
        },
        async onHide(callback: () => void) {
          await this.isReady();
          this.callIntercom("onHide", callback);
        },
        async showMessages() {
          await this.isReady();
          this.callIntercom("showMessages");
        },
        async showNewMessage(content: string) {
          await this.isReady();
          this.callIntercom(
            "showNewMessage",
            typeof content === "string" ? content : ""
          );
        },
        async trackEvent(name: string, ...metadata: any[]) {
          await this.isReady();
          this.callIntercom("trackEvent", ...[name, ...metadata]);
        },
        async getVisitorId() {
          await this.isReady();
          this.callIntercom("getVisitorId");
        },
        async startTour(tourId: number) {
          await this.isReady();
          this.callIntercom("startTour", tourId);
        },
      },
    });

    Object.defineProperty(Vue.prototype, "$intercom", {
      get: () => intercom,
    });

    Vue.mixin({
      created() {
        // @ts-ignore
        if (!this.$intercom.installed) {
          // @ts-ignore
          const loaded = () => this.$intercom.loadScript();
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
          // @ts-ignore
          this.$intercom.installed = true;
        }
      },
    });
  },
};

export default intercomVuePlugin;
