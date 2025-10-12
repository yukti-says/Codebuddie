import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./components/EditorPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </>
  );
};

export default App;
