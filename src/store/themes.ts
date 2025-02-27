import { ThemeType } from "../utils/data.ts";
import Border from "../data/default-theme/border.json";
import Elevation from "../data/default-theme/elevation.json";
import Fonts from "../data/default-theme/fonts.json";
import Sizing from "../data/default-theme/sizing.json";
import Spacing from "../data/default-theme/spacing.json";
import Transition from "../data/default-theme/transition.json";
import TypographyRegular from "../data/default-theme/typography/regular.json";
import TypographyExpressive from "../data/default-theme/typography/expressive.json";
import TypographyFunctional from "../data/default-theme/typography/functional.json";

import Branding from "../data/default-theme/branding.json";
import Colors from "../data/default-theme/colors.json";

import DBBranding from "../data/db-theme/branding.json";
import DBColors from "../data/db-theme/colors.json";

import SBahnBranding from "../data/sbahn-theme/branding.json";
import SBahnBColors from "../data/sbahn-theme/colors.json";

export const defaultTheme: ThemeType = {
  ...Border,
  ...Elevation,
  ...Fonts,
  ...Sizing,
  ...Spacing,
  ...Transition,
  typography: {
    ...TypographyRegular.typography,
    ...TypographyExpressive.typography,
    ...TypographyFunctional.typography,
  },
  ...Branding,
  ...Colors,
};

export const dbTheme: ThemeType = {
  ...defaultTheme,
  ...DBBranding,
  ...DBColors,
};

export const sBahnTheme: ThemeType = {
  ...defaultTheme,
  ...SBahnBranding,
  ...SBahnBColors,
};
