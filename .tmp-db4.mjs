import { config } from "dotenv";
config({ path: ".env.local" });
import pg from "pg";
const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000 });
await client.connect();
const tests = [
  ["small", "select now() as v"],
  ["gen 136k text", "select repeat('a', 136455) as v"],
  ["gen 500k text", "select repeat('b', 500000) as v"],
];
for (const [name, sql] of tests) {
  const t = Date.now();
  const r = await client.query(sql);
  console.log(`${name}: ${Date.now()-t}ms len=${r.rows[0]?.v?.length}`);
}
await client.end();
