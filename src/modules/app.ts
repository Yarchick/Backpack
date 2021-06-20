import { gsap, PixiPlugin, MotionPathPlugin } from "gsap/all";
import config from "../config";

PIXI.utils.skipHello();
gsap.registerPlugin(PixiPlugin, MotionPathPlugin);

function app() {
  if (window.appIsLoaded && window.app) window.app.destroy();

  return (window.app = new PIXI.Application({
    view: document.getElementById("mainCanvas") as HTMLCanvasElement,
    width: config.matrix[1] * config.blockWidth+ config.matrix[1] * config.cageGap,
    height: config.matrix[0] * config.blockHeight + config.matrix[0] * config.cageGap,
    antialias: false,
    transparent: false
  }));
}

const ticker = PIXI.Ticker.shared;
ticker.maxFPS = 60;

export { app, ticker };
