import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { auth } from '@/includes/firebase/firebase';

import Icon from '@/directives/icon';
import i18n from './includes/i18n/i18n';
import App from './App.vue';
import router from './router';
import VeeValidatePlugin from './includes/validation';

import './assets/tailwind.css';
import './assets/main.css';

let app;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    
    app.directive('icon', Icon);
    
    app.mount('#app'); 
  }  
});
