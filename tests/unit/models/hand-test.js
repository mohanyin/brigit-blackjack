import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Hand from 'brigit-blackjack/models/hand';
import Card from 'brigit-blackjack/models/card';

module('Unit | Model | hand', function(hooks) {
  setupTest(hooks);

  test('it can correctly calculate the value of the hand', function(assert) {
    const hand = new Hand([new Card({ value: '8' }), new Card({ value: 'QUEEN' })]);
    assert.equal(hand.value, 18);
  });

  test('it can correctly calculate the value of aces', function(assert) {
    const hand = new Hand([
      new Card({ value: '3' }),
      new Card({ value: 'ACE' }),
      new Card({ value: 'ACE' }),
      new Card({ value: 'ACE' })
    ]);
    assert.equal(hand.value, 16);
  });

  test('it can add a card', function(assert) {
    const hand = new Hand([new Card(), new Card()]);
    hand.addCard(new Card());
    assert.equal(hand.cards.length, 3);
  });
});
