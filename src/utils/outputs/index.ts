import { DefaultColorType, HeisslufType } from "../data.ts";
import { getHeissluftColors } from "../generate-colors.ts";

export const prefix = "db";

export const getPalette = (
  allColors: Record<string, DefaultColorType>,
  luminanceSteps: number[],
): Record<string, HeisslufType[]> =>
  Object.entries(allColors)
    .map((value) => {
      const name = value[0];
      const color = value[1];
      const hslColors: HeisslufType[] = getHeissluftColors(
        name,
        color.origin,
        luminanceSteps,
      );

      return {
        [name]: hslColors,
      };
    })
    .reduce(
      (previousValue, currentValue) => ({ ...previousValue, ...currentValue }),
      {},
    );
