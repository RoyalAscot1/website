// Routes
import LandingPage from "pages/LandingPage";
import About from "pages/About";
import InvestmentAdvisor from "pages/InvestmentAdvisor";

const routes = [
	{ name: "Home", route: "/", component: <LandingPage /> },
  	{ name: "About", route: "/about", component: <About /> },
  	{ 
		name: "Services",
    	collapse: [
			{
				name: "Investment Advisor",
				route: "/services/investment-advisor",
				component: <InvestmentAdvisor />
			}
		]  
	},
  	{ name: "Careers", route: "/careers" },
];

export default routes;