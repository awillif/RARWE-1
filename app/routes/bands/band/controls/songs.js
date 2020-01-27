import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  model() {
    return this.modelFor('bands.band');
  },
  // model() {
  //   return RSVP.reject(this.modelFor('bands.band'));
  // },
    
  resetController(controller) {
    controller.setProperties({
      isAddingSong: false,
      newSongTitle: ''
    });
  },
  actions: {
    didTransition() {
      let band = this.modelFor(this.routeName);
      document.title = `${band.name} songs - Rock & Roll`;
    },
  },
});
