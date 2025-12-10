import React, { useEffect, useState } from "react";
import { Typography, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require('../config.json');

//Salary by Role

export default function RoleSalaryChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/analysis/salary-alignment`)
      .then(res => res.json())
      .then(rows => {
        const formatted = rows.map(r => ({
          role: r.job_family,
          salary: r.normalized_salary
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
      <Typography variant="h6" gutterBottom>Salary by Role</Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={data} margin={{ left: 180 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis type="category" dataKey="role" width={180} />
          <Tooltip formatter={v => `$${v.toLocaleString()}`} />
          <Bar dataKey="salary" fill="#1976d2">
            <LabelList dataKey="salary" position="right" formatter={v => `$${v.toLocaleString()}`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
}
