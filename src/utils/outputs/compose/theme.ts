import { designSystemName, replacePackageName, replacePackagePath } from "./shared.ts";

export const generateBrandThemeFile = (brandName: string): string => {
    return `package ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}

import ${replacePackageName}${replacePackagePath}.Theme
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data.${brandName}ColorMap
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data.${brandName}DimensionsMap
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.data.${brandName}TypographyMap

object ${brandName}Theme : Theme {
    override val colorMap = ${brandName}ColorMap
    override val dimensionsMap = ${brandName}DimensionsMap
    override val typographyMap = ${brandName}TypographyMap
}
`;
}

export const generateThemeFile = (fileName: string, brandName: string): string => {
  return `package ${replacePackageName}${replacePackagePath}

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.core.view.WindowCompat
import ${replacePackageName}${replacePackagePath}.core.Density
import ${replacePackageName}${replacePackagePath}.${brandName.toLowerCase()}.${fileName}


object ${designSystemName}Theme {
    val colors: ${designSystemName}ColorScheme
        @Composable
        @ReadOnlyComposable
        get() = LocalColors.current

    val activeColor: AdaptiveColors
        @Composable
        @ReadOnlyComposable
        get() = LocalActiveColor.current

    val dimensions: ${designSystemName}Dimensions
        @Composable
        @ReadOnlyComposable
        get() = LocalDimensions.current

    val typography: ${designSystemName}TextStyles
        @Composable
        @ReadOnlyComposable
        get() = LocalTypography.current
}

interface Theme {
    val colorMap: Map<String, Color>
    val dimensionsMap: Map<String, Dp>
    val typographyMap: Map<String, TextUnit>
}

internal val LocalTheme = staticCompositionLocalOf<Theme> { ${fileName} }

@Composable
fun ${designSystemName}Theme(
    theme: Theme = ${fileName},
    density: Density = Density.REGULAR,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val configuration = LocalConfiguration.current
    // typography
    val typography: ${designSystemName}TextStyles = when {
        configuration.screenWidthDp > 768 ->
            when (density) {
                Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalTablet(theme.typographyMap))
                Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveTablet(theme.typographyMap))
                else -> getTextStyles(getTypographyRegularTablet(theme.typographyMap))
            }

        else -> when (density) {
            Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalMobile(theme.typographyMap))
            Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveMobile(theme.typographyMap))
            else -> getTextStyles(getTypographyRegularMobile(theme.typographyMap))
        }
    }

    // screen
    val dimensions: ${designSystemName}Dimensions = when {
        configuration.screenWidthDp > 768 ->
            when (density) {
                Density.FUNCTIONAL -> getDimensionsFunctionalTablet(theme.dimensionsMap)
                Density.EXPRESSIVE -> getDimensionsExpressiveTablet(theme.dimensionsMap)
                else -> getDimensionsRegularTablet(theme.dimensionsMap)
            }

        else -> when (density) {
            Density.FUNCTIONAL -> getDimensionsFunctionalMobile(theme.dimensionsMap)
            Density.EXPRESSIVE -> getDimensionsExpressiveMobile(theme.dimensionsMap)
            else -> getDimensionsRegularMobile(theme.dimensionsMap)
        }
    }

    // colors
    val colorScheme: ${designSystemName}ColorScheme = when {
        darkTheme -> getColorSchemeDark(theme.colorMap)
        else -> getColorSchemeLight(theme.colorMap)
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
            window.navigationBarColor = colorScheme.neutral.bgBasicLevel1Default.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    CompositionLocalProvider(
        LocalTheme provides theme,
        LocalColors provides colorScheme,
        LocalDimensions provides dimensions,
        LocalTypography provides typography
    ) {
        content()
    }
}
`;
};
