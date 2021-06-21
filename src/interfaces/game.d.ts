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

export interface IMatrix {
  row: number;
  column: number;
  takenCube: boolean;
}

export interface IThingData {
  row: number;
  column: number;
  width: number;
  height: number;
  imageName: string;
}
