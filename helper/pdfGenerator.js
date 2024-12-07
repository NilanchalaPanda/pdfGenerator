import pupp from "puppeteer";
import hbs from "handlebars";
import path from "path";
import fs from "fs-extra";

const compile = async function (templateName, data) {
  const templateFilePath = path.join(
    process.cwd(),
    "template",
    `${templateName}.hbs`
  );
  const html = await fs.readFile(templateFilePath, "utf-8");
  return hbs.compile(html)(data);
};

export const pdfGenerator = async (fileName, data) => {
  try {
    const browser = await pupp.launch({
      args: ["--no-sandbox"],
      headless: "new",
    });
    const page = await browser.newPage();

    const content = await compile("page", data);

    await page.setContent(content);
    await page.emulateMediaType("screen");

    const downloadPath = path.join(
      process.cwd(),
      "generatedFile",
      `${fileName}-${Date.now()}.pdf`
    );

    let buffer = await page.pdf({
      path: downloadPath,
      format: "A4",
      margin: { top: 20 },
      printBackground: true,
    });

    await browser.close();

    return buffer; // Return the buffer directly
  } catch (error) {
    console.error("Error in pdfGenerator:", error); // Log the error for debugging
    throw error; // Throw the actual error for handling in calling code
  }
};
