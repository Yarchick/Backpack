declare global {
  interface Window {
    app: PIXI.Application;
    resources: PIXI.LoaderResource;
    appIsLoaded: boolean;
  }
}

export interface IApp {
  app: PIXI.Application;
  ticker: PIXI.Ticker;
  resources: PIXI.LoaderResource;
}

export interface IThingsData {
  columnCube: number;
  rowCube: number;
  cubeWidth: number;
  cubeHeight: number;
  imageName: string;
}
