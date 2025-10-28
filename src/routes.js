// Routes
import About from "pages/About";
import LandingPage from "pages/LandingPage";

const routes = [
  { name: "Home", route: "/", component: <LandingPage /> },
  { name: "About", route: "/about", component: <About /> },
  { name: "Services", route: "/services" },
  { name: "Careers", route: "/careers" },
];

export default routes;