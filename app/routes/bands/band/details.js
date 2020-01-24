import Route from '@ember/routing/route';
export default Route.extend({
  model() {
    return this.modelFor('bands.band');
  },
  // setupController: function(controller, model) {
  //   this._super(controller, model);
  //   controller.set('isEditing', false);
  // },

  actions: {
    didTransition() {
      let band = this.modelFor(this.routeName);
      document.title = `${band.name} info - Rock & Roll`;
      // this.set('isEditing', false); Why would this not work to reset the flag? Something to do with not setting variables in this function?
      this.controller.set('isEditing', false);
    },
    willTransition(transition) {
      if (this.controller.isEditing) {
        let leave = window.confirm('Are you sure?');
        if (!leave) {
          transition.abort();
        }
      }
    },
  }
});
