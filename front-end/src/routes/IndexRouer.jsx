import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Friends from "../pages/Friends";

const IndexRouer = [
  <Route key="index" path="/" element={<Home />} />,
  <Route key="friend" path="/friends" element={<Friends />} />,

];
export default IndexRouer;
