require("dotenv").config();

const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    product: "chrome",
    headless: false,
    devtools: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();

  const CHANNEL_ID = process.env.CHANNEL_ID;
  const DEFAULT_CHANNEL_ID = process.env.DEFAULT_CHANNEL_ID;
  const SERVER_ID = process.env.SERVER_ID;
  const USER_ID = process.env.USER_ID;
  const PASSWORD = process.env.PASSWORD;
  const MESSAGE = process.env.MESSAGE;
  // HELPER FUNCTIONS
  async function redirectToChannel(channelId = DEFAULT_CHANNEL_ID) {
    const serverSelector = `div[href="/channels/${SERVER_ID}/${channelId}"]`;
    await page.waitForSelector(serverSelector);
    await page.click(serverSelector);
    await page.waitForTimeout(1000);
    // for some reason one click isn't enough to load the page
    await page.click(serverSelector);

    const channelSelector = `a[href="/channels/${SERVER_ID}/${CHANNEL_ID}"]`;
    await page.waitForSelector(channelSelector);
    await page.click(channelSelector);
  }

  // START
  await page.goto("https://discord.com/login", {
    waitUntil: "networkidle2",
  });

  const emailSelector = 'input[name="email"]';
  await page.waitForSelector(emailSelector);
  await page.focus(emailSelector);
  await page.keyboard.type(USER_ID, { delay: 100 });

  const passwordSelector = 'input[name="password"]';
  await page.waitForSelector(passwordSelector);
  await page.focus(passwordSelector);
  await page.keyboard.type(PASSWORD, { delay: 100 });

  const buttonSelector = 'button[type="submit"]';
  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  await page.waitForNavigation({
    waitUntil: "networkidle2",
  });

  await page.waitForTimeout(5000);
  const closeModalButton = 'button[aria-label="Close"]';
  await page.waitForSelector(closeModalButton);
  await page.click(closeModalButton);

  await page.waitForTimeout(1000);
  await redirectToChannel();
  await page.waitForTimeout(1000);

  await page.waitForTimeout(1000);
  await page.focus(`div[data-list-id="members-${CHANNEL_ID}"]`);

  for (let index = 0; index < 100; index++) {
    await page.keyboard.press("ArrowDown");
    await page.waitForTimeout(50);
    await page.keyboard.press("ArrowDown");
  }

  for (let index = 0; index < 100; index++) {
    await page.keyboard.press("ArrowUp");
    await page.waitForTimeout(50);
    await page.keyboard.press("ArrowUp");
  }

  const onlineUsers = await page.$$(
    'rect[mask="url(#svg-mask-status-online)"]'
  );
  console.log(onlineUsers.length, "----length----");

  for (let index = 0; index < onlineUsers.length; index++) {
    const users = await page.$$('rect[mask="url(#svg-mask-status-online)"]');
    // only working for first 11 users ?
    [].forEach.call(users, async (user, i) => {
      if (i === index) {
        await user.click();
      }
    });
    await page.waitForTimeout(1000);
    await page.keyboard.type(MESSAGE, { delay: 100 });
    // await page.keyboard.press("Enter");

    await redirectToChannel(CHANNEL_ID);
  }

  // browser.close();
})();
