import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { clearUser, setUser } from "./features/auth/authSlice";
import { MantineProvider } from "@mantine/core";
import AppRoutes from "./routes";

function App() {


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