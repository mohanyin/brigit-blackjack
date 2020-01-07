import { tracked } from '@glimmer/tracking';

export default class Card {
  suit = null;
  @tracked value = null;
  @tracked imageURL;

  constructor({ suit, value, imageURL } = {}) {
    this.suit = suit;
    this.value = value;
    this.imageURL = imageURL;
  }

  // NOTE: This always returns the value of an ace as 1.
  get baseNumericalValue() {
    switch (this.value) {
      case 'JACK':
      case 'QUEEN':
      case 'KING':
        return 10;
      case 'ACE':
        return 1;
      default:
        return Number.parseInt(this.value);
    }
  }

  static createFromAPIData(apiData) {
    return new Card({
      suit: apiData.suit,
      value: apiData.value,
      imageURL: apiData.image
    });
  }
}
