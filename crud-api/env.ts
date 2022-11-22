import { config } from "https://deno.land/std/dotenv/mod.ts";
await config({
  export: true,
  safe: true,
  example: ".env.example",
  defaults: ".env.example",
});
const env = Deno.env.toObject();

export default env;
