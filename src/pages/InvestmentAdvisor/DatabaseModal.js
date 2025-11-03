import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const modalStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "80%",
	maxHeight: "80vh",
	overflowY: "auto",
	bgcolor: "background.paper",
	borderRadius: 2,
	boxShadow: 24,
	p: 4,
};

function DatabaseModal({ open, onClose, data }) {
	return (
		<Modal open={open} onClose={onClose}>
		<Box sx={modalStyle}>
			<Typography variant="h5" mb={2}>
			Investments Table
			</Typography>
			<TableContainer component={Paper}>
			<Table>
				<TableHead>
				<TableRow>
					<TableCell>Name</TableCell>
					<TableCell>Type</TableCell>
					<TableCell>Risk Level</TableCell>
					<TableCell>Expected Return</TableCell>
				</TableRow>
				</TableHead>
				<TableBody>
				{data.map((inv, index) => (
					<TableRow key={index}>
					<TableCell>{inv.name}</TableCell>
					<TableCell>{inv.type}</TableCell>
					<TableCell>{inv.risk_level}</TableCell>
					<TableCell>{inv.expected_return}</TableCell>
					</TableRow>
				))} 
				</TableBody>
			</Table>
			</TableContainer>
		</Box>
		</Modal>
	);
}

export default DatabaseModal;
