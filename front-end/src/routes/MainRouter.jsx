import { BrowserRouter, Routes, Route } from "react-router-dom";

import IndexRouer from "./IndexRouer";
import Error404 from "../pages/error/Error404";
function MainRouter() {
  return (
    
      <BrowserRouter basename="/">
        <Routes>
          {IndexRouer}
          <Route path="*" element={<Error404 />} />
          
        </Routes>
      </BrowserRouter>
    
  );
}

export default MainRouter;
