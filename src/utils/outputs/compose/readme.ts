import { designSystemName } from "./shared";

export const generateAndroidReadmeFile = (): string => {
  return `# How to use the theme

1. Move the \`theme\` directory into your project
2. Replace the string \`replace.\` inside the  \`theme\` directory with your package name for example: \`com.example.myapplication.\`
3. Add your theme to the MainActivity:

\`\`\`\` kotlin
import com.example.myapplication.theme.${designSystemName}Theme
...
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
        ${designSystemName}Theme {
            //... your content
        }
    }
}
\`\`\`\`

Use the tokens like this:
\`\`\`\` kotlin
Text(
    text = "Headline",
    style = ${designSystemName}Theme.typography.h1,
    color = ${designSystemName}.colors.neutral.onBgBasicEmphasis100,
    modifier = Modifier.padding(${designSystemName}.dimensions.spacing.fixedMd)
)
\`\`\`\`

To use another theme, export it and copy the \`theme/<theme name>\` folder to your project and set it like this:
\`\`\`\` kotlin
// Code from step 3
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContent {
        ${designSystemName}Theme(
            theme = <theme name>Theme,
        ) {
            //... your content
        }
    }
}
\`\`\`\`

## Fonts

[Download](https://marketingportal.extranet.deutschebahn.com/marketingportal/Marke-und-Design/Basiselemente/Typografie/DB-Neo-Font-Downloads) fonts and use the \`.ttf\` files. 
You might rename it based on the names in \`~/theme/core/Fonts.kt\` and move the \`.ttf\` files into \`~/src/main/res/font\` folder.  
`;
};
