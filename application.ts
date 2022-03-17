export class Application {
  callbacks: Function[];
  context: any;
  constructor(context?: any) {
    this.callbacks = [];
    this.context = context;
  }
  use(callback: Function) {
    this.callbacks.push(callback);
  }
  dispatch() {
    const { context, callbacks } = this;
    let index = -1;
    async function dispatch(i: number) {
      if (i <= index) {
        throw new Error("next() called multiple times.");
      }
      index = i;
      let fn: Function | undefined = callbacks[i];
      if (fn === undefined) {
        return;
      }
      if (fn) {
        await fn(context, dispatch.bind(null, i + 1));
      }
    }
    return dispatch(0);
  }
}
