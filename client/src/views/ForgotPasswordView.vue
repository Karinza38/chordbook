<script setup>
import { ref } from "vue";
import useAuthStore from "@/stores/auth";

const auth = useAuthStore();
const params = ref({});
const { isFinished, error, execute, data } = auth.forgotPassword(params, {
  immediate: false,
});
</script>

<template>
  <ion-page>
    <Head>
      <title>Forgot Password</title>
    </Head>
    <ion-header>
      <ion-toolbar>
        <ion-title> Reset Password </ion-title>
        <ion-buttons slot="end">
          <ion-back-button
            role="cancel"
            icon=""
            text="Cancel"
            default-href="/"
          />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div
        class="max-w-md m-auto flex flex-col justify-center h-full main-content"
      >
        <div v-if="isFinished && !error" class="text-center">
          <p class="text-lg">
            {{ data.message }}
          </p>
        </div>
        <form v-else @submit.prevent="execute(false)">
          <ion-item>
            <ion-input
              v-model="params.email"
              label="Email"
              label-placement="floating"
              type="email"
              autocomplete="email"
              required
              :class="{ 'ion-invalid ion-touched': error }"
              :error-text="data?.error?.message"
            />
          </ion-item>
          <div class="ion-margin">
            <ion-button type="submit" expand="block">
              Reset Password
            </ion-button>
          </div>
          <div class="ion-margin text-center text-sm text-muted">
            <router-link to="#signin"> Sign In </router-link>
            •
            <router-link to="#signup"> Sign Up </router-link>
          </div>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>
