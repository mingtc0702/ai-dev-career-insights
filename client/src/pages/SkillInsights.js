import React from "react";
import { Stack, Typography, Divider, Paper } from "@mui/material";
import SkillUsageExplorer from "../components/SkillUsageExplorer";

export default function SkillInsights() {
  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography variant="h4">Skill Insights</Typography>

      <Paper sx={{ p: 3 }}>
        <SkillUsageExplorer />
      </Paper>
    </Stack>
  );
}
