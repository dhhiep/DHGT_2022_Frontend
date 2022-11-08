import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

export const isPresent = (value) => {
  return !isBlank(value);
};

export const isBlank = (value) => {
  if (isNumber(value) || value == true) {
    return false;
  }

  return isEmpty(value);
};
