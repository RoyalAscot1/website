import React, { useState, useEffect } from "react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";

function RecommendationCard({ snapshotId, surveyId }) {
    const [recommendation, setRecommendation] = useState("Loading recommendations...");
    useEffect(() => {
        if (!snapshotId || !surveyId) return;

        console.log(snapshotId);
        console.log(surveyId);
        const fetchRecommendation = async () => {
            try {
                const formData = new FormData();
                formData.append("input", JSON.stringify({ snapshotId, surveyId }));

                const res = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/`, {
                    method: "POST",
                    body: formData,
                });
                const data = await res.json();
                setRecommendation(data.gemini_response);
            } catch (error) {
                console.error("Error fetching recommendation:", error);
                setRecommendation("Failed to load recommendation.");
            }
        };
        fetchRecommendation();
    }, [snapshotId, surveyId]);

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
                Investment Recommendations
            </MKTypography>
            <MKBox sx={{ marginTop: "12px" }}>
                <MKTypography variant="body2" fontStyle="italic">
                    {recommendation}
                </MKTypography>
            </MKBox>
        </MKBox>
    );
}

export default RecommendationCard;
