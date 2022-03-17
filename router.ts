export class Router {
  map: Record<string, Function>;
  constructor() {
    this.map = {};
  }
  get(path: string, callback: Function) {
    this.map[path] = callback;
    return this;
  }
  routes() {
    const middleware = async (ctx: any, next: Function) => {
      const { pathname } = ctx.url;
      const callback = this.map[pathname];
      if (callback) {
        await callback(ctx);
      }
      await next();
    };
    return middleware;
  }
}
