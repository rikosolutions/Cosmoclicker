import { Route } from "react-router-dom";
import Home from "../pages/Home";
import Game from "../pages/Game";
import Friends from "../pages/Friends";
import Earn from "../pages/Earn";
import Quest from "../pages/Quest";
const IndexRouer = [
  <Route key="index" path="/" element={<Home />} />,
  <Route key="game" path="/game" element={<Game />} />,
  <Route key="Earn" path="/earn" element={<Earn />} />,
  <Route key="Quest" path="/quest" element={<Quest />} />,
  <Route key="friend" path="/friends" element={<Quest />} />,
  

];
export default IndexRouer;
