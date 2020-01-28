import Route from '@ember/routing/route';
// import RSVP from 'rsvp';
import { capitalize as capitalizeWords } from 'rarwe/helpers/capitalize';

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
      let name = capitalizeWords(band.name);
      document.title = `${name} songs - Rack & Roll`;
    },
  },
});
