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
import MKButton from "../../components/MKButton";
import MKTypography from "components/MKTypography";

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

function DatabaseModal({ open, onClose, snapshot }) {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!open || !snapshot) return;
		setLoading(true);
		setError(null);
		setData([]);
		if (open) {
			// Fetch from backend
			fetch(`http://localhost:8000/snapshots/${snapshot.id}/`)
				.then((res) => {
					if (!res.ok) throw new Error("Failed to fetch investments");
					return res.json();
				})
				.then((data) => setData(data))
				.catch((err) => setError(err.message))
				.finally(() => setLoading(false));
		}
	}, [open, snapshot]);

	return (
		<Modal open={open} onClose={onClose}>
			<Box sx={modalStyle}>
				<MKTypography variant="h5">
					Investment Snapshot — {new Date(snapshot.uploaded_at).toLocaleString(undefined, {
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
										})}
				</MKTypography>

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
									<TableCell>Beta</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{data.map((inv, index) => (
									<TableRow key={index}>
										<TableCell>{inv.TickerSymbol}</TableCell>
										<TableCell>{inv.InvestmentName}</TableCell>
										<TableCell>{inv.QuantityHeld}</TableCell>
										<TableCell>{Number(inv.AveragePurchasePrice).toFixed(2)}</TableCell>
										<TableCell>{Number(inv.CurrentPrice).toFixed(2)}</TableCell>
										<TableCell>{Number(inv.TotalValue).toFixed(2)}</TableCell>
										<TableCell>{Number(inv.UnrealizedGainLoss).toFixed(2)}</TableCell>
										<TableCell>{inv.AssetType}</TableCell>
										<TableCell>{inv.Currency}</TableCell>
										<TableCell>{inv.Beta}</TableCell>
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
