import Service, { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Hand from 'brigit-blackjack/models/hand';

export default class BlackjackService extends Service {
  @service cardsApi;

  @tracked playerHand;
  @tracked houseHand;
  @tracked hasGameEnded = false;

  deckId = null;

  get didPlayerWin() {
    if (!this.hasGameEnded) {
      return false;
    }

    return this.playerHand.value > this.houseHand.value && this.playerHand.value <= 21;
  }

  initializeGame() {
    this.hasGameEnded = false;

    return this.cardsApi
      .createNewDeck()
      .then(deckId => (this.deckId = deckId))
      .then(() => this.cardsApi.drawCards(this.deckId, 4))
      .then(initialCards => {
        this.playerHand = new Hand(initialCards.slice(0, 2));
        this.houseHand = new Hand(initialCards.slice(2));
      });
  }

  drawCard() {
    return this.cardsApi.drawCards(this.deckId, 1).then(([card]) => {
      this.playerHand.addCard(card);
    });
  }

  endGame() {
    this.hasGameEnded = true;
  }
}
