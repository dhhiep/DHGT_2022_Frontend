import transform from 'lodash/transform';
import camelCase from 'lodash/camelCase';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import snakeCase from 'lodash/snakeCase';

export const snakeToCamelCase = (obj) =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key);

    acc[camelKey] = isObject(value) ? snakeToCamelCase(value) : value;
  });

export const camelToSnakeCase = (obj) =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key);

    acc[camelKey] = isObject(value) ? camelToSnakeCase(value) : value;
  });
