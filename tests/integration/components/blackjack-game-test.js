import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import Hand from 'brigit-blackjack/models/hand';
import Card from 'brigit-blackjack/models/card';

module('Integration | Component | blackjack-game', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(async function() {
    this.blackjackService = this.owner.lookup('service:blackjack');
    this.blackjackService.playerHand = new Hand([
      new Card({ value: '9', imageURL: 'https://fake.com/first' }),
      new Card({ value: '6', imageURL: 'https://fake.com/second' })
    ]);
    this.blackjackService.houseHand = new Hand([
      new Card({ value: '8', imageURL: 'https://fake.com/third' }),
      new Card({ value: '6', imageURL: 'https://fake.com/fourth' })
    ]);

    await render(hbs`<BlackjackGame/>`);
  });

  test('it renders initial state correctly', async function(assert) {
    await render(hbs`<BlackjackGame/>`);

    assert.dom('[data-test-house-header]').hasText('House Cards');
    assert.dom('[data-test-house-card-disclaimer]').hasText('(Currently Hidden)');

    assert.dom('[data-test-player-header]').hasText('Your Cards');
    assert.dom('[data-test-player-card-image]').exists({ count: 2 });

    assert.dom('[data-test-hit-button]').hasText('Hit');
    assert.dom('[data-test-stand-button]').hasText('Stand');
    assert.dom('[data-test-game-results]').doesNotExist();
    assert.dom('[data-test-play-again-button]').doesNotExist();
  });

  test('it allows the player to hit', async function(assert) {
    sinon.stub(this.blackjackService, 'drawCard');

    await click('[data-test-hit-button]');

    assert.equal(this.blackjackService.drawCard.callCount, 1);
  });

  module('after the game ends', function(hooks) {
    hooks.beforeEach(async function() {
      await click('[data-test-stand-button]');
    });

    test('it renders correctly', async function(assert) {
      assert.dom('[data-test-house-card-image]').exists({ count: 2 });
      assert.dom('[data-test-house-card-disclaimer]').doesNotExist();

      assert.dom('[data-test-game-results]').hasText('You won!');
      assert.dom('[data-test-play-again-button]').hasText('Play Again');
    });

    test('it allows the player to restart', async function(assert) {
      sinon.stub(this.blackjackService, 'initializeGame');

      await click('[data-test-play-again-button]');

      assert.equal(this.blackjackService.initializeGame.callCount, 1);
    });
  });
});
