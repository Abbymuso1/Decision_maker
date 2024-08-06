import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";

interface Comparison {
  [option: string]: {
    [otherOption: string]: number;
  };
}
interface AggregatedPreference {
  [option: string]: number;
}

const PairwiseComparison: React.FC = () => {
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const [criterionIndex, setCriterionIndex] = useState(0);
  const [combinationIndex, setCombinationIndex] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { handleNavigation } = useBreadcrumbs();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const generateResults = () => {
      const results: { [criterion: string]: Comparison } = {};
      const aggregatedPreferences: {
        [criterion: string]: AggregatedPreference;
      } = {};

      decisionState.criteria.forEach((criterion) => {
        const criterionAggregated: AggregatedPreference = {};

        decisionState.options.forEach((option) => {
          criterionAggregated[option] = 0;
        });

        Object.keys(criterion.comparisons).forEach((option1) => {
          Object.keys(criterion.comparisons[option1]).forEach((option2) => {
            const value = criterion.comparisons[option1][option2];

            criterionAggregated[option1] += value;
            criterionAggregated[option2] += 1 - value;
          });
        });

        aggregatedPreferences[criterion.name] = criterionAggregated;
      });

      setDecisionState((prevData) => ({
        ...prevData,
        results,
        aggregatedPreferences,
      }));
    };

    generateResults();
  }, [decisionState.criteria, setDecisionState]);

  const criteria = decisionState.criteria.map((c) => c.name);
  const combinations = Object.keys(
    decisionState.criteria[criterionIndex].comparisons
  )
    .map((option1) =>
      Object.keys(
        decisionState.criteria[criterionIndex].comparisons[option1]
      ).map((option2) => [option1, option2])
    )
    .flat();

  useEffect(() => {
    // Notify user when criterion changes
    setNotificationOpen(true);
  }, [criterionIndex]);

  const handlePrevious = () => {
    setCombinationIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : combinations.length - 1
    );
  };

  const handleNext = () => {
    if (combinationIndex < combinations.length - 1) {
      setCombinationIndex(combinationIndex + 1);
    } else {
      if (criterionIndex < criteria.length - 1) {
        handleNextCriterion();
      } else {
        handleNavigation("/ResultsPage", "Results Page");
      }
    }
  };

  const handlePreviousCriterion = () => {
    setCriterionIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : criteria.length - 1
    );
    setCombinationIndex(0);
  };

  const handleNextCriterion = () => {
    setCriterionIndex((prevIndex) =>
      prevIndex < criteria.length - 1 ? prevIndex + 1 : 0
    );
    setCombinationIndex(0);
  };

  const handleSelect = (selectedOption: string) => {
    const [option1, option2] = combinations[combinationIndex];
    const updatedCriteria = decisionState.criteria.map((criterion, i) => {
      if (i === criterionIndex) {
        return {
          ...criterion,
          comparisons: {
            ...criterion.comparisons,
            [option1]: {
              ...criterion.comparisons[option1],
              [option2]: selectedOption === option1 ? 1 : 0,
            },
          },
        };
      }
      return criterion;
    });

    setDecisionState({ ...decisionState, criteria: updatedCriteria });
    handleNext();
  };

  return (
    <Container>
      <Box sx={{ p: { xs: 1, md: 1.5 }, textAlign: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Please Set Your Preference on Options Based On This Criteria
        </Typography>
      </Box>
      <Box sx={{ p: { xs: 1, md: 2 }, textAlign: "center" }}>
        <Typography variant="body2">
          You’re comparing options based on{" "}
          <Typography
            component="span"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              bgcolor: "yellow",  // Change this to your preferred background color
              px: 0.5,  // Adds horizontal padding around the text
              borderRadius: 1,  // Adds slight rounding to the corners
            }}
          >
            {criteria[criterionIndex]}
          </Typography>
          . This means you should focus on how well each option performs with regard to this particular criterion. Choose the option that best meets this criterion.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, md: 5 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton aria-label="arrowbackios" onClick={handlePreviousCriterion}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography sx={{ fontWeight: "bold" }}>
            {criteria[criterionIndex]}
          </Typography>
          <IconButton aria-label="arrowforwardios" onClick={handleNextCriterion}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: 2, md: 5 },
        }}
      >
        <Box
          sx={{
            bgcolor: "lightgrey",
            p: { xs: 1, md: 2 },
            display: "flex",
            flexDirection: "row",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconButton aria-label="arrowbackios" onClick={handlePrevious}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography sx={{ fontWeight: "bold" }}>
            {`${combinations[combinationIndex][0]} vs ${combinations[combinationIndex][1]}`}
          </Typography>
          <IconButton aria-label="arrowforwardios" onClick={handleNext}>
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            display: "flex",
            flexDirection: "row",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {combinations[combinationIndex].map((option, index) => (
            <Button
              key={index}
              variant="contained"
              onClick={() => handleSelect(option)}
            >
              {option}
            </Button>
          ))}
        </Box>
        <Box sx={{ p: { xs: 1, md: 1.5 }, textAlign: "center" }}>
          <Typography variant="caption">
            Click one of the Buttons Above
          </Typography>
        </Box>
      </Box>

      {/* Notification Snackbar */}
      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}  // Center horizontally at the top
        sx={{
          top: '50%',  // Center vertically
          transform: 'translateY(-50%)',  // Offset to exactly center
        }}
      >
        <Alert onClose={() => setNotificationOpen(false)} severity="info">
        Your comparison is now based on{" "}
          <strong>{criteria[criterionIndex]}</strong>.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PairwiseComparison;
