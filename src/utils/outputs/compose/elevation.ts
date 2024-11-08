import { ThemeSizing } from "../../data.ts";
import { designSystemShortName, replacePackageName } from "./shared.ts";

export const generateComposeElevationFile = (
  allElevations: ThemeSizing,
): string => {
  let resolvedTokenFile = `package ${replacePackageName}.core
  
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithCache
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.graphics.drawOutline
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp

fun Modifier.${designSystemShortName.toLowerCase()}Shadow(
    elevation: ${designSystemShortName}Elevation,
    shape: Shape = RectangleShape,
    clip: Boolean = true,
): Modifier {
    return drawWithCache {
        onDrawWithContent {
            fun drawShadow(config: ${designSystemShortName}ElevationShadowConfig) {
                drawIntoCanvas { canvas ->
                    val spreadRadiusPx = config.spread.toPx()
                    val hasSpreadRadius = spreadRadiusPx != 0f

                    val shadowOutline = shape.createOutline(size = when {
                        hasSpreadRadius -> size.let { (width, height) ->
                            (2 * spreadRadiusPx).let { outset ->
                                Size(
                                    width = width + outset, height = height + outset
                                )
                            }
                        }

                        else -> size
                    }, layoutDirection = layoutDirection, density = this)

                    canvas.save()

                    canvas.drawOutline(outline = shadowOutline, paint = Paint().also { paint ->
                        paint.asFrameworkPaint().apply {
                            this.color = Color.Transparent.toArgb()
                            setShadowLayer(
                                config.blur.toPx(),
                                config.offset.x.toPx() - spreadRadiusPx,
                                config.offset.y.toPx() - spreadRadiusPx,
                                config.color.toArgb(),
                            )
                        }
                    })

                    canvas.restore()
                }
            }

            elevation.config.forEach(::drawShadow)
            drawContent()
        }
    }.let { modifier -> if (clip) modifier.clip(shape) else modifier }
}

internal data class ${designSystemShortName}ElevationShadowConfig(
    val offset: DpOffset,
    val blur: Dp,
    val spread: Dp,
    val color: Color,
)

enum class ${designSystemShortName}Elevation(internal val config: List<${designSystemShortName}ElevationShadowConfig>) {
`;

  Object.entries(allElevations).forEach(([name, elevationScheme]) => {
    if (name == "_scale") return;

    const elevationStages = elevationScheme
      .toString()
      .replaceAll("  ", " ")
      .replaceAll("rgba(", "")
      .replaceAll("), ", "#")
      .replaceAll(")", "")
      .replaceAll(",", "")
      .replaceAll("px", "")
      .split("#");

    resolvedTokenFile += `    ${name.toUpperCase()}(
        listOf(`;
    for (const elevationStage of elevationStages) {
      const elevationValues = elevationStage.split(" ");
      const horizontal = elevationValues[0];
      const vertical = elevationValues[1];
      const blur = elevationValues[2];
      const spread = elevationValues[3];
      const red = elevationValues[4];
      const green = elevationValues[5];
      const blue = elevationValues[6];
      const alpha = elevationValues[7];

      resolvedTokenFile += `
            ${designSystemShortName}ElevationShadowConfig(DpOffset(${horizontal}.dp, ${vertical}.dp), ${blur}.dp, ${spread.startsWith("-") ? "(" + spread + ")" : spread}.dp, Color(${red}f, ${green}f, ${blue}f, ${alpha}f)),`;
    }
    resolvedTokenFile += `\n        ),\n    ),\n`;
  });

  resolvedTokenFile += "}\n";
  return resolvedTokenFile;
};
