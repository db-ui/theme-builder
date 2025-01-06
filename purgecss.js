import { PurgeCSS } from "purgecss";

import { writeFileSync } from "node:fs";

new PurgeCSS()
  .purge({
    content: ["./dist/**/*.html", "./dist/**/*.js"],
    css: ["./dist/**/*.css"],
    defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    variables: true,
    rejectedCss: true,
    safelist: {
      standard: [
        "md:min-h-[282px]",
        "md:w-[100vw]",
        "md:w-[376px]",
        "md:h-[100vh]",
      ],
      /* Keep density & all color properties/variables */
      variables: [/-regular-/, /-default$/, /-hovered$/, /-pressed$/],
      /* Some components require a safelist */
      greedy: [/db-tabs/],
    },
  })
  .then((purgeCSSResult) => {
    for (const result of purgeCSSResult) {
      writeFileSync(result.file, result.css);
      writeFileSync(`debug_rejected.css`, result.rejectedCss || "");
    }
  });
