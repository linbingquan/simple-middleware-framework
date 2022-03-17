/** @jsx h */
/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { serve } from "./deps.ts";
import { h, renderSSR } from "./deps.ts";
import { Application } from "./application.ts";
import { logger, responseTime } from "./logger.ts";
import { Router } from "./router.ts";

function Index() {
  return (
    <html>
      <body>index</body>
    </html>
  );
}

function Page404() {
  return (
    <html>
      <body>404</body>
    </html>
  );
}

const page_404 = async (ctx: any, next: Function) => {
  await next();
  if (ctx.reponse === undefined) {
    ctx.reponse = new Response(renderSSR(<Page404 />), {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }
};

const router = new Router();

router.get("/", async (ctx: any) => {
  ctx.reponse = new Response(renderSSR(<Index />), {
    headers: {
      "content-type": "text/html; charset=utf-8",
    },
  });
});

const app = new Application();

app.use(logger);
app.use(responseTime);
app.use(router.routes());
app.use(page_404);

async function handler(request: Request) {
  const url = new URL(request.url);

  app.context = { request, url };

  await app.dispatch();

  return app.context.reponse;
}

console.log("Listening on http://localhost:8000");
serve(handler);
