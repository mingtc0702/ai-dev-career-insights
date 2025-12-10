import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require("../config.json");

// Highest paying AI roles

export default function AiHighestPayingCompanies() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/companies/ai-highest-paying?limit=30`)
      .then(res => res.json())
      .then((rows) => {
        let formatted = rows.map((row) => ({
          company_name: row.company_name,
          avg_ai_salary: Math.round(row.avg_ai_salary),
        }));

        const values = formatted.map(d => d.avg_ai_salary).sort((a, b) => a - b);

        const q1 = values[Math.floor(values.length * 0.25)];
        const q3 = values[Math.floor(values.length * 0.75)];
        const iqr = q3 - q1;
        const upperBound = q3 + 1.5 * iqr;

        formatted = formatted.filter(d => d.avg_ai_salary <= upperBound);

        setData(formatted);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Top AI-Paying Companies (within 1.5 IQR)
      </Typography>

      <ResponsiveContainer width="100%" height={480}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 120, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="company_name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="avg_ai_salary" fill="#1e88e5" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
