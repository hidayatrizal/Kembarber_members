import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 417, height: 926 }, colorScheme: "light" });
await page.goto("http://localhost:3300/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.evaluate(() => document.fonts.ready);
const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  const cs = getComputedStyle(main);
  return {
    font: cs.fontFamily,
    androidVar: cs.getPropertyValue("--font-android"),
    roboto: Array.from(document.fonts).filter(f => /Roboto/i.test(f.family)).map(f => f.family + ":" + f.status).slice(0, 3),
    h1: main?.querySelector("h1") ? getComputedStyle(main.querySelector("h1")).fontFamily : null,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.screenshot({ path: ".tmp-light.png" });
await page.evaluate(() => localStorage.setItem("kb-theme", "dark"));
await page.reload({ waitUntil: "domcontentloaded" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(300);
await page.screenshot({ path: ".tmp-dark.png" });
await page.evaluate(() => {
  const scroll = document.querySelector(".welcome-viewport");
  scroll?.scrollTo({ top: scroll.scrollHeight });
});
await page.waitForTimeout(400);
await page.screenshot({ path: ".tmp-bottom.png" });
await browser.close();
