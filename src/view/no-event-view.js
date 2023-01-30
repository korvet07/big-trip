import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPES} from '../constants.js';

const NoEventTextType = {
  [FILTER_TYPES.EVERYTHING]: 'Click New Event to create your first point',
  [FILTER_TYPES.FUTURE]: 'There are no future events now',
  [FILTER_TYPES.PAST]: 'There are no past events now',
};

const createNoEventsMsg = (filterType) => {
  const NoEventTextValue = NoEventTextType[filterType];

  return (
    `<p class="trip-events__msg">
      ${NoEventTextValue}
    </p>`);
};

export default class NoEventsView extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoEventsMsg(this.#filterType);
  }
}
