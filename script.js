const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
  });
  const page = await browser.newPage();
  page.setViewport({
    width: 1000,
    height: 1000,
    deviceScaleFactor: 1,
  });
  await page.goto("http://localhost:4200/#/dashboard", {
    waitUntil: "networkidle2",
  });

  // scroll up and down, click on random links
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(50000);
  await page.keyboard.up("ArrowDown");
  await page.waitForTimeout(50000);
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(50000);
  await page.keyboard.up("ArrowUp");

  browser.close();
})();
