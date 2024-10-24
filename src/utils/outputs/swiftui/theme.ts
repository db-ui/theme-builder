import { designSystemName } from "./shared";

export const generateSwiftUIDesignSystemThemeFile = (fileName: string): string => {
    console.log(fileName)
    return `
import SwiftUI

struct ThemeModifier: ViewModifier {
    @Environment(\\.colorScheme) var systemColorScheme
    
    var theme: DSTheme
    
    func body(content: Content) -> some View {
        var changedTheme = theme
        changedTheme.fonts = adaptiveFonts
        changedTheme.dimensions = adaptiveDimensions
        
        return content
            .theme(changedTheme)
    }
    
    var adaptiveFonts: DesignSystemTextStyles {
        // TODO: Use dimensions environment variable
        let typography = UIDevice.current.userInterfaceIdiom == .pad ? DesignSystemTypography.getTypographyRegularTablet(sizes: DeutscheBahnTypography) : DesignSystemTypography.getTypographyRegularMobile(sizes: DeutscheBahnTypography)
        return DesignSystemTextStyles.getFonts(typo: typography)
    }
    
    var adaptiveDimensions: DesignSystemDimensions {
        UIDevice.current.userInterfaceIdiom == .pad ? DesignSystemDimensions.getDimensionsRegularTablet(dimensions: DeutscheBahnDimensions()) : DesignSystemDimensions.getDimensionsRegularMobile(dimensions: DeutscheBahnDimensions())
    }
}

extension EnvironmentValues {
    @Entry public var theme: DSTheme = DeutscheBahnTheme()
}

extension View {
    public func dsTheme(_ theme: DSTheme = DeutscheBahnTheme()) -> some View {
        modifier(ThemeModifier(theme: theme))
    }
    
    public func theme(_ theme: DSTheme) -> some View {
        environment(\\.theme, theme)
    }
    
    public func activeColorScheme(_ colorScheme: DSColorVariant) -> some View {
        modifier(ActiveColorViewModifier(color: colorScheme))
    }
    
    public func dsExpressive() -> some View {
        modifier(DimensionsViewModifier(dimensions: DesignSystemDimensions.getDimensionsExpressiveMobile(dimensions: DeutscheBahnDimensions())))
    }
    
    public func dsFunctional() -> some View {
        modifier(DimensionsViewModifier(dimensions:
                                            UIDevice.current.userInterfaceIdiom == .pad ? DesignSystemDimensions.getDimensionsFunctionalTablet(dimensions: DeutscheBahnDimensions()) :
                                            DesignSystemDimensions.getDimensionsFunctionalMobile(dimensions: DeutscheBahnDimensions())))
    }
}

struct ActiveColorViewModifier: ViewModifier {
    @Environment(\\.theme) var theme
    
    var color: DSColorVariant
    
    func body(content: Content) -> some View {
        var changedTheme = theme
        changedTheme.activeColor = color
        
        return content
            .theme(changedTheme)
    }
}

struct DimensionsViewModifier: ViewModifier {
    @Environment(\\.theme) var theme
    
    var dimensions: DesignSystemDimensions
    
    func body(content: Content) -> some View {
        var changedTheme = theme
        changedTheme.dimensions = dimensions
        
        return content
            .theme(changedTheme)
    }
}

public protocol DSTheme {
    var colorScheme: DesignSystemColorScheme { get set }
    var activeColor: DSColorVariant { get set }
    var fonts: DesignSystemTextStyles { get set }
    var dimensions: DesignSystemDimensions { get set }
}

`;
}

export const generateSwiftUIThemeFile = (themeName: string): string => {
  return `
import SwiftUI

public struct ${themeName}Theme: DSTheme {
    public var colorScheme: ${designSystemName}ColorScheme
    public var activeColor: DSColorVariant
    public var dimensions: ${designSystemName}Dimensions
    public var fonts: ${designSystemName}TextStyles
    
    public init(_ colorScheme: ColorScheme = .light) {
        self.colorScheme = colorScheme == .light ? DesignSystemColorScheme.getColorSchemeLight(colors: ${themeName}Colors) : DesignSystemColorScheme.getColorSchemeDark(colors: ${themeName}Colors)
        self.activeColor = self.colorScheme.brand
        self.dimensions = ${designSystemName}Dimensions.getDimensionsFunctionalMobile(dimensions: ${themeName}Dimensions())
        self.fonts = DesignSystemTextStyles.getFonts(typo: ${designSystemName}Typography.getTypographyFunctionalMobile(sizes: ${themeName}Typography))
    }
}
`
};
