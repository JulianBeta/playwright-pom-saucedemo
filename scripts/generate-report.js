const fs = require('fs');
const path = require('path');
const reporter = require('multiple-cucumber-html-reporter');

const jsonBase = path.resolve('reports/json');
const outputBase = path.resolve('reports/html');

function listBrowsers(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
}

function hasJson(dir) {
  const p = path.join(dir, 'cucumber-report.json');
  return fs.existsSync(p);
}

function getRunStart(browser) {
  const startFile = path.join(jsonBase, browser, 'run-start.txt');
  if (fs.existsSync(startFile)) {
    try {
      const iso = fs.readFileSync(startFile, 'utf-8').trim();
      const d = new Date(iso);
      if (!isNaN(d.getTime())) return d;
    } catch {}
  }
  return new Date();
}

const browsers = listBrowsers(jsonBase).filter(b => hasJson(path.join(jsonBase, b)));

if (browsers.length === 0) {
  console.log('No JSON report files found. Skipping HTML report generation.');
  process.exit(0);
}

for (const b of browsers) {
  const jsonDir = path.join(jsonBase, b);
  const reportPath = path.join(outputBase, b);
  fs.mkdirSync(reportPath, { recursive: true });
  const runStart = getRunStart(b);
  const runEnd = new Date();
  reporter.generate({
    jsonDir,
    reportPath,
    reportName: `Cucumber Report - ${b}`,
    pageTitle: `Automation Report - ${b}`,
    displayDuration: true,
    durationInMS: false,
    metadata: {
      browser: {
        name: b,
        version: 'latest'
      },
      device: 'Local',
      platform: {
        name: process.platform,
        version: process.version
      }
    },
    customData: {
      title: 'Run info',
      data: [
        { label: 'Execution Start Time', value: runStart.toLocaleString(undefined, { hour12: false }) },
        { label: 'Execution End Time', value: runEnd.toLocaleString(undefined, { hour12: false }) }
      ]
    }
  });
  console.log(`HTML report for ${b} generated at: ${reportPath}`);
}

// Root index linking to per-browser reports
fs.mkdirSync(outputBase, { recursive: true });
const links = browsers.map(b => `<li><a href="./${b}/index.html">${b} report</a></li>`).join('');
const indexHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Multiple Cucumber HTML Reports</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; }
      h1 { margin-bottom: 8px; }
      ul { line-height: 1.8; }
      a { color: #0a66c2; text-decoration: none; }
    </style>
  </head>
  <body>
    <h1>Multiple Cucumber HTML Reports</h1>
    <ul>${links}</ul>
  </body>
</html>`;
fs.writeFileSync(path.join(outputBase, 'index.html'), indexHtml, 'utf-8');
console.log(`Index page generated at: ${outputBase}/index.html`);
