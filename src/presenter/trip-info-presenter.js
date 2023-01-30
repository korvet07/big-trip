import {render, replace, remove, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #eventsModel = null;
  #offersModel = null;
  #tripInfoComponent = null;
  #prevTripInfoComponent = null;

  constructor(tripInfoContainer, eventsModel, offersModel) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#eventsModel = eventsModel;
    this.#offersModel = offersModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
  }

  init = () => {
    this.#prevTripInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView(this.#eventsModel.events, this.#offersModel);

    if (this.#prevTripInfoComponent === null && this.#eventsModel.events !== 0) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, this.#prevTripInfoComponent);
    remove(this.#prevTripInfoComponent);
  };

  destroy = () => {
    remove(this.#tripInfoComponent);
  };

  #handleModelEvent = () => {
    if (this.#eventsModel.events.length === 0) {
      remove(this.#tripInfoComponent);
      this.#prevTripInfoComponent = null;
      this.#tripInfoComponent = null;
      return;
    }
    this.init();
  };
}
