export const generateReadmeFile = (fileName: string): string => {
  return `# How to use the theme

1. Move the \`theme\` directory into your project
2. Replace the string \`replace.\` inside the  \`theme\` directory with your package name for example: \`com.example.myapplication.\`
3. Add your theme to the MainActivity:

\`\`\`\` kotlin
import com.example.myapplication.theme.${fileName}
...
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ${fileName} {
                //... your content
            }
        }
    }
\`\`\`\`

Use the tokens like this:
\`\`\`\` kotlin
        Text(
            text = "Headline",
            style = DBTheme.typography.h1,
            color = DBTheme.colors.neutral.onBgEnabled,
            modifier = Modifier.padding(DBTheme.dimensions.spacing.fixedMd)
        )
\`\`\`\`

  
`;
};
