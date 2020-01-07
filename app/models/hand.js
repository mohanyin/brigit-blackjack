import { tracked } from '@glimmer/tracking';

export default class Hand {
  @tracked cards;

  constructor(cards = []) {
    this.cards = cards;
  }

  get value() {
    let baseValue = 0;
    let numAces = 0;

    this.cards.forEach(card => {
      baseValue += card.baseNumericalValue;

      if (card.value === 'ACE') {
        numAces += 1;
      }
    });

    // Only a single ace per hand can count for 11 points
    // w/o exceeding the 21 point limit.
    if (baseValue <= 11 && numAces > 0) {
      return baseValue + 10;
    }

    return baseValue;
  }

  addCard(card) {
    this.cards.push(card);
  }
}
