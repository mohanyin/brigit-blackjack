import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import Card from 'brigit-blackjack/models/card';

module('Unit | Service | cards-api', function(hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:cards-api');
  });

  test('it can correctly create a new deck', async function(assert) {
    this.server.get('https://deckofcardsapi.com/api/deck/new/shuffle/', (db, request) => {
      assert.equal(request.queryParams.deck_count, 1, 'requests the correct number of decks');
      return { deck_id: 'TEST-DECK-ID' };
    });

    const newDeckId = await this.service.createNewDeck();
    assert.equal(newDeckId, 'TEST-DECK-ID', 'returns the correct deck ID');
  });

  test('it can correctly draw cards', async function(assert) {
    this.server.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', (db, request) => {
      assert.equal(request.params.deckId, 'FAKE-DECK-ID', 'requests the correct deck');
      assert.equal(request.queryParams.count, 17, 'requests the correct number of cards');
      return {
        cards: [
          {
            image: 'https://deckofcardsapi.com/static/img/8C.png',
            value: '8',
            suit: 'CLUBS',
            code: '8C'
          },
          {
            image: 'https://deckofcardsapi.com/static/img/AS.png',
            value: 'ACE',
            suit: 'SPADES',
            code: 'AS'
          }
        ]
      };
    });

    const cards = await this.service.drawCards('FAKE-DECK-ID', 17);
    assert.equal(cards.length, 2, 'returns every card');
    assert.ok(cards[0] instanceof Card, 'converts api data into Card models');
  });
});
