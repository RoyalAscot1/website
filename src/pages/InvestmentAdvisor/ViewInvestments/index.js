import React, { useState, useEffect } from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography
} from "@mui/material";
import MKBox from "../../../components/MKBox";
import MKButton from "../../../components/MKButton";
import DatabaseModal from "../DatabaseModal";
import { useNavigate } from "react-router-dom";

function ViewInvestments() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
        
    const [snapshots, setSnapshots] = useState([]);
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleOpenModal = (snapshot) => {
        setSelectedSnapshot(snapshot);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedSnapshot(null);
    };

    useEffect(() => {
        const fetchSnapshots = async () => {
            try {
                const res = await fetch("http://localhost:8000/snapshots/");
                const data = await res.json();
                setSnapshots(data);
            } catch (err) {
                console.error("Error fetching snapshots:", err);
            }
        };
        fetchSnapshots();
    }, []);

    console.log(snapshots);
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
        <Typography variant="h3" color="white" sx={{ mb: 3 }}>
            Investment History
        </Typography>

        <TableContainer component={Paper} sx={{ maxWidth: 900 }}>
            <Table>
            <TableHead sx={{ display: "table-header-group" }}>
                <TableRow>
                <TableCell>Snapshot</TableCell>
                <TableCell>Date uploaded</TableCell>
                <TableCell>Description</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {snapshots.length === 0 ? (
        <TableRow>
            <TableCell colSpan={4} align="center">
                No snapshots uploaded
            </TableCell>
        </TableRow>
    ) : (
        snapshots.map((snap, idx) => (
            <TableRow key={idx}>
                <TableCell>{snap.id}</TableCell>
                <TableCell>
                    {new Date(snap.uploaded_at).toLocaleString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </TableCell>
                <TableCell>{snap.description}</TableCell>
                <TableCell>
                    <MKButton
                        color="info"
                        size="small"
                        onClick={() => handleOpenModal(snap)}
                    >
                        View Details
                    </MKButton>
                </TableCell>
            </TableRow>
        ))
    )}
            </TableBody>
            </Table>
        </TableContainer>

        <MKButton
            color="secondary"
            sx={{ mt: 3 }}
            onClick={() => navigate("/services/investment-advisor/")}
        >
            To Advisor
        </MKButton>

        {selectedSnapshot && (
            <DatabaseModal
                open={openModal}
                onClose={handleCloseModal}
                snapshot={selectedSnapshot}
            />
        )}
        </MKBox>
        </MKBox>
    );
}

export default ViewInvestments;
