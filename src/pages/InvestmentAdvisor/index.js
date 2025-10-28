import React, { useState, useEffect } from "react";
import MKBox from "../../components/MKBox";
import Container from "@mui/material/Container";
import UploadCSV from "./UploadCSV";
import Survey from "./Survey";

function InvestmentAdvisor() {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	const [file, setFile] = useState(null);
	const [step, setStep] = useState(1);
	const [surveyAnswers, setSurveyAnswers] = useState({
		riskTolerance: "",
		investmentHorizon: "",
	});

	const handleFileChange = (e) => {
		const uploadedFile = e.target.files[0];
		setFile(uploadedFile);
		setTimeout(() => {
			setIsMounted(false);
			setTimeout(() => {
				setStep(2);
				setIsMounted(true);
			}, 500);
		}, 2000);
	};

	const handleUploadClick = () => {
		document.getElementById("csvInput").click();
	};

	const handleSurveyChange = (e) => {
		const { name, value } = e.target;
		setSurveyAnswers((prev) => ({ ...prev, [name]: value }));
	};

	const handleSurveySubmit = () => {
		console.log("CSV:", file);
		console.log("Survey:", surveyAnswers);
		// PASS TO BACKEND AND DATABASE LATER
	};

	return (
		<MKBox
		minHeight="100vh"
		display="flex"
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
		</MKBox>
		</MKBox>
	);
}

export default InvestmentAdvisor;
