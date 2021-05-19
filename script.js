const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    product:'chrome',
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: false,
    devtools: true,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto("http://localhost:4200/#/login", {
    waitUntil: "networkidle2",
  });

  const emailSelector = '#email'
  await page.waitForSelector(emailSelector)
  await page.focus(emailSelector)
  await page.keyboard.type('tester@yopmail.com',{delay: 100})

  const passwordSelector = '#password'
  await page.waitForSelector(passwordSelector)
  await page.focus(passwordSelector)
  await page.keyboard.type('12345678',{delay: 100})

  const buttonSelector = '#loginBtn'
  await page.waitForSelector(buttonSelector)
  await page.click(buttonSelector)

  await page.waitForTimeout(5000)
  await autoScroll(page)
  await page.waitForTimeout(5000)

  const userSelector = 'a[href="#/pages/users"]'
  const vendorSelector = 'a[href="#/pages/vendors"]'
  const orderSelector = 'a[href="#/pages/orderlist"]'

  while(true){
    await page.waitForSelector(userSelector)
    await page.click(userSelector)
  
    await page.waitForTimeout(5000)
    await autoScroll(page)
    await page.waitForTimeout(5000)
  
    await page.waitForSelector(vendorSelector)
    await page.click(vendorSelector)
  
    await page.waitForTimeout(5000)
    await autoScroll(page)
    await page.waitForTimeout(5000)
  
    await page.waitForSelector(orderSelector)
    await page.click(orderSelector)
  
    await page.waitForTimeout(5000)
    await autoScroll(page)
    await page.waitForTimeout(5000)
  
    await page.waitForSelector(userSelector)
    await page.click(userSelector)
  
    await page.waitForTimeout(5000)
    await autoScroll(page)
    await page.waitForTimeout(5000)
  }
  

  browser.close();
})();

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}
