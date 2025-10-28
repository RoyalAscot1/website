// src/pages/InvestmentAdvisor/index.js
import React, { useState } from "react";
import Container from "@mui/material/Container";
import UploadCSV from "./UploadCSV";
import Survey from "./Survey";

function InvestmentAdvisor() {
    const [file, setFile] = useState(null);
    const [step, setStep] = useState(1);
    const [surveyAnswers, setSurveyAnswers] = useState({
        riskTolerance: "",
        investmentHorizon: ""
    })

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
        setTimeout(() => {
            setStep(2);
        }, 1000);
    };

    const handleUploadClick = () => {
        document.getElementById("csvInput").click();
    };

    const handleSurveyChange = (e) => {
        const { name, value } = e.target;
        setSurveyAnswers((prev) => ({ ...prev, [name]: value}));
    }

    const handleSurveySubmit = () => {
        console.log("CSV:", file);
        console.log("Survey:", surveyAnswers);
        // PASS TO BACKEND AND DATABASE LATER
    }

    return (
        <Container maxWidth="sm">
            {step === 1 && (
                <UploadCSV 
                    file={file} 
                    onFileChange={handleFileChange} 
                    onUploadClick={handleUploadClick} 
                />
            )}
            {step === 2 && (
                <Survey
                    surveyAnswers={surveyAnswers}
                    onSurveyChange={handleSurveyChange}
                    onSurveySubmit={handleSurveySubmit}
                />
            )}
        </Container>
    );
}

export default InvestmentAdvisor;
