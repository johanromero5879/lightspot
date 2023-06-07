<template>
  <v-app>
    <router-view />
    <Notification />
    <Dialog />
  </v-app>
</template>

<script>
import Vue from "vue";
import Notification from "@/components/Notification.vue";
import Dialog from "@/components/Dialog.vue";

export default Vue.extend({
  name: "App",
  components: {
    Notification,
    Dialog,
  },
  data() {
    return {
      meta: []
    }
  },
  metaInfo() {
    const meta = []
    if (process.env.NODE_ENV === "production") {
      meta.push({
        "http-equiv": "Content-Security-Policy",
        "content": "upgrade-insecure-requests"
      })
    }
    return { meta }
  }
});
</script>

<style lang="scss">
:root {
  --primary: #0d3882;
  --primary-alt: #1559cf;
  --secondary: #0891B2;
  --secondary-alt: #00cfc5;
  --grey: #8297b5;
  --dark: #393939;
  --dark-alt: #4f4f4f;
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

i {
  cursor: pointer;
}

a {
  color: var(--primary) !important;
}

.v-application {
  background-color: var(--light-alt) !important;
}

.info-text {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
}

.btn-primary {
  background-color: var(--primary) !important;
  color: var(--light) !important;
}

.btn-secondary {
  background-color: var(--secondary) !important;
  color: var(--light) !important;
}
</style>
