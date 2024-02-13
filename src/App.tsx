import { Outlet } from "react-router-dom";
import Notifications from "./components/Notifications";

const App = () => {
  return (
    <>
      <Notifications />
      <Outlet />
    </>
  );
};

export default App;
