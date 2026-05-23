import './App.css';

// Routing
import { Routes, Route } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

// Material Kit 2 React themes
import theme from "assets/theme";

// Material Kit Navbar
import DefaultNavbar from "./examples/Navbars/DefaultNavbar";
import routes from "routes";

// Clerk
import { useUser, RedirectToSignIn, UserButton } from "@clerk/clerk-react";

function ProtectedRoute({ children }) {
	const { isSignedIn, isLoaded } = useUser();
	if (!isLoaded) return null;
	if (!isSignedIn) return <RedirectToSignIn />;
	return children;
}

function App() {
	const { isSignedIn } = useUser();

	const getRoutes = (allRoutes) =>
		allRoutes.map((route) => {
			if (route.collapse) {
				return getRoutes(route.collapse);
			}
			if (route.route) {
				const element = route.protected
					? <ProtectedRoute>{route.component}</ProtectedRoute>
					: route.component;
				return <Route exact path={route.route} element={element} key={route.key} />;
			}
			return null;
		});

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
			{isSignedIn && (
				<Box sx={{ position: "fixed", top: 14, right: 24, zIndex: 9999 }}>
					<UserButton />
				</Box>
			)}
			<Routes>
				{getRoutes(routes)}
			</Routes>
		</ThemeProvider>
	);
}

export default App;
