import Service from '@ember/service';
import fetch from 'fetch';
import Card from 'brigit-blackjack/models/card';

// Reference for Cards API can be found here: http://deckofcardsapi.com/
export default class CardsApiService extends Service {
  createNewDeck() {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(responseJSON => responseJSON.deck_id);
  }

  drawCards(deckId, numCards = 1) {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards}`)
      .then(response => response.json())
      .then(responseJSON => {
        return responseJSON.cards.map(cardData => {
          return Card.createFromAPIData(cardData);
        });
      });
  }
}
