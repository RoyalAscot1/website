import React from "react";
import MKBox from "../../components/MKBox";         // Material Kit Box
import MKTypography from "../../components/MKTypography"; // Material Kit Typography
import MKButton from "../../components/MKButton";

const LandingPage = () => {
    return (
        <MKBox
            minHeight="100vh"
            width="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                background: "linear-gradient(195deg, #49a3f1, #1A73E8)",
                color: "#fff",
                borderRadius: 2,
        }}
        >
            <MKTypography
                variant="h1"
                sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: { xs: "3rem", md: "5em" },
                    mb: 6
                }}
            >
                Investment Advisor
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
    );
};

export default LandingPage;
