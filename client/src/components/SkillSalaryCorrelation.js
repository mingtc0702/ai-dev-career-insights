import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
const config = require("../config.json");

// Scatterplot of skill usage counts vs LinkedIn mentions
export default function SkillSalaryCorrelation() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/skills/popularity?limit=30`)
      .then((res) => res.json())
      .then((rows) => {
        const seen = new Set();
        const unique = rows.filter((row) => {
          const key = (row.language || "Unknown").toLowerCase();
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        setData(unique);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        LinkedIn Mentions vs Developer Usage
      </Typography>

      <ResponsiveContainer width="100%" height={440}>
        <ScatterChart margin={{ top: 20, right: 20, bottom: 60, left: 60 }}>
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
              dx: -25,
            }}
          />

          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            formatter={(value, name, entry) => [value.toLocaleString(), name]}
          />

          <Scatter
            data={data}
            fill="#0A2342"
            name="Skill"
          />
        </ScatterChart>
      </ResponsiveContainer>
    </>
  );
}
