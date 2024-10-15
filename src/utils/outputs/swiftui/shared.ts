export const designSystemName = "DesignSystem"

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
  return `import SwiftUI

public struct BasicColor {
    public var text: TextColor
    public var icon: IconColor
    public var border: BorderColor
    public var background: BackgroundColor
}

public struct InvertedBackgroundColor {
    public var contrastMax: StateColor
    public var contrastHigh: StateColor
    public var contrastLow: StateColor
}

public struct InvertedColor {
    public var background: InvertedBackgroundColor
    public var onBackground: StateColor
}

public struct OriginColor {
    public var origin: StateColor
    public var onOrigin: StateColor
}

public struct TextColor {
    public var \`default\`: StateColor
    public var emphasis100: StateColor
    public var emphasis90: StateColor
    public var emphasis80: StateColor
}

public struct IconColor {
    public var \`default\`: StateColor
    public var emphasis100: StateColor
    public var emphasis90: StateColor
    public var emphasis80: StateColor
    public var emphasis70: StateColor
}

public struct BorderColor {
    public var \`default\`: StateColor
    public var emphasis100: StateColor
    public var emphasis70: StateColor
    public var emphasis60: StateColor
    public var emphasis50: StateColor
}

public struct BackgroundColor {
    public var transparent: TransparentColor
    public var level1: StateColor
    public var level2: StateColor
    public var level3: StateColor
}

public struct TransparentColor {
    public var full: Color
    public var semi: Color
    public var hovered: Color
    public var pressed: Color
}

public struct StateColor {
    public var \`default\`: Color
    public var hovered: Color
    public var pressed: Color
}

extension DSColorVariant {
    
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