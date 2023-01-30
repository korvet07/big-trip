export default class DestinationsModel {
  #eventsApiService = null;
  #destinations = [];

  constructor(eventsApiService) {
    this.#eventsApiService = eventsApiService;
  }

  get destinations () {
    return this.#destinations;
  }

  init = async () => {
    try {
      this.#destinations = await this.#eventsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
      throw new Error(`Can't get offers: ${err.message}`);
    }
  };
}
