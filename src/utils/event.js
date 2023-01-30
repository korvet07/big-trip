import dayjs from 'dayjs';

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 1440;
const DATE_WORD = {
  days: 'D',
  hours: 'H',
  minutes: 'M',
};

export const humanizeEventDate = (date, format) => dayjs(date).format(format);

export const calculateDateDif = (dateFrom, dateTo) => {
  const days = dayjs(dateTo).diff(dateFrom, 'day');
  const hours = dayjs(dateTo).diff(dateFrom, 'hour') - days * HOURS_IN_DAY;
  const minutes = dayjs(dateTo).diff(dateFrom, 'minute') - hours * MINUTES_IN_HOUR - days * MINUTES_IN_DAY;

  let dateDif = `${minutes + DATE_WORD.minutes}`;

  if (hours > 0) {
    dateDif = `${hours + DATE_WORD.hours} ${minutes + DATE_WORD.minutes}`;
  }

  if (days > 0) {
    dateDif = `${days + DATE_WORD.days} ${hours + DATE_WORD.hours} ${minutes + DATE_WORD.minutes}`;
  }

  if (minutes <= 0 && hours <= 0 && days <= 0) {
    return 0;
  }

  return dateDif;
};
