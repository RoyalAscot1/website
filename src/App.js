import './App.css';

// Routing
import { Routes, Route } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Material Kit 2 React themes
import theme from "assets/theme";

// Material Kit Navbar
import DefaultNavbar from "./examples/Navbars/DefaultNavbar";
import routes from "routes";

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
        <Routes>
          {routes.map(({ route, component }) => (
            <Route exact path={route} element={component} key={route} />
          ))}
        </Routes>
    </ThemeProvider>
  );
}

export default App;
