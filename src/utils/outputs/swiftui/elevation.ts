import { ThemeSizing } from "../../data.ts";

export const generateSwiftUIElevationsFile = (
    allElevations: ThemeSizing,
): string => {
  let resolvedString: string = `import SwiftUI

struct DSShadowViewModifier: ViewModifier {
    
    let elevation: DSSubElevation
    
    func body(content: Content) -> some View {
        content
            .background(
                content
                    .shadow(color: elevation.first.color, radius: elevation.first.spread, x: elevation.first.x, y: elevation.first.y)
                    .shadow(color: elevation.second.color, radius: elevation.second.spread, x: elevation.second.x, y: elevation.second.y)
                    .shadow(color: elevation.third.color, radius: elevation.third.spread, x: elevation.third.x, y: elevation.third.y)
            )
    }
}

extension View {
    func dsShadow(elevation: DSSubElevation = DSElevation.sm) -> some View {
        self.modifier(DSShadowViewModifier(elevation: elevation))
    }
}

struct DSSubElevation {
    let first: DSElevationShadowConfig
    let second: DSElevationShadowConfig
    let third: DSElevationShadowConfig
}

struct DSElevationShadowConfig {
    let x: CGFloat
    let y: CGFloat
    let blur: CGFloat
    let spread: CGFloat
    let color: Color
}
  
public struct DSElevation {\n`;

  Object.entries(allElevations).forEach(([name, elevation]) => {
    if (!name.includes("_scale")) {
        resolvedString += `    static let ${name.toLowerCase()} = DSSubElevation(`;
        const shadows = elevation.toString().replaceAll("  ", " ").replaceAll("rgba(", "").replaceAll ("), ", "#").replaceAll(")", "").replaceAll(",", "").split("#")
        resolvedString += `
        first: .init(
            x: ${shadows[0].split(' ')[0]}, 
            y: ${shadows[0].split(' ')[1]}, 
            blur: ${shadows[0].split(' ')[2].replace("px", "")}, 
            spread: ${shadows[0].split(' ')[3].replace("px", "")}, 
            color: Color(red: ${shadows[0].split(' ')[4]}, green: ${shadows[0].split(' ')[5]}, blue: ${shadows[0].split(' ')[6]}, opacity: ${shadows[0].split(' ')[7]})
        ),
        second: .init(
            x: ${shadows[1].split(' ')[0]}, 
            y: ${shadows[1].split(' ')[1]}, 
            blur: ${shadows[1].split(' ')[2].replace("px", "")}, 
            spread: ${shadows[1].split(' ')[3].replace("px", "")}, 
            color: Color(red: ${shadows[1].split(' ')[4]}, green: ${shadows[1].split(' ')[5]}, blue: ${shadows[1].split(' ')[6]}, opacity: ${shadows[1].split(' ')[7]})
        ),
        third: .init(
            x: ${shadows[2].split(' ')[0]}, 
            y: ${shadows[2].split(' ')[1]}, 
            blur: ${shadows[2].split(' ')[2].replace("px", "")}, 
            spread: ${shadows[2].split(' ')[3].replace("px", "")}, 
            color: Color(red: ${shadows[2].split(' ')[4]}, green: ${shadows[2].split(' ')[5]}, blue: ${shadows[2].split(' ')[6]}, opacity: ${shadows[2].split(' ')[7]})
        )
    )
`;
    }
  })
  
  resolvedString += "}\n";

  resolvedString += `

  `
  return resolvedString;
};


