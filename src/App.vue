<template>
  <app-header />
  
  <router-view />

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

export default {
  name: 'App',
  components: {
    AppHeader,
    AuthenticationModal,
    MusicPlayer
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
