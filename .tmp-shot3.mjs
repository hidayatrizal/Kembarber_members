import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 417, height: 926 } });
await page.goto("http://localhost:3200/", { waitUntil: "networkidle" });

const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  const header = document.querySelector("header");
  const cta = document.querySelector("a[href='/daftar']");
  const scroll = document.querySelector(".welcome-viewport");
  return {
    font: main ? getComputedStyle(main).fontFamily : null,
    headerHeight: header?.getBoundingClientRect().height,
    ctaHeight: cta?.getBoundingClientRect().height,
    scrollHeight: scroll?.scrollHeight,
    clientHeight: scroll?.clientHeight,
  };
});
console.log(JSON.stringify(info, null, 2));

await page.evaluate(() => {
  const scroll = document.querySelector(".welcome-viewport");
  scroll?.scrollTo({ top: scroll.scrollHeight });
});
await page.waitForTimeout(400);
await page.screenshot({ path: ".tmp-bottom.png" });

await browser.close();

