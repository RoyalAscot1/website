// Routes
import LandingPage from "pages/LandingPage";
import About from "pages/About";
import InvestmentAdvisor from "pages/InvestmentAdvisor";
import ViewInvestments from "pages/InvestmentAdvisor/ViewInvestments";
import Careers from "pages/Careers";

const routes = [
	{ name: "Home", route: "/", component: <LandingPage /> },
	{ name: "About", route: "/about", component: <About /> },
	{
		name: "Services",
		collapse: [
			{
				name: "Investment Advisor",
				route: "/services/investment-advisor",
				component: <InvestmentAdvisor />,
				protected: true,
			},
			{
				name: "View Investments",
				route: "/services/view-investments",
				component: <ViewInvestments />,
				protected: true,
			}
		]
	},
	{ name: "Careers", route: "/careers", component: <Careers /> },
];

export default routes;
