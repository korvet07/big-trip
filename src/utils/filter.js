import {FILTER_TYPES} from '../constants.js';
import dayjs from 'dayjs';

const isEventInFuture = (eventDate) => !dayjs().isAfter(eventDate, 'D');
const isEventInPast = (eventDate) => dayjs().isAfter(eventDate, 'D');

export const eventsByFilterType = {
  [FILTER_TYPES.EVERYTHING]: (events) => events,
  [FILTER_TYPES.FUTURE]: (events) => events.filter((event) => isEventInFuture(event.dateFrom)),
  [FILTER_TYPES.PAST]: (events) => events.filter((event) => isEventInPast(event.dateTo))
};
