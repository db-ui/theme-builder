import { ComponentCardPropsType } from "./ComponentCard/data.ts";
import Container from "../../components/container.tsx";
import Text from "../../components/text.tsx";
import Button from "../../components/button.tsx";
import Link from "../../components/link.tsx";
import Card from "../../components/card.tsx";
import Headline from "../../components/headline.tsx";
import Divider from "../../components/divider.tsx";

export type ComponentListType = {
  headline: string;
  components: ComponentCardPropsType[];
};

export const Components: ComponentListType[] = [
  {
    headline: "general",
    components: [
      {
        name: "container",
        component: <Container />,
        assetPath: "assets/components/flex.svg",
      },
      { name: "text", component: <Text /> },
      { name: "headline", component: <Headline /> },
    ],
  },
  {
    headline: "action",
    components: [
      {
        name: "button",
        component: <Button children="Test" />,
        assetPath: "assets/components/button.svg",
      },
      {
        name: "link",
        component: <Link />,
        assetPath: "assets/components/link.svg",
      },
    ],
  },
  {
    headline: "layout",
    components: [
      { name: "card", component: <Card /> },
      {
        name: "divider",
        component: <Divider />,
        assetPath: "assets/components/divider.svg",
      },
    ],
  },
];
