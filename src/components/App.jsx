import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import MeetingSummary from "./MeetingSummary";
import TermsOfUse from "./TermsOfUse";
import TabConfig from "./TabConfig";
import Privacy from "./Privacy";
import Tab from "./Tab";
import "./App.css";
import Dynamics365Entity from "./Dynamics365Entity";
import AnnuitiesClientInstruction from "./AnnuitiesClientInstruction";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/tab" element={<Tab />} />
        <Route path="/config" element={<TabConfig />} />
        <Route path="/meeting-summary" element={<MeetingSummary />} />
        <Route path="/annuities-client-instruction" element={<AnnuitiesClientInstruction />} />
      </Routes>
    </Router>
  );
}
