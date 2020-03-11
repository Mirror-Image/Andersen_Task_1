class Observer {
  constructor() {
    this.events = {};
  }

  subscribe(type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  unsubscribe(type, listener) {
    if (this.events[type]) {
      this.events[type] = this.events[type]
        .filter((func) => func !== listener);
    }
  }

  fire(type, arg) {
    if (this.events[type]) {
      this.events[type].forEach((listener) => listener(arg));
    }
  }
}

export const observer = new Observer();
