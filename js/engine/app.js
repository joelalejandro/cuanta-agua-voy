import EventEmitter from "./event-emitter.js";
import Registry from "./registry.js";

export default class App {
  #events = new EventEmitter();
  #registry = new Registry();
  #options = {
    wrapper: "main#app",
    components: [],
    services: {},
  };
  #wrapper = null;

  constructor(options) {
    this.#options = { ...this.#options, ...options };
    this.#wrapper = document.querySelector(this.#options.wrapper);

    this.#bindEvents();
  }

  #bindEvents() {
    this.onReady(() => {
      this.#wrapper.classList.add("ready");
    });
  }

  async initialize() {
    await this.#loadServices();
    await this.#loadComponents();
    this.#events.trigger("ready");
  }

  async #loadServices() {
    await Promise.all(
      this.#options.services.map((service) =>
        typeof service === "string"
          ? this.#registry.loadService(service, {})
          : this.#registry.loadService(service.name, service.options)
      )
    );
  }

  async #loadComponents() {
    await Promise.all(this.#options.components.map((component) => this.#registry.loadComponent(component)));
  }

  onReady(callback) {
    this.#events.on("ready", callback);
  }
}
