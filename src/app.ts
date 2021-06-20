import * as PIXI from "pixi.js";

// ===== JS =====
import assetsConfig from "./assets/assetsConfig";
import loadResources from "./loadResources";

// ===== CSS =====
import "./assets/scss/main.scss";

// ===== Modules =====
import { app, ticker } from "./modules/app";
import Modules from "./modules";

window.PIXI = PIXI; // for development, pixi.js devtools need "window.PIXI"

function loadApp() {
  // ===== Load resources =====
  !window.appIsLoaded ? loadResources.load(PIXI.Loader.shared, assetsConfig(), startApp) : startApp();

  // ===== Start app =====
  function startApp() {
    new Modules({ app: app(), ticker, resources: window.resources });

    if (!window.appIsLoaded) {
      ticker.add((delta: number) => {});
    }
  }
}

if (!window.appIsLoaded) loadApp();

if (module.hot) {
  module.hot.accept();
  if (window.appIsLoaded) loadApp();
  window.appIsLoaded = true;
}
