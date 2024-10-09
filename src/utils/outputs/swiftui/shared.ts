import fs from 'fs';

export const densities = ["Functional", "Regular", "Expressive"];

export const devices = ["Mobile", "Tablet"];

export const shirtSizes = [
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
];

export const generateStaticSwiftUIFiles = (): string => {
  return `
import SwiftUI

struct BasicColor {
    var text: TextColor
    var icon: IconColor
    var border: BorderColor
    var background: BackgroundColor
}

struct InvertedBackgroundColor {
    var contrastMax: StateColor
    var contrastHigh: StateColor
    var contrastLow: StateColor
}

struct InvertedColor {
    var background: InvertedBackgroundColor
    var onBackground: StateColor
}

struct OriginColor {
    var origin: StateColor
    var onOrigin: StateColor
}

struct TextColor {
    var \`default\`: StateColor
    var emphasis100: StateColor
    var emphasis90: StateColor
    var emphasis80: StateColor
}

struct IconColor {
    var \`default\`: StateColor
    var emphasis100: StateColor
    var emphasis90: StateColor
    var emphasis80: StateColor
    var emphasis70: StateColor
}

struct BorderColor {
    var \`default\`: StateColor
    var emphasis100: StateColor
    var emphasis70: StateColor
    var emphasis60: StateColor
    var emphasis50: StateColor
}

struct BackgroundColor {
    var transparent: TransparentColor
    var level1: StateColor
    var level2: StateColor
    var level3: StateColor
}

struct TransparentColor {
    var full: Color
    var semi: Color
    var hovered: Color
    var pressed: Color
}

struct StateColor {
    var \`default\`: Color
    var hovered: Color
    var pressed: Color
}

extension AdaptiveColors {
    
    public var basic: BasicColor {
        .init(
            text: .init(
                default: .init(
                    default: onBgBasicEmphasis100Default,
                    hovered: onBgBasicEmphasis100Hovered,
                    pressed: onBgBasicEmphasis100Pressed
                ),
                emphasis100: .init(
                    default: onBgBasicEmphasis100Default,
                    hovered: onBgBasicEmphasis100Hovered,
                    pressed: onBgBasicEmphasis100Pressed
                ),
                emphasis90: .init(
                    default: onBgBasicEmphasis80Default,
                    hovered: onBgBasicEmphasis80Hovered,
                    pressed: onBgBasicEmphasis80Pressed
                ),
                emphasis80: .init(
                    default: onBgBasicEmphasis80Default,
                    hovered: onBgBasicEmphasis80Hovered,
                    pressed: onBgBasicEmphasis80Pressed
                )
            ),
            icon: .init(
                default: .init(
                    default: onBgBasicEmphasis70Default,
                    hovered: onBgBasicEmphasis70Hovered,
                    pressed: onBgBasicEmphasis70Pressed
                ),
                emphasis100: .init(
                    default: onBgBasicEmphasis100Default,
                    hovered: onBgBasicEmphasis100Hovered,
                    pressed: onBgBasicEmphasis100Pressed
                ),
                emphasis90: .init(
                    default: onBgBasicEmphasis90Default,
                    hovered: onBgBasicEmphasis90Hovered,
                    pressed: onBgBasicEmphasis90Pressed
                ),
                emphasis80: .init(
                    default: onBgBasicEmphasis80Default,
                    hovered: onBgBasicEmphasis80Hovered,
                    pressed: onBgBasicEmphasis80Pressed
                ),
                emphasis70: .init(
                    default: onBgBasicEmphasis70Default,
                    hovered: onBgBasicEmphasis70Hovered,
                    pressed: onBgBasicEmphasis70Pressed
                )
            ),
            border: .init(
                default: .init(
                    default: onBgBasicEmphasis60Default,
                    hovered: onBgBasicEmphasis60Hovered,
                    pressed: onBgBasicEmphasis60Pressed
                ),
                emphasis100: .init(
                    default: onBgBasicEmphasis100Default,
                    hovered: onBgBasicEmphasis100Hovered,
                    pressed: onBgBasicEmphasis100Pressed
                ),
                emphasis70: .init(
                    default: onBgBasicEmphasis70Default,
                    hovered: onBgBasicEmphasis70Hovered,
                    pressed: onBgBasicEmphasis70Pressed
                ),
                emphasis60: .init(
                    default: onBgBasicEmphasis60Default,
                    hovered: onBgBasicEmphasis60Hovered,
                    pressed: onBgBasicEmphasis60Pressed
                ),
                emphasis50: .init(
                    default: onBgBasicEmphasis50Default,
                    hovered: onBgBasicEmphasis50Hovered,
                    pressed: onBgBasicEmphasis50Pressed
                )
            ),
            background: .init(
                transparent: .init(
                    full: bgBasicTransparentFullDefault,
                    semi: bgBasicTransparentSemiDefault,
                    hovered: bgBasicTransparentHovered,
                    pressed: bgBasicTransparentPressed
                ),
                level1: .init(
                    default: bgBasicLevel1Default,
                    hovered: bgBasicLevel1Hovered,
                    pressed: bgBasicLevel1Pressed
                ),
                level2: .init(
                    default: bgBasicLevel2Default,
                    hovered: bgBasicLevel2Hovered,
                    pressed: bgBasicLevel2Pressed
                ),
                level3: .init(
                    default: bgBasicLevel3Default,
                    hovered: bgBasicLevel3Hovered,
                    pressed: bgBasicLevel3Pressed
                )
            )
        )
    }
    
    public var inverted: InvertedColor {
        .init(
            background: .init(
                contrastMax: .init(
                    default: bgInvertedContrastMaxDefault,
                    hovered: bgInvertedContrastMaxHovered,
                    pressed: bgInvertedContrastMaxPressed
                ),
                contrastHigh: .init(
                    default: bgInvertedContrastHighDefault,
                    hovered: bgInvertedContrastHighHovered,
                    pressed: bgInvertedContrastHighPressed
                ),
                contrastLow: .init(
                    default: bgInvertedContrastLowDefault,
                    hovered: bgInvertedContrastLowHovered,
                    pressed: bgInvertedContrastLowPressed
                )
            ),
            onBackground: .init(
                default: onBgInvertedDefault,
                hovered: onBgInvertedHovered,
                pressed: onBgInvertedPressed
            )
        )
    }
    
    public var origin: OriginColor {
        .init(
            origin: .init(
                default: originDefault,
                hovered: originHovered,
                pressed: originPressed
            ),
            onOrigin: .init(
                default: onOriginDefault,
                hovered: onOriginHovered,
                pressed: onOriginPressed
            )
        )
    }
}

  `
}