import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { clearUser, setUser } from "./features/auth/authSlice";;

function App() {
  const dispatch = useDispatch();

  console.log("hello")

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