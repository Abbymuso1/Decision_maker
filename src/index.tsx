import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const ConfirmationModal: React.FC<{ open: boolean; onClose: () => void; onConfirm: () => void; }> = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Confirm Page Refresh</DialogTitle>
    <DialogContent>
      <Typography>Are you sure you want to refresh the page? All unsaved data will be lost.</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancel</Button>
      <Button onClick={onConfirm} color="primary">Confirm</Button>
    </DialogActions>
  </Dialog>
);

const Main: React.FC = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isNavigatingAway, setIsNavigatingAway] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = ''; // Trigger the built-in confirmation dialog
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleNavigation = () => {
    setIsNavigatingAway(true);
    setOpenConfirmDialog(true);
  };

  const handleConfirmRefresh = () => {
    setOpenConfirmDialog(false);
    window.location.reload(); // Proceed with page refresh
  };

  const handleCancel = () => {
    setOpenConfirmDialog(false);
    setIsNavigatingAway(false);
  };

  return (
    <>
   
      <BrowserRouter>
      <AuthProvider>
        <App />
        </AuthProvider>
        
      </BrowserRouter>
      <ConfirmationModal
        open={openConfirmDialog}
        onClose={handleCancel}
        onConfirm={handleConfirmRefresh}
      />
      
    </>
  );
};

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
