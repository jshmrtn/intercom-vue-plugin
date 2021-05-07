import Vue from 'vue';

export default {
  install(vue, settings) {
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
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://widget.intercom.io/widget/${settings.app_id}`;
          const firstScript = document.getElementsByTagName('script')[0];
          firstScript.parentNode.insertBefore(script, firstScript);
          script.onload = () => this.$intercom.init();
        },
        init() {
          this.callIntercom('onHide', () => (this.$intercom.visible = false));
          this.callIntercom('onShow', () => (this.$intercom.visible = true));
          this.callIntercom(
              'onUnreadCountChange',
              (unreadCount) => (this.unreadCount = unreadCount),
          );
          window.intercomSettings = { ...settings };
          this.$intercom.ready = true;
        },
        callIntercom(...args) {
          window.Intercom(...args);
        },
        async checkStatus() {
          return new Promise((resolve, reject) => {
            if (this.$intercom.ready) {
              resolve(true);
            } else {
              setTimeout(async () => {
                if (this.$intercom.ready) {
                  resolve(true);
                } else {
                  await this.checkStatus();
                }
              }, 200);
            }
            setTimeout(() => resolve('done!'), 1000);
          });
        },
        isReady() {
          return new Promise((resolve, reject) => {
            if (this.$intercom.ready) {
              resolve();
            } else {
              setTimeout(async () => {
                if (this.$intercom.ready) {
                  resolve();
                } else {
                  await this.isReady();
                  resolve();
                }
              }, 100);
            }
          });
        },
        async boot(options) {
          await this.isReady();
          if (!options.app_id) options.app_id = settings.app_id;
          this.callIntercom('boot', options);
        },
        async shutdown() {
          await this.isReady();
          this.callIntercom('shutdown');
        },
        async update(...options) {
          await this.isReady();
          this.callIntercom('update', ...options);
        },
        async show() {
          await this.isReady();
          this.callIntercom('show');
        },
        async hide() {
          await this.isReady();
          this.callIntercom('hide');
        },
        async showMessages() {
          await this.isReady();
          this.callIntercom('showMessages');
        },
        async showNewMessage(content) {
          await this.isReady();
          this.callIntercom(
              'showNewMessage',
              typeof content === 'string' ? content : '',
          );
        },
        async trackEvent(name, ...metadata) {
          await this.isReady();
          this.callIntercom('trackEvent', ...[name, ...metadata]);
        },
        async getVisitorId() {
          await this.isReady();
          this.callIntercom('getVisitorId');
        },
        async startTour(tourId) {
          await this.isReady();
          this.callIntercom('startTour', tourId);
        },
      },
    });

    Object.defineProperty(Vue.prototype, '$intercom', {
      get: () => intercom,
    });

    Vue.mixin({
      created() {
        if (!this.$intercom.installed) {
          const loaded = () => this.$intercom.loadScript();
          if (document.readyState === 'complete') {
            loaded();
          } else if (window.attachEvent) {
            window.attachEvent('onload', loaded);
          } else {
            window.addEventListener('load', loaded, false);
          }
          this.$intercom.installed = true;
        }
      },
    });
  },
};
