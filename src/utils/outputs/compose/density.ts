import { densities, replacePackageName, replacePackagePath } from "./shared.ts";

export const generateDensityEnumFile = (): string => {
  return `package ${replacePackageName}${replacePackagePath}.core

enum class Density {
    ${densities.map((density) => density.toUpperCase()).join(",")}
}
`;
};
