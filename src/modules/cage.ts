import gsap from "gsap";

import { IApp } from "../interfaces/game";
import config from "../config";

class Cube {
  matrix = [];
  allowLanding = false;

  thingData;

  updateData: (rowCube: number, columnCube: number, index: number) => void;

  constructor({ app, ticker, resources }: IApp, { matrix }, { updateData }) {
    const cubesContainer = new PIXI.Container();
    cubesContainer.name = "cube";

    this.updateData = updateData;

    matrix.forEach((row: string[], indexX: number) => {
      row.forEach((cubeName: string, indexY: number) => {
        const cubeGraphics = this.createGraphics(config.colors.yellow);
        const [rowCube, columnCube] = cubeName.split("_");

        cubeGraphics.x = indexY * (config.blockWidth + config.cageGap);
        cubeGraphics.y = indexX * (config.blockHeight + config.cageGap);
        cubeGraphics.name = cubeName;

        const cubeBorderRight = new PIXI.Graphics();
        cubeBorderRight.beginFill(0xaf601a, 1);
        cubeBorderRight.drawRect(0, 0, 1, config.blockHeight);
        cubeBorderRight.endFill();

        const cubeBorderBottom = new PIXI.Graphics();
        cubeBorderBottom.beginFill(0xaf601a, 1);
        cubeBorderBottom.drawRect(0, 0, config.blockWidth, 1);
        cubeBorderBottom.endFill();

        cubeGraphics.addChild(cubeBorderRight);
        cubeGraphics.addChild(cubeBorderBottom);
        cubesContainer.addChild(cubeGraphics);

        this.matrix.push({
          cubeName,
          cubeGraphics,
          x: cubeGraphics.x,
          y: cubeGraphics.y,
          rowCube: +rowCube,
          columnCube: +columnCube
        });
      });
    });

    app.stage.addChild(cubesContainer);
  }

  updateMatrix(updatedMatrix) {
    let count = 0;
    updatedMatrix.forEach((row: string[]) => {
      row.forEach((cubeName: string) => {
        this.matrix[count].cubeName = cubeName;
        count++;
      });
    });
  }

  createGraphics(color: number, graphics?: PIXI.Graphics): PIXI.Graphics {
    graphics && graphics.clear();

    const cubeGraphics = graphics || new PIXI.Graphics();
    cubeGraphics.beginFill(color, 1);
    cubeGraphics.drawRect(0, 0, config.blockWidth, config.blockHeight);
    cubeGraphics.endFill();

    return cubeGraphics;
  }

  setThingCageData({ thingGraphics, originalX, originalY, x, y, width, height, thingData, index }) {
    this.thingData = { thingGraphics, x: originalX, y: originalY, width, height, thingData, index };
    this.moveThing({ x, y, width, height, thingData });
  }

  moveThing({ x, y, width, height, thingData }) {
    const takenCubes = [];
    this.allowLanding = true;

    this.matrix.forEach((cubeData) => {
      if (
        cubeData.x + config.blockWidth >= x &&
        cubeData.x + config.blockWidth < x + width &&
        cubeData.y + config.blockHeight >= y &&
        cubeData.y + config.blockHeight < y + height
      ) {
        const [rowCube, columnCube, isTaken] = cubeData.cubeName.split("_");
        let color = +isTaken ? config.colors.red : config.colors.green;
        let taken = !!+isTaken;

        if (
          rowCube >= thingData.rowCube &&
          rowCube <= thingData.rowCube + thingData.cubeHeight - 1 &&
          columnCube >= thingData.columnCube &&
          columnCube <= thingData.columnCube + thingData.cubeWidth - 1
        ) {
          taken = false;
          color = config.colors.green;
        }

        if (taken) {
          this.allowLanding = false;
        }

        this.createGraphics(color, cubeData.cubeGraphics);
        takenCubes.push(cubeData);
        return;
      }

      this.createGraphics(config.colors.yellow, cubeData.cubeGraphics);
    });

    const { cubeWidth, cubeHeight } = this.thingData.thingData;
    if (takenCubes.length < cubeWidth * cubeHeight) {
      this.allowLanding = false;
    }

    return takenCubes;
  }

  setOnPlace({ thingGraphics, x, y, width, height, thingData, index }) {
    const takesCages = this.moveThing({ x, y, width, height, thingData });
    const thingGraphicsCoords = {
      x: 0,
      y: 0
    };

    if (!this.allowLanding) {
      thingGraphicsCoords.x = this.thingData.x;
      thingGraphicsCoords.y = this.thingData.y;
    } else {
      thingGraphicsCoords.x = takesCages[0].x;
      thingGraphicsCoords.y = takesCages[0].y;
      this.updateData(takesCages[0].rowCube, takesCages[0].columnCube, index);
    }

    gsap.to(thingGraphics, { duration: 0.05, x: thingGraphicsCoords.x, y: thingGraphicsCoords.y });

    this.matrix.forEach((cubeData) => {
      this.createGraphics(config.colors.yellow, cubeData.cubeGraphics);
    });
  }
}

export default Cube;
