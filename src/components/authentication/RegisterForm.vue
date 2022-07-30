<template>
    <authentication-alert v-if="showRegisterAlert" 
        :message="registrationAlertMessage"
        :variant="registrationAlertVariant"/>

    <vee-form :validation-schema="registerSchema" :initial-values="userData" @submit="register">
        <!-- Name -->
        <div class="mb-3">
            <label class="inline-block mb-2">Name</label>
            <vee-field type="text" name="name"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Name"/>
            <error-message class="text-red-600" name="name" />
        </div>
        <!-- Email -->
        <div class="mb-3">
            <label class="inline-block mb-2">Email</label>
            <vee-field type="email" name="email"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Enter Email" />
            <error-message class="text-red-600" name="email" />
        </div>
        <!-- Age -->
        <div class="mb-3">
            <label class="inline-block mb-2">Age</label>
            <vee-field type="number" name="age"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded" />
            <error-message class="text-red-600" name="age" />
        </div>
        <!-- Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Password</label>
            <vee-field name="password" :bails="false" v-slot="{ field, errors }">
            <input type="password" 
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Password" v-bind="field" />
            <div class="text-red-600" v-for="error in errors" :key="error">
                {{ error }}
            </div>
            </vee-field>
        </div>
        <!-- Confirm Password -->
        <div class="mb-3">
            <label class="inline-block mb-2">Confirm Password</label>
            <vee-field type="password" name="confirmPassword"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded"
            placeholder="Confirm Password" />
            <error-message class="text-red-600" name="confirmPassword"/>
        </div>
        <!-- Country -->
        <div class="mb-3">
            <label class="inline-block mb-2">Country</label>
            <vee-field as="select" name="country"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded">
            <option value="USA">USA</option>
            <option value="Mexico">Mexico</option>
            <option value="Germany">Germany</option>
            <option value="Antarctica">Antarctica</option>
            </vee-field>
            <error-message class="text-red-600" name="country" />
        </div>
        <!-- TOS -->
        <div class="mb-3 pl-6">
            <vee-field type="checkbox" name="termsOfService" 
            class="w-4 h-4 float-left -ml-6 mt-1 rounded" value="1" />
            <label class="inline-block">Accept terms of service</label>
            <error-message class="text-red-600 block" name="termsOfService" />
        </div>

        <button type="submit"
            class="block w-full bg-purple-600 text-white py-1.5 
            px-3 rounded transition hover:bg-purple-700"
            :disabled="registrationInSubmission"
            >
            Submit
        </button>
    </vee-form>
</template>

<script>
import CONSTANTS from '@/constants/constants';
import { firebaseEmailAndPasswordAuth, firebaseAddUserToCollection } from '@/includes/firebase/requests';
import AuthenticationAlert from './AuthenticationAlert.vue';

export default {
  name: 'RegisterForm',
  components: {
    AuthenticationAlert
  },
  data() {
    return {
      registerSchema: {
        name: 'required|min:3|max:100|alpha_spaces',
        email: 'required|min:3|max:100|email',
        age: 'required|min_value:18|max_value:100',
        password: 'required|min:9|max:100|excluded:password',
        confirmPassword: 'required|password_mismatch:@password',
        country: 'required|country_excluded:Antarctica',
        termsOfService: 'terms_of_service'
      }, 
      userData: {
        country: 'USA'
      },
      registrationInSubmission: false,
      showRegisterAlert: false,
      registrationAlertMessage: CONSTANTS.ALERT_MESSAGES.REGISTER_WAIT,
      registrationAlertVariant: CONSTANTS.COLOR_VARIANTS.BLUE
    };
  },
  methods: {
    async register(values) {
      this.registrationInSubmission = true;
      this.showRegisterAlert = true;
      this.registrationAlertVariant = CONSTANTS.COLOR_VARIANTS.BLUE;
      this.registrationAlertMessage = CONSTANTS.ALERT_MESSAGES.REGISTER_WAIT;

      // Authenticate the user via Firebase 
      const userCredentials = await this.createUser(values.email, values.password);      
      if (userCredentials === null) {
        this.handleErrorResponse();
      }

      // Create and save the user document in the firestore database
      const userDocument = await this.addUser({
        name: values.name,
        email: values.email,
        age: values.age,
        country: values.country 
      });
      if (userDocument === null) {
        this.handleErrorResponse();
      }

      this.handleSuccessResponse();
    },
    createUser(email, password) {
      return firebaseEmailAndPasswordAuth(email, password);
    },
    addUser(user) {
      return firebaseAddUserToCollection(user);
    },
    handleErrorResponse() {
      this.registrationInSubmission = false;
      this.registrationAlertVariant = CONSTANTS.COLOR_VARIANTS.RED;
      this.registrationAlertMessage = CONSTANTS.ALERT_MESSAGES.ERROR;
    },
    handleSuccessResponse() {
      this.registrationAlertVariant = CONSTANTS.COLOR_VARIANTS.GREEN;
      this.registrationAlertMessage = CONSTANTS.ALERT_MESSAGES.REGISTER_SUCCESS;
    }
  }
};  
</script>
