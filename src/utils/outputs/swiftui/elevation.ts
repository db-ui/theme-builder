import { ThemeSizing } from "../../data.ts";

export const generateSwiftUIElevationsFile = (
    allElevations: ThemeSizing,
): string => {
  let resolvedString: string = `import SwiftUI

struct DBSubElevation {
    let first: DBElevationShadow
    let second: DBElevationShadow
    let third: DBElevationShadow
}

struct DBElevationShadow {
    let x: CGFloat
    let y: CGFloat
    let blur: CGFloat
    let spread: CGFloat
    let color: Color
}
  
struct DBElevation {\n`;

  Object.entries(allElevations).forEach(([name, elevation]) => {
    if (!name.includes("_scale")) {
        resolvedString += `    static let ${name.toLowerCase()} = DBSubElevation(`;
        let shadows = elevation.toString().replaceAll("  ", " ").replaceAll("rgba(", "").replaceAll ("), ", "#").replaceAll(")", "").replaceAll(",", "").split("#")
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


