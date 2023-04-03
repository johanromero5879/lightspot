<template>
  <v-app>
    <router-view />
    <Notification />
    <Dialog />
  </v-app>
</template>

<script>
import Vue from "vue";
import Notification from "@/components/Notification.vue"
import Dialog from "@/components/Dialog.vue"

export default Vue.extend({
  name: "App",
  components: {
    Notification,
    Dialog
  }
});
</script>

<style lang="scss">
:root {
  --primary: #0D3882;
  --primary-alt: #1559CF;
  --secondary: #00CFC5;
  --secondary-alt: #00DBD0;
  --grey: #8297B5;
  --dark: #393939;
  --dark-alt: #4F4F4F;
  --light: #fff;
  --light-alt: #f6f6f6;
  --sidebar-width: 300px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Fira sans", sans-serif;
}

body {
  background-color: var(--light-alt) !important;
  min-height: 100vh;
  width: 100%;
}

.v-application {
  background-color: var(--light-alt) !important;
}

a {
  color: var(--primary) !important;
}

.btn-primary {
  background-color: var(--primary) !important;
  color: var(--light) !important;
}
</style>
