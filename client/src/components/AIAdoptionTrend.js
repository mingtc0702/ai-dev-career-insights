import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
const config = require('../config.json');

//Compares AI jobs by experience level

export default function AIAdoptionTrend() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/experience/matching-levels`)
      .then(res => res.json())
      .then(rows => {
        const formatted = rows.map(r => ({
          level: r.survey_level,
          survey: r.survey_count,
          jobs: r.matching_jobs
        }));
        setData(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <>
      <Typography variant="h6" gutterBottom>AI Adoption Trend by Experience Level</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="level" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="survey" stroke="#1976d2" name="Survey Count" />
          <Line type="monotone" dataKey="jobs" stroke="#388e3c" name="Matching Jobs" />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
}
