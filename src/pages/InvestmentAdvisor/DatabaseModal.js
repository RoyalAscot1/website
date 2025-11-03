import React, { useState, useEffect } from "react";
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
import CircularProgress from "@mui/material/CircularProgress";

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

function DatabaseModal({ open, onClose }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (open) {
			// Fetch from backend
			fetch("http://localhost:8000/investments/")
				.then((res) => {
					if (!res.ok) throw new Error("Failed to fetch investments");
					return res.json();
				})
				.then((data) => setData(data))
				.catch((err) => setError(err.message))
				.finally(() => setLoading(false));
		}
	}, [open]);

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				<Typography variant="h5" mb={2}>
					Investments Table
				</Typography>

				{loading ? (
					<Box display="flex" justifyContent="center" alignItems="center" height="40vh">
						<CircularProgress />
					</Box>
				) : error ? (
					<Typography color="error" textAlign="center">
						{error}
					</Typography>
				) : data.length === 0 ? (
					<Typography textAlign="center" color="text.secondary">
						No investment data available.
					</Typography>
				) : (
					<TableContainer component={Paper}>
						<Table>
							<TableHead sx={{ display: "table-header-group" }}>
								<TableRow>
									<TableCell>Ticker Symbol</TableCell>
									<TableCell>Investment Name</TableCell>
									<TableCell>Quantity Held</TableCell>
									<TableCell>Average Purchase Price</TableCell>
									<TableCell>Current Price</TableCell>
									<TableCell>Total Value</TableCell>
									<TableCell>Unrealized Gain or Loss</TableCell>
									<TableCell>Asset Type</TableCell>
									<TableCell>Currency</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((inv, index) => (
									<TableRow key={index}>
										<TableCell>{inv.TickerSymbol}</TableCell>
										<TableCell>{inv.InvestmentName}</TableCell>
										<TableCell>{inv.QuantityHeld}</TableCell>
										<TableCell>{inv.AveragePurchasePrice}</TableCell>
										<TableCell>{inv.CurrentPrice}</TableCell>
										<TableCell>{inv.TotalValue}</TableCell>
										<TableCell>{inv.UnrealizedGainLoss}</TableCell>
										<TableCell>{inv.AssetType}</TableCell>
										<TableCell>{inv.Currency}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				)}
			</Box>
		</Modal>
	);
}

export default DatabaseModal;
