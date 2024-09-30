import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Friends from "../pages/Friends";
import Quest from "../pages/Quest";
import Earn from "../pages/Earn";

const IndexRouer = [
  <Route key="index" path="/" element={<Home />} />,
  <Route key="friend" path="/friends" element={<Friends />} />,
  <Route key="quest" path="/quest" element={<Quest />} />,
  <Route key="earn" path="/earn" element={<Earn />} />,



];
export default IndexRouer;
