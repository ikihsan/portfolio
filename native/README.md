# Native iOS wrapper for Ikhsan Portfolio

This folder contains the Capacitor configuration and generated native iOS project to run the existing Vite React web app as an iPhone app.

What's included
- Capacitor config pointing to the built web assets in `../dist`
- iOS Xcode project scaffold under `native/ios`
- NPM scripts to add/sync/open the iOS project

Build steps
1) From the project root, build the web app:
   - Windows PowerShell
     - `npm run build`
   This outputs the web bundle to `dist/`.

2) Sync web to iOS:
   - `cd native`
   - `npx cap sync ios`

3) Open and build in Xcode (macOS only):
   - `npx cap open ios` (requires Xcode installed)
   - In Xcode: select a Team, update bundle ID if needed, then Run on a simulator or a connected iPhone.

Notes
- On Windows you can prepare the iOS project, but the final signing/build must be performed on macOS with Xcode.
- To update the app after web code changes, run `npm run build` again at the root, then `npx cap sync ios` inside `native/`.
- Configure icons/splash screens by adding assets in the Xcode project’s Asset Catalog (AppIcon, LaunchScreen).

Troubleshooting
- If you see PostCSS ESM issues during build, ensure only `postcss.config.cjs` exists in the root (delete `postcss.config.js`).
- If the iOS simulator shows a white screen, re-run the steps: `npm run build` → `npx cap sync ios` → rebuild in Xcode.
