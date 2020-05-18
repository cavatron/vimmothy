const {Builder, By, Key, until } = require('selenium-webdriver');
const { PageLoadStrategy } = require('selenium-webdriver/lib/capabilities')
const chrome = require('selenium-webdriver/chrome')
const chromedriver = require('chromedriver')
const chokidar = require('chokidar');
const path = require('path');
const mkdirp = require('mkdirp');
const dotenv = require('dotenv');
const events = require('events');
const fs = require('fs');
const retry = require('async-retry');

const eventEmitter = new events.EventEmitter()

dotenv.config();

const dlPath = `${process.env.OUTPUT_DIR}/dl`;
 
(async () => {
  chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(
      new chrome.Options()
        .addArguments('--no-sandbox')
        .headless()
        .setPageLoadStrategy(PageLoadStrategy.NONE)
    )
    .build();
  

  const download = async (num) => {
    const watcher = chokidar
    .watch(dlPath, {
      ignored: /\.crdownload$/g,
      awaitWriteFinish: true
    }).on('ready', async () => {
      console.log(`Downloading #${num}`)
      try {
        await retry(async () => {
          await driver.get(`${process.env.BASE_URL}/${num}`);
          const el = await driver.wait(until.elementLocated(By.tagName('input[name="download"][value="Download"][type="button"]')), 10000)
          await el.click()
        }, {
          retries: 5,
          maxTimeout: 2000,
          onRetry() {
            console.log('Failed to click download button. Retrying...')
          }
        });

      } catch (error) {
        console.error(`Failed to click download button`, error)
      }
      
    })

    return new Promise(resolve => {
      watcher.on('add', async event => {
        console.log('Downloaded', event);
        fs.readdir(dlPath, async (err, files) => {
          fs.rename(`${dlPath}/${files[0]}`, `${process.env.OUTPUT_DIR}/${files[0]}`, async (err) => {
            await watcher.close()
            resolve()
          })
          
        })  
       
      })

    })
  }

  await mkdirp(dlPath)
  await driver.setDownloadPath(dlPath)

  const [start, end] = process.env.RANGE.split(',');

  for (let i = start; i <= end; i++) {
    await download(i)
  }

  fs.rmdir(dlPath, (err) => {
    if (err !== null) {
      console.log(err)
    }
  })

  await driver.close()
  process.exit(0)
  
})();

