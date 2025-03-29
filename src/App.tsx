import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <div className='app'>
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
