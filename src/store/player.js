import { defineStore } from 'pinia';
import { Howl } from 'howler';

export default defineStore('player', {
  state: () => ({
    currentSong: {},
    howlSound: {}
  }),
  actions: {
    async playSong(song) {
      this.currentSong = song;
      
      this.howlSound = new Howl({
        src: [this.currentSong.url],
        html5: true
      });

      this.howlSound.play();
    },
    async toggleAudio() {
      if (!this.howlSound.playing) {
        return;
      }

      if (this.howlSound.playing()) {
        this.howlSound.pause();
      } else {
        this.howlSound.play();
      }
    }
  },
  getters: {
    isSongPlaying: (state) => {
      if (state.howlSound.playing) {
        return state.howlSound.playing();
      }
      return false;
    }
  }
});
