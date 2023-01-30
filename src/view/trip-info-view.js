import AbstractView from '../framework/view/abstract-view.js';
import {getSortedEventsbyDate} from '../utils/sort.js';
import {humanizeEventDate} from '../utils/event.js';
import {getOferrsCost} from '../utils/offers.js';

const TRIP_INFO_MAX_LENGTH = 3;

const createTripInfoTemplate = (sortedEvents, tripCost, tripDestinations) => {
  const startEventDate = humanizeEventDate(sortedEvents[0].dateFrom,'MMM DD');
  const endEventDate = humanizeEventDate(sortedEvents.at(-1).dateTo,'MMM DD');

  return (
    `<section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${tripDestinations}</h1>

          <p class="trip-info__dates">${startEventDate}&nbsp;&mdash;&nbsp;${endEventDate}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
        </p>
      </section>`
  );
};

export default class TripInfoView extends AbstractView {
  #sortedEvents = null;
  #offersCatalog = null;

  constructor(events, offersCatalog) {
    super();
    this.#sortedEvents = getSortedEventsbyDate(events);
    this.#offersCatalog = offersCatalog;
  }

  get template() {
    return createTripInfoTemplate(this.#sortedEvents, this.#getTripCost(), this.#getTripDestinations());
  }

  #getTripCost = () => this.#sortedEvents.reduce(
    (acc, { offers, type, basePrice }) => {
      const offersCost = getOferrsCost(this.#offersCatalog, offers, type);
      acc += offersCost + basePrice;
      return acc;
    },
    0);


  #getTripDestinations = () => {
    const startDestinationName =  this.#sortedEvents[0].destination.name;
    const endDestinationName = this.#sortedEvents.at(-1).destination.name;

    if (this.#sortedEvents.length > TRIP_INFO_MAX_LENGTH) {
      return `${startDestinationName} &mdash; ... &nbsp &mdash; ${endDestinationName}`;
    }

    return this.#sortedEvents.map(({ destination }) => `${destination.name}`).join(' &mdash; ');
  };
}
