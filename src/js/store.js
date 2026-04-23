/**
 * STORE.JS - QUẢN LÝ TRẠNG THÁI TOÀN CỤC (POC)
 */

class Store {
    constructor() {
        this.state = {
            user: null, // role: MB|BOD|PROJECT|ADMIN
            sites: [],
            activeSite: null,
            isLoading: false,
            notifications: []
        };
        this.listeners = [];
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

export const store = new Store();
