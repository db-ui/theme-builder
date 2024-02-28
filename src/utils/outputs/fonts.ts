import { DefaultThemeType, FontType } from "../data.ts";

export const getFontFaces = (theme: DefaultThemeType): string => {
  let fontfaces: string = `@use "default.assets-paths" as assets-paths;`;

  for (const type of ["sans", "head"]) {
    const fontType: Record<string, FontType> =
      type === "sans" ? theme.font.sans : theme.font.head;
    Object.entries(fontType).forEach(([name, font]) => {
      fontfaces += `
$${name}: assets-paths.$fonts-path + '${font.woff2}';
@font-face {
\tfont-family: '${font.family}';
\tfont-style: normal;
\tfont-weight: ${font.weight};
\tsrc:
\t\tlocal('${font.name}'),
\t\tlocal('${font.localName}'),
\t\tlocal('${font.localShortName}'),
\t\turl($${name}) format("woff2");
}`;
    });
  }
  return fontfaces;
};
