import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require('../config.json');

export default function AIAdoptionByRole() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/jobs/ai-vs-non-ai-salaries`)
      .then(res => res.json())
      .then(rows => setData(rows))
      .finally(() => setLoading(false))
      .catch(err => console.error(err));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>AI vs Non-AI Job Salaries</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="job_type" />
          <YAxis />
          <Tooltip formatter={v => `$${v.toLocaleString()}`} />
          <Bar dataKey="median_salary" fill="#6a1b9a" />
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
