<template>
  <app-header />

  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"></component>
    </transition>
  </router-view>

  <music-player v-if="currentSong.modifiedName" />

  <authentication-modal />
</template>

<script>
import { mapWritableState, mapState } from 'pinia';
import { auth } from '@/includes/firebase/firebase';
import useUserStore from '@/store/user';
import usePlayerStore from '@/store/player';
import AppHeader from '@/components/AppHeader.vue';
import AuthenticationModal from '@/components/authentication/AuthenticationModal.vue';
import MusicPlayer from './components/MusicPlayer.vue';
import AboutView from './views/AboutView.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthenticationModal,
    MusicPlayer,
    AboutView
  },
  computed: {
    ...mapWritableState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['currentSong'])
  },
  created() {
    if (auth.currentUser) {
      this.userLoggedIn = true;
    }
  }
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 0.3s linear;
}
.fade-leave-to {
  transition: all 0.3s linear;
  opacity: 0;
}
</style>
