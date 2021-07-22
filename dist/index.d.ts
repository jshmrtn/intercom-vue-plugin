import { Plugin } from "vue";
declare type messengerAttributes = {
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
declare type company = {
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
declare const intercomSetup: (settings: messengerAttributes) => {
    installed: import("vue").Ref<boolean>;
    ready: import("vue").Ref<boolean>;
    visible: import("vue").Ref<boolean>;
    unreadCount: import("vue").Ref<number>;
    loadScript: () => void;
    init: () => void;
    callIntercom: (...args: any[]) => void;
    isReady: () => Promise<unknown>;
    boot: (options: messengerAttributes) => Promise<void>;
    shutdown: () => Promise<void>;
    update: (options?: messengerAttributes | undefined) => Promise<void>;
    show: () => Promise<void>;
    onShow: (callback: () => void) => Promise<void>;
    hide: () => Promise<void>;
    onHide: (callback: () => void) => Promise<void>;
    showMessages: () => Promise<void>;
    showNewMessage: (content: string) => Promise<void>;
    trackEvent: (name: string, ...metadata: any[]) => Promise<void>;
    getVisitorId: () => Promise<void>;
    startTour: (tourId: number) => Promise<void>;
};
declare type Intercom = ReturnType<typeof intercomSetup>;
declare module "@vue/runtime-core" {
    interface ComponentCustomProperties {
        $intercom: Intercom;
    }
}
export declare const useIntercom: () => {
    installed: import("vue").Ref<boolean>;
    ready: import("vue").Ref<boolean>;
    visible: import("vue").Ref<boolean>;
    unreadCount: import("vue").Ref<number>;
    loadScript: () => void;
    init: () => void;
    callIntercom: (...args: any[]) => void;
    isReady: () => Promise<unknown>;
    boot: (options: messengerAttributes) => Promise<void>;
    shutdown: () => Promise<void>;
    update: (options?: messengerAttributes | undefined) => Promise<void>;
    show: () => Promise<void>;
    onShow: (callback: () => void) => Promise<void>;
    hide: () => Promise<void>;
    onHide: (callback: () => void) => Promise<void>;
    showMessages: () => Promise<void>;
    showNewMessage: (content: string) => Promise<void>;
    trackEvent: (name: string, ...metadata: any[]) => Promise<void>;
    getVisitorId: () => Promise<void>;
    startTour: (tourId: number) => Promise<void>;
};
declare const intercomPlugin: Plugin;
export default intercomPlugin;
