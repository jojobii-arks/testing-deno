import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { z, ZodError } from "https://deno.land/x/zod@v3.19.1/mod.ts";
import redis from "./redis.ts";
import env from "./env.ts";

const app = new Application();

/** ----- */

const noteSchema = z.object({
  content: z.string().min(1, "required"),
});

/** ----- */

const router = new Router();

router
  .get("/", async ({ response }) => {
    response.body = { data: await redis.smembers("notes") };
  })
  .post("/", async ({ request, response }) => {
    try {
      const json = request.body({ type: "json" });
      const raw = await json.value;
      const input = noteSchema.parse(raw);
      const pl = redis.pipeline();
      pl.sadd("notes", input.content);
      pl.smembers("notes");
      const out = await pl.flush();
      if (out[0] === 0) {
        response.body = {
          error: "This note already exists.",
          data: out[1],
        };
        response.status = 409;
      } else {
        response.body = {
          message: "Note created.",
          data: out[1],
        };
        response.status = 201;
      }
    } catch (error) {
      response.body = error;
      if (error instanceof SyntaxError) {
        response.body = { error: "invalid JSON syntax" };
        response.status = 400;
      }
      if (error instanceof ZodError || error instanceof RangeError) {
        response.status = 400;
      } else {
        console.error(error);
        response.status = 500;
      }
    }
  })
  .delete("/", async ({ request, response }) => {
    try {
      const json = request.body({ type: "json" });
      const raw = await json.value;
      const input = noteSchema.parse(raw);
      const pl = redis.pipeline();
      pl.srem("notes", input.content);
      pl.smembers("notes");
      const out = await pl.flush();
      if (out[0] === 0) {
        response.body = {
          error: "This note doesn't exist.",
          data: out[1],
        };
        response.status = 404;
      } else {
        response.body = {
          message: "Note removed.",
          data: out[1],
        };
        response.status = 201;
      }
    } catch (error) {
      response.body = error;
      if (error instanceof SyntaxError) {
        response.body = { error: "invalid JSON syntax" };
        response.status = 400;
      }
      if (error instanceof ZodError || error instanceof RangeError) {
        response.status = 400;
      } else {
        console.error(error);
        response.status = 500;
      }
    }
  });

app.use(router.routes());
app.use(router.allowedMethods());

/** ----- */

const webRouter = new Router();

webRouter
  .get("/web", async (context, next) => {
    try {
      await context.send({
        root: `${Deno.cwd()}/`,
        index: "index.html",
      });
    } catch (err) {
      console.error(err);
      await next();
    }
  });

app.use(webRouter.routes());
app.use(router.allowedMethods());

/** ----- */

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${
      hostname ??
        "localhost"
    }:${port}`,
  );
});

await app.listen({ port: Number(env.PORT) });
