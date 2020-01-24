import Controller from '@ember/controller';
import { empty, sort } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Controller.extend({
  isAddingSong: false,
  newSongTitle: '',
  isAddButtonDisabled: empty('newSongTitle'),
  searchTerm: '',
  sortBy: 'ratingDesc',
  
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
    searchTerm: 's',
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
