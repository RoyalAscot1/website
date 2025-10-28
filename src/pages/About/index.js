// src/pages/About/index.js
import React from "react";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

function About() {
  return (
    <MKBox minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <MKTypography variant="h2">About This App</MKTypography>
    </MKBox>
  );
}

export default About;
