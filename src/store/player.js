import { defineStore } from 'pinia';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default defineStore('player', {
  state: () => ({
    currentSong: {},
    howlSound: {},
    seek: '00:00',
    duration: '00:00',
    progressPosition: '0%'
  }),
  actions: {
    async playSong(song) {
      if (this.howlSound instanceof Howl) {
        this.howlSound.unload();
      }

      this.currentSong = song;
      this.howlSound = new Howl({
        src: [this.currentSong.url],
        html5: true
      });
      this.howlSound.play();

      this.howlSound.on('play', () => {
        requestAnimationFrame(this.progress);
      });
    },
    progress() {
      this.seek = helper.formatAudioTime(this.howlSound.seek());
      this.duration = helper.formatAudioTime(this.howlSound.duration());
      this.progressPosition = `${(this.howlSound.seek() / this.howlSound.duration()) * 100}%`;
      
      if (this.howlSound.playing()) {
        requestAnimationFrame(this.progress);
      }
    },
    updateSeek(event) {
      if (!this.howlSound.playing) {
        return;
      }
      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.howlSound.duration() * percentage;
      this.howlSound.seek(seconds);
      this.howlSound.once('seek', this.progress);
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
