import {render, replace, remove} from '../framework/render.js';
import FilterView from '../view/filter-view.js';
import {eventsByFilterType} from '../utils/filter.js';
import {FILTER_TYPES, UPDATE_TYPE} from '../constants.js';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #eventsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, eventsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#eventsModel = eventsModel;

    this.#eventsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const events = this.#eventsModel.events;

    return [
      {
        type: FILTER_TYPES.EVERYTHING,
        name: 'everything',
        count: eventsByFilterType[FILTER_TYPES.EVERYTHING](events).length,
      },
      {
        type: FILTER_TYPES.FUTURE,
        name: 'future',
        count: eventsByFilterType[FILTER_TYPES.FUTURE](events).length,
      },
      {
        type: FILTER_TYPES.PAST,
        name: 'past',
        count: eventsByFilterType[FILTER_TYPES.PAST](events).length,
      }
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView(filters, this.#filterModel.activeFilter);
    this.#filterComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  };

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#filterModel.activeFilter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UPDATE_TYPE.MINOR, filterType);
  };
}
