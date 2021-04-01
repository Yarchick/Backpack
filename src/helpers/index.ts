import gsap from "gsap";

export const setCenter = (dim1: number, dim2: number, scale = 1): number => {
  return toInt((dim1 / 2 - (dim2 * scale) / 2).toFixed());
};

export const toInt = (value: number | string): number => {
  return +(+value).toFixed();
};

export const getRndInteger = (min: number, max: number, excluded: number[] = []): number => {
  let getRnd = null;

  do {
    getRnd = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (excluded.includes(getRnd));

  return getRnd;
};

export const sortArray = (array: number[], value?: string): number[] => {
  if (value) {
    return [...array].sort((a, b) => a[value] - b[value]);
  }

  return [...array].sort((a, b) => a - b);
};

export const gsapTimer = (callback: () => void, time: number): GSAPAnimation => {
  const obj = { x: 0 };
  return gsap.to(obj, { duration: time, x: 1, onComplete: () => callback() });
};

export const delay = async (time: number) => {
  return await new Promise((resolve) => gsapTimer(() => resolve("ok"), time));
};

export const mask = ({ x, y, width, height }) => {
  const mask = new PIXI.Graphics();
  mask.beginFill();
  mask.drawRect(x, y, width, height);
  mask.endFill();

  return mask;
};

export const removeDublicate = (array: any[]): any[] => {
  const seen = {};
  const out = [];
  const len = array.length;
  let j = 0;

  for (let index = 0; index < len; index++) {
    const item = array[index];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
};
