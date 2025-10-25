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
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
    </ThemeProvider>
  );
}

export default App;
