import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Typography, CircularProgress } from "@mui/material";
const config = require('../config.json');

export default function AvgSalaryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/jobs/avg-salary-by-state`)
      .then((res) => res.json())
      .then((rows) => {
        const formatted = rows.map((row) => ({
          state: row.state,
          avg_salary: Math.round(row.avg_salary),
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching avg salary:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Average Salary by State
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="state" />
          <YAxis />
          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Bar dataKey="avg_salary" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
