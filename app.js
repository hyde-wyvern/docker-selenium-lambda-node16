"use strict";
const path = require("path");
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

module.exports.main = async (event) => {
    const eventData = event.body;
    const buffer = new Buffer.from(eventData, 'base64');
    const requestString = buffer.toString('ascii');
    const requestJson = JSON.parse(requestString);

    const chromedriverLocation = path.join(__dirname, 'lib', 'chromedriver');
    const binaryLocation = path.join(__dirname, 'lib', 'chrome');
    const service = new chrome.ServiceBuilder(chromedriverLocation);
    const options = new chrome.Options();

    options.setChromeBinaryPath(binaryLocation);
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--single-process');
    options.addArguments('--disable-dev-shm-usage');

    const driver = new webdriver.Builder()
    .setChromeOptions(options)
    .setChromeService(service)
    .forBrowser('chrome')
    .build();

    await driver.get(requestJson.url);
    const title = await driver.getTitle();
  
    const response = {
    statusCode: 200,
    body: `The page title of "${requestJson.url}" is: ${title}`
    };
    return response;

};