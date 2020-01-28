import Controller, { inject as controller } from '@ember/controller';
import { empty, sort, alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { capitalize } from 'rarwe/helpers/capitalize';

export default Controller.extend({
  controls: controller('bands.band.controls'),
  isAddingSong: false,
  newSongTitle: '',
  isAddButtonDisabled: empty('newSongTitle'),
  searchTerm: alias('controls.searchTerm'),
  sortBy: 'ratingDesc',

  newSongPlaceholder: computed('model.name', function() {
    let bandName = this.model.name;
    return `New ${capitalize(bandName)} song`;
  }),
  
  sortProperties: computed('sortBy', function() {
    let options = {
      ratingDesc: ['rating:desc', 'title:asc'],
      ratingAsc: ['rating:asc', 'title:asc'],
      titleDesc: ['title:desc'],
      titleAsc: ['title:asc']
    };
    return options[this.sortBy];
  }),

  sortedSongs: sort('matchingSongs', 'sortProperties'),

  matchingSongs: computed('model.songs.@each.title', 'searchTerm', function() {
    let searchTerm = this.searchTerm.toLowerCase();
    return this.model.get('songs').filter((song) => {
      return song.title.toLowerCase().includes(searchTerm);
    });
  }),

  queryParams: {
    sortBy: 'sort',
  },

  actions: {
    addSong() {
      this.set('isAddingSong', true);
    },
    cancelAddSong() {
      this.set('isAddingSong', false);
    },
    async saveSong(event) {
      event.preventDefault();
      let newSong = this.store.createRecord('song', {
        title: this.get('newSongTitle'),
        band: this.model
        });
      await newSong.save();
      this.set('newSongTitle', '');
    },
    updateRating(song, rating) {
      song.set('rating', song.rating === rating ? 0 : rating);
      song.save();
    },
  }
});
