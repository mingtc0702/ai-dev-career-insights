import React, { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Slider,
} from "@mui/material";
const config = require("../config.json");

//Data explorer with filters and dropdowns

export default function InteractiveDataExplorer() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [salaryDomain, setSalaryDomain] = useState([0, 500000]);

  const [filters, setFilters] = useState({
    job_family: "All",
    title: "",
    company_name: "",
    salary_range: [0, 500000],
    salary_rank: "",
  });

  const [dropdownOptions, setDropdownOptions] = useState({
    job_family: [],
  });

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/analysis/salary-alignment`)
      .then((res) => res.json())
      .then((rows) => {
        setData(rows);
        setFilteredData(rows);

        setDropdownOptions({
          job_family: Array.from(
            new Set(rows.map((r) => r.job_family || "Unknown"))
          ).sort(),
        });

        const salaries = rows
          .map((r) => r.normalized_salary)
          .filter((s) => s !== null && !isNaN(s));

        if (salaries.length > 0) {
          const minSalary = Math.min(...salaries);
          const maxSalary = Math.max(...salaries);

          setSalaryDomain([minSalary, maxSalary]);

          setFilters((prev) => ({
            ...prev,
            salary_range: [minSalary, maxSalary],
          }));
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = data.filter((row) => {
      const jobFamily = row.job_family || "Unknown";
      const title = row.title || "";
      const company = row.company_name || "";
      const salary = Number(row.normalized_salary);
      const rank = row.salary_rank || "";

      return (
        (filters.job_family === "All" || jobFamily === filters.job_family) &&
        title.toLowerCase().includes(filters.title.toLowerCase()) &&
        company.toLowerCase().includes(filters.company_name.toLowerCase()) &&
        (isNaN(salary) ||
          (salary >= filters.salary_range[0] &&
            salary <= filters.salary_range[1])) &&
        (filters.salary_rank === "" ||
  rank.toString() === filters.salary_rank)

      );
    });

    setFilteredData(filtered);
    setPage(0);
  }, [filters, data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Interactive Data Explorer
      </Typography>

      <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Job Family</InputLabel>
          <Select
            value={filters.job_family}
            label="Job Family"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, job_family: e.target.value }))
            }
          >
            <MenuItem value="All">All</MenuItem>
            {dropdownOptions.job_family.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {["title", "company_name", "salary_rank"].map((col) => (
          <TextField
            key={col}
            label={col.replace("_", " ").toUpperCase()}
            value={filters[col]}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, [col]: e.target.value }))
            }
            variant="outlined"
            size="small"
          />
        ))}

        <Stack sx={{ minWidth: 280 }}>
          <Typography gutterBottom>
            Salary Range (${filters.salary_range[0].toLocaleString()} - $
            {filters.salary_range[1].toLocaleString()})
          </Typography>
          <Slider
            value={filters.salary_range}
            onChange={(e, newValue) =>
              setFilters((prev) => ({
                ...prev,
                salary_range: newValue,
              }))
            }
            min={salaryDomain[0]}
            max={salaryDomain[1]}
            step={10000}
            valueLabelDisplay="auto"
            disableSwap
          />
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Job Family</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Salary Rank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell>{row.job_family || "Unknown"}</TableCell>
                  <TableCell>{row.title || "N/A"}</TableCell>
                  <TableCell>{row.company_name || "N/A"}</TableCell>
                  <TableCell>
                    {row.normalized_salary
                      ? `$${row.normalized_salary.toLocaleString()}`
                      : "N/A"}
                  </TableCell>
                  <TableCell>{row.salary_rank || "N/A"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
