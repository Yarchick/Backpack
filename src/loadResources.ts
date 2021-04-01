import WebFont from "webfontloader";

interface IAssets {
  name: string;
  path: string;
}

export const webFontLoad = () => {
  WebFont.load({
    custom: {
      families: ["Roboto", "Roboto-Bold", "Roboto-Medium", "Roboto-Light", "Times-New-Roman", "Lato"],
      urls: ["assets/fonts/fonts.css"]
    }
  });
};

function load(loader: PIXI.Loader, assets: IAssets[], onLoaded: (resources: PIXI.LoaderResource) => void) {
  webFontLoad();
  assets.forEach(({ name, path }) => loader.add(name, path));
  loader.load();

  loader.onComplete.add((data: PIXI.Loader, resources: PIXI.LoaderResource) => {
    onLoaded(resources);
  });
}

export default {
  load
};
