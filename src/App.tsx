import { useEffect, useState } from "react";
import "./App.css";
import { useLogin } from "./hooks/useLogin";
import { logout } from "./api/auth";
import { getAllTxs } from "./api/transaction";

function App() {
  const [email, setEmail] = useState("kishore@endl.app");
  const [password, setPassword] = useState("G7m@xQ2w!");

  const mutation = useLogin();

  const handleLogin = () => {
    mutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          console.log("Login Successful:", data);
        },
        onError: (error) => {
          console.error("Login Failed:", error);
        },
      }
    );
  };

  const handleLogout = async () => {
    // await logout();
    const data = await getAllTxs();
    console.log("data", data);
  };

  useEffect(() => {
    // const get = async () => {
    //   const data = await getAllTxs();
    //   console.log("data", data);
    // };
    // get();
  }, []);

  return (
    <>
      <div>
        <h2>Login</h2>
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={mutation.isPending}>
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </>
  );
}

export default App;
