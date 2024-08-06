import "./App.css";
import { useState } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { Theme } from "@mui/material";

import { Routes, Route } from "react-router-dom";
import NewCriteria from "./pages/NewCriteria";
import OtherNewCriteria from "./pages/OtherNewCriteria";
import DecisionModel from "./pages/DecisionModel";
import PreviousDecisions from "./pages/PreviousDecision";
import NewDecision from "./pages/NewDecision";
import OtherNewOption from "./pages/OtherNewOption";
import NewOption from "./pages/NewOption";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ResultsPage from "./pages/ResultsPage";
import CriteriaPage from "./pages/EvaluateCriteriaPage";
import { DecisionStateContext } from "./contexts/DecisionStateContext";
import Home from "./pages/Home";
import DecisionState from "./components/interfaces/DecisionState";
import BreadcrumbsProvider from "./contexts/BreadcrumbsProvider";
import EvaluateOptions from "./pages/EvaluateOptionsPage";
//login and registration
import Login from "./pages/Login";
import Register from "./pages/Register";
import ExistingCriteria from "./pages/ExistingCriteria";
import { AuthProvider } from "./contexts/AuthContext";


function App() {
  const [decisionState, setDecisionState] = useState<DecisionState>({
    model: "AHP",
    decision: "",
    criteria: [],
    options: [],
    aggregatedPreferences: {},
    totalScores: {},
  });

  // const updateDecisionState = (updatedProperties: Partial<DecisionState>) => {
  //   setDecisionState(prevState => ({
  //     ...prevState,
  //     ...updatedProperties,
  //   }));
  // };

  interface HeroSectionProps {
    theme: Theme;
  }
  //state management
  const [auth, setAuth] = useState<boolean>(false);

  return (
    <>
      <BreadcrumbsProvider>
        <DecisionStateContext.Provider
          value={{ decisionState, setDecisionState }}
        >
          <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Abi */}
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/register" element={<Register setAuth={setAuth} />} />
            <Route path="/NewOption" element={<NewOption />} />
            <Route path="/newCriteria" element={<NewCriteria />} />
            <Route path="/OtherNewCriteria" element={<OtherNewCriteria />} />
            <Route path="/DecisionModel" element={<DecisionModel />} />
            <Route path="/NewDecision" element={<NewDecision />} />
            <Route path="/OtherNewOption" element={<OtherNewOption />} />
            <Route path="/PreviousDecision" element={<PreviousDecisions />} />
            <Route path="/contactUs" element={<ContactUs />} />
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/resultsPage" element={<ResultsPage />} />
            <Route path="/EvaluateCriteriaPage" element={<CriteriaPage />} />
            <Route path="/EvaluateOptionsPage" element={<EvaluateOptions />} />
            <Route path="/ExistingCriteria" element={<ExistingCriteria />} />
          </Routes>
          </AuthProvider>
        </DecisionStateContext.Provider>
      </BreadcrumbsProvider>
    </>
  );
}

export default App;
