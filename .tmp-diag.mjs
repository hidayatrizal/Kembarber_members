import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 417, height: 926 } });
await page.goto("http://localhost:3100/", { waitUntil: "domcontentloaded", timeout: 60000 });
const info = await page.evaluate(() => {
  const main = document.querySelector("main");
  const cs = main ? getComputedStyle(main) : null;
  const body = document.body;
  return {
    className: main?.className,
    font: cs?.fontFamily,
    robotoVar: cs?.getPropertyValue("--font-roboto"),
    androidVar: cs?.getPropertyValue("--font-android"),
    bodyFont: getComputedStyle(body).fontFamily,
    fonts: Array.from(document.fonts).filter(f => /Roboto/i.test(f.family)).map(f => f.family + ":" + f.status),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();

