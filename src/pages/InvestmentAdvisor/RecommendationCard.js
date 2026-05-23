import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import MKBox from "../../components/MKBox";
import MKTypography from "../../components/MKTypography";
import CircularProgress from "@mui/material/CircularProgress";

function RecommendationCard({ snapshotId, surveyId }) {
    const { getToken } = useAuth();
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!snapshotId || !surveyId) return;

        const fetchRecommendation = async () => {
            try {
                const token = await getToken();
                const formData = new FormData();
                formData.append("input", JSON.stringify({ snapshotId, surveyId }));

                const res = await fetch(`${process.env.REACT_APP_API_URL}/recommendations/`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });
                if (!res.ok) {
                    let detail = "Failed to load recommendations.";
                    try {
                        const errData = await res.json();
                        detail = errData.detail || detail;
                    } catch {}
                    setError(detail);
                    return;
                }
                const data = await res.json();
                setRecommendation(data.gemini_response);
            } catch (err) {
                setError("Could not reach the server. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendation();
    }, [snapshotId, surveyId, getToken]);

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
            <MKBox sx={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
                {loading && <CircularProgress size={24} />}
                {error && (
                    <MKTypography variant="body2" color="error">
                        ❌ {error}
                    </MKTypography>
                )}
                {recommendation && (
                    <MKTypography variant="body2" fontStyle="italic">
                        {recommendation}
                    </MKTypography>
                )}
            </MKBox>
        </MKBox>
    );
}

export default RecommendationCard;
