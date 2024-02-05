import { DBAccordion, DBAccordionItem } from "@db-ui/react-components";
import Text from "../../components/text.tsx";
import Button from "../../components/button.tsx";
import Card from "../../components/card.tsx";
import ComponentCard from "./ComponentCard";
import Flex from "../../components/flex.tsx";

const ComponentList = () => {
  return (
    <DBAccordion
      className="sidebar-components"
      behaviour="single"
      initOpenIndex={[0]}
    >
      <DBAccordionItem title="General">
        <ComponentCard name="Text" component={<Text text="Edit me" />} />
        <ComponentCard name="Flex" component={<Flex />} />
      </DBAccordionItem>
      <DBAccordionItem title="Action">
        <ComponentCard
          assetPath={"assets/components/button.svg"}
          name="Button"
          component={<Button children="Test" />}
        />
      </DBAccordionItem>
      <DBAccordionItem title="Layout">
        <ComponentCard name="Card" component={<Card />} />
      </DBAccordionItem>
    </DBAccordion>
  );
};

export default ComponentList;
