import { replacePackageName } from "./shared.ts";

export const generateThemeFile = (fileName: string): string => {
  return `package ${replacePackageName}.theme  

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.ReadOnlyComposable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = getColorSchemeDark()

private val LightColorScheme = getColorSchemeLight()


object ${fileName} {
    val colors: ${fileName}ColorScheme
        @Composable
        @ReadOnlyComposable
        get() = LocalColors.current

    val dimensions: ${fileName}Dimensions
        @Composable
        @ReadOnlyComposable
        get() = LocalDimensions.current

    val typography: ${fileName}TextStyles
        @Composable
        @ReadOnlyComposable
        get() = LocalTypography.current
}

@Composable
fun ${fileName}(
    density: Density = Density.REGULAR,
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val configuration = LocalConfiguration.current
    // typography
    val typography: ${fileName}TextStyles = when {
        configuration.screenWidthDp > 768 ->
            when (density) {
                Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalTablet())
                Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveTablet())
                else -> getTextStyles(getTypographyRegularTablet())
            }

        else -> when (density) {
            Density.FUNCTIONAL -> getTextStyles(getTypographyFunctionalMobile())
            Density.EXPRESSIVE -> getTextStyles(getTypographyExpressiveMobile())
            else -> getTextStyles(getTypographyRegularMobile())
        }
    }

    // screen
    val dimensions: ${fileName}Dimensions = when {
        configuration.screenWidthDp > 768 ->
            when (density) {
                Density.FUNCTIONAL -> getDimensionsFunctionalTablet()
                Density.EXPRESSIVE -> getDimensionsExpressiveTablet()
                else -> getDimensionsRegularTablet()
            }

        else -> when (density) {
            Density.FUNCTIONAL -> getDimensionsFunctionalMobile()
            Density.EXPRESSIVE -> getDimensionsExpressiveMobile()
            else -> getDimensionsRegularMobile()
        }
    }

    // colors
    val colorScheme: ${fileName}ColorScheme = when {
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.neutral.bgLvl1Enabled.toArgb()
            window.navigationBarColor = colorScheme.neutral.bgLvl1Enabled.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    CompositionLocalProvider(
        LocalColors provides colorScheme,
        LocalDimensions provides dimensions,
        LocalTypography provides typography
    ) {
        content()
    }
}
`;
};
