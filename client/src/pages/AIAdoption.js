import React from "react";
import { Stack, Typography, Divider, Paper, Link } from "@mui/material";
import AIAdoptionByRole from "../components/AIAdoptionByRole";
import AIAdoptionTrend from "../components/AIAdoptionTrend";
import AiHighestPayingCompanies from "../components/AIHighestPaying";
import SalaryAlignmentExplorer from "../components/SalaryAlignment";

//Format of AI Adoption Page

export default function AIAdoption() {
  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      
      <Typography variant="h4">AI Adoption Insights</Typography>

      <Paper
  elevation={3}
  sx={{
    p: 3,
    borderRadius: 3,
    backgroundColor: "background.paper",
  }}
>
  <Typography variant="h5" fontWeight={600} gutterBottom>
    Data Sources
  </Typography>

  <Typography variant="subtitle1" fontWeight={600} mt={2}>
    (1) LinkedIn Job Postings
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Source:{" "}
    <Link
      href="https://www.kaggle.com/datasets/arshkon/linkedin-job-postings"
      target="_blank"
      rel="noopener"
      underline="hover"
    >
      Kaggle
    </Link>
    <br />
    Contains real-world job postings scraped from LinkedIn, including job titles,
    skill descriptions, employer metadata, compensation, experience level, and
    geographic location.
  </Typography>

  <Typography variant="subtitle1" fontWeight={600} mt={2}>
    (2) Stack Overflow Developer Survey (2023–2025)
  </Typography>
  <Typography variant="body2" color="text.secondary">
    Source:{" "}
    <Link
      href="https://survey.stackoverflow.co/"
      target="_blank"
      rel="noopener"
      underline="hover"
    >
      StackOverflow Insights
    </Link>
    <br />
    Annual global survey of developers, including demographics, skills used,
    experience level, remote work data, and sentiment toward AI.
  </Typography>
</Paper>


      <Paper sx={{ p: 3 }}>
        <AIAdoptionByRole />
      </Paper>

      <Divider />

      <Paper sx={{ p: 3 }}>
        <SalaryAlignmentExplorer/>
      </Paper>

      <Divider />

      <Paper sx={{ p: 3 }}>
        <AIAdoptionTrend />
      </Paper>

      <Divider />

      <Paper sx={{ p: 3 }}>
        <AiHighestPayingCompanies/>
      </Paper>
    </Stack>
  );
}
