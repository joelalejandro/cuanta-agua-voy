import loadComponents from "./loader.js";
import EventEmitter from "./event-emitter.js";

export default class App {
  #events = new EventEmitter();
  #options = {
    wrapper: "main#app",
  };
  #wrapper = null;

  constructor(options) {
    this.#options = { ...this.#options, ...options };
    this.#wrapper = document.querySelector(this.#options.wrapper);
  }

  async initialize() {
    await loadComponents(this.#options.components);
    this.#wrapper.classList.add("ready");
    this.#events.trigger("ready");
  }

  onReady(callback) {
    this.#events.on("ready", callback);
  }
}
