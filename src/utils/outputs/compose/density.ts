import { densities, replacePackageName } from "./shared.ts";

export const generateDensityEnumFile = (): string => {
  return `package ${replacePackageName}  
 enum class Density {
    ${densities.map((density) => density.toUpperCase()).join(",")}
}
`;
};
