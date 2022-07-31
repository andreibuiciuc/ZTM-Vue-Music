<template>
    <authentication-alert v-if="showLoginAlert" 
      :message="loginAlertMessage" 
      :variant="loginAlertVariant" />

    <vee-form :validation-schema="loginSchema" @submit="login">
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Email" />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field type="password" name="password"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Password" />
            <error-message class="text-red-600" name="password"/>
        </div>

        <button type="submit" :disabled="loginInSubmission"
            class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition
            hover:bg-purple-700">
                Submit
        </button>
    </vee-form>
</template>

<script>
import { mapActions } from 'pinia';
import useUserStore from '@/store/user';

import CONSTANTS from '@/constants/constants';
import AuthenticationAlert from './AuthenticationAlert.vue';

export default {
  name: 'LoginForm',
  components: {
    AuthenticationAlert
  },
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:9|max:100'
      },
      loginInSubmission: false,
      showLoginAlert: false,
      loginAlertMessage: CONSTANTS.ALERT_MESSAGES.LOGIN_WAIT,
      loginAlertVariant: CONSTANTS.COLOR_VARIANTS.BLUE
    };
  },
  methods: {
    ...mapActions(useUserStore, {
      authenticate: 'login'
    }),
    async login(values) {
      this.loginInSubmission = true;
      this.showLoginAlert = true;

      this.loginAlertVariant = CONSTANTS.COLOR_VARIANTS.BLUE;
      this.loginAlertMessage = CONSTANTS.ALERT_MESSAGES.LOGIN_WAIT;

      try {
        await this.authenticate(values);
      } catch (error) {
        this.loginAlertVariant = CONSTANTS.COLOR_VARIANTS.RED;
        this.loginAlertMessage = CONSTANTS.ALERT_MESSAGES.LOGIN_ERROR;
        return;
      }

      this.loginAlertVariant = CONSTANTS.COLOR_VARIANTS.GREEN;
      this.loginAlertMessage = CONSTANTS.ALERT_MESSAGES.LOGIN_SUCCESS;

      window.location.reload();
    }
  },
};
</script>
