import * as PIXI from "pixi.js";
import { gsap, PixiPlugin, MotionPathPlugin } from "gsap/all";
import DeviceDetector from "device-detector-js";

// ===== Import JS =====
import assetsConfig from "./assets/assetsConfig";
import loadResources from "./loadResources";
import config from "./config";

// ===== Import CSS =====
import "./assets/scss/common.scss";

PIXI.utils.skipHello();
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

const app = new PIXI.Application({
  view        : document.getElementById("mainCanvas") as HTMLCanvasElement,
  width       : 500,
  height      : 500,
  antialias   : false,
  transparent : false
});

const ticker  = PIXI.Ticker.shared;
ticker.maxFPS = 60;

const deviceDetector = new DeviceDetector();
const device         = deviceDetector.parse(navigator.userAgent);

function loadApp() {
  // ===== Load resources =====
  loadResources.load(PIXI.Loader.shared, assetsConfig(device.device.type), startApp);

  // ===== Start app =====
  function startApp(resources: PIXI.LoaderResource) {
    console.log(resources);
    ticker.add((delta: number) => {});
  }
}

loadApp();