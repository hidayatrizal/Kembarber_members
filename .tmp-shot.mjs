import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath:
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});

const page = await browser.newPage({ viewport: { width: 417, height: 926 } });

await page.goto("http://localhost:3100/", { waitUntil: "networkidle" });
await page.screenshot({ path: ".tmp-light.png", fullPage: false });

await page.evaluate(() => {
  localStorage.setItem("kb-theme", "dark");
});
await page.reload({ waitUntil: "networkidle" });
await page.screenshot({ path: ".tmp-dark.png", fullPage: false });

await browser.close();
