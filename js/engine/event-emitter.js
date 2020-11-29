export default class EventEmitter {
  #events = {};

  #registerEventIfNeeded(eventName) {
    if (!(eventName in this.#events)) {
      this.#events[eventName] = [];
    }
  }

  trigger(eventName, ...params) {
    if (!(eventName in this.#events)) {
      return;
    }

    this.#events[eventName].forEach((callback) => {
      callback(...params);
    });
  }

  on(eventName, callback) {
    this.#registerEventIfNeeded(eventName);
    this.#events[eventName].push(callback);
  }

  once(eventName, callback) {
    this.#registerEventIfNeeded(eventName);
    const selfDestructiveCallback = (index) => () => {
      callback();
      this.#events[eventName].splice(index, 1);
    };
    this.#events[eventName].push(selfDestructiveCallback(this.#events[eventName].length));
  }

  off(eventName, callback) {
    if (!(eventName in this.#events)) {
      return;
    }

    this.#events[eventName] = this.#events[eventName].filter((registeredCallback) => callback === registeredCallback);
  }
}
