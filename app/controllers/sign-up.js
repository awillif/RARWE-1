import Controller from '@ember/controller';
import { inject as service } from '@ember/service';


export default Controller.extend({
    router: service(),

    actions: {
        async signUp(event) {
            event.preventDefault();
            let { email, password } = this;
            let user = this.store.createRecord('user', { email, password});
            await user.save();
            await this.router.transitionTo('login');
        }
    }
});