import BoardPresenter from './presenter/event-board-presenter.js';
import EventsApiService from './api-service/events-api-service.js';

import EventsModel from './model/events-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import DestinationsModel from './model/destinations-model.js';

const AUTHORIZATION = 'Basic 28d08vaL19Ya84t';
const END_POINT = 'https://17.ecmascript.pages.academy/big-trip';

const siteHeader = document.querySelector('.trip-main');
const siteFilter = siteHeader.querySelector('.trip-controls__filters');
const siteEvents = document.querySelector('.trip-events');

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);
const offersModel = new OffersModel(eventsApiService);
const destinationsModel = new DestinationsModel(eventsApiService);
const eventsModel = new EventsModel(eventsApiService);
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter(siteFilter, siteHeader, siteEvents, eventsModel, destinationsModel, offersModel, filterModel);


const loadDataFromServer = async () => {
  try {
    await destinationsModel.init();
    await offersModel.init();
  } catch {
    eventsModel.init();
  }
  eventsModel.init();
};

loadDataFromServer()
  .finally(() => {
    boardPresenter.init();
  });

