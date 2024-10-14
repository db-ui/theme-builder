import { designSystemName } from "./shared";

export const generateSwiftUIDesignSystemThemeFile = (fileName: string): string => {
    return `
import SwiftUI

// Design System Theme File
// import SwiftUI

// private var DarkColorScheme = getColorSchemeDark()

// private var LightColorScheme = getColorSchemeLight()


// struct ${fileName} {
//     val colors: ${fileName}ColorScheme
//         @Composable
//         @ReadOnlyComposable
//         get() = LocalColors.current

//     val dimensions: ${fileName}Dimensions
//         @Composable
//         @ReadOnlyComposable
//         get() = LocalDimensions.current

//     val typography: ${fileName}TextStyles
//         @Composable
//         @ReadOnlyComposable
//         get() = LocalTypography.current
// }

// func ${fileName}(
//     density: Density = .regular,
//     darkTheme: Boolean = isSystemInDarkTheme(),
//     content: @Composable () -> Unit
// ) {
//     val configuration = LocalConfiguration.current
//     // typography
//     val typography: ${fileName}TextStyles = when {
//         configuration.screenWidthDp > 768 ->
//             when (density) {
//                 Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalTablet())
//                 Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveTablet())
//                 else -> getTextStyles(getTypographyRegularTablet())
//             }

//         else -> when (density) {
//             Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalMobile())
//             Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveMobile())
//             else -> getTextStyles(getTypographyRegularMobile())
//         }
//     }

//     // screen
//     val dimensions: ${fileName}Dimensions = when {
//         configuration.screenWidthDp > 768 ->
//             when (density) {
//                 Density.FUNCTIONAL -> getDimensionsFunctionalTablet()
//                 Density.EXPRESSIVE -> getDimensionsExpressiveTablet()
//                 else -> getDimensionsRegularTablet()
//             }

//         else -> when (density) {
//             Density.FUNCTIONAL -> getDimensionsFunctionalMobile()
//             Density.EXPRESSIVE -> getDimensionsExpressiveMobile()
//             else -> getDimensionsRegularMobile()
//         }
//     }

//     // colors
//     val colorScheme: ${fileName}ColorScheme = when {
//         darkTheme -> DarkColorScheme
//         else -> LightColorScheme
//     }
//     val view = LocalView.current
//     if (!view.isInEditMode) {
//         SideEffect {
//             val window = (view.context as Activity).window
//             window.statusBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
//             window.navigationBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
//             WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
//         }
//     }

//     CompositionLocalProvider(
//         LocalColors provides colorScheme,
//         LocalDimensions provides dimensions,
//         LocalTypography provides typography
//     ) {
//         content()
//     }
// }
`;
}

export const generateSwiftUIThemeFile = (themeName: string): string => {
  return `
import SwiftUI

struct ${themeName}Theme: Theme {
    var colorScheme: ${designSystemName}ColorScheme
    var activeColor: AdaptiveColors
    var dimensions: ${designSystemName}Dimensions
    var fonts: ${designSystemName}Fonts
    
    init(_ colorScheme: ColorScheme = .light) {
        self.colorScheme = colorScheme == .light ? getColorSchemeLight(colors: ${themeName}Colors) : getColorSchemeDark(colors: ${themeName}Colors)
        self.activeColor = self.colorScheme.brand
        self.dimensions = ${designSystemName}Dimensions.getDimensionsFunctionalMobile(dimensions: ${themeName}Dimensions())
        self.fonts = ${designSystemName}Fonts.getTypographyFunctionalMobile(sizes: ${themeName}Typography)
    }
}
`
};
