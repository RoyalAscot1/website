import React from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Paper from "@mui/material/Paper";
import { Button, Stack } from "@mui/material";

function Survey({ surveyAnswers, onSurveyChange, onSurveySubmit, surveySubmitted }) {
    
    const makeHandler = (name, value) => ({
        target: { name, value }
    });

    const questions = [
        {
            key: "riskTolerance",
            label: "Risk Tolerance",
            options: [
                { label: "Low", value: 1 },
                { label: "Medium", value: 2 },
                { label: "High", value: 3 }
            ]
        },
        {
            key: "investmentHorizon",
            label: "Investment Horizon",
            options: [
                { label: "< 1 year", value: 1 },
                { label: "1 - 5 years", value: 2 },
                { label: "5+ years", value: 3 }
            ]
        },
        {
            key: "lossCapacity",
            label: "Loss Capacity",
            options: [
                { label: "Up to 10%", value: 1 },
                { label: "Up to 20%", value: 2 },
                { label: "40%+", value: 3 }
            ]
        },
        {
            key: "investmentGoal",
            label: "Investment Goal",
            options: [
                { label: "Capital Protection", value: 1 },
                { label: "Balanced Growth", value: 2 },
                { label: "Aggressive Growth", value: 3 }
            ]
        }
    ];

    const allAnswered = questions.every(
        (q) => surveyAnswers[q.key] !== undefined 
        && surveyAnswers[q.key] !== null 
        && surveyAnswers[q.key] !== ""
    );

    return (
        <MKBox
            minHeight="60vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            mt={8}
        >
            <Paper elevation={4} sx={{ p: 4, pb: 2, borderRadius: "20px", width: "420px", mb: 2}}>
                <MKTypography variant="h3" mb={3} textAlign="center">
                    Investment Survey
                </MKTypography>

                {questions.map((q) => (
                    <MKBox key={q.key} mb={3}>
                        <MKTypography variant="h6" mb={1}>
                            {q.label}
                        </MKTypography>

                        <Stack direction="row" spacing={1}>
                            {q.options.map((opt) => (
                                <Button
                                    key={opt.value}
                                    variant={
                                        surveyAnswers[q.key] === opt.value
                                            ? "contained"
                                            : "outlined"
                                    }
                                    color="info"
                                    sx={{
                                        flexGrow: 1,
                                        borderRadius: "30px",
                                        textTransform: "none",
                                        color: "#666"
                                    }}
                                    onClick={() =>
                                        onSurveyChange(makeHandler(q.key, opt.value))
                                    }
                                >
                                    {opt.label}
                                </Button>
                            ))}
                        </Stack>
                    </MKBox>
                ))}

                <MKButton
                    color="info"
                    onClick={onSurveySubmit}
                    disabled={!allAnswered}
                    sx={{ mt: 2, py: 0.5, display: "block", mx: "auto"  }}
                >
                    Submit
                </MKButton>

                {surveySubmitted && (
                    <MKTypography variant="body2" color="success.main" mt={1} textAlign="center">
                        ✅ Survey submitted!
                    </MKTypography>
                )}
            </Paper>
        </MKBox>
    );
}

export default Survey;
