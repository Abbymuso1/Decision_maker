import { Box, Container, Grid, Stack, TextField, Alert } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Layout from "../components/Layout";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import BackButton from "../components/BackButton";
import { NavLink } from "react-router-dom";
import CustomButton from "../components/Button";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { useContext, useEffect, useState } from "react";
import DecisionState from "../components/interfaces/DecisionState";
import { DecisionStateContext } from "../contexts/DecisionStateContext";

const CriteriaPage = () => {
  // Functions for handling criteria addition and deletion
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const [weightsValid, setWeightsValid] = useState(true);

  console.log(decisionState);

  const options = ["Cost", "Safety", "Maintenance"];

  const handleWeightChange = (index: number, value: number) => {
    const updatedCriteria = decisionState.criteria.map((criterion, i) => {
      if (i === index) {
        return { ...criterion, weight: value };
      }
      return criterion;
    });

    setDecisionState({ ...decisionState, criteria: updatedCriteria });
    console.log(decisionState);
  };

  useEffect(() => {
    const totalWeight = decisionState.criteria.reduce(
      (total, criterion) => total + criterion.weight,
      0
    );
    setWeightsValid(totalWeight === 1);
  }, [decisionState.criteria]);

  const handleClick = () => {
    if (weightsValid) {
      console.log("Weights are valid and sum to 1:", decisionState.criteria);
      handleNavigation("/NewOption", "New Option");
      // Proceed with further actions like submitting the data
    } else {
      console.log("Weights do not sum to 1. Please correct them.");
    }
  };

  const { handleNavigation } = useBreadcrumbs();
  const EnterOption = () => {
    handleNavigation("/NewOption", "New Option");
  };

  return (
    <Layout>
      <Stack>
        <div style={{ marginLeft: "30px" }}>
          {" "}
          <BackButton />
        </div>
      </Stack>
      <Container
        sx={{
          display: "100vh",
          paddingTop: "2",
        }}
      >
        <Box
          sx={{
            display: "grid",
            height: "80vh",
            width: "100%",
            gap: 1,
            padding: 2,
            boxShadow: 3, // Added shadow effect
            backgroundColor: "white",
            gridTemplate: `"result result result result option"
                          "result result result result ranking"
                          "result result result result ranking"
                          ". . save save ranking"
                          `,
          }}
        >
          <Box
            sx={{
              gridArea: "result",
            }}
          >
            <Container>
              <Typography variant="h4" gutterBottom>
                Update Weights
              </Typography>
              {decisionState.criteria.map((criterion, index) => (
                <Box key={index} mb={2}>
                  <TextField
                    label={`${criterion.name} Weight`}
                    type="number"
                    value={criterion.weight}
                    onChange={(e) =>
                      handleWeightChange(index, parseFloat(e.target.value))
                    }
                    fullWidth
                  />
                </Box>
              ))}
              {!weightsValid && (
                <Alert severity="error">
                  The weights must sum to 1. Please adjust the values.
                </Alert>
              )}
            </Container>
          </Box>
          <Box
            sx={{
              gridArea: "option",

              borderRadius: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 3, // Added shadow effect
              backgroundColor: "white",
            }}
          >
            <Button onClick={handleClick} variant="contained">
              Update Criteria Weights
            </Button>
          </Box>
          <Box
            sx={{
              gridArea: "ranking",

              borderRadius: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2.5,
              boxShadow: 3, // Added shadow effect
              backgroundColor: "white",
            }}
          >
            <Typography
              variant="body1"
              alignSelf="flex-start"
              sx={{ fontWeight: "800" }}
            >
              Criteria
            </Typography>
            {options.map((option) => (
              <Stack
                key={option}
                gap={3}
                direction="column"
                justifyContent="center"
              >
                <Stack
                  gap={2}
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <AdsClickIcon style={{ fontSize: "56px", padding: "2" }} />
                  <Stack>
                    <Typography variant="body1">{option}</Typography>
                    <Button variant="contained">Edit Criteria</Button>
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Box>
          <Box sx={{ gridArea: "save" }}>
            <NavLink
              to="/NewOption"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <CustomButton onClick={EnterOption}>PROCEED</CustomButton>
            </NavLink>
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default CriteriaPage;