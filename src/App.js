import logo from './logo.svg';
import './App.css';

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";

// Material Kit Navbar
import DefaultNavbar from "./examples/Navbars/DefaultNavbar";
import routes from "routes";

// Hero Section
import HeroSection from "./components/HeroSection";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <DefaultNavbar
          routes={routes}
          brand={"hello"}
          action={{
            type: "external",
            route: "https://example.com",
            label: "Sign Up",
            color: "info",
          }}
        />
        <HeroSection />
    </ThemeProvider>
  );
}

export default App;
