import Cage from "./cage";
import Things from "./things";
import { IApp } from "../interfaces/game";

import { IMatrix, IThingData } from "../interfaces/game";
import config from "../config";

class Modules {
  matrix = [];
  updatedMatrix = [];
  thingsData = [
    { row: 0, column: 0, width: 2, height: 3, imageName: "1" },
    { row: 2, column: 10, width: 4, height: 2, imageName: "2" },
    { row: 4, column: 5, width: 2, height: 3, imageName: "3" },
    { row: 6, column: 0, width: 2, height: 3, imageName: "4" },
    { row: 8, column: 5, width: 2, height: 3, imageName: "5" },
    { row: 10, column: 0, width: 2, height: 3, imageName: "6" },
    { row: 12, column: 5, width: 10, height: 3, imageName: "7" },
    { row: 16, column: 0, width: 2, height: 3, imageName: "8" },
    { row: 18, column: 5, width: 3, height: 3, imageName: "9" }
  ];

  cage: Cage;
  things: Things;

  constructor({ app, ticker, resources }: IApp) {
    this.createMatrix();
    this.updateMatrix(this.matrix, this.thingsData);

    this.cage = new Cage({ app, ticker, resources }, { matrix: this.updatedMatrix }, { updateData: this.updateData.bind(this) });
    this.things = new Things(
      { app, ticker, resources },
      { thingsData: this.thingsData },
      {
        setThingCageData: this.cage.setThingCageData.bind(this.cage),
        moveThing: this.cage.moveThing.bind(this.cage),
        setOnPlace: this.cage.setOnPlace.bind(this.cage),
        getThingData: this.getThingData.bind(this)
      }
    );
  }

  createMatrix = () => {
    const matrix = [];

    for (let row = 0; row <= config.matrix[0] - 1; row++) {
      const rowArray = [];
      for (let column = 0; column < config.matrix[1]; column++) {
        rowArray.push({ row, column, takenCube: false });
      }
      matrix.push(rowArray);
    }

    this.matrix = matrix;
  };

  updateMatrix = (matrix: IMatrix[][], thingsData: IThingData[]) => {
    const takenMatrixItems: { row: number; column: number }[] = [];

    thingsData.forEach((thingData) => {
      for (let indexHeight = 0; indexHeight < thingData.height; indexHeight++) {
        for (let indexWidth = 0; indexWidth < thingData.width; indexWidth++) {
          takenMatrixItems.push({ row: thingData.row + indexHeight, column: thingData.column + indexWidth });
        }
      }
    });

    const updatedMatrix = matrix.map((row: IMatrix[]) => {
      return row.map((matrixCube: IMatrix) => {
        takenMatrixItems.forEach((takenCube: { row: number; column: number }) => {
          if (matrixCube.row === takenCube.row && matrixCube.column === takenCube.column) {
            matrixCube = { row: matrixCube.row, column: matrixCube.column, takenCube: true };
          }
        });

        return matrixCube;
      });
    });

    this.updatedMatrix = updatedMatrix;
  };

  getThingData(index: number) {
    return this.thingsData[index];
  }

  updateData(row: number, column: number, index: number) {
    this.thingsData[index] = { ...this.thingsData[index], row, column };
    this.updateMatrix(this.matrix, this.thingsData);
    this.cage.setUpdatedMatrix(this.updatedMatrix);
  }
}

export default Modules;
