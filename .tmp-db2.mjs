import { config } from "dotenv";
config({ path: ".env.local" });
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
await client.connect();
for (let i = 0; i < 3; i++) {
  const t = Date.now();
  const r = await client.query("select history_image from shop_settings where id = $1", ["main"]);
  console.log(`run ${i+1}: ${Date.now()-t}ms bytes=${r.rows[0]?.history_image?.length}`);
}
const t2 = Date.now();
const b = await client.query("select length(encode(history_image,'base64')) as n from shop_settings where id='main'");
console.log("base64 len ms:", Date.now()-t2, b.rows);
await client.end();
