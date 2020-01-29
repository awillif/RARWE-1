import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { buildValidations } from 'ember-cp-validations';
import emailFieldValidation from 'rarwe/validations/email-field';
import passwordFieldValidation from 'rarwe/validations/password-field';

const Validations = buildValidations({
    email: emailFieldValidation,
    password: passwordFieldValidation
});

export default Controller.extend(Validations, {
    session: service(),
    router: service(),

    showErrors: computed('_showErrors', {
        get() {
          return this._showErrors || {
            email: false,
            password: false
          };
        },
        set(key, value) {
          this.set('_showErrors', value);
          return this._showErrors;
        }
      }),

    actions: {
        async signIn(event) {
            event.preventDefault();
            let { email, password } = this;
            await this.session.authenticate('authenticator:credentials', email, password);
            await this.router.transitionTo('bands');
        }
    }
})
