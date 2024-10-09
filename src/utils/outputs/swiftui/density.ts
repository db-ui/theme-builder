import { densities } from "./shared.ts";

export const generateSwiftUIDensityEnumFile = (): string => {
  let resolvedString: string = "enum  Density: String {\n";

  densities.forEach( density => {
    resolvedString += `  case ${density.toLowerCase()} = "${density}"\n`;
  })
  
  resolvedString += "}\n";
  return resolvedString;
};
