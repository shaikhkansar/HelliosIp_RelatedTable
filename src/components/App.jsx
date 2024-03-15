import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import TermsOfUse from "./TermsOfUse";
import TabConfig from "./TabConfig";
import Privacy from "./Privacy";
import Tab from "./Tab";
import "./App.css";
import AnnuitiesPatents from "./AnnuitiesPatents";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/termsofuse" element={<TermsOfUse />} />
        <Route path="/tab" element={<Tab />} />
        <Route path="/config" element={<TabConfig />} />
        <Route path="/annuities-patents" element={<AnnuitiesPatents />} />
      </Routes>
    </Router>
  );
}
