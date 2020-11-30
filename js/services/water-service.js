import EventEmitter from "../engine/event-emitter.js";

export default class WaterService {
  #events = new EventEmitter();
  #waterLog = [];
  #options = { goals: [1000, 1500, 2000], dehydrationTimeout: 14400, store: window.localStorage };
  #goals = [];
  #dehydrationTimer = null;
  #dayFinishedTimer = null;
  #store = null;

  constructor(options = {}) {
    this.#options = { ...this.#options, options };
    this.#setupGoals();
    this.#setupStore();
    this.#loadState();
    this.#setupEvents();
    this.#setupTimers();
  }

  logDrink(amount) {
    const now = new Date();
    const accumulated = this.waterDrank + amount;
    const log = {
      date: now.valueOf(),
      amount: amount,
      accumulated,
    };
    this.#waterLog.push(log);
    this.#events.trigger("waterDrank");
  }

  onWaterDrank(callback) {
    this.#events.on("waterDrank", callback);
  }

  onMilestone(callback) {
    this.#events.on("milestone", callback);
  }

  onDayFinished(callback) {
    this.#events.on("dayFinished", callback);
  }

  get waterDrank() {
    return this.#waterLog[this.#waterLog.length - 1]?.accumulated || 0;
  }

  get lastTimeDrankWater() {
    return this.#waterLog[this.#waterLog.length - 1].date;
  }

  get ultimateGoal() {
    return this.#goals[this.#goals.length - 1];
  }

  #setupGoals() {
    this.#goals = this.#options.goals.map((goal) => ({ targetAmount: goal, met: false }));
  }

  #setupStore() {
    this.#store = this.#options.store;
  }

  #setupEvents() {
    this.#events.on("waterDrank", () => this.#onWaterDrank());
  }

  #setupTimers() {
    if (this.#waterLog.length > 0) {
      this.#setupDayFinishedTimer();
      this.#setupDehydrationTimer();
    }
  }

  #loadState() {
    try {
      this.#waterLog = JSON.parse(this.#store.getItem("cav:water-log") || "[]");
      if (this.#store.getItem("cav:goals")) {
        this.#goals = JSON.parse(this.#store.getItem("cav:goals"));
      }
    } catch (error) {
      console.warn("Could not retrieve water logs from storage. Data store will begin a new log.");
      console.warn("Error was", error);
    }
  }

  #saveState() {
    this.#store.setItem("cav:water-log", JSON.stringify(this.#waterLog));
    this.#store.setItem("cav:goals", JSON.stringify(this.#goals));
  }

  #reset() {
    this.#waterLog = [];
    this.#goals = this.#goals.map((goal) => ({ ...goal, met: false }));
    this.#setupDehydrationTimer();
    this.#setupDayFinishedTimer();
    this.#saveState();
  }

  #onWaterDrank() {
    this.#checkMilestone();
    this.#setupDehydrationTimer();
    this.#setupDayFinishedTimer();
    this.#saveState();
  }

  #setupDehydrationTimer() {
    if (this.#dehydrationTimer) {
      clearTimeout(this.#dehydrationTimer);
    }

    this.#dehydrationTimer = setTimeout(() => this.#checkIfDehydrated(), this.#options.dehydrationTimeout * 1000);
  }

  #setupDayFinishedTimer() {
    if (this.#dayFinishedTimer) {
      clearTimeout(this.#dayFinishedTimer);
    }

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const remainingToMidnight = 86400 - hours * 60 * 60 - minutes * 60 - seconds;

    this.#dayFinishedTimer = setTimeout(() => {
      this.#events.trigger("dayFinished", {
        goals: this.#goals,
        log: this.#waterLog,
        accumulated: this.waterDrank,
      });
      this.#reset();
    }, remainingToMidnight * 1000);
  }

  #checkMilestone() {
    const milestone = this.#goals.find((goal) => this.waterDrank >= goal.targetAmount && !goal.met);
    if (milestone) {
      const index = this.#goals.indexOf(milestone);
      this.#goals[index].met = true;

      this.#events.trigger("milestone", milestone);
    }
  }

  #checkIfDehydrated() {
    if (this.waterDrank >= this.ultimateGoal) {
      return;
    }

    const now = new Date().valueOf();
    if (now - this.lastTimeDrankWater > this.#options.dehydrationTimeout) {
      this.#events.trigger("dehydrated");
    }
  }
}
