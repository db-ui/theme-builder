import { useThemeBuilderStore } from "../../store";
import { useEffect, useState } from "react";
import { DBAlert } from "@db-ui/react-components";

import "./index.scss";

const Notifications = () => {
  const { notification } = useThemeBuilderStore((state) => state);
  const [lastNotification, setLastNotification] = useState<string>();
  const [init, setInit] = useState<boolean>(false);

  useEffect(() => {
    if (notification) {
      console.log(notification);
      setLastNotification(notification);
      setTimeout(
        () => useThemeBuilderStore.setState({ notification: undefined }),
        1500,
      );
    }
  }, [notification]);

  useEffect(() => {
    const runAsync = async () => {
      setTimeout(() => setInit(true), 2000);
    };
    runAsync();
  }, []);

  return (
    <DBAlert
      className={`notification${init ? " opacity-100" : " opacity-0"}${notification ? " show" : ""}`}
      variant="informational"
      type="inline"
    >
      {lastNotification}
    </DBAlert>
  );
};

export default Notifications;
