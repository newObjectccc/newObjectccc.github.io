---
layout: doc
---

# chrome-extension-boilerplate

[Repo Link](https://github.com/newObjectccc/chrome-extension-boilerplate)

## Chrome Extension (MV3) Boilerplate with React18 & TypeScript & Vite & NextUI

English | [简体中文](https://github.com/newObjectccc/chrome-extension-boilerplate/blob/main/README-zh-Hans.md)

## Feature

- ✨ Watch your code and build your extension code to dist.
- 💥 Vite@5.1 supported.
- 💫 Beauty UI library NextUI@2.2.
- 🧨 This boilerplate adopts Manifest V3.
- 💖 TypeScript supported.

## Environment

I recommend setup your development environment to this below:

- node >= 20
- pnpm >= 8

## Usage

1. ```git clone git@github.com:newObjectccc/chrome-extension-boilerplate.git```
2. ```pnpm install```
3. ```pnpm start```

When the chrome launched, type "chrome://extensions" into the chrome address bar, then tap the Load unpacked button, and select the dist folder.

## TODO

vite v5.1.4 building for production...

✓ 33 modules transformed.

dist/index.html                   0.38 kB │ gzip:  0.25 kB

dist/assets/react-CHdo91hT.svg    4.13 kB │ gzip:  2.05 kB

dist/assets/index-DiwrgTda.css    1.39 kB │ gzip:  0.72 kB

dist/assets/index-C7lZPRrh.js   142.63 kB │ gzip: 45.83 kB

thanks to React framework, the js bundle has 142kb at least. i think its too big, so i considering to change to an other lightly framework.

## Reference

[Chrome Developer](https://developer.chrome.com/)
