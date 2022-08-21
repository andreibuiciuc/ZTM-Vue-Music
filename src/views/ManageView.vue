<template>
  <section class="container mx-auto mt-6">
      <div class="md:grid md:grid-cols-3 md:gap-4">
        <div class="col-span-1">
          <app-upload ref="upload" :addSong="addSong"/>
        </div>
        <div class="col-span-2">
          <div class="bg-white rounded border border-gray-200 relative flex flex-col">
            <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
              <span class="card-title"> {{ $t("manage.my-songs-header") }}</span>
              <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
            </div>
            <div class="p-6">
              <!-- Composition Items -->
              <composition-item v-for="(song, index) in songs" :key="song.documentId" :song="song"
                :updateSong="updateSong" :index="index"
                :removeSong="removeSong"
                :updateUnsavedFlag="updateUnsavedFlag"/>
            </div>
          </div>
        </div>
      </div>
  </section>
</template>

<script>
import { auth, songsCollection } from '@/includes/firebase/firebase';
import AppUpload from '@/components/AppUpload.vue';
import CompositionItem from '@/components/CompositionItem.vue';

export default {
  name: 'ManageView',
  components: {
    AppUpload,
    CompositionItem,
  },
  data() {
    return {
      songs: [],
      unsavedFlag: false
    };
  },
  methods: {
    updateSong(index, values) {
      this.songs[index].modifiedName = values.modifiedName;
      this.songs[index].genre = values.genre;
    },
    removeSong(index) {
      this.songs.splice(index, 1);
    },
    addSong(songDocument) {
      const song = { ...songDocument.data(), documentId: songDocument.id };
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    }
  },
  async created() {
    const songsSnapshot = await songsCollection.where('uid', '==', auth.currentUser.uid).get();
    songsSnapshot.forEach(this.addSong);
  },
  beforeRouteLeave(_to, _from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have unsaved changes. Are you sure you want to leave?');
      next(leave);
    }
  }
};
</script>
