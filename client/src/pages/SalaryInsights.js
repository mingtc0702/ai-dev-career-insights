import React from "react";
import { Stack, Typography, Divider, Paper } from "@mui/material";
import AvgSalaryChart from "../components/AvgSalaryChart";
import HighestPaidJobsChart from "../components/HighestPaidJobsChart";

export default function SalaryInsights() {
  return (
    <Stack spacing={4}>
      <Typography variant="h4">Salary Insights</Typography>

      <Paper sx={{ p: 3 }}>
        <AvgSalaryChart />
      </Paper>

      <Divider />

      <Paper sx={{ p: 3 }}>
        <HighestPaidJobsChart />
      </Paper>
    </Stack>
  );
}
