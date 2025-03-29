import { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { getAllTxs } from "./api/transaction";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (you can implement your own logic here)
    const checkAuth = async () => {
      try {
        await getAllTxs();
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  return <div className='app'>{isLoggedIn ? <Dashboard /> : <Login />}</div>;
}

export default App;
