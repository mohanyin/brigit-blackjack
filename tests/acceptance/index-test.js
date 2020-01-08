import { module, test } from 'qunit';
import { visit, click } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

module('Acceptance | index', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function() {
    this.server.get('https://deckofcardsapi.com/api/deck/new/shuffle/', () => ({ deck_id: 'TEST-DECK-ID' }));
    this.server.get('https://deckofcardsapi.com/api/deck/:deckId/draw/', () => {
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
          },
          {
            image: 'https://deckofcardsapi.com/static/img/9C.png',
            value: '9',
            suit: 'CLUBS',
            code: '9C'
          },
          {
            image: 'https://deckofcardsapi.com/static/img/QS.png',
            value: 'QUEEN',
            suit: 'SPADES',
            code: 'QS'
          }
        ]
      };
    });

    await visit('/');
  });

  test('the game displays correctly', async function(assert) {
    assert.dom('[data-test-house-card-disclaimer]').hasText('(Currently Hidden)');

    assert.dom('[data-test-player-card-image]').exists({ count: 2 });
    const cardsImage = document.querySelector('[data-test-player-card-image]');
    assert.dom(cardsImage).hasAttribute('src', 'https://deckofcardsapi.com/static/img/8C.png');
  });

  test('the game allows the player to hit', async function(assert) {
    await click('[data-test-hit-button]');

    assert.dom('[data-test-player-card-image]').exists({ count: 3 });
  });

  test('it allows the player to stand', async function(assert) {
    await click('[data-test-stand-button]');

    assert.dom('[data-test-game-results]').hasText('You lost :(');
  });
});
