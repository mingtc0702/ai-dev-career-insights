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

//Format of Home Page

function Home() {
  return (
    <Stack
      spacing={4}
      sx={{
        p: 5,
        maxWidth: "900px",
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          maxWidth: "800px",
          textAlign: "left",
          lineHeight: 1.6,
        }}
      >
        <Typography
          variant="h3"
          fontWeight={600}
          sx={{
            mb: 1,
          }}
        >
          Welcome to Tech Insights Dashboard
        </Typography>

        <Typography variant="body1" color="text.secondary">
          The rapid rise of AI adoption has transformed the global technology
          workforce, yet many questions remain unanswered:
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Which roles earn the most? Which skills are in highest demand? How does
          AI influence compensation and career progression?
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Our project combines LinkedIn Job Postings with multi-year StackOverflow
          Developer Surveys to provide insights into hiring trends and skill
          evolution.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Explore salary trends, skill popularity, and AI adoption across roles,
          countries, and experience levels.
        </Typography>
      </Stack>


      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          Getting Started
        </Typography>
        <Typography variant="body2" mt={1} color="text.secondary">
          Use the top menu to explore Salary Insights, Skill Insights, and AI
          Impact.
        </Typography>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          backgroundColor: "background.paper",
        }}
      >
        <InteractiveDataExplorer />
      </Paper>
    </Stack>
  );
}

export default function App() {
  return (
    <Router>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#0A2342",
        }}
      >
        <Toolbar sx={{ gap: 3 }}>
          {[
            { label: "Home", to: "/" },
            { label: "Salary", to: "/salary" },
            { label: "Skills", to: "/skills" },
            { label: "AI Impact", to: "/impact" },
          ].map((item) => (
            <Button
              key={item.to}
              color="inherit"
              component={Link}
              to={item.to}
              sx={{
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.15)",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      <Container
        sx={{
          mt: 4,
          pb: 6,
          minHeight: "100vh",
          backgroundColor: "rgba(245,246,248,0.6)",
          borderRadius: 3,
        }}
      >
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
