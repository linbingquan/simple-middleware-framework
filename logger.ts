import { green } from "./deps.ts";
import { format } from "./deps.ts";

const User_Agent = "User-Agent";

/** logs requests */
export const logger = async (
  ctx: { request: any; url: any; responseTime: any },
  next: Function,
) => {
  const { request, url } = ctx;
  await next();
  const { responseTime = "" } = ctx;
  const User = request.headers.get(User_Agent);
  const now = format(new Date(Date.now()), "MM-dd-yyyy hh:mm:ss.SSS");
  const text: string =
    `[${now} logger] "${request.method} ${url.pathname}" ${User} ${responseTime}`;
  console.log(`${green(text)}`);
};

export const responseTime = async (
  ctx: any,
  next: Function,
) => {
  const start = Date.now();
  await next();
  const ms: number = Date.now() - start;
  ctx.responseTime = `${ms}ms`;
};
