import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Stack,
  Paper,
} from "@mui/material";
import SalaryInsights from "./pages/SalaryInsights";
import SkillInsights from "./pages/SkillInsights";
import AIAdoption from "./pages/AIAdoption";

import InteractiveDataExplorer from "./components/InteractiveDataExplorer";


function Home() {
  return (
    <Stack spacing={4} sx={{ p: 3 }}>
      <Typography variant="h3">Welcome to Tech Insights Dashboard</Typography>
      <Typography variant="body1">
        Explore salary trends, skill popularity, and AI adoption across roles, countries, and experience levels.
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Getting Started</Typography>
        <Typography variant="body2">
          Use the navigation menu to explore Salary Insights, Skill Insights, and AI Adoption.
        </Typography>
      </Paper>

       <Paper sx={{ p: 3 }}>
        <InteractiveDataExplorer />
      </Paper>
    </Stack>
  );
}

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/salary">Salary</Button>
          <Button color="inherit" component={Link} to="/skills">Skills</Button>
          <Button color="inherit" component={Link} to="/impact">AI Impact</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/salary" element={<SalaryInsights />} />
          <Route path="/skills" element={<SkillInsights />} />
          <Route path="/impact" element={<AIAdoption />} />
        </Routes>
      </Container>
    </Router>
  );
}
