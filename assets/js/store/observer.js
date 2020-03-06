class Observer {
  constructor() {
    this.events = {};
  }

  subscribe(type, listener) {
    this.events[type] = this.events[type] || [];
    this.events[type].push(listener);
  }

  fire(type, arg) {
    if (this.events[type]) {
      this.events[type].forEach(listener => listener(arg));
    }
  }
}

export let observer = new Observer();