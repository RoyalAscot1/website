// src/pages/InvestmentAdvisor/index.js
import React, { useState } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function InvestmentAdvisor() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);
    };

    const handleUploadClick = () => {
        document.getElementById("csvInput").click();
    };

    return (
        <MKBox
        minHeight="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: "#f8f9fa" }}
        >
        <Container maxWidth="sm">
            <Paper
            elevation={3}
            sx={{
                p: 4,
                borderRadius: "20px",
                textAlign: "center",
            }}
            >
            <MKTypography variant="h3" mb={2}>
                Upload Your Investment History
            </MKTypography>

            <MKTypography variant="body1" color="text.secondary" mb={3}>
                Please upload a CSV file containing your past investment transactions.
            </MKTypography>

            <input
                id="csvInput"
                type="file"
                accept=".csv"
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            <MKButton
                color="info"
                startIcon={<UploadFileIcon />}
                onClick={handleUploadClick}
                sx={{ mb: 2 }}
            >
                Choose CSV File
            </MKButton>

            {file && (
                <MKTypography variant="body2" color="text.primary">
                ✅ {file.name} uploaded successfully
                </MKTypography>
            )}
            </Paper>
        </Container>
        </MKBox>
    );
}

export default InvestmentAdvisor;
