import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Friends from "../pages/Friends";

const IndexRouer = [
  <Route key="index" path="/" element={<Home />} />,
  <Route key="index" path="/game" element={<Game />} />,
  <Route key="friend" path="/friends" element={<Friends />} />,

];
export default IndexRouer;
