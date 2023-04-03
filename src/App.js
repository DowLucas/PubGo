import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { clearUser, setUser } from "./features/auth/authSlice";
import { MantineProvider } from "@mantine/core";
import AppRoutes from "./routes";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, displayName, email, photoURL } = user;
      dispatch(setUser({ uid, displayName, email, photoURL }));
    } else {
      dispatch(clearUser());
    }
  });

    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <div className="App">
      {/* Your app content */}
      <div>
        Hello
      </div>
    </div>
  );
}

export default App;