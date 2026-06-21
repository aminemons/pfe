import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--no-sandbox", "--hide-scrollbars"],
  defaultViewport: { width: 1280, height: 720, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
await page.goto("http://127.0.0.1:3000/#/6", { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));

const out = await page.evaluate(() => {
  const revealEl = document.querySelector(".reveal");
  const secs = [...document.querySelectorAll(".reveal .slides > section")];
  const rows = secs.slice(4, 9).map((s, idx) => {
    const cs = getComputedStyle(s);
    return {
      i: idx + 4,
      cls: s.className.replace("h-full w-full", "").trim(),
      transform: cs.transform === "none" ? "none" : cs.transform.slice(0, 30),
      transition: cs.transitionProperty.slice(0, 30),
      display: cs.display,
      position: cs.position,
      visibility: cs.visibility,
      opacity: cs.opacity,
    };
  });
  return { revealClass: revealEl.className, rows };
});
console.log("reveal:", out.revealClass);
for (const r of out.rows) console.log(JSON.stringify(r));
await browser.close();
