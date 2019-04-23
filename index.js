const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");
const fs = require('fs');
const html = require('./html');

exports.handler = async (event, context) => {
  let result = null;
  let browser = null;
  const font = fs.readFileSync('./NotoColorEmoji.ttf');
  try {
    //add emoji ffont
    await chromium.font(font);

    // create browser
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath, //'google-chrome-unstable',
      headless: chromium.headless
    });

    const page = await browser.newPage();
    await page.setContent(html);
    const screenshotOptions = { encoding: "base64", type: "jpeg", quality: 81 };
    result = await page.screenshot(screenshotOptions);
    console.log(`data:image/jpeg;base64,${result}`);
  } catch (error) {
    return context.fail(error);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
  return `data:image/jpeg;base64,${result}`;
};
