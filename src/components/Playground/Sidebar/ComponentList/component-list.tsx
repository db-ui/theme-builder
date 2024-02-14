import { DBAccordion, DBAccordionItem } from "@db-ui/react-components";
import ComponentCard from "./ComponentCard";
import Container from "../../components/container.tsx";
import Button from "../../components/button.tsx";
import Link from "../../components/link.tsx";
import Card from "../../components/card.tsx";
import Text from "../../components/text.tsx";

const ComponentList = () => {
  return (
    <DBAccordion
      className="sidebar-components"
      behaviour="single"
      initOpenIndex={[0]}
    >
      <DBAccordionItem title="General">
        <ComponentCard name="Container" component={<Container />} />
        <ComponentCard name="Text" component={<Text text="Edit me" />} />
      </DBAccordionItem>
      <DBAccordionItem title="Action">
        <ComponentCard
          assetPath={"assets/components/button.svg"}
          name="Button"
          component={<Button children="Test" />}
        />
        <ComponentCard
          assetPath={"assets/components/link.svg"}
          name="Link"
          component={<Link />}
        />
      </DBAccordionItem>
      <DBAccordionItem title="Layout">
        <ComponentCard name="Card" component={<Card />} />
      </DBAccordionItem>
    </DBAccordion>
  );
};

export default ComponentList;
