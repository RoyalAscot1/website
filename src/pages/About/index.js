import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "../../components/MKButton";

function About() {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<MKBox
			minHeight="100vh"
			display="flex"
			alignItems="center"
			justifyContent="center"
			sx={{
				background: "linear-gradient(135deg, #f06, #4a90e2)",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
		<MKBox
			maxWidth="md"
			width="100%"
			px={{ xs: 3, sm: 4, md: 6 }}
			textAlign="center"
			sx={{
				opacity: isMounted ? 1 : 0,
				transform: isMounted ? "translateY(0)" : "translateY(20px)",
				transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
				zIndex: 1,
			}}
		>
			<MKTypography
				variant="h1"
				component="h1"
				fontWeight="bold"
				color="white"
				mb={2}
				sx={{
					fontSize: { xs: "2.5rem", md: "3.75rem" },
					lineHeight: 1.2,
				}}
			>
			About This App
			</MKTypography>

			<MKTypography
			variant="body1"
			color="rgba(255, 255, 255, 0.8)"
			sx={{
				fontSize: { xs: "1rem", md: "1.125rem" },
				lineHeight: 1.6,
				maxWidth: "50ch",
				mx: "auto",
			}}
			>
			A modern, developer-first platform built with the same attention to
			detail that powers Stripe’s global payments infrastructure. Fast,
			reliable, and beautifully simple.
			</MKTypography>

			<MKBox mt={4}>
			<MKButton
				color="info"
				size="large"
				sx={{ px: 4, py: 1.5 }}
				onClick={() => alert("Get Started clicked!")}
			>
				Get Started
			</MKButton>
			</MKBox>
		</MKBox>
		</MKBox>
	);
}

export default About;
