import { densities } from "./shared.ts";

export const generateSwiftUIDensityEnumFile = (): string => {
  let resolvedString: string = "enum DSDensity: String {\n";

  densities.forEach( density => {
    resolvedString += `  case ${density.toLowerCase()} = "${density}"\n`;
  })
  
  resolvedString += "}\n";
  return resolvedString;
};
