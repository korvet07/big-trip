import Observable from '../framework/observable.js';
import {UPDATE_TYPE} from '../constants.js';
export default class EventsModel extends Observable{
  #eventsApiService = null;
  #events = [];

  constructor(eventsApiService) {
    super();
    this.#eventsApiService = eventsApiService;
  }

  get events () {
    return this.#events;
  }

  init = async () => {
    try {
      const events = await this.#eventsApiService.events;
      this.#events = events.map(this.#adaptToClient);
    } catch(err) {
      this.#events = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  };

  updateEvent = async (updateType, updatedEvent) => {
    const updatedEventIndex = this.#events.findIndex((event) => event.id === updatedEvent.id);

    if (updatedEventIndex === -1) {
      throw new Error(`Can't update unexisting event, updatedEvent: ${updatedEvent}`);
    }

    try {
      const response = await this.#eventsApiService.updateEvent(updatedEvent);
      const updatedEventAdapt = this.#adaptToClient(response);
      this.#events = [
        ...this.#events.slice(0, updatedEventIndex),
        updatedEventAdapt,
        ...this.#events.slice(updatedEventIndex + 1),
      ];
      this._notify(updateType, updatedEventAdapt);
    } catch(err) {
      throw new Error(`Can't update event: ${err.message}. UpdatedEvent: ${updatedEvent}.`);
    }
  };

  addEvent = async (updateType, updatedEvent) => {
    try {
      const response = await this.#eventsApiService.addEvent(updatedEvent);
      const newEvent = this.#adaptToClient(response);
      this.#events = [
        newEvent,
        ...this.#events,
      ];

      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error(`Can't add task: ${err.message}.`);
    }
  };

  deleteEvent = async (updateType, eventToDelete) => {
    const index = this.#events.findIndex((event) => event.id === event.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting event');
    }

    try {
      await this.#eventsApiService.deleteEvent(eventToDelete);

      this.#events = this.#events.filter((event) => event.id !== eventToDelete.id);
      this._notify(updateType);
    } catch(err) {
      throw new Error(`Can't delete event: ${err.message}.`);
    }
  };

  #adaptToClient = (event) => {
    const adaptedEvent = {...event,
      basePrice: event['base_price'],
      dateFrom: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'],
      dateTo: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'],
      isFavorite: event['is_favorite']
    };

    delete adaptedEvent['base_price'];
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  };
}
