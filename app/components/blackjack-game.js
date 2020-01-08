import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class BlackjackGameComponent extends Component {
  @service blackjack;

  @action
  hit() {
    this.blackjack.drawCard();
  }

  @action
  stand() {
    this.blackjack.endGame();
  }

  @action
  playAgain() {
    this.blackjack.initializeGame();
  }
}
