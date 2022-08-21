<template>
  <main>
    <!-- Introduction -->
    <section class="mb-8 py-20 text-white text-center relative">
      <div class="absolute inset-0 w-full h-full bg-contain introduction-bg"
        style="background-image: url(assets/img/header.png)"></div>
      <div class="container mx-auto">
        <div class="text-white main-header-content">
          <h1 class="font-bold text-5xl mb-5">{{ $t("home.main-header") }}</h1>
          <p class="w-full md:w-8/12 mx-auto">
            {{ $t("home.main-subheader") }}
          </p>
        </div>
      </div>

      <img class="relative block mx-auto mt-5 -mb-20 w-auto max-w-full"
        src="assets/img/introduction-music.png" alt="''" />
    </section>

    <!-- Main Content -->
    <section class="container mx-auto">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200" v-icon-new="{ icon: 'headphones-alt', right: true }">
        <span class="card-title">{{ $t("home.songs-title") }}</span>
      </div>
      <!-- Playlist -->
      <ol id="playlist">
        <song-item v-for="song in songs" :key="song.documentId" :song="song"/>
      </ol>
    </div>
  </section>
  </main>
</template>

<script>
import { songsCollection } from '@/includes/firebase/firebase';
import SongItem from '@/components/SongItem.vue';
import IconNew from '@/directives/icon-new';

export default {
  name: 'HomeView',
  components: {
    SongItem
  },
  directives: {
    'icon-new': IconNew
  },
  data() {
    return {
      songs: [],
      maxNumberOfSongsPerPage: 25,
      pendingRequest: false
    };
  },
  methods: {
    handleScroll() {
      const { scrollTop, offsetHeight } = document.documentElement;
      const { innerHeight } = window;
      const isAtBottomWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

      if (isAtBottomWindow) {
        this.getSongs();
      }
    },
    async getSongs() {
      if (this.pendingRequest) {
        return;
      }

      this.pendingRequest = true;
      let snapshots;

      if (this.songs.length) {
        const lastDocument = await songsCollection
          .doc(this.songs[this.songs.length - 1].documentId)
          .get();
      
        snapshots = await songsCollection
          .orderBy('modifiedName')
          .startAfter(lastDocument)
          .limit(this.maxNumberOfSongsPerPage)
          .get();
      } else {
        snapshots = await songsCollection
          .orderBy('modifiedName')
          .limit(this.maxNumberOfSongsPerPage)
          .get();
      }

      snapshots.forEach((songDocument) => this.songs.push({
        documentId: songDocument.id,
        ...songDocument.data()
      }));

      this.pendingRequest = false;
    },
  },
  async created() {
    this.getSongs();

    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }
};
</script>
