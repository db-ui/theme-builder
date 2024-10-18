import { densities, designSystemShortName, replacePackageName } from "./shared.ts";

export const generateDensityEnumFile = (): string => {
  return `package ${replacePackageName}.core

enum class ${designSystemShortName}Density {
    ${densities.map((density) => density.toUpperCase()).join(", ")}
}
`;
};
