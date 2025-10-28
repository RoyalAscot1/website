import React, { useEffect, useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function Careers() {
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
			<MKTypography variant="h2">Not hiring at the moment, stay tuned!</MKTypography>
		</MKBox>
		</MKBox>
	);
}

export default Careers;
