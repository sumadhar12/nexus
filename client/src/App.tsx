import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Register from "./pages/Register";
function App() {
  return (
    <>
      <main className="w-full min-h-screen bg-gray-900">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            className: "bg-gray-800 text-white",
          }}
        />
      </main>
    </>
  );
}

export default App;
