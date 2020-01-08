import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import Card from 'brigit-blackjack/models/card';

module('Integration | Component | card-carousel', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders correctly', async function(assert) {
    this.cards = [
      new Card({ value: '9', imageURL: 'https://fake.com/first' }),
      new Card({ value: '6', imageURL: 'https://fake.com/second' })
    ];

    await render(hbs`<CardCarousel @cards={{this.cards}}/>`);

    assert.equal(this.element.textContent.trim(), '');

    assert.dom('img').exists({ count: 2 });

    const cardsImages = document.querySelectorAll('img');
    assert.dom(cardsImages[0]).hasAttribute('src', 'https://fake.com/first');
    assert.dom(cardsImages[1]).hasAttribute('src', 'https://fake.com/second');
  });
});
