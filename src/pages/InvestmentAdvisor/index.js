import React, { useState, useEffect } from "react";
import MKBox from "../../components/MKBox";
import MKButton from "../../components/MKButton";
import Container from "@mui/material/Container";
import UploadCSV from "./UploadCSV";
import Survey from "./Survey";
import RecommendationCard from "./RecommendationCard";
import DatabaseModal from "./DatabaseModal";

function InvestmentAdvisor() {
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Important data to remember
	const [file, setFile] = useState(null);
	const [step, setStep] = useState(1);
	const [surveyAnswers, setSurveyAnswers] = useState({
		riskTolerance: null,
		investmentHorizon: null,
	});
	const [surveySubmitted, setSurveySubmitted] = useState(false);
	const [recommendations, setRecommendations] = useState([]);

	const [openModal, setOpenModal] = useState(false);
	const [investmentsData, setInvestmentsData] = useState([]);

	const handleOpenModal = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);

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

	const handleSurveySubmit = async () => {
		console.log("CSV:", file);
		console.log("Survey:", surveyAnswers);
		
		try {
			// Build the form to be sent to the backend
			const formData = new FormData();
			formData.append("file", file);
			formData.append("surveyAnswers", JSON.stringify(surveyAnswers));
			
			const res = await fetch("http://localhost:8000/upload", {
				method: "POST",
				body: formData
			});

			const data = await res.json();
			console.log("Server response:", data)
		} catch (err) {
			console.log("Error:", err);
		}
		setSurveySubmitted(true);

		setTimeout(() => {
			setIsMounted(false);
			setTimeout(() => {
				setStep(3);
				setIsMounted(true);
			}, 500);
		}, 2000);
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
					onUploadClick={handleUploadClick}
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
				<RecommendationCard investment={{
					name: "hello",
					type: "test",
					risk_level: "high",
					expected_return: "0.6"
				}}
				/>
			)}
			<MKButton color="secondary" onClick={handleOpenModal}>
			View Investments in Database
		</MKButton>
		<DatabaseModal
			open={openModal}
			onClose={handleCloseModal}
			data={investmentsData}
		/>
		</Container>
		</MKBox>
		</MKBox>
	);
}

export default InvestmentAdvisor;
