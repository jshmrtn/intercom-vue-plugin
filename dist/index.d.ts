import { PluginObject } from "vue";
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
declare type Intercom = {
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
declare module "vue/types/vue" {
    interface Vue {
        $intercom: Intercom;
    }
    interface VueConstructor {
        $intercom: Intercom;
    }
}
declare const intercomVuePlugin: PluginObject<messengerAttributes>;
export default intercomVuePlugin;
