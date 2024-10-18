import { designSystemName, designSystemShortName, replacePackageName } from "./shared.ts";

export const generateBrandThemeFile = (brandName: string): string => {
    return `package ${replacePackageName}.${brandName.toLowerCase()}

import ${replacePackageName}.${designSystemShortName}Theme
import ${replacePackageName}.${brandName.toLowerCase()}.data.${brandName}ColorMap
import ${replacePackageName}.${brandName.toLowerCase()}.data.${brandName}DimensionsMap
import ${replacePackageName}.${brandName.toLowerCase()}.data.${brandName}TypographyMap

object ${brandName}Theme : ${designSystemShortName}Theme {
    override val colorMap = ${brandName}ColorMap
    override val dimensionsMap = ${brandName}DimensionsMap
    override val typographyMap = ${brandName}TypographyMap
}
`;
}

export const generateThemeFile = (fileName: string, brandName: string): string => {
  return `package ${replacePackageName}

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
import ${replacePackageName}.${designSystemName}ColorScheme.Companion.getColorSchemeDark
import ${replacePackageName}.${designSystemName}ColorScheme.Companion.getColorSchemeLight
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsExpressiveMobile
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsExpressiveTablet
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsFunctionalMobile
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsFunctionalTablet
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsRegularMobile
import ${replacePackageName}.${designSystemName}Dimensions.Companion.getDimensionsRegularTablet
import ${replacePackageName}.${designSystemName}TextStyles.Companion.getTextStyles
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyExpressiveMobile
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyExpressiveTablet
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyFunctionalMobile
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyFunctionalTablet
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyRegularMobile
import ${replacePackageName}.${designSystemName}Typography.Companion.getTypographyRegularTablet
import ${replacePackageName}.core.${designSystemShortName}Density
import ${replacePackageName}.${brandName.toLowerCase()}.${fileName}


object ${designSystemName}Theme {
    val colors: ${designSystemName}ColorScheme
        @Composable
        @ReadOnlyComposable
        get() = LocalColors.current

    val activeColor: ${designSystemShortName}ColorVariant
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

interface ${designSystemShortName}Theme {
    val colorMap: Map<String, Color>
    val dimensionsMap: Map<String, Dp>
    val typographyMap: Map<String, TextUnit>
}

internal val LocalTheme = staticCompositionLocalOf<${designSystemShortName}Theme> { ${fileName} }

@Composable
fun ${designSystemName}Theme(
    theme: ${designSystemShortName}Theme = ${fileName},
    density: ${designSystemShortName}Density = ${designSystemShortName}Density.REGULAR,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val isTablet = LocalConfiguration.current.screenWidthDp > 768
    // typography
    val typography: ${designSystemName}TextStyles = when(isTablet) {
        true ->
            when (density) {
                ${designSystemShortName}Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalTablet(theme.typographyMap))
                ${designSystemShortName}Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveTablet(theme.typographyMap))
                else -> getTextStyles(getTypographyRegularTablet(theme.typographyMap))
            }

        else -> when (density) {
            ${designSystemShortName}Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalMobile(theme.typographyMap))
            ${designSystemShortName}Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveMobile(theme.typographyMap))
            else -> getTextStyles(getTypographyRegularMobile(theme.typographyMap))
        }
    }

    // screen
    val dimensions: ${designSystemName}Dimensions = when(isTablet) {
        true ->
            when (density) {
                ${designSystemShortName}Density.FUNCTIONAL -> getDimensionsFunctionalTablet(theme.dimensionsMap)
                ${designSystemShortName}Density.EXPRESSIVE -> getDimensionsExpressiveTablet(theme.dimensionsMap)
                else -> getDimensionsRegularTablet(theme.dimensionsMap)
            }

        else -> when (density) {
            ${designSystemShortName}Density.FUNCTIONAL -> getDimensionsFunctionalMobile(theme.dimensionsMap)
            ${designSystemShortName}Density.EXPRESSIVE -> getDimensionsExpressiveMobile(theme.dimensionsMap)
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
        LocalTypography provides typography,
    ) {
        content()
    }
}
`;
};
