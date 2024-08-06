import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login"); // Redirect to login
    onClose();
  };

  const handleProceedWithoutLogin = () => {
    navigate("/NewDecision"); // Redirect to NewDecision
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          You are not logged in
        </Typography>
        <Typography sx={{ mt: 2 }}>
          To ensure your decisions are saved, please log in. If you choose not to log in, your decisions will not be saved.
        </Typography>
        <Box sx={{ marginTop: 2, display: "flex", gap: 2 }}>
          <Button variant="contained" color="primary" onClick={handleLogin}>
            Log In
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleProceedWithoutLogin}>
            Skip
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default LoginModal;
