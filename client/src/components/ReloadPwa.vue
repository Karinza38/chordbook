<script setup>
import { registerSW } from "virtual:pwa-register";
import { ref, computed } from "vue";
import { UseOnline } from "@vueuse/components";
import { offline } from "@/icons";
import { useTimeout } from "@vueuse/core";

const offlineReady = ref(false);
const installPrompt = ref(null);
const showInstallPrompt = computed(() => {
  return installPrompt.value && useTimeout(60 * 1000); // 60 second delay
});

console.info("PWA enabled, registering service worker...");
registerSW({
  immediate: true,
  onOfflineReady() {
    offlineReady.value = true;
  },
});

// Save prompt for installing to home screen
// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen
window.addEventListener("beforeinstallprompt", (e) => {
  // Stash the event so it can be triggered later.
  installPrompt.value = e;
  console.debug("PWA: saved install prompt");
});

function addToHomeScreen() {
  // Show the prompt
  installPrompt.value.prompt();
  // Wait for the user to respond to the prompt
  installPrompt.value.userChoice.then((choiceResult) => {
    console.log("Response to A2HS prompt", choiceResult);
    installPrompt.value = null;
  });
}
</script>

<template>
  <ion-toast
    :is-open="offlineReady"
    message="Ready to work offline."
    duration="3000"
    :buttons="[{ text: 'Ok', role: 'cancel' }]"
  />
  <ion-toast
    :is-open="showInstallPrompt"
    message="Add to home screen?"
    :buttons="[
      { text: 'Not Now', role: 'cancel' },
      { text: 'Add', handler: addToHomeScreen },
    ]"
    :duration="5000"
  />
  <UseOnline v-slot="{ isOnline }">
    <ion-toast
      :is-open="!isOnline"
      :icon="offline"
      header="It looks like you are offline"
      message="Some functionality will be limited."
      duration="5000"
      :buttons="[{ text: 'Ok', role: 'cancel' }]"
    />
  </UseOnline>
</template>
