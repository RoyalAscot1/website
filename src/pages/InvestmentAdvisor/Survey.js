import React from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";

function Survey({ surveyAnswers, onSurveyChange, onSurveySubmit, surveySubmitted }) {
    return (
        <MKBox
            minHeight="50vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
        <Paper elevation={3} sx={{ p: 4, borderRadius: "20px", textAlign: "center" }}>
            <MKTypography variant="h3" mb={3}>
            Investment Preferences Survey
            </MKTypography>

            <TextField
            fullWidth
            label="Risk Tolerance (Low, Medium, High)"
            name="riskTolerance"
            value={surveyAnswers.riskTolerance}
            onChange={onSurveyChange}
            sx={{ mb: 2 }}
            />

            <TextField
            fullWidth
            label="Investment Horizon (Years)"
            name="investmentHorizon"
            value={surveyAnswers.investmentHorizon}
            onChange={onSurveyChange}
            sx={{ mb: 2 }}
            />

            <MKButton color="info" onClick={onSurveySubmit} sx={{ mb: 2 }}>
            Submit Survey
            </MKButton>

            {surveySubmitted && (
                <MKTypography variant="body2" color="text.primary">
                ✅ Survey uploaded successfully
                </MKTypography>
            )}
        </Paper>
        </MKBox>
    );
}

export default Survey;
