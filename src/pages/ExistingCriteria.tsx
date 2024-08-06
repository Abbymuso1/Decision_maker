import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Stack,
  Typography,
  Box,
  TextField,
  Snackbar,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";
import { useBreadcrumbs } from "../contexts/BreadcrumbsProvider";
import { DecisionStateContext } from "../contexts/DecisionStateContext";
import { supabase } from "../supabase/supabaseClient";
import { getUserId } from "../supabase/auth";
import DecisionState from "../components/interfaces/DecisionState";
import { useTheme, useMediaQuery } from "@mui/material";

interface CriteriaCategories {
  [key: string]: string[];
}

interface CustomCriteria {
  name: string;
}

const StyledChip = styled(Chip)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => ({
    margin: theme.spacing(0.5),
    backgroundColor: isSelected ? "#337357" : theme.palette.background.paper,
    color: isSelected ? "#fff" : theme.palette.text.primary,
    "&:hover": {
      backgroundColor: isSelected ? "#2c6b4e" : theme.palette.action.hover,
      color: isSelected ? "#e0f7fa" : theme.palette.text.primary, // Ensure good contrast on hover
    },
  })
);

const HighlightText: React.FC<{ text: string; highlight: string }> = ({
  text,
  highlight,
}) => {
  if (!highlight.trim()) return <>{text}</>;

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} style={{ backgroundColor: "#ffeb3b" }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </>
  );
};

const NewCriteriaPage: React.FC = () => {
  const [formData, setFormData] = useState({ criteria: "" });
  const { decisionState, setDecisionState } = useContext(DecisionStateContext);
  const [predefinedCriteria, setPredefinedCriteria] = useState<string[]>([]);
  const [originalPredefinedCriteria, setOriginalPredefinedCriteria] = useState<
    string[]
  >([]);
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [errorMessageOpen, setErrorMessageOpen] = useState(false); // New state for error message
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] =
    useState<CriteriaCategories>({});
  const [originalCategories, setOriginalCategories] =
    useState<CriteriaCategories>({});
  const [customCriteria, setCustomCriteria] = useState<CustomCriteria[]>([]);
  const [originalCustomCriteria, setOriginalCustomCriteria] = useState<
    CustomCriteria[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomCriteriaLoading, setIsCustomCriteriaLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("predefined");
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isCustomCriteriaExpanded, setIsCustomCriteriaExpanded] =
    useState(false); // New state for custom criteria dropdown

  const { handleNavigation } = useBreadcrumbs();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const updateDecisionState = (updatedProperties: Partial<DecisionState>) => {
    setDecisionState((prevState) => ({
      ...prevState,
      ...updatedProperties,
    }));
  };

  const handleAddCriteria = () => {
    handleNavigation("/newCriteria", "Add Criteria");
    console.log("Add new criteria");
  };
  const [deselectMessageOpen, setDeselectMessageOpen] = useState(false);

  const handleSelectCriteria = (criteria: string) => {
    if (selectedCriteria.includes(criteria)) {
      setSelectedCriteria((prevSelectedCriteria) =>
        prevSelectedCriteria.filter((item) => item !== criteria)
      );
      setDeselectMessageOpen(true); // Show deselection message
      return;
    }

    const newCriterion = { name: criteria, weight: 1, comparisons: {} };
    const updatedCriteria = [...decisionState.criteria, newCriterion];
    setDecisionState({ ...decisionState, criteria: updatedCriteria });

    setSelectedCriteria((prevSelectedCriteria) => [
      ...prevSelectedCriteria,
      criteria,
    ]);

    setSuccessMessageOpen(true);
  };

  const handleSubmit = () => {
    if (selectedCriteria.length === 0) {
      setErrorMessageOpen(true); // Show error message if no criteria are selected
      return;
    }

    handleNavigation("/OtherNewCriteria", "Add Another Criteria");
    console.log("Submit criteria");
  };

  const fetchCriteriaCategories = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("criteria_categories")
        .select("*");

      if (error) {
        console.error("Error fetching criteria categories:", error.message);
        return;
      }

      const categories: CriteriaCategories = {};
      data?.forEach((item: any) => {
        categories[item.category_name] = item.criteria;
      });

      const allPredefinedCriteria = Object.values(categories).flat();
      setPredefinedCriteria(allPredefinedCriteria);
      setOriginalPredefinedCriteria(allPredefinedCriteria);
      setOriginalCategories(categories);
      setFilteredCategories(categories);
    } catch (error) {
      console.error("Error fetching criteria categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomCriteria = async () => {
    setIsCustomCriteriaLoading(true);
    try {
      const userId = await getUserId();
      if (!userId) {
        console.error("User not authenticated");
        return;
      }

      const { data: criteriaData, error: criteriaError } = await supabase
        .from("criteria")
        .select("name")
        .eq("user_id", userId);

      if (criteriaError) {
        console.error("Error fetching custom criteria:", criteriaError.message);
        return;
      }

      setCustomCriteria(criteriaData || []);
      setOriginalCustomCriteria(criteriaData || []);
    } catch (error) {
      console.error("Error fetching custom criteria:", error);
    } finally {
      setIsCustomCriteriaLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCriteriaCategories();
      await fetchCustomCriteria();
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCategories(originalCategories);
      setCustomCriteria(originalCustomCriteria);
      setExpandedCategories([]);
      setIsCustomCriteriaExpanded(false); // Collapse dropdown if search term is cleared
      return;
    }

    const filterCriteria = (criteria: string[]) =>
      criteria.filter((item) =>
        item.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const filteredPredefined = Object.entries(originalCategories).reduce(
      (acc, [category, items]) => {
        const filteredItems = filterCriteria(items);
        if (
          category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          filteredItems.length > 0
        ) {
          acc[category] = filteredItems;
        }
        return acc;
      },
      {} as CriteriaCategories
    );

    const filteredCustom = filterCriteria(
      customCriteria.map((item) => item.name)
    );

    const expanded = Object.entries(filteredPredefined).reduce<string[]>(
      (acc, [category, items]) => {
        if (items.length > 0) {
          acc.push(category);
        }
        return acc;
      },
      []
    );

    setFilteredCategories(filteredPredefined);
    setCustomCriteria(filteredCustom.map((name) => ({ name })));
    setExpandedCategories(expanded);

    // Open dropdown if search term matches any custom criteria
    setIsCustomCriteriaExpanded(filteredCustom.length > 0);
  }, [searchTerm, originalCategories, originalCustomCriteria]);

  const isEmpty = Object.keys(filteredCategories).every(
    (key) => filteredCategories[key].length === 0
  );

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  return (
    <Layout>
      <Stack>
        <Box ml={2} mt={2}>
          <BackButton />
        </Box>
      </Stack>

      <Container>
        <Stack
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: "calc(100vh - 64px)", position: "relative" }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontSize: isMobile ? "1.5rem" : "2rem", // Responsive font size
              lineHeight: isMobile ? "2rem" : "2.5rem", // Adjust line height for mobile
            }}
          >
            Choose from Predefined Criteria or Add Your Own Custom Criteria
          </Typography>

          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 2,
              fontSize: isMobile ? "0.875rem" : "1rem", // Responsive font size
            }}
          >
            What criteria would you consider when making the decision you are
            trying to make?
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
            sx={{ width: "100%", mb: 2 }}
          >
            <TextField
              variant="outlined"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
                endAdornment: searchTerm && (
                  <Button
                    onClick={() => setSearchTerm("")}
                    sx={{ marginLeft: 1 }}
                  >
                    <ClearIcon />
                  </Button>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddCriteria}
              startIcon={<AddIcon />}
            >
              Add My Criteria
            </Button>
          </Stack>

          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{ marginTop: 2, marginBottom: 2 }}
          >
            <Tab label="Predefined Criteria" value="predefined" />
            <Tab label="My Criteria" value="custom" />
          </Tabs>

          {currentTab === "predefined" && (
            <Box
              sx={{
                width: "100%",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {/* <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                Can't find the criteria you are looking for? Create your own
                custom criteria!
              </Typography> */}
              {isLoading ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress />
                </Stack>
              ) : isEmpty ? (
                <Typography variant="h6" color="error" align="center">
                  No criteria found for "{searchTerm}"
                </Typography>
              ) : (
                Object.entries(filteredCategories).map(([category, items]) => (
                  <Accordion
                    key={category}
                    expanded={expandedCategories.includes(category)}
                    onChange={() =>
                      setExpandedCategories(
                        expandedCategories.includes(category)
                          ? expandedCategories.filter((cat) => cat !== category)
                          : [...expandedCategories, category]
                      )
                    }
                    sx={{ width: "100%" }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`${category}-content`}
                      id={`${category}-header`}
                    >
                      <Typography variant="h6">
                       {` ${category.charAt(0).toUpperCase() + category.slice(1)} related criteria`}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {items.map((crit, index) => (
                          <ListItem
                            key={index}
                            button
                            onClick={() => handleSelectCriteria(crit)}
                            sx={{
                              backgroundColor: selectedCriteria.includes(crit)
                                ? "#337357"
                                : "transparent",
                              color: selectedCriteria.includes(crit)
                                ? "#fff"
                                : "inherit",
                              "&:hover": {
                                backgroundColor: selectedCriteria.includes(crit)
                                  ? "#2c6b4e"
                                  : "rgba(0, 0, 0, 0.04)",
                                color: selectedCriteria.includes(crit)
                                  ? "#e0f7fa"
                                  : "inherit", // Ensure good contrast on hover
                              },
                            }}
                          >
                            <ListItemText
                              primary={
                                <HighlightText
                                
                                  text={crit} 
                                  highlight={searchTerm}
                                />
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))
              )}
            </Box>
          )}

          {currentTab === "custom" && (
            <Box
              sx={{
                width: "100%",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              {isCustomCriteriaLoading ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <CircularProgress />
                </Stack>
              ) : customCriteria.length === 0 ? (
                <Typography variant="h6" color="textSecondary" align="center">
                  You haven't added any custom criteria yet. Start by creating
                  your own criteria.
                </Typography>
              ) : (
                <Accordion
                  expanded={isCustomCriteriaExpanded} // Use state to control expansion
                  onChange={() => setIsCustomCriteriaExpanded((prev) => !prev)}
                  sx={{ width: "100%" }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="custom-criteria-content"
                    id="custom-criteria-header"
                  >
                    <Typography variant="h6">Click to view your Criteria</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {customCriteria.map((crit, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleSelectCriteria(crit.name)}
                          sx={{
                            backgroundColor: selectedCriteria.includes(
                              crit.name
                            )
                              ? "#337357"
                              : "transparent",
                            color: selectedCriteria.includes(crit.name)
                              ? "#fff"
                              : "inherit",
                            "&:hover": {
                              backgroundColor: selectedCriteria.includes(
                                crit.name
                              )
                                ? "#2c6b4e"
                                : "rgba(0, 0, 0, 0.04)",
                              color: selectedCriteria.includes(crit.name)
                                ? "#e0f7fa"
                                : "inherit", // Ensure good contrast on hover
                            },
                          }}
                        >
                          <ListItemText
                            primary={
                              <HighlightText
                                text={crit.name}
                                highlight={searchTerm}
                              />
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          )}

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit Criteria
          </Button>

          <Snackbar
            open={successMessageOpen}
            autoHideDuration={3000}
            onClose={() => setSuccessMessageOpen(false)}
            message="Criteria added successfully!"
          />

          <Snackbar
            open={errorMessageOpen}
            autoHideDuration={3000}
            onClose={() => setErrorMessageOpen(false)}
            message="You must select at least one criteria before submitting."
          />

          <Snackbar
            open={deselectMessageOpen}
            autoHideDuration={3000}
            onClose={() => setDeselectMessageOpen(false)}
            message="Criteria deselected successfully!"
          />
        </Stack>
      </Container>
    </Layout>
  );
};

export default NewCriteriaPage;
