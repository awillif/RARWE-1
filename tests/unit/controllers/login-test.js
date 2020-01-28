import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | login', function(hooks) {
  setupTest(hooks);
  // hooks.beforeEach(function() {
  //   this.owner.register('service:ajax');
  // });
  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:login');
    assert.ok(controller);
  });
});
