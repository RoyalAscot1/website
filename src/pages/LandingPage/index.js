import React, { useEffect, useState } from "react";
import MKBox from "../../components/MKBox";         // Material Kit Box
import MKTypography from "../../components/MKTypography"; // Material Kit Typography
import MKButton from "../../components/MKButton";

const LandingPage = () => {
    const [isMounted, setIsMounted] = useState(false);
        useEffect(() => {
        setIsMounted(true);
    }, []);
    
    return (
        <MKBox
            sx={{
                background: "linear-gradient(135deg, #f06, #4a90e2)",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <MKBox
                display="flex"
                flexDirection="column"
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
                sx={{
                    opacity: isMounted ? 1 : 0,
                    transform: isMounted ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                    zIndex: 1,
                }}
            >
            <MKTypography
                variant="h1"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: { xs: "3rem", md: "4em" },
                    mb: 1,
                }}
            >
                What would you like to do today?
            </MKTypography>
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
    );
};

export default LandingPage;
