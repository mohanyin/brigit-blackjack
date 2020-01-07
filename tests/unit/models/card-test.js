import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Card from 'brigit-blackjack/models/card';

module('Unit | Model | card', function(hooks) {
  setupTest(hooks);

  test('it can correctly deserialize API data', function(assert) {
    const deserializedCard = Card.createFromAPIData({
      value: 'KING',
      suit: 'HEARTS',
      code: 'KH',
      image: 'https://deckofcardsapi.com/static/img/KH.png'
    });

    assert.equal(deserializedCard.suit, 'HEARTS');
    assert.equal(deserializedCard.value, 'KING');
    assert.equal(deserializedCard.imageURL, 'https://deckofcardsapi.com/static/img/KH.png');
  });

  test('it correctly calculates numerical value for normal cards', function(assert) {
    const normalCard = new Card({ value: '8' });
    assert.equal(normalCard.baseNumericalValue, 8);
  });

  test('it correctly calculates numerical value for face cards', function(assert) {
    const faceCard = new Card({ value: 'KING' });
    assert.equal(faceCard.baseNumericalValue, 10);
  });

  test('it correctly calculates numerical value for aces', function(assert) {
    const faceCard = new Card({ value: 'ACE' });
    assert.equal(faceCard.baseNumericalValue, 1);
  });
});
