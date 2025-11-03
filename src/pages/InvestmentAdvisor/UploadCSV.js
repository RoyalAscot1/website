import React from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Paper from "@mui/material/Paper";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function UploadCSV({ file, onFileChange, onUploadClick }) {
    return (
        <MKBox
            minHeight="40vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
        <Paper elevation={3} sx={{ p: 4, borderRadius: "20px", textAlign: "center" }}>
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
            onChange={onFileChange}
            />

            <MKButton
            color="info"
            startIcon={<UploadFileIcon />}
            onClick={onUploadClick}
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
        </MKBox>
    );
}

export default UploadCSV;
