import { config } from "dotenv";
config({ path: ".env.local" });
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
await client.connect();
const tests = [
  ["hex text", "select history_image::text as v from shop_settings where id='main'"],
  ["b64 text", "select encode(history_image,'base64') as v from shop_settings where id='main'"],
  ["substr 8k bytea", "select substring(history_image from 1 for 8192) as v from shop_settings where id='main'"],
];
for (const [name, sql] of tests) {
  const t = Date.now();
  const r = await client.query(sql);
  const v = r.rows[0]?.v;
  console.log(`${name}: ${Date.now()-t}ms len=${v?.length} type=${typeof v}`);
}
await client.end();
