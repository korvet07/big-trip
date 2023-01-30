import dayjs from 'dayjs';

import {SORT_TYPES} from '../constants.js';

const dateCompare = (eventA, eventB) => dayjs(eventA.dateFrom) - dayjs(eventB.dateFrom);

const timeCompare = (eventA, eventB) => {
  const timeA = dayjs(eventA.dateTo).diff(dayjs(eventA.dateFrom));
  const timeB = dayjs(eventB.dateTo).diff(dayjs(eventB.dateFrom));
  return timeB - timeA;
};

const priceCompare = (eventB, eventA) => eventA.basePrice - eventB.basePrice;

export const getSortedEventsbyDate = (events) => events.sort(dateCompare);

export const getSortedEvents = (sortType, events) => (sortType === SORT_TYPES.TIME) ? events.sort(timeCompare) : events.sort(priceCompare);
