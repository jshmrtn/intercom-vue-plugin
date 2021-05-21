<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route() {
      this.$intercom.hide();
    },
  },
  mounted() {
    this.$intercom.boot({
      user_id: '1',
      name: 'Test User',
      email: 'test@user.com',
      background_color: '#35495E',
      action_color: '#41B883',
    });
    this.$intercom.show();
    this.$intercom.onHide(() => {
      console.warn('Intercom hidden. visible = ', this.$intercom.visible);
    });
    this.$intercom.onShow(() => {
      console.warn('Intercom visible. visible = ', this.$intercom.visible);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
