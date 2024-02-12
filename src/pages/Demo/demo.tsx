import DefaultPage from "../../components/DefaultPage";
import { DBCard } from "@db-ui/react-components";

const cards = ["1", "2", "3"];

const Demo = () => {
  return (
    <DefaultPage className="hide-action-bar" name="Demo">
      <div className="grid grid-cols-1 md:grid-cols-3 p-fix-md gap-fix-md">
        {cards.map((card) => (
          <DBCard key={card} spacing="small" className="gap-fix-md">
            <h4 data-icon="account">Lorem Ipsum {card}</h4>
            <p>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut.
            </p>
          </DBCard>
        ))}
      </div>
    </DefaultPage>
  );
};

export default Demo;
