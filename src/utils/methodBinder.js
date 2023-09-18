'use strict';

const getAllMethods = function (instance, cls) {
  return Object.getOwnPropertyNames(Object.getPrototypeOf(instance)).filter((name) => {
    let method = instance[name];
    return method instanceof Function && method !== cls;
  });
};

const bind = function (instance, cls) {
  getAllMethods(instance, cls).forEach((mtd) => {
    instance[mtd] = instance[mtd].bind(instance);
  });
};

export default bind;
