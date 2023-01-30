import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeEventDate, calculateDateDif} from '../utils/event.js';
import {POINT_TYPES} from '../constants.js';
import {getOffersByType} from '../utils/offers.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';

import 'flatpickr/dist/flatpickr.min.css';

const NEW_EVENT = {
  basePrice: 0,
  dateFrom: `${humanizeEventDate(dayjs(),'YYYY-MM-DD[T]HH:mm:ss[.375Z]')}`,
  dateTo: `${humanizeEventDate(dayjs().add(1, 'h'),'YYYY-MM-DD[T]HH:mm:ss[.375Z]')}`,
  destination: {
    description: '',
    name: '',
    pictures: []
  },
  isFavorite: false,
  offers: [],
  type: 'sightseeing'
};

const createDestinationsListTemplate = (destinations) => (
  `${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}`
);

const createTypeItemTemplate = (type, selectedType, id) => (
  `<div class="event__type-item">
    <input
      id="event-type-${type.toLowerCase()}-${id}"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type.toLowerCase()}"
      ${type.toLowerCase() === selectedType.toLowerCase()? 'checked' : ''}
    >
    <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.toLowerCase()}-${id}">${type}</label>
  </div>`
);

const createTypeListTemplate = (availableTypes, selectedType, id) => {
  const typeItemsTemplate = availableTypes
    .map((type) => createTypeItemTemplate(type, selectedType, id))
    .join('');

  return (
    `<fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${typeItemsTemplate}
    </fieldset>`
  );
};

const createOfferTemplate = (currentOffer, selectedOffers, isDisabled) => {
  const {id, title, price} = currentOffer;
  const isAlreadySelected = selectedOffers.find((selected) => title === selected.title);

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
             id="event-offer-${id}"
             type="checkbox"
             name="event-offer"
             value="${id}"
             ${isAlreadySelected ? 'checked' : ''}>
             ${isDisabled ? 'disabled' : ''}
      <label class="event__offer-label" for="event-offer-${id}">
        <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

const createOffersTemplate = (availableOffers, offers, isDisabled) => {
  if (availableOffers?.length === 0) {
    return '';
  }

  const selectedOffers = availableOffers.filter((offer) => offers.includes(offer.id));

  const offersListTemplate = availableOffers
    .map((offer) => createOfferTemplate(offer, selectedOffers, isDisabled))
    .join('');

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersListTemplate}
      </div>
    </section>`
  );
};

const createPicturesTemplate = (pictures) => (
  pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')
);

const createDestinationTemplate = (destination) => {
  if (!destination || !destination.name) {
    return  '';
  }

  const picturesTemplate = createPicturesTemplate(destination.pictures);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${picturesTemplate}
        </div>
      </div>
    </section>`
  );
};


const createEventEditTemplate = (event, destinationsСatalog, offersCatalog) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    id,
    offers,
    type,
    isDisabled,
    isSaving,
    isDeleting,
  } = event;

  const availableOffers = getOffersByType(offersCatalog, type)?.offers || [];
  const typesTemplate = createTypeListTemplate(POINT_TYPES, type, id);
  const offersTemplate = createOffersTemplate(availableOffers, offers);
  const destinationTemplate = createDestinationTemplate(destination);
  const destionationsListTemplate = createDestinationsListTemplate(destinationsСatalog);
  const isSubmitDisabled = basePrice === 0 || !destination.name || calculateDateDif(dateFrom, dateTo) === 0;
  const resetButtonName = id ? 'Delete' : 'Cancel';

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn ${isDisabled ? 'disabled' : ''}" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              ${typesTemplate}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output ${isDisabled ? 'disabled' : ''}" for="event-destination-1">
              ${type}
            </label>
            <input
              class="event__input
              event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${destination.name}"
              list="destination-list-${id}"
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-${id}">
              ${destionationsListTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-${id}"
              type="text"
              name="event-start-time"
              value="${humanizeEventDate(dateFrom, 'DD/MM/YY HH:mm')}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-${id}"
              type="text"
              name="event-end-time"
              value="${humanizeEventDate(dateTo, 'DD/MM/YY HH:mm')}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label ${isDisabled ? 'disabled' : ''}" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input  event__input--price"
              id="event-price-${id}"
              type="number"
              name="event-price"
              min="1"
              step="1"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>

          <button
            class="event__save-btn  btn  btn--blue"
            type="submit"
            ${isSubmitDisabled ? 'disabled' : ''}
          >
          ${isSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            class="event__reset-btn"
            type="reset"
            ${isDisabled ? 'disabled' : ''}
          >
          ${isDeleting ? 'Deleting...' : resetButtonName}
          </button>

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}
          ${destinationTemplate}
        </section>
      </form>
    </li>`
  );
};

export default class EventEditView extends AbstractStatefulView {
  #destinationsCatalog = null;
  #offersCatalog = null;
  #dateFromPicker = null;
  #dateToPicker = null;

  constructor(destinationsCatalog, offersCatalog, event = NEW_EVENT) {
    super();
    this._state = EventEditView.parseEventToState(event);
    this.#destinationsCatalog = destinationsCatalog;
    this.#offersCatalog = offersCatalog;

    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  get template() {
    return createEventEditTemplate(this._state, this.#destinationsCatalog, this.#offersCatalog);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  reset = (event) => {
    this.updateElement(EventEditView.parseEventToState(event));
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.#setDateFromPicker();
    this.#setDateToPicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupButtonClickHandler(this._callback.editClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EventEditView.parseStateToEvent(this._state));
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EventEditView.parseStateToEvent(this._state));
  };


  setRollupButtonClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      offers: [],
      type: evt.target.value,
    });
  };

  #destinationNameToggleHandler = (evt) => {
    evt.preventDefault();
    const enteredDestination = this.#destinationsCatalog.find((destination) => destination.name === evt.target.value);

    this.updateElement({
      destination: {
        name: enteredDestination?.name || '',
        description: enteredDestination?.description || '',
        pictures: enteredDestination?.pictures || [],
      }
    });
  };

  #dueDateFromChangeHandler = ([userDate]) => {
    this.updateElement({ dateFrom: dayjs(userDate).toDate().toISOString()});
  };

  #dueDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: dayjs(userDate).toDate().toISOString(),
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: Math.floor(Math.max(evt.target.value, null)),
    });
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();

    const offerIdNumber = Number(evt.target.value);
    let newSelectedOffers = [...this._state.offers];

    if (!newSelectedOffers.includes(offerIdNumber)) {
      newSelectedOffers.push(offerIdNumber);
    } else {
      newSelectedOffers = this._state.offers.filter((offerId) => offerId !== offerIdNumber);
    }

    this.updateElement({
      offers: newSelectedOffers,
    });
  };

  #setDateFromPicker = () => {
    if (this._state.dateFrom) {
      this.#dateFromPicker = flatpickr(
        this.element.querySelector('input[name="event-start-time"]'),
        {
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._state.dateFrom,
          enableTime: true,
          onClose: this.#dueDateFromChangeHandler,
        },
      );
    }
  };

  #setDateToPicker = () => {
    if (this._state.dateTo) {
      this.#dateToPicker = flatpickr(
        this.element.querySelector('input[name="event-end-time"]'),
        {
          dateFormat: 'd/m/Y H:i',
          defaultDate: this._state.dateTo,
          enableTime: true,
          onClose: this.#dueDateToChangeHandler,
        },
      );
    }
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationNameToggleHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);

    if (this.element.querySelector('.event__available-offers')) {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#offersChangeHandler);
    }
  };

  static parseEventToState = (event) => ({...event,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToEvent = (state) => {
    const event = {...state};
    delete event.isDisabled;
    delete event.isSaving;
    delete event.isDeleting;
    return event;
  };
}
