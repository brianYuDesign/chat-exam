import { useEffect, useState } from "react";
import { backendUrl } from "./utils";

const useUser = (username) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    fetch(backendUrl + "/user/" + username)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      });
    return () => {};
  }, [username]);

  return { user };
};

export default useUser;
