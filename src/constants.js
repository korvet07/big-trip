export const POINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

export const FILTER_TYPES = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past'
};

export const SORT_TYPES = {
  DAY: 'sort-day',
  PRICE: 'sort-price',
  TIME: 'sort-time'
};

export const USER_ACTION = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

export const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT'
};
