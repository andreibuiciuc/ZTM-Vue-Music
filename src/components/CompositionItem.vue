<template>
  <div class="border border-gray-200 p-3 mb-4 rounded">
    <div v-show="!showForm">
      <h4 class="inline-block text-2xl font-bold">{{ song.modifiedName }}</h4>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right"
        @click.prevent="deleteComposition">
        <i class="fa fa-times"></i>
      </button>
      <button class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right"
        @click.prevent="showForm = !showForm">
      <i class="fa fa-pencil-alt"></i>
    </button>
    </div>
    <div v-show="showForm">
      <page-alert v-if="showEditAlert" :message="editAlertMessage" :variant="editAlertVariant"/>
      <vee-form :validation-schema="compositionFormSchema" :initial-values="song" @submit="editComposition">
        <div class="mb-3">
          <label class="inline-block mb-2">Song Title</label>
          <vee-field type="text" name="modifiedName"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Song Title" 
                @input="updateUnsavedFlag(true)"/>
          <error-message class="text-red-600" name="modifiedName" />
        </div>
        <div class="mb-3">
          <label class="inline-block mb-2">Genre</label>
          <vee-field type="text" name="genre"
                class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                transition duration-500 focus:outline-none focus:border-black rounded"
                placeholder="Enter Genre"
                @input="updateUnsavedFlag(true)" />
          <error-message class="text-red-600" name="genre"></error-message>
        </div>
        <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600"
          :disabled="editInSubmission">
          Submit
        </button>
        <button type="button" class="py-1.5 px-3 rounded text-white bg-gray-600"
          :disabled="editInSubmission" @click.prevent="showForm = false" >
          Go Back
        </button>
      </vee-form>
    </div>
  </div>
</template>

<script>
import constants from '@/constants/constants';
import { storage, songsCollection } from '@/includes/firebase/firebase';
import PageAlert from '@/components/alert/PageAlert.vue';

export default {
  name: 'CompositionItem',
  components: { 
    PageAlert  
  },
  props: {
    song: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    updateSong: {
      type: Function,
      required: true
    },
    removeSong: {
      type: Function,
      required: true
    },
    updateUnsavedFlag: {
      type: Function,
    }
  },
  data() {
    return {
      showForm: false,
      compositionFormSchema: {
        modifiedName: 'required|min:3|max:50',
        genre: 'required|min:3|max:50|alpha_spaces'
      },
      editInSubmission: false,
      showEditAlert: false,
      editAlertMessage: constants.ALERT_MESSAGES.UPDATE_WAIT,
      editAlertVariant: constants.COLOR_VARIANTS.BLUE
    };
  },
  methods: {
    async editComposition(values) {
      this.editInSubmission = true;
      this.showEditAlert = true;
      this.editAlertMessage = constants.ALERT_MESSAGES.UPDATE_WAIT;
      this.editAlertVariant = constants.COLOR_VARIANTS.BLUE;
      
      try {
        await songsCollection.doc(this.song.documentId).update({
          modifiedName: values.modifiedName,
          genre: values.genre
        });
      } catch (error) {
        this.editInSubmission = false;
        this.editAlertMessage = constants.ALERT_MESSAGES.ERROR;
        this.editAlertVariant = constants.COLOR_VARIANTS.RED;
        return;
      }

      this.updateSong(this.index, values);
      this.updateUnsavedFlag(false);

      this.editInSubmission = false;
      this.editAlertMessage = constants.ALERT_MESSAGES.UPDATE_SUCCESS;
      this.editAlertVariant = constants.COLOR_VARIANTS.GREEN;
    },
    async deleteComposition() {
      const storageReference = storage.ref();
      const songReference = storageReference.child(`songs/${this.song.originalName}`);

      await songReference.delete();
      await songsCollection.doc(this.song.documentId).delete();

      this.removeSong(this.index);
    }
  }
};
</script>
