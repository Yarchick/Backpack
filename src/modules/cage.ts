import gsap from "gsap";

import { IApp, IMatrix } from "../interfaces/game";
import config from "../config";

interface ICageMatrix {
  row: number;
  column: number;
  takenCube: boolean;
  cubeGraphics: PIXI.Graphics;
  x: number;
  y: number;
}

class Cube {
  cageMatrix: ICageMatrix[] = [];
  takenCubes: ICageMatrix[] = [];
  allowLanding = false;

  thingData;

  updateData: (rowCube: number, columnCube: number, index: number) => void;

  constructor({ app, ticker, resources }: IApp, { matrix }: { matrix: IMatrix[][] }, { updateData }) {
    const cubesContainer = new PIXI.Container();
    cubesContainer.name = "cube";

    this.updateData = updateData;

    matrix.forEach((row: IMatrix[], indexX: number) => {
      row.forEach((cubeData: IMatrix, indexY: number) => {
        const cubeGraphics = this.createGraphics(config.colors.black);

        cubeGraphics.x = indexY * config.blockWidth;
        cubeGraphics.y = indexX * config.blockHeight;

        const cubeBorderRight = new PIXI.Graphics();
        cubeBorderRight.beginFill(config.colors.border, 1);
        cubeBorderRight.drawRect(0, 0, 1, config.blockHeight);
        cubeBorderRight.endFill();

        const cubeBorderBottom = new PIXI.Graphics();
        cubeBorderBottom.beginFill(config.colors.border, 1);
        cubeBorderBottom.drawRect(0, 0, config.blockWidth, 1);
        cubeBorderBottom.endFill();

        cubeGraphics.addChild(cubeBorderRight);
        cubeGraphics.addChild(cubeBorderBottom);
        cubesContainer.addChild(cubeGraphics);

        this.cageMatrix.push({
          ...cubeData,
          cubeGraphics,
          x: cubeGraphics.x,
          y: cubeGraphics.y
        });
      });
    });

    app.stage.addChild(cubesContainer);
  }

  setUpdatedMatrix(updatedMatrix: IMatrix[][]) {
    let count = 0;
    updatedMatrix.forEach((row: IMatrix[]) => {
      row.forEach((cubeData: IMatrix) => {
        this.cageMatrix[count] = { ...this.cageMatrix[count], ...cubeData };
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

  setThingCageData({ originalX, originalY, x, y, width, height, thingData, index }) {
    this.thingData = { x: originalX, y: originalY, width, height, thingData, index };
    this.moveThing({ x, y, width, height, thingData });
  }

  moveThing({ x, y, width, height, thingData }) {
    this.takenCubes = [];
    this.allowLanding = true;

    this.cageMatrix.forEach((cubeData: ICageMatrix) => {
      if (
        cubeData.x + config.blockWidth >= x &&
        cubeData.x + config.blockWidth < x + width &&
        cubeData.y + config.blockHeight >= y &&
        cubeData.y + config.blockHeight < y + height
      ) {
        let color = cubeData.takenCube ? config.colors.red : config.colors.green;
        let taken = cubeData.takenCube;

        if (
          cubeData.row >= thingData.row &&
          cubeData.row <= thingData.row + thingData.height - 1 &&
          cubeData.column >= thingData.column &&
          cubeData.column <= thingData.column + thingData.width - 1
        ) {
          taken = false;
          color = config.colors.green;
        }

        if (taken) {
          this.allowLanding = false;
        }

        this.createGraphics(color, cubeData.cubeGraphics);
        this.takenCubes.push(cubeData);
        return;
      }

      this.createGraphics(config.colors.black, cubeData.cubeGraphics);
    });

    if (this.takenCubes.length < this.thingData.thingData.width * this.thingData.thingData.height) {
      this.allowLanding = false;
    }
  }

  setOnPlace({ thingGraphics, index }) {
    const thingGraphicsCoords = { x: 0, y: 0 };

    if (!this.allowLanding) {
      thingGraphicsCoords.x = this.thingData.x;
      thingGraphicsCoords.y = this.thingData.y;
    } else {
      thingGraphicsCoords.x = this.takenCubes[0].x;
      thingGraphicsCoords.y = this.takenCubes[0].y;
      this.updateData(this.takenCubes[0].row, this.takenCubes[0].column, index);
    }

    gsap.to(thingGraphics, { duration: 0.05, x: thingGraphicsCoords.x, y: thingGraphicsCoords.y });

    this.cageMatrix.forEach((cubeData) => {
      this.createGraphics(config.colors.black, cubeData.cubeGraphics);
    });
  }
}

export default Cube;
