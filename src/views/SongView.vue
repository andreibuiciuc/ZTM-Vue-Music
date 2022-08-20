<template>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button @click.prevent="manageSong"
        type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none">
        <i class="fas" :class="{ 'fa-play': !isSongPlaying, 'fa-duotone fa-backward': isSongPlaying }"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modifiedName }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.commentsCount }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <vee-form v-if="userLoggedIn" :validation-schema="commentSchema" @submit="addComment">
          <page-alert v-if="showCommentAlert" :message="commentAlertMessage" :variant="commentAlertVariant" />
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..." />
          <error-message class="text-red-600" name="comment" />
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block"
            :disabled="commentInSubmission">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sortOption"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li v-for="comment in sortedComments" :key="comment.documentId" 
      class="p-6 bg-gray-50 border border-gray-200">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time> {{ comment.datePosted }}</time>
      </div>
      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>

<script>
import { songsCollection, commentsCollection, auth } from '@/includes/firebase/firebase';
import { mapState, mapActions } from 'pinia';
import useUserStore from '@/store/user';
import usePlayerStore from '@/store/player';
import constants from '@/constants/constants';
import PageAlert from '@/components/alert/PageAlert.vue';

export default {
  name: 'SongView',
  components: {
    PageAlert
  },
  data() {
    return {
      song: {},
      commentSchema: {
        comment: 'required|min:3'
      },
      commentInSubmission: false,
      showCommentAlert: false,
      commentAlertMessage: '',
      commentAlertVariant: '',
      comments: [],
      sortOption: '1'
    };
  },
  computed: {
    ...mapState(useUserStore, ['userLoggedIn']),
    ...mapState(usePlayerStore, ['currentSong', 'isSongPlaying']),
    sortedComments() {
      return this.comments.slice().sort((a, b) => {
        if (this.sortOption === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    }
  },
  methods: {
    ...mapActions(usePlayerStore, ['playSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.commentInSubmission = true;
      this.showCommentAlert = true;

      this.commentAlertMessage = constants.ALERT_MESSAGES.COMMENT_SUBMISSION_WAIT;
      this.commentAlertVariant = constants.COLOR_VARIANTS.BLUE;

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        songId: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid
      };

      await commentsCollection.add(comment);

      this.song.commentsCount += 1;
      await songsCollection.doc(this.$route.params.id).update({
        commentsCount: this.song.commentsCount
      });

      this.getComments();
      
      this.commentAlertMessage = constants.ALERT_MESSAGES.COMMENT_SUBMISSION_SUCCESS;
      this.commentAlertVariant = constants.COLOR_VARIANTS.GREEN;
      this.commentInSubmission = false;
      
      resetForm();
    },
    async getComments() {
      const commentsSnapshots = await commentsCollection.where('songId', '==', this.$route.params.id).get();

      this.comments = [];
      commentsSnapshots.forEach((commentDocument) => {
        this.comments.push({
          documentId: commentDocument.id,
          ...commentDocument.data()
        });
      });
    },
    manageSong() {
      if (this.isSongPlaying) {
        this.toggleAudio();
      } else {
        this.playSong(this.song);
      }
    }
  },
  async created() {
    const songDocumentSnapshot = await songsCollection.doc(this.$route.params.id).get();

    if (!songDocumentSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }

    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';

    this.getComments();

    this.song = songDocumentSnapshot.data();
  },
  watch: {
    sortOption(newValue) {
      if (newValue === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newValue
        }
      });
    }
  }
};
</script>
