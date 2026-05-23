import React, { useRef } from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import MKButton from "components/MKButton";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import UploadFileIcon from "@mui/icons-material/UploadFile";

function UploadCSV({ file, onFileChange, loading, error }) {
    const fileInputRef = useRef(null);

    const handleChooseClick = () => {
        fileInputRef.current.click();
    };

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
                ref={fileInputRef}
                onChange={onFileChange}
            />

            <MKButton
                color="info"
                startIcon={loading ? null : <UploadFileIcon />}
                onClick={handleChooseClick}
                disabled={loading}
                sx={{ mb: 2 }}
            >
                {loading ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : null}
                {loading ? "Fetching market data..." : "Choose CSV File"}
            </MKButton>

            {file && !loading && !error && (
            <MKTypography variant="body2" color="text.primary">
                ✅ {file.name} uploaded successfully
            </MKTypography>
            )}
            {error && (
            <MKTypography variant="body2" color="error" mt={1}>
                ❌ {error}
            </MKTypography>
            )}
        </Paper>
        </MKBox>
    );
}

export default UploadCSV;
