<template>
  <li class="flex justify-between items-center p-3 pl-6 cursor-pointer transition
    duration-300 hover:bg-gray-50">
    <div>
      <router-link :to="{ name: 'song', params: { id: song.documentId } }" class="font-bold block text-gray-600">
        {{ song.modifiedName }}
      </router-link>
      <span class="text-gray-500 text-sm">{{ song.name }}</span>
    </div>
    <div class="text-gray-600 text-lg">
      <router-link custom 
        :to="{ name: 'song', params: { id: song.documentId }, hash: '#comments' }"
        v-slot="{ navigate }"
        >
        <span class="comments" @click="navigate">
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.commentsCount }}
      </span>
      </router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object
    }
  }
};
</script>
