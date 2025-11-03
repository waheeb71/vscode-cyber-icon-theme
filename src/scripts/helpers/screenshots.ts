import { join } from 'node:path';
import puppeteer from 'puppeteer-core';

/**
 * Create a screenshot from an HTML file and save it as image.
 * @param filePath Path of an HTML file
 * @param fileName Name of the output image
 */
export const createScreenshot = async (filePath: string, fileName: string) => {
  // استخدم مسار Chrome على جهازك
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const htmlFilePath = join('file:', filePath);

  try {
    const page = await browser.newPage();
    await page.setViewport({
      width: 1000,
      height: 10,
    });

    await page.goto(htmlFilePath);

    await page.screenshot({
      path: `images/${fileName}.png`,
      omitBackground: true,
      fullPage: true,
    });

    await browser.close();
  } catch (error) {
    console.error(error);
    throw new Error('Could not create screenshot for a preview');
  } finally {
    // تأكد من إغلاق جميع الصفحات إذا بقيت مفتوحة
    const pages = await browser.pages();
    for (const page of pages) await page.close();
  }
};
