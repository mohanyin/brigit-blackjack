import Service from '@ember/service';
import fetch from 'fetch';
import Card from 'brigit-blackjack/models/card';

// Reference for Cards API can be found here: http://deckofcardsapi.com/
export default class CardsApiService extends Service {
  createNewDeck() {
    return fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.success === false) {
          throw new Error('Unable to create new deck');
        }

        return responseJSON.deck_id;
      })
      .catch(error => this.alert(error.message));
  }

  drawCards(deckId, numCards = 1) {
    return fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${numCards}`)
      .then(response => response.json())
      .then(responseJSON => {
        if (responseJSON.success === false) {
          throw new Error('Unable to draw cards');
        }

        return responseJSON.cards.map(cardData => {
          return Card.createFromAPIData(cardData);
        });
      })
      .catch(error => this.alert(error.message));
  }

  alert(message) {
    window.alert(message);
  }
}
