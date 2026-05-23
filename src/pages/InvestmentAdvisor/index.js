import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MKBox from "../../components/MKBox";
import MKButton from "../../components/MKButton";
import Container from "@mui/material/Container";
import UploadCSV from "./UploadCSV";
import Survey from "./Survey";
import RecommendationCard from "./RecommendationCard";

function InvestmentAdvisor() {
	const navigate = useNavigate();
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);
	const [step, setStep] = useState(1);

	// Important data to remember
	const [file, setFile] = useState(null);
	const [snapshotId, setSnapshotId] = useState(null);
	const [surveyId, setSurveyId] = useState(null);
	const [surveyAnswers, setSurveyAnswers] = useState({
		riskTolerance: "",
		investmentHorizon: "",
		lossCapacity: "",
		investmentGoal: "",
	});
	const [surveySubmitted, setSurveySubmitted] = useState(false);
	const [csvUploaded, setCsvUploaded] = useState(false);
	const [csvLoading, setCsvLoading] = useState(false);

	const handleFileChange = async (e) => {
		const uploadedFile = e.target.files[0];
		if (!uploadedFile) return;
		setFile(uploadedFile);
		setCsvLoading(true);
		try {
			// Build the form to be sent to the backend
			const formData = new FormData();
			formData.append("file", uploadedFile);

			const res = await fetch(`${process.env.REACT_APP_API_URL}/upload-CSV/`, {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			setCsvUploaded(true);
			setCsvLoading(false);
			setSnapshotId(data.snapshot_id);

			setTimeout(() => {
				setIsMounted(false);
				setTimeout(() => {
					setStep(2);
					setIsMounted(true);
				}, 500);
			}, 500);
		} catch (err) {
			setCsvLoading(false);
			console.log("Error:", err);
		}
	};

	const handleSurveyChange = (e) => {
		const { name, value } = e.target;
		setSurveyAnswers((prev) => ({ ...prev, [name]: value }));
	};

	const handleSurveySubmit = async () => {
		console.log("Survey:", surveyAnswers);
		
		try {
			// Build the form to be sent to the backend
			const formData = new FormData();
			formData.append("surveyAnswers", JSON.stringify(surveyAnswers));
			
			const res = await fetch(`${process.env.REACT_APP_API_URL}/upload-survey/`, {
				method: "POST",
				body: formData
			});
			const data = await res.json();
			console.log("Survey uploaded:", data);
			setSurveySubmitted(true);
			setSurveyId(data.survey_id);

			setTimeout(() => {
				setIsMounted(false);
				setTimeout(() => {
					setStep(3);
					setIsMounted(true);
				}, 500);
			}, 500);
		} catch (err) {
			console.log("Error:", err);
		}
	};

	return (
		<MKBox
		minHeight="100vh"
		display="flex"
		flexDirection="column"
		alignItems="center"
		justifyContent="center"
		sx={{
			background: "linear-gradient(135deg, #f06, #4a90e2)",
			backgroundSize: "cover",
			backgroundPosition: "center",
		}}
		>
		<MKBox
			display="flex"
			flexDirection="column"
			minHeight="100vh"
			alignItems="center"
			justifyContent="center"
			sx={{
			opacity: isMounted ? 1 : 0,
			transform: isMounted ? "translateY(0)" : "translateY(20px)",
			transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
			zIndex: 1,
			}}
		>
		<Container maxWidth="sm" 
		sx={{
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
		}}>
			{step === 1 && (
				<UploadCSV
					file={file}
					onFileChange={handleFileChange}
					loading={csvLoading}
				/>
			)}
			{step === 2 && (
				<Survey
					surveyAnswers={surveyAnswers}
					onSurveyChange={handleSurveyChange}
					onSurveySubmit={handleSurveySubmit}
					surveySubmitted={surveySubmitted}
				/>
			)}
			{step === 3 && (
				<RecommendationCard snapshotId={snapshotId} surveyId={surveyId} />
			)}
			<MKButton color="secondary" onClick={() => navigate("/services/view-investments/")}>
				View Investments in Database
			</MKButton>
		</Container>
		</MKBox>
		</MKBox>
	);
}

export default InvestmentAdvisor;
