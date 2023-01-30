export default class OffersModel {
  #eventsApiService = null;
  #offers = [];

  constructor(eventsApiService) {
    this.#eventsApiService = eventsApiService;
  }

  get offers () {
    return this.#offers;
  }

  init = async () => {
    try {
      this.#offers = await this.#eventsApiService.offers;
    } catch(err) {
      this.#offers = [];
      throw new Error(`Can't get offers: ${err.message}`);
    }
  };
}
