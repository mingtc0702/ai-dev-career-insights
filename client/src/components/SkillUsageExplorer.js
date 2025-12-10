import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require('../config.json');

export default function SkillUsageExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/skills/popularity`)
      .then(res => res.json())
      .then(rows => {
        // Deduplicate by language key & sum counts
        const aggregated = rows.reduce((acc, row) => {
          const key = row.language || "Unknown";
          if (!acc[key]) {
            acc[key] = { language: key, survey_usage_count: 0 };
          }
          acc[key].survey_usage_count += Number(row.survey_usage_count) || 0;
          return acc;
        }, {});

        // Convert back to array and take top 10
        const formatted = Object.values(aggregated)
          .sort((a, b) => b.survey_usage_count - a.survey_usage_count)
          .slice(0, 10);

        setData(formatted);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>Most Popular Skills</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="language" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="survey_usage_count" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
