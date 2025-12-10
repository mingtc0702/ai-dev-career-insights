import React from "react";
import { Stack, Typography, Divider, Paper } from "@mui/material";
import AIAdoptionByRole from "../components/AIAdoptionByRole";
import AIAdoptionTrend from "../components/AIAdoptionTrend";
import AiHighestPayingCompanies from "../components/AIHighestPaying";
import SalaryAlignmentExplorer from "../components/SalaryAlignment";

export default function AIAdoption() {
  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography variant="h4">AI Adoption Insights</Typography>

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
