import ComponentContainer from "./ComponentContainer";
import ScreenContainer from "./ScreenContainer";

const ComponentPreview = () => {
  return (
    <div className="w-full flex flex-col gap-res-md">
      <ScreenContainer />
      <ComponentContainer />
    </div>
  );
};

export default ComponentPreview;
