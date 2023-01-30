import Observable from '../framework/observable.js';
import {FILTER_TYPES} from '../constants.js';

export default class FilterModel extends Observable {
  #activeFilter  = FILTER_TYPES.EVERYTHING;

  get activeFilter () {
    return this.#activeFilter;
  }

  setFilter = (updateType, activeFilter) => {
    this.#activeFilter  = activeFilter;
    this._notify(updateType, activeFilter);
  };
}
