import moment from 'moment';

export const formatDate = (dateString) => {
  return moment(dateString).format('YYYY-MM-DD');
};

export const toISOString = (date) => {
  return moment(date).toISOString();
};

export const formatDateRange = (start, end) => {
  return `${moment(start).format('MMM DD, YYYY')} - ${moment(end).format('MMM DD, YYYY')}`;
};
