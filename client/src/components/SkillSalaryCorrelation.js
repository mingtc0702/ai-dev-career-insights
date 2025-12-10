import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
const config = require("../config.json");

export default function SkillSalaryCorrelation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/skills/popularity?limit=30`)
      .then(res => res.json())
      .then(rows => {
        const seen = new Set();
        const unique = rows.filter(row => {
          const key = (row.language || "Unknown").toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setData(unique);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  // Custom tooltip for scatter plot
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const skill = payload[0].payload.language;
      const devUsage = payload[0].payload.survey_usage_count;
      const linkedin = payload[0].payload.linkedin_job_mentions;
      return (
        <div style={{ background: "#fff", border: "1px solid #ccc", padding: 8 }}>
          <strong>{skill}</strong>
          <div>Developer Usage: {devUsage.toLocaleString()}</div>
          <div>LinkedIn Mentions: {linkedin.toLocaleString()}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        LinkedIn Mentions vs Developer Usage
      </Typography>

      <ResponsiveContainer width="100%" height={440}>
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            type="number"
            dataKey="survey_usage_count"
            name="Developer Usage"
            label={{ value: "Developer Usage", position: "bottom", offset: 0 }}
          />

          <YAxis
            type="number"
            dataKey="linkedin_job_mentions"
            name="LinkedIn Mentions"
            label={{
              value: "LinkedIn Mentions",
              angle: -90,
              position: "insideLeft",
              offset: 10
            }}
          />

          <Tooltip content={<CustomTooltip />} />

          <Scatter
            data={data}
            fill="#1e88e5"
            name="Skill"
          />

        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}
