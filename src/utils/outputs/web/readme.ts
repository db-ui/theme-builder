export const generateReadmeFile = (fileName: string): string => {
  return `# Custom Theme for Web

This folder contains \`.css\` files you can include for you web project.

## Content

- **${fileName}-theme.css**: Contains overwritten spacings, sizings, etc.
- **${fileName}-palette.css**: Contains overwritten default-colors like neutral, brand, etc. + contains all custom-colors as hex values
- **${fileName}-speaking-names-dark.css**: Contains all speaking names for dark-mode for default-colors + custom-colors
- **${fileName}-speaking-names-light.css**: Contains all speaking names for light-mode for default-colors + custom-colors
- Custom Colors:
  - **${fileName}-custom-colors-full.css**: Contains _only_ all custom-colors with auto light-/dark-mode
  - **${fileName}-custom-colors-palette.css**: Contains _only_ all custom-colors as hex values
  - **${fileName}-speaking-names-custom-colors-dark.css**: Contains _only_ all speaking names for dark-mode custom-colors
  - **${fileName}-speaking-names-custom-colors-light.css**: Contains _only_ all speaking names for light-mode custom-colors

## How to use

To overwrite the default theme you need to copy the specific file to your asset folder and import it after all other DBUX related styles. For example in JS:

\`\`\`js
// main.js
import "@db-ux/core-components/build/styles/db-ui-42-rollup.css";
import "assets/${fileName}-theme.css"; // <-- after all other styles
\`\`\`

### Custom colors

If you want to use your custom colors, but you don't need to overwrite the default colors you can import only the files inside the \`Custom Colors\` folder.

## Additional information for Colors

To enable automatic light-/dark-mode you need to add a media-query:
\`@media (prefers-color-scheme: dark) {\`

You may want to use \`${fileName}-custom-colors-full.css\` or you can copy it from the file as needed.
`;
};
