import React, { useEffect, useState } from "react";
import { Typography, CircularProgress, Paper } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
const config = require("../config.json");

export default function AvgSalaryByJobFamilyChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/analysis/salary-alignment`)
      .then(res => res.json())
      .then(rows => {
        const salaryMap = {};

        rows.forEach(row => {
          let salary = row.normalized_salary;
          if (salary != null) {
            salary = Number(salary); // ensure it's numeric
            if (!isNaN(salary)) {
              const family = row.job_family || "Unknown";
              if (!salaryMap[family]) salaryMap[family] = { totalSalary: 0, count: 0 };
              salaryMap[family].totalSalary += salary;
              salaryMap[family].count += 1;
            }
          }
        });

        const avgSalaryData = Object.entries(salaryMap)
          .map(([family, { totalSalary, count }]) => ({
            job_family: family,
            avg_salary: count > 0 ? Math.round(totalSalary / count) : 0
          }))
          .filter(d => d.avg_salary > 0) // remove any zero averages
          .sort((a, b) => b.avg_salary - a.avg_salary);

        setData(avgSalaryData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CircularProgress />;
  if (!data.length) return <Typography>No data available</Typography>;

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Average Salary by Job Family
      </Typography>

      <ResponsiveContainer width="100%" height={480}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, bottom: 20, left: 150 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(val) => `$${val.toLocaleString()}`} />
          <YAxis type="category" dataKey="job_family" />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="avg_salary" fill="#4caf50" name="Average Salary" />
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
}
