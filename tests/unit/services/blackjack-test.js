import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';
import { resolve } from 'rsvp';
import Card from 'brigit-blackjack/models/card';
import Hand from 'brigit-blackjack/models/hand';

module('Unit | Service | blackjack', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    this.service = this.owner.lookup('service:blackjack');
    this.cardsApiService = this.owner.lookup('service:cards-api');
  });

  module('initialization', function(hooks) {
    hooks.beforeEach(function() {
      sinon.stub(this.cardsApiService, 'createNewDeck').returns(resolve('TEST-DECK-ID'));
      sinon
        .stub(this.cardsApiService, 'drawCards')
        .returns(
          resolve([
            new Card({ value: 'KING' }),
            new Card({ value: 'KING' }),
            new Card({ value: '2' }),
            new Card({ value: '2' })
          ])
        );
    });

    test('it makes the correct api calls', async function(assert) {
      await this.service.initializeGame();

      assert.equal(this.cardsApiService.createNewDeck.callCount, 1, 'creates a new deck');
      assert.equal(this.cardsApiService.drawCards.callCount, 1, 'initializes the players and houses hands');
      assert.deepEqual(
        this.cardsApiService.drawCards.firstCall.args,
        ['TEST-DECK-ID', 4],
        'draws four cards using the correct deck ID'
      );
    });

    test('it gives each player two cards', async function(assert) {
      await this.service.initializeGame();

      assert.equal(this.service.playerHand.cards.length, 2, 'gives the player two cards');
      assert.equal(this.service.houseHand.cards.length, 2, 'gives the house two cards');
    });

    test('it resets the game ended flag', async function(assert) {
      this.service.hasGameEnded = true;

      await this.service.initializeGame();

      assert.notOk(this.service.hasGameEnded, 'flag is reset');
    });
  });

  test('it can draw new cards', async function(assert) {
    sinon.stub(this.cardsApiService, 'drawCards').returns(resolve([new Card({ value: 'KING' })]));

    this.service.deckId = 'FAKE-DECK-ID';
    this.service.playerHand = new Hand();

    await this.service.drawCard();

    assert.equal(this.cardsApiService.drawCards.callCount, 1, 'draws a card');
    assert.deepEqual(
      this.cardsApiService.drawCards.firstCall.args,
      ['FAKE-DECK-ID', 1],
      'draws one card using the correct deck ID'
    );

    assert.equal(this.service.playerHand.cards.length, 1);
  });

  module('after ending the game', function(hooks) {
    hooks.beforeEach(function() {
      this.service.endGame();
    });

    test('it ends the game', function(assert) {
      assert.ok(this.service.hasGameEnded);
    });

    test('it calculates the winner of the game', function(assert) {
      this.service.playerHand = new Hand([
        new Card({ value: '8' }),
        new Card({ value: 'ACE' }),
        new Card({ value: 'KING' })
      ]);
      this.service.houseHand = new Hand([new Card({ value: '8' }), new Card({ value: 'KING' })]);

      assert.ok(this.service.didPlayerWin);
    });

    test('it does not allow the player to exceed 21 points', function(assert) {
      this.service.playerHand = new Hand([
        new Card({ value: 'KING' }),
        new Card({ value: 'KING' }),
        new Card({ value: 'KING' })
      ]);
      this.service.houseHand = new Hand([new Card({ value: '8' }), new Card({ value: 'KING' })]);

      assert.notOk(this.service.didPlayerWin);
    });
  });
});
