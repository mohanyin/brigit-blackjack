import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | index', function(hooks) {
  setupTest(hooks);

  test('it initializes the game', function(assert) {
    const route = this.owner.lookup('route:index');
    const blackjackService = this.owner.lookup('service:blackjack');

    sinon.stub(blackjackService, 'initializeGame');

    route.model();

    assert.equal(blackjackService.initializeGame.callCount, 1);
  });
});
