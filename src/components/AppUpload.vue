<template>
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
          class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
          border-gray-400 text-gray-400 transition duration-500 hover:text-white
          hover:bg-green-400 hover:border-green-400 hover:border-solid"
          :class="{ 'bg-green-400 border-green-400 border-solid': isDragOver}"
          @drag.prevent.stop="''"
          @dragstart.prevent.stop="''"
          @dragend.prevent.stop="isDragOver = false"
          @dragover.prevent.stop="isDragOver = true"
          @dragenter.prevent.stop="isDragOver = true"
          @dragleave.prevent.stop="isDragOver = false"
          @drop.prevent.stop="upload($event)">
          <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)"/>
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="upload in uploads" :key="upload.name">
          <div class="font-bold text-sm" :class="upload.textColor">
            <i :class="upload.icon"></i>
            {{ upload.name }}
          </div>
          <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
            <div class="transition-all progress-bar"
              :class="upload.variance"
              :style="{ width: upload.currentProgress + '%' }"></div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storage, auth, songsCollection } from '@/includes/firebase/firebase';

export default {
  name: 'AppUpload',
  data() {
    return {
      isDragOver: false,
      uploads: []
    };
  },
  methods: {
    upload($event) {
      this.isDragOver = false;
      
      const files = $event.dataTransfer 
        ? [...$event.dataTransfer.files] : [...$event.target.files];

      // This will return the URL (reference) of the storage bucket, the same as the one that
      // can be found in the firebase configuration file.
      //
      // If an argument is passed, a subdirectory will be created and the path will be updated.
      const storageReference = storage.ref(); // root reference

      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        // This will create a relative reference.
        const songsReference = storageReference.child(`songs/${file.name}`); // additional reference
        const task = songsReference.put(file); 

        const uploadIndex = this.uploads.push({
          task,
          currentProgress: 0,
          name: file.name,
          variance: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          textColor: ''
        }) - 1;

        task.on(
          'state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this.uploads[uploadIndex].currentProgress = progress;
          }, 
          () => {
            this.uploads[uploadIndex].variance = 'bg-red-400';
            this.uploads[uploadIndex].icon = 'fas fa-times';
            this.uploads[uploadIndex].textColor = 'text-red-400';
          }, 
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              displayName: auth.currentUser.displayName,
              originalName: task.snapshot.ref.name,
              modifiedName: task.snapshot.ref.name,
              genre: '',
              commentsCount: 0,
            };

            song.url = await task.snapshot.ref.getDownloadURL();
            await songsCollection.add(song);

            this.uploads[uploadIndex].variance = 'bg-green-400';
            this.uploads[uploadIndex].icon = 'fas fa-check';
            this.uploads[uploadIndex].textColor = 'text-green-400';
          }
        );
      });
    },
    cancelUploads() {
      this.uploads.forEach((upload) => {
        upload.task.cancel();
      });
    }
  },
  beforeUnmount() {
    // Solution for canceling the uploads when the user changes the route 
    // while there are ongoing uploads.
    this.uploads.forEach((upload) => {
      upload.task.cancel();
    });
  }
};
</script>
