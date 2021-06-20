import { IApp } from "../interfaces/game";
import config from "../config";

import { IThingsData } from "../interfaces/game";

class Things {
  thingsGraphics: PIXI.Graphics[] = [];

  constructor(
    { app, ticker, resources }: IApp,
    { matrix, thingsData }: { matrix: string[][]; thingsData: IThingsData[] },
    { setThingCageData, moveThing, setOnPlace, getThingData }
  ) {
    const thingsContainer = new PIXI.Container();
    thingsContainer.name = "things";

    thingsData.map((thingData, index) => {
      const graphicsThingX = 0;
      const graphicsThingY = 0;
      const graphicsThingWidth = config.blockWidth * thingData.cubeWidth + (thingData.cubeWidth - 1) * config.cageGap;
      const graphicsThingHeight = config.blockHeight * thingData.cubeHeight + (thingData.cubeHeight - 1) * config.cageGap;

      const thingGraphics = new PIXI.Graphics();
      thingGraphics.beginFill(0x0080ff, 1);
      thingGraphics.drawRect(graphicsThingX, graphicsThingY, graphicsThingWidth, graphicsThingHeight);
      thingGraphics.endFill();

      thingGraphics.x = thingData.columnCube * config.blockWidth + thingData.columnCube * config.cageGap;
      thingGraphics.y = thingData.rowCube * config.blockHeight + thingData.rowCube * config.cageGap;
      thingGraphics.alpha = 0.4;
      thingGraphics.interactive = true;

      const image = PIXI.Sprite.from(thingData.imageName);
      image.width = thingGraphics.width;
      image.height = thingGraphics.height;

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
        // takeShiftX = thingGraphics.width / 2;
        // takeShiftY = thingGraphics.height / 2;

        const originalX = thingGraphics.x;
        const originalY = thingGraphics.y;
        this.takeThingGraphics(thingGraphics, { x: event.data.global.x - takeShiftX, y: event.data.global.y - takeShiftY });

        setThingCageData({
          thingGraphics,
          originalX,
          originalY,
          x: thingGraphics.x,
          y: thingGraphics.y,
          width: thingData.cubeWidth * config.blockWidth,
          height: thingData.cubeHeight * config.blockHeight,
          thingData: getThingData(index),
          index
        });
      });

      const mouseup = () => {
        this.setInteractive();
        allowMove = false;

        setOnPlace({
          thingGraphics,
          x: thingGraphics.x,
          y: thingGraphics.y,
          width: thingData.cubeWidth * config.blockWidth,
          height: thingData.cubeHeight * config.blockHeight,
          thingData: getThingData(index),
          index
        });
      };

      thingGraphics.on("pointerup", () => {
        mouseup();
      });

      thingGraphics.on("pointermove", (event) => {
        if (!allowMove) return;

        thingGraphics.x = event.data.global.x - takeShiftX;
        thingGraphics.y = event.data.global.y - takeShiftY;

        moveThing({
          x: thingGraphics.x,
          y: thingGraphics.y,
          width: thingData.cubeWidth * config.blockWidth,
          height: thingData.cubeHeight * config.blockHeight,
          thingData: getThingData(index),
          index
        });
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
