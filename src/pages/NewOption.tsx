import React, { useState, useContext } from "react";
import BackButton from "../components/BackButton";
import {
  Stack,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Paper,
  Box,
  TextField,
  Snackbar,
} from "@mui/material";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import Layout from "../components/Layout";

const NewOption = () => {
  const { handleNavigation } = useBreadcrumbs();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [option, setOption] = useState<string>("");
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    if (option.trim() === "") {
      setSnackbarOpen(true); // Open snackbar if no option is entered
      return;
    }
    
    const updatedOptions = [...decisionState.options, option];
    setDecisionState({ ...decisionState, options: updatedOptions });
    handleNavigation("/OtherNewOption", "Other New Option");
  };

  return (
    <Layout>
      <Stack sx={{ margin: isMobile ? "0" : "0 30px" }}>
        <BackButton />
      </Stack>
      <Stack
        direction="column"
        spacing={2}
        alignItems="center"
        justifyContent="center"
        sx={{ p: 2, mx: 2 }}
      >
        <Paper
          sx={{
            p: isMobile ? 2 : 4,
            boxShadow: 3,
            width: "100%",
            maxWidth: "600px",
            mx: 2,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{ fontSize: { xs: 'h5.fontSize', sm: 'h4.fontSize' } }}
          >
            Add the Options You Have in Mind for Your Decision
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              mt: 1,
              mb: 2,
              fontSize: { xs: 'body2.fontSize', sm: 'body1.fontSize' },
              mx: { xs: 1, sm: 2 }
            }}
          >
            Enter a choice that you are considering for your decision. For example, if you are choosing a car, you might add options like "BMW" or "Mercedes."
            <br />
            <strong>Note:</strong> Please add one option at a time and click "Add Option" to include it in your list.
          </Typography>

          <Stack alignItems="center" sx={{ mt: 2 }}>
            <FormatListBulletedIcon
              style={{ fontSize: "56px", padding: "2" }}
            />
          </Stack>
          <Box
            sx={{
              width: "100%",
              "& > :not(style)": { m: 1 },
              mt: 2,
              mb: 2,
            }}
          >
            <TextField
              id="filled-basic"
              label="ie. BMW, Mercedes"
              name="option"
              value={option}
              onChange={(e) => setOption(e.target.value)}
              variant="filled"
              fullWidth
            />
          </Box>
          <Stack direction="row" justifyContent="center">
            <Button variant="contained" color="primary" onClick={handleClick}>
              Add Option
            </Button>
          </Stack>
        </Paper>
      </Stack>

      {/* Snackbar for validation message */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Please enter an option before proceeding."
      />
    </Layout>
  );
};

export default NewOption;
