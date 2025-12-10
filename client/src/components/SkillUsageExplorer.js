import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require('../config.json');

// explore skills vs usage

export default function SkillUsageExplorer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/skills/popularity`)
      .then(res => res.json())
      .then(rows => {

        const aggregated = rows.reduce((acc, row) => {
          const key = row.language || "Unknown";
          if (!acc[key]) {
            acc[key] = { language: key, survey_usage_count: 0 };
          }
          acc[key].survey_usage_count += Number(row.survey_usage_count) || 0;
          return acc;
        }, {});

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
     <ResponsiveContainer width="100%" height={420}>
  <BarChart data={data} margin={{ top: 20, right: 20, left: 50, bottom: 60 }}>

    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
    <XAxis
      dataKey="language"
      angle={-30}
      textAnchor="end"
      interval={0}
      tick={{ fontSize: 12 }}
      label={{
        value: "Skill",
        position: "insideBottom",
        offset: -40,
        fontSize: 14,
        fontWeight: 600,
      }}
    />

    <YAxis
      tick={{ fontSize: 12 }}
      label={{
        value: "Survey Usage",
        angle: -90,
        position: "insideLeft",
        offset: -30,
        fontSize: 14,
        fontWeight: 600,
      }}
    />

    <Tooltip
      formatter={(value) => [`${value.toLocaleString()}`, "Usage Count"]}
      cursor={{ fillOpacity: 0.1 }}
    />

    <Bar
      dataKey="survey_usage_count"
      fill="#0A2342" 
      radius={[4, 4, 0, 0]}
    />
  </BarChart>
</ResponsiveContainer>

    </>
  );
}
