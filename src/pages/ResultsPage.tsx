import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Container,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Modal,
  Backdrop,
  Fade,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { keyframes } from "@mui/system";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import CustomButton from "../components/Button";
import BarChartComponent from "../components/interfaces/BarChartComponent";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { supabase } from "../supabase/supabaseClient";
import { getUserId } from "../supabase/auth";
import DecisionState from "../components/interfaces/DecisionState";
import Confetti from "react-confetti";
import { useAuth } from "../contexts/AuthContext"; // Import the authentication context
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

interface TotalScores {
  [option: string]: number;
}

interface Criterion {
  name: string;
  weight: number;
}

const defaultDecisionState: DecisionState = {
  model: "AHP",
  decision: "",
  criteria: [],
  options: [],
  aggregatedPreferences: {},
  totalScores: {},
};

// Define keyframes for pulsing animation
const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(255, 215, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
`;

const ResultsPage = () => {
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const [totalScores, setTotalScores] = useState<TotalScores>({});
  const [bestChoice, setBestChoice] = useState<string>("");
  const [tiebreakerExplanation, setTiebreakerExplanation] =
    useState<string>("");
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showCompletionPopup, setShowCompletionPopup] =
    useState<boolean>(false);
    const [isDecisionSaved, setIsDecisionSaved] = useState<boolean>(false); // New state to track if decision is saved

  const { isAuthenticated } = useAuth(); // Get authentication status from context
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const calculateTotalScores = () => {
      const scores: TotalScores = {};

      // Initialize total scores with 0 for each option
      decisionState.options.forEach((option) => {
        scores[option] = 0;
      });

      decisionState.criteria.forEach((criterion: Criterion) => {
        const criterionAggregated =
          decisionState.aggregatedPreferences[criterion.name];

        // Update total scores with weighted sum
        decisionState.options.forEach((option) => {
          scores[option] += criterionAggregated[option] * criterion.weight;
        });
      });

      setTotalScores(scores);
      decisionState.totalScores = scores;

      // Determine the best choice
      const bestOption = determineBestOption(scores, decisionState.criteria);
      setBestChoice(bestOption.choice);
      setTiebreakerExplanation(bestOption.explanation);
      setShowConfetti(true);
    };

    const determineBestOption = (
      scores: TotalScores,
      criteria: Criterion[]
    ) => {
      const maxScore = Math.max(...Object.values(scores));
      const topOptions = Object.keys(scores).filter(
        (option) => scores[option] === maxScore
      );

      if (topOptions.length === 1) {
        return { choice: topOptions[0], explanation: "" };
      }

      // Tiebreaker based on the highest weighted criterion
      const highestWeightCriterion = criteria.reduce(
        (prev: Criterion, current: Criterion) =>
          prev.weight > current.weight ? prev : current
      );

      const topChoice = topOptions.reduce((prev, current) =>
        decisionState.aggregatedPreferences[highestWeightCriterion.name][prev] >
        decisionState.aggregatedPreferences[highestWeightCriterion.name][
          current
        ]
          ? prev
          : current
      );

      const explanation = `The best choice was determined based on the highest weight criterion "${highestWeightCriterion.name}".`;

      return { choice: topChoice, explanation };
    };

    calculateTotalScores();
  }, [
    decisionState.criteria,
    decisionState.aggregatedPreferences,
    decisionState.options,
  ]);

  const { handleNavigation } = useBreadcrumbs();

  const saveDecision = async () => {
    const user = await getUserId();

    if (!user) {
      // Prompt user to log in
      alert("Please log in to save your decision.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("decisions")
        .insert([
          {
            user_id: user,
            decision: decisionState,
          },
        ])
        .select();

        if (error) {
          throw error;
        }
  
        setIsDecisionSaved(true); // Set the decision as saved
        setShowCompletionPopup(true);
      } catch (error) {
        console.error("Error saving decision:", error);
      }
    };

  const closeModal = () => {
    setShowCompletionPopup(false);
  };

  const handlePopupOption = async (option: number) => {
    switch (option) {
      case 1:
        // Make another decision (Navigate or handle as needed)
        setShowCompletionPopup(false);
        setDecisionState(defaultDecisionState);
        await handleNavigation("/NewDecision", "New Decision");
        break;
      case 2:
        setShowCompletionPopup(false);
        setDecisionState(defaultDecisionState);
        await handleNavigation("/PreviousDecision", "Previous Decision");
        break;
      case 3:
        setShowCompletionPopup(false);
        setDecisionState(defaultDecisionState);
        await handleNavigation("/", "Home");
        break;
      default:
        break;
    }
  };

 

  // const clearCacheAndRedirect = () => {
  //   // Clear cache (local storage)
  //   localStorage.clear();
  //   // Redirect to home page and reload
  //   window.location.href = "/";
  // };

  const clearCacheAndRedirect = () => {
    // Clear decision state
    setDecisionState(defaultDecisionState);
    // Redirect to home page
    navigate("/");
  };

  const getTotalMaxValue = () =>
    Object.values(totalScores).reduce((a, b) => a + b, 0);
  const convertScoreToOutOfTen = (score: number) =>
    Math.round((score / getTotalMaxValue()) * 10);

  // Sort totalScores by score descending
  const sortedScores = Object.entries(totalScores).sort((a, b) => b[1] - a[1]);

  return (
    <Layout>
      {showConfetti && <Confetti recycle={false} />}

      <Stack sx={{ margin: { xs: "1vh", md: "2vh 30px" } }}>
        <BackButton />
      </Stack>
      <Container sx={{ paddingY: 2, flexGrow: 1 }}>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            padding: 2,
            boxShadow: 3,
            backgroundColor: "white",
            gridTemplateColumns: { xs: "1fr", md: "3fr 1fr" },
            gridTemplateRows: "auto",
            gridTemplateAreas: {
              xs: `
                  "bestChoice"
                  "totalScores"
                  "results"
                  "save"
                `,
              md: `
                  "bestChoice totalScores"
                  "results totalScores"
                  "save totalScores"
                `,
            },
            flexGrow: 1,
          }}
        >
          <Box
            sx={{
              gridArea: "bestChoice",
              padding: 2,
              borderRadius: 1,
              boxShadow: 3,
              backgroundColor: "#e0f7fa",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              animation: `${pulse} 2s infinite`,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '2rem',
                  md: '2.5rem',
                  lg: '3rem'
                }
              }}
            >
              Best Choice
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: {
                  xs: '1.2rem',
                  sm: '1.5rem',
                  md: '1.8rem',
                  lg: '2rem'
                }
              }}
            >
              {bestChoice}
            </Typography>
            <EmojiEventsIcon
              sx={{ fontSize: 80, color: "gold", marginTop: 2 }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "5px 10px",
                backgroundColor: "gold",
                borderRadius: "0 0 0 10px",
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: "bold" }}>
                Top Choice
              </Typography>
            </Box>
            {tiebreakerExplanation && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  {tiebreakerExplanation}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ gridArea: "results", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
              Results
            </Typography>
            <Typography variant="body2" sx={{ marginBottom: 2 }}>
              Below are the detailed results for each criterion. Click on each
              section to expand and view the graph for that criterion.
            </Typography>
            {decisionState.criteria.map((criterion, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h6">{criterion.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ marginBottom: 2 }}>
                    This graph illustrates the performance of each option based
                    on the "{criterion.name}" criterion.
                  </Typography>
                  <BarChartComponent criterion={criterion.name} />
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          <Box
            sx={{
              gridArea: "totalScores",
              padding: 2,
              borderRadius: 1,
              boxShadow: 3,
              backgroundColor: "white",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5" gutterBottom>
              Total Scores
            </Typography>
            <Typography
              variant="body2"
              sx={{ marginBottom: 2, textAlign: "center" }}
            >
              The options below are sorted from the most preferred to the least
              preferred.
            </Typography>
            {sortedScores.map(([option], index) => (
              <Box
                key={option}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  boxShadow: 1,
                  backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff",
                  marginBottom: 1,
                }}
              >
                <Typography variant="body1">{option}</Typography>
                <StarIcon sx={{ color: index === 0 ? "gold" : "gray" }} />
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              gridArea: "save",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isAuthenticated ? (
              <CustomButton onClick={saveDecision}>Save Decision</CustomButton>
            ) : (
              <>
                <Typography variant="body2" sx={{ color: "gray", textAlign: "center" }}>
                  If you wish to save decisions in the future, make sure to log in beforehand.
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ marginTop: 2 }} 
                  onClick={clearCacheAndRedirect}
                >
                  Go to Homepage 
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Completion Popup */}
      <Modal
        open={showCompletionPopup}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showCompletionPopup}>
        <Box
  sx={{
    backgroundColor: "white",
    boxShadow: 3,
    padding: { xs: 2, sm: 3, md: 4 },
    borderRadius: 8,
    width: { xs: "90%", sm: "70%", md: "50%" },
    maxWidth: 400,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    margin: { xs: 2, sm: 3 } // Add margin to ensure it doesn't touch edges
  }}
>
  <Typography 
    variant="h5" 
    gutterBottom
    sx={{
      fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' }
    }}
  >
    Decision Saved!
  </Typography>
  <Typography 
    variant="body1" 
    sx={{ marginBottom: 3, fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' } }}
  >
    What would you like to do next?
  </Typography>
  <Stack 
    direction="row" 
    spacing={2} 
    justifyContent="center" 
    sx={{ flexWrap: 'wrap', gap: 2 }} // Add gap to ensure space between buttons
  >
    <Button 
      variant="contained" 
      onClick={() => handlePopupOption(1)}
      sx={{
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
        padding: { xs: 1, sm: 1.5, md: 2 },
      }}
    >
      Make Another Decision
    </Button>
    <Button 
      variant="contained" 
      onClick={() => handlePopupOption(2)}
      sx={{
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
        padding: { xs: 1, sm: 1.5, md: 2 },
      }}
    >
      See Previous Decisions
    </Button>
    <Button 
      variant="contained" 
      onClick={() => handlePopupOption(3)}
      sx={{
        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
        padding: { xs: 1, sm: 1.5, md: 2 },
      }}
    >
      Go Back to Homepage
    </Button>
  </Stack>
</Box>

        </Fade>
      </Modal>
    </Layout>
  );
};

export default ResultsPage;
