import AbstractView from '../framework/view/abstract-view.js';
import {humanizeEventDate, calculateDateDif} from '../utils/event.js';
import {getOffersByType} from '../utils/offers.js';

const createOfferTemplate = ({title, price}) => (
  `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`
);

const getOffersTemplate = (availableOffers, offers) => {
  const selectedOffers = availableOffers.filter((offer) => offers.includes(offer.id));

  return selectedOffers
    .map((offer) => createOfferTemplate(offer))
    .join('');
};

const createEventTemplate = (event, offersCatalog) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    isFavorite,
    offers,
    type
  } = event;

  const availableOffers = getOffersByType(offersCatalog, type)?.offers || [];
  const favoriteClass = isFavorite ? 'event__favorite-btn--active' : '';

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeEventDate(dateFrom,'YYYY-MM-DD')}">${humanizeEventDate(dateFrom,'DD MMM')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeEventDate(dateFrom,'YYYY-MM-DD[T]HH:mm')}">${humanizeEventDate(dateFrom,'HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeEventDate(dateTo,'YYYY-MM-DD[T]HH:mm')}">${humanizeEventDate(dateTo,'HH:mm')}</time>
        </p>
        <p class="event__duration">${calculateDateDif(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${getOffersTemplate(availableOffers, offers)}
      </ul>
      <button class="event__favorite-btn ${favoriteClass}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
};

export default class EventView extends AbstractView {
  #event = null;
  #offersCatalog = null;

  constructor(event, offersCatalog) {
    super();
    this.#event = event;
    this.#offersCatalog = offersCatalog;
  }

  get template() {
    return createEventTemplate(this.#event, this.#offersCatalog);
  }

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
