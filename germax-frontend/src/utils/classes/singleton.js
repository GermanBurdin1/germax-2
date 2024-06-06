export class Singleton {
	static _instance = null;

	constructor() {
		if (Singleton._instance === null) {
			Singleton._instance = this;
		}
		return Singleton._instance;
	}

	static getInstance() {
		if (Singleton._instance === null) {
			Singleton._instance = new Singleton();
		}
		return Singleton._instance;
	}
}
