import { useThemeBuilderStore } from "../../store";
import { useEffect, useState } from "react";
import { DBAlert } from "@db-ui/react-components";

import "./index.scss";

const Notifications = () => {
  const { notification } = useThemeBuilderStore((state) => state);
  const [lastNotification, setLastNotification] = useState<string>();

  useEffect(() => {
    if (notification) {
      setLastNotification(notification);
      setTimeout(
        () => useThemeBuilderStore.setState({ notification: undefined }),
        1500,
      );
    }
  }, [notification]);

  return (
    <DBAlert
      className={`notification ${notification ? "show" : ""}`}
      variant="informational"
    >
      {lastNotification}
    </DBAlert>
  );
};

export default Notifications;
