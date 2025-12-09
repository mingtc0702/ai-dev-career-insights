import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Typography, CircularProgress } from "@mui/material";
const config = require('../config.json');

export default function HighestPaidJobsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/jobs/highest-paid`)
      .then((res) => res.json())
      .then((rows) => {
        const formatted = rows.map((row) => ({
          title: `${row.title} @ ${row.company_name}`,
          salary: row.normalized_salary,
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching highest-paid jobs:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Highest Paid Jobs (Top 10)
      </Typography>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 20, bottom: 10, left: 180 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
  type="category"
  dataKey="title"
  width={250}
  tick={({ x, y, payload }) => {
    const maxLength = 30;
    const label =
      payload.value.length > maxLength
        ? payload.value.slice(0, maxLength) + "..."
        : payload.value;
    return (
      <text x={x} y={y + 5} textAnchor="end" fill="#666">
        {label}
      </text>
    );
  }}
/>

          <Tooltip formatter={(v) => `$${v.toLocaleString()}`} />
          <Bar dataKey="salary">
            <LabelList
              dataKey="salary"
              position="right"
              formatter={(v) => `$${v.toLocaleString()}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
