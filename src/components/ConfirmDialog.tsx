import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from "@mui/material";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Refresh</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to refresh the page? All unsaved data will be lost.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="primary">Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
