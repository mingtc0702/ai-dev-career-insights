const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

// Allow all origins (Render needs public CORS)
app.use(cors({ origin: '*' }));

// -------- PORT SETTING FOR RENDER ----------
const PORT = process.env.PORT || 3001;

// -------- API ROUTES ----------
app.get('/jobs/highest-paid', routes.highest_paid);
app.get('/jobs/experience-level-count', routes.experience_level_count);
app.get('/survey/python-users', routes.python_users);
app.get('/jobs/avg-salary-by-state', routes.avg_salary_by_state);
app.get('/jobs/ai-vs-non-ai-salaries', routes.ai_vs_non_ai_salaries);
app.get('/companies/ai-highest-paying', routes.ai_highest_paying);
app.get('/skills/popularity', routes.popularity);
app.get('/analysis/salary-alignment', routes.salary_alignment);
app.get('/experience/matching-levels', routes.matching_levels);
app.get('/ai/sentiment-vs-market', routes.sentiment_vs_market);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
