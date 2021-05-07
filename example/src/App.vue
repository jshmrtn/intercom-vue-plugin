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
      // this.$intercom.hide();
    },
  },
  mounted() {
    this.$intercom.boot({
      userId: 1,
      name: 'Test User',
      email: 'test@user.com',
      background_color: '#35495E',
      action_color: '#41B883',
    });
    this.$intercom.show();
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
