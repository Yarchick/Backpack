import Cage from "./cage";
import Things from "./things";
import { IApp } from "../interfaces/game";

import { IThingsData } from "../interfaces/game";
import config from "../config";

class Modules {
  matrix = [];
  updatedMatrix = [];
  takenMatrixItems = [];
  thingsData = [
    { rowCube: 0, columnCube: 0, cubeWidth: 13, cubeHeight: 13, imageName: "1" },
    { rowCube: 1, columnCube: 5, cubeWidth: 13, cubeHeight: 15, imageName: "2" },
    // { rowCube: 7, columnCube: 5, cubeWidth: 13, cubeHeight: 14, imageName: "3" },
    // { rowCube: 4, columnCube: 0, cubeWidth: 13, cubeHeight: 13, imageName: "4" },
    // { rowCube: 12, columnCube: 0, cubeWidth: 15, cubeHeight: 17, imageName: "5" },
    // { rowCube: 14, columnCube: 5, cubeWidth: 17, cubeHeight: 14, imageName: "6" }
  ];

  cage: Cage;
  things: Things;

  constructor({ app, ticker, resources }: IApp) {
    this.createMatrix();
    this.setTakingMatrixItems(this.matrix, this.thingsData);

    this.cage = new Cage({ app, ticker, resources }, { matrix: this.updatedMatrix }, { updateData: this.updateData.bind(this) });
    this.things = new Things(
      { app, ticker, resources },
      { matrix: this.matrix, thingsData: this.thingsData },
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

    for (let row = 0; row <= config.matrix[0]; row++) {
      const rowArray = [];
      for (let column = 0; column < config.matrix[1]; column++) {
        rowArray.push(`${row}_${column}_0`);
      }
      matrix.push(rowArray);
    }

    this.matrix = matrix;
  };

  setTakingMatrixItems = (matrix: string[][], thingsData: IThingsData[]) => {
    const takenMatrixItems = [];

    thingsData.forEach((thingData) => {
      for (let indexHeight = 0; indexHeight < thingData.cubeHeight; indexHeight++) {
        for (let indexWidth = 0; indexWidth < thingData.cubeWidth; indexWidth++) {
          takenMatrixItems.push(`${thingData.rowCube + indexHeight}_${thingData.columnCube + indexWidth}`);
        }
      }
    });

    const updatedMatrix = matrix.map((row) => {
      return row.map((thingData) => {
        const [rowItem, columnItem] = thingData.split("_");

        takenMatrixItems.forEach((takenPosition: string) => {
          const [rowTakenPosition, columnTakenPosition] = takenPosition.split("_");

          if (rowItem === rowTakenPosition && columnItem === columnTakenPosition) {
            thingData = `${rowItem}_${columnItem}_${1}`;
          }
        });

        return thingData;
      });
    });

    this.updatedMatrix = updatedMatrix;
    this.takenMatrixItems = takenMatrixItems;
  };

  getThingData(index: number) {
    return this.thingsData[index];
  }

  updateData(rowCube: number, columnCube: number, index: number) {
    this.thingsData[index] = { ...this.thingsData[index], rowCube, columnCube };
    this.setTakingMatrixItems(this.matrix, this.thingsData);
    this.cage.updateMatrix(this.updatedMatrix);
  }
}

export default Modules;
