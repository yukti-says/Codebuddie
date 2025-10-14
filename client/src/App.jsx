import React from "react";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import EditorPage from "./components/EditorPage";
import {Toaster}  from 'react-hot-toast'

const App = () => {
  return (
    <>
      <Toaster position="top-right"></Toaster>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/editor/:roomId" element={<EditorPage />} />
      </Routes>
    </>
  );
};

export default App;
