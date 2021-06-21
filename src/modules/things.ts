import { IApp } from "../interfaces/game";
import config from "../config";

import { IThingData } from "../interfaces/game";

class Things {
  thingsGraphics: PIXI.Graphics[] = [];

  constructor(
    { app, ticker, resources }: IApp,
    { thingsData }: { thingsData: IThingData[] },
    { setThingCageData, moveThing, setOnPlace, getThingData }
  ) {
    const thingsContainer = new PIXI.Container();
    thingsContainer.name = "things";

    thingsData.map((thingData: IThingData, index) => {
      const graphicsThingX = 0;
      const graphicsThingY = 0;
      const graphicsThingWidth = config.blockWidth * thingData.width + thingData.width;
      const graphicsThingHeight = config.blockHeight * thingData.height + thingData.height;

      const thingGraphics = new PIXI.Graphics();
      thingGraphics.beginFill(0x0080ff, 0);
      thingGraphics.drawRect(graphicsThingX, graphicsThingY, graphicsThingWidth, graphicsThingHeight);
      thingGraphics.endFill();

      const thingGraphicsBg = new PIXI.Graphics();
      thingGraphicsBg.beginFill(0x0080ff, 0.4);
      thingGraphicsBg.drawRect(graphicsThingX, graphicsThingY, graphicsThingWidth, graphicsThingHeight);
      thingGraphicsBg.endFill();
      thingGraphicsBg.alpha = 0;

      thingGraphics.x = thingData.column * config.blockWidth;
      thingGraphics.y = thingData.row * config.blockHeight;
      thingGraphics.interactive = true;

      const image = PIXI.Sprite.from(thingData.imageName);
      image.width = thingGraphics.width;
      image.height = thingGraphics.height;

      thingGraphics.addChild(thingGraphicsBg);
      thingGraphics.addChild(image);

      let takeShiftX = 0;
      let takeShiftY = 0;
      let allowMove = false;

      this.thingsGraphics.push(thingGraphics);

      thingGraphics.on("pointerdown", (event) => {
        this.setInteractive(thingGraphics);

        allowMove = true;
        takeShiftX = event.data.global.x - thingGraphics.x - 1;
        takeShiftY = event.data.global.y - thingGraphics.y - 1;

        const originalX = thingGraphics.x;
        const originalY = thingGraphics.y;
        this.takeThingGraphics(thingGraphics, { x: event.data.global.x - takeShiftX, y: event.data.global.y - takeShiftY });
        thingGraphicsBg.alpha = 1;

        setThingCageData({
          originalX,
          originalY,
          x: thingGraphics.x,
          y: thingGraphics.y,
          width: thingData.width * config.blockWidth,
          height: thingData.height * config.blockHeight,
          thingData: getThingData(index),
          index
        });
      });

      thingGraphics.on("pointermove", (event) => {
        if (!allowMove) return;

        this.takeThingGraphics(thingGraphics, { x: event.data.global.x - takeShiftX, y: event.data.global.y - takeShiftY });

        moveThing({
          x: thingGraphics.x,
          y: thingGraphics.y,
          width: thingData.width * config.blockWidth,
          height: thingData.height * config.blockHeight,
          thingData: getThingData(index),
          index
        });
      });

      thingGraphics.on("pointerup", () => {
        this.setInteractive();
        allowMove = false;

        thingGraphicsBg.alpha = 0;

        setOnPlace({ thingGraphics, index });
      });

      thingsContainer.addChild(thingGraphics);
    });

    app.stage.addChild(thingsContainer);
  }

  takeThingGraphics(thingGraphics: PIXI.Graphics, { x, y }) {
    thingGraphics.x = x;
    thingGraphics.y = y;
  }

  setInteractive(thingGraphics?: PIXI.Graphics) {
    this.thingsGraphics.forEach((itemThingGraphics) => {
      itemThingGraphics.interactive = thingGraphics ? false : true;
    });

    if (thingGraphics) {
      thingGraphics.interactive = true;
    }
  }
}

export default Things;
