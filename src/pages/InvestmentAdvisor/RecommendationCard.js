import React from "react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";

function RecommendationCard({ investment }) {
    return (
        <MKBox
            sx={{
                border: "1px solid #ccc",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "12px",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
            }}
        >
            <MKTypography variant="h6" fontWeight="bold">
                {investment.name}
            </MKTypography>
            <MKTypography variant="body2">
                Type: {investment.type}
            </MKTypography>
            <MKTypography variant="body2">
                Risk: {investment.risk_level}
            </MKTypography>
            <MKTypography variant="body2">
                Expected Return: {investment.expected_return}%
            </MKTypography>
        </MKBox>
    );
}

export default RecommendationCard;
