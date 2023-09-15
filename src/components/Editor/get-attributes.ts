import parse from "html-react-parser";

const reactifyAttribute = (key: string, prefix: string): string => {
  const slot = key.slice(prefix.length);
  return prefix + slot.charAt(0).toUpperCase() + slot.slice(1);
};

const getAttributes = (attribs: any, options: any): any => {
  const attributes: any = {};
  if (attribs) {
    const attributeKeys = Object.keys(attribs);
    attributeKeys.forEach((key) => {
      if (key === "classname") {
        attributes.className = attribs[key];
      } else if (key.startsWith("on")) {
        try {
          const event = reactifyAttribute(key, "on");
          attributes[event] = Function(attribs[key].replace(/"/g, ""));
        } catch (e) {
          /* empty */
        }
      } else if (key.startsWith("slot")) {
        try {
          const slot = reactifyAttribute(key, "slot");
          attributes[slot] = parse(attribs[key], options);
        } catch (e) {
          /* empty */
        }
      } else {
        attributes[key] = attribs[key];
      }
    });
  }
  return attributes;
};

export default getAttributes;
