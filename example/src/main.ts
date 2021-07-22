import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import IntercomVuePlugin from "@leadent/intercom-vue-plugin";

createApp(App)
  .use(router)
  .use(IntercomVuePlugin, {
    app_id: process.env.VUE_APP_INTERCOM_ID,
  })
  .mount("#app");
