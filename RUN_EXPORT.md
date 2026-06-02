How to export manual pages to PNG (local steps)

1) Install Node.js (if not installed): https://nodejs.org/
2) In the workspace root, install Playwright:

```powershell
npm install playwright
```

3) Run the exporter:

```powershell
node scripts/export_manual_pages_playwright.js
```

Notes:
- The script loads `user_manual.html` from the repository root and looks for `div.page` elements.
- It uses a bounding-box clip to avoid flaky scrollIntoView calls.
- If a direct element screenshot fails, the script falls back to a full-page screenshot for that page.
- For higher-quality rasterization or batch conversions, consider installing ImageMagick or Ghostscript and converting `Questify_User_Manual.pdf` directly.
