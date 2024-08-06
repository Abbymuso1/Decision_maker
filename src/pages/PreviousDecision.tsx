import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Button,
  TextField,
  Modal,
  Backdrop,
  Fade,
  LinearProgress,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Layout from "../components/Layout";
import AddIcon from "@mui/icons-material/Add";
import BackButton from "../components/BackButton";
import { NavLink } from "react-router-dom";
import { supabase } from "../supabase/supabaseClient";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import ReactConfetti from 'react-confetti';
import EmojiEventsTwoToneIcon from '@mui/icons-material/EmojiEventsTwoTone';
interface Criterion {
  name: string;
  weight: number;
  comparisons: Record<string, Record<string, number>>;
}

interface Decision {
  id: number;
  decision: any;
}

const PreviousDecisions: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [filteredDecisions, setFilteredDecisions] = useState<Decision[]>([]);
  const [currentDecision, setCurrentDecision] = useState<Decision | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    fetchDecisions();
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      const query = searchQuery.toLowerCase();
      const filtered = decisions.filter((decision) => {
        if (typeof decision.decision === "string") {
          return decision.decision.toLowerCase().includes(query);
        }
        return (
          decision.decision?.model.toLowerCase().includes(query) ||
          decision.decision?.criteria.some((criterion: Criterion) =>
            criterion.name.toLowerCase().includes(query)
          )
        );
      });
      setFilteredDecisions(filtered);
    }
  }, [searchQuery, decisions, isDataLoaded]);

  const fetchDecisions = async () => {
    setIsLoading(true); // Set loading to true when starting the fetch
    try {
      const { data, error } = await supabase
        .from("decisions")
        .select("id, decision");

      if (error) {
        console.error("Error fetching decisions:", error.message);
        return;
      }

      if (data) {
        const updatedData = data.map((decision) => {
          if (typeof decision.decision === "object") {
            return {
              ...decision,
              decision: decision.decision || "No decision available",
            };
          }
          return decision;
        });

        const sortedData = updatedData.sort((a, b) => b.id - a.id);
        setDecisions(sortedData);
        setFilteredDecisions(sortedData);
      }
    } catch (error) {
      console.error("Error fetching decisions:", error);
    } finally {
      setIsLoading(false); // Set loading to false when fetch is complete
      setIsDataLoaded(true); // Indicate that data has been loaded
    }
  };

  const fetchCriteria = async (decisionId: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("criteria")
        .select("*")
        .eq("decision_id", decisionId);

      if (error) {
        console.error("Error fetching criteria:", error.message);
        return;
      }

      if (data) {
        setCriteria(data);
      }
    } catch (error) {
      console.error("Error fetching criteria:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Highlight text with different colors
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
  
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query ? (
        <span key={index} style={{ backgroundColor: getRandomColor() }}>
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  

  // Generate a random color
  const getRandomColor = () => {
    const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#9CF4E8"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // No need to fetch from the database again for the specific decision since it had already been fetched in the fetchDecisions functions
  const handleSeeCriteria = (decision: Decision) => {
    console.log("Current Decision", decision);
    setCurrentDecision(decision);
    setModalOpen(true);
  };

  useEffect(() => {
    console.log("Updated Current Decision", currentDecision);
  }, [currentDecision]);

  const closeModal = () => {
    setCurrentDecision(null);
    setCriteria([]);
    setModalOpen(false);
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

 
  const noResultsMessage = "No previous decisions found.";
// Custom hook to get window size
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [windowSize.width, windowSize.height];
}
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();

  useEffect(() => {
    // Show confetti when component mounts (or when decision is available)
    setShowConfetti(true);
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [decisions]);

  console.log('Confetti dimensions:', width, height);

  return (
    <Layout>
      <Container
        maxWidth="md"
        sx={{ paddingX: { xs: 2, sm: 3 }, paddingY: { xs: 2, sm: 3 } }}
      >
        <Stack spacing={2}>
          <BackButton />
          <Paper sx={{ padding: 3, textAlign: "center" }}>
            <Typography variant="h3">List of Previous Decisions</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <TextField
                value={searchQuery}
                onChange={handleSearchChange}
                label="Search previous decisions"
                variant="outlined"
                size="small"
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              <NavLink
                to="/newDecision"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<AddIcon />}
                  fullWidth
                >
                  Add New Decision
                </Button>
              </NavLink>
            </Box>
          </Paper>

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <LinearProgress sx={{ width: "100%" }} />
            </Box>
          ) : filteredDecisions.length === 0 && isDataLoaded ? (
            <Typography variant="h6" color="textSecondary" align="center">
              {noResultsMessage}
            </Typography>
          ) : (
            <Stack spacing={2}>
              {filteredDecisions
                .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                .map((decision) => (
                  <Accordion key={decision.id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1">
                    <span style={{ backgroundColor: '#f0f0f0', padding: '0 4px', borderRadius: '4px' }}>
    Decision Made:
  </span>{" "}
                        {highlightText(
                          typeof decision.decision.decision === "string"
                            ? decision.decision.decision
                            : decision.decision?.model || "No model available",
                          searchQuery
                        )}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack direction="column" spacing={2}>
                        {/* <Typography variant="body1">
                        {highlightText(typeof decision.decision.decision === "string" ? decision.decision.decision : `Model: ${decision.decision?.model}`, searchQuery)}
                      </Typography> */}


<Box sx={{ border: '1px solid #ddd', borderRadius: 1, padding: 1, position: 'relative' }}>
    
      <Typography variant="body1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
        Decision Results:
      </Typography>
      <Typography>
        Winning Option : <EmojiEventsTwoToneIcon style={{ color: 'gold' }} /> {Object.keys(decision.decision.totalScores).at(-1)}
      </Typography>
      <BarChart
        width={500}
        height={300}
        data={Object.keys(decision.decision.totalScores).map((option) => ({
          name: option,
          preferences: decision.decision.totalScores[option],
        }))}
        margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="preferences" fill="#8884d8" />
      </BarChart>
    </Box>

                        <Button
                          onClick={() => handleSeeCriteria(decision)}
                          variant="outlined"
                          color="primary"
                          size="small"
                        >
                          See Criteria
                        </Button>
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              <Pagination
                count={Math.ceil(filteredDecisions.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                sx={{ marginTop: 2 }}
              />
            </Stack>
          )}

          <Modal
            open={modalOpen}
            onClose={closeModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
          >
            <Fade in={modalOpen}>
              <Box
                sx={{
                  backgroundColor: "white",
                  boxShadow: 24,
                  padding: 3,
                  maxWidth: 600,
                  margin: "auto",
                  marginTop: "10vh",
                  borderRadius: 2,
                  position: "relative",
                  maxHeight: "80vh",
                  overflowY: "auto", // Allow scrolling
                }}
              >
                <Typography variant="h4" component="h2" gutterBottom>
                  Decision Criteria
                </Typography>

                <Box sx={{ marginBottom: 2 }}>
                  {currentDecision &&
                  typeof currentDecision.decision !== "string" &&
                  currentDecision.decision.criteria.length > 0 ? (
                    currentDecision.decision.criteria.map(
                      (criterion: Criterion) => (
                        <Accordion key={criterion.name}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography variant="h6" sx={{ marginBottom: 1 }}>
                              {criterion.name}
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Box sx={{ padding: 2 }}>
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: 1 }}
                              >
                                <strong>Weight:</strong>{" "}
                                {criterion.weight.toFixed(2)}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={criterion.weight * 100}
                                sx={{
                                  height: 8,
                                  borderRadius: 5,
                                  marginBottom: 1,
                                }}
                              />
                              <Typography
                                variant="body1"
                                sx={{ marginBottom: 1 }}
                              >
                                <strong>Comparisons:</strong>
                              </Typography>

                              {Object.entries(criterion.comparisons).length >
                              0 ? (
                                <Box
                                  sx={{
                                    border: "1px solid #ddd",
                                    borderRadius: 1,
                                    padding: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: "bold", marginBottom: 1 }}
                                  >
                                    Comparison Results:
                                  </Typography>
                                  <BarChart
                                    width={500}
                                    height={300}
                                    data={Object.keys(
                                      currentDecision.decision
                                        .aggregatedPreferences[criterion.name]
                                    ).map((option) => ({
                                      name: option,
                                      preferences:
                                        currentDecision.decision
                                          .aggregatedPreferences[
                                          criterion.name
                                        ][option],
                                    }))}
                                    margin={{
                                      top: 20,
                                      right: 30,
                                      bottom: 20,
                                      left: 0,
                                    }}
                                  >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="preferences" fill="#8884d8" />
                                  </BarChart>
                                </Box>
                              ) : (
                                <Typography variant="body2">
                                  No comparisons available.
                                </Typography>
                              )}
                            </Box>
                          </AccordionDetails>
                        </Accordion>
                      )
                    )
                  ) : (
                    <Typography variant="body1">
                      No criteria found for this decision.
                    </Typography>
                  )}
                </Box>

                <Button onClick={closeModal} variant="outlined" sx={{ mt: 2 }}>
                  Close
                </Button>
              </Box>
            </Fade>
          </Modal>
        </Stack>
      </Container>
    </Layout>
  );
};

export default PreviousDecisions;
