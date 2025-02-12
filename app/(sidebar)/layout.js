import React from "react";
import { Home } from "../_pages/home/Home";

const layout = ({ children }) => {
  return (
    <div>
      <Home>
        {/* hello */}
        {children}
      </Home>
    </div>
  );
};

export default layout;
