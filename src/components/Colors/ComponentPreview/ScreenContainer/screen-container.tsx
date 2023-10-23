import "./index.scss";
import LoginScreen from "./LoginScreen";
import NavigationScreen from "./NavigationScreen";

const ScreenContainer = () => {
  return (
    <div className="flex flex-col md:flex-row mx-auto gap-res-md">
      <LoginScreen />
      <NavigationScreen />
    </div>
  );
};

export default ScreenContainer;
