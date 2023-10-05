import "./index.scss";
import LoginScreen from "./LoginScreen";
import NavigationScreen from "./NavigationScreen";

const ScreenContainer = () => {
  return (
    <div className="flex flex-col m:flex-row mx-auto gap-res-md">
      <LoginScreen />
      <NavigationScreen />
    </div>
  );
};

export default ScreenContainer;
