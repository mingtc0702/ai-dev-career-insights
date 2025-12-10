const { Pool, types, Query } = require('pg');
const config = require('./config.js')

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

// Create PostgreSQL connection using database credentials provided in config.json
// Do not edit. If the connection fails, make sure to check that config.json is filled out correctly
const connection = new Pool({
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db,
  ssl: {
    rejectUnauthorized: false,
  },
});
connection.connect((err) => err && console.log(err));

/******************
 * ROUTES *
 ******************/

// Route 1: GET /jobs/highest-paid
const highest_paid = async function(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const location = req.query.location ?? null;
  const family = req.query.family ?? null;

  let Query = `
  SELECT DISTINCT
    title,
    company_name,
    normalized_salary
  FROM linkedin_jobs
  `;

  let whereString = `WHERE normalized_salary IS NOT NULL\n`;
  let params = [];
  let idx = 1;

  if (location) {
    whereString += ` AND job_country ILIKE $${idx++}\n`;
    params.push(`%${location}%`)
  }
  if (family) {
    whereString += `AND job_family ILIKE $${idx++}\n`;
    params.push(`%${family}%`)
  }
  whereString += `ORDER BY normalized_salary DESC LIMIT $${idx++}`;
  params.push(limit);

  Query += whereString;

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 2: GET /jobs/experience-level-count
const experience_level_count = async function(req, res) {
  const location = req.query.location ?? null;
  const family = req.query.family ?? null;
  const minSalary = req.query.minSalary ?? null;

  let Query = `
    SELECT
      formatted_experience_level,
      COUNT(*) AS postings_count
    FROM linkedin_jobs
  `

  let whereStrings = [];
  let params = [];
  let idx = 1;

  if (location) {
    whereStrings.push(`job_country ILIKE $${idx++}`);
    params.push(`%${location}%`);
  }

  if (family) {
    whereStrings.push(`job_family ILIKE $${idx++}`);
    params.push(`%${family}%`);
  }

  if (minSalary) {
    whereStrings.push(`normalized_salary >= $${idx++}`);
    params.push(Number(minSalary));
  }

  if (whereStrings.length > 0) {
    Query += "WHERE " + whereStrings.join(" AND ") + "\n";
  }

  Query += `
    GROUP BY formatted_experience_level
    ORDER BY postings_count DESC;
  `;

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 3: GET /survey/python-users
const python_users = async function(req, res) {
  const respondentCountry = req.query.respondentCountry ?? null;
  const minSalary = req.query.minSalary ?? null;

  let Query = ` SELECT
                COUNT(*) AS python_users
                FROM survey_responses
                WHERE LOWER(language_have_worked_with) LIKE '%python%'
              `
  let params = [];
  let idx = 1;

  if (respondentCountry) {
    Query += `AND country ILIKE $${idx++}\n`;
    params.push(`%${respondentCountry}%`);
  }

  if (minSalary) {
    Query += `AND salary >= $${idx++}`;
    params.push(Number(minSalary));
  }

  Query += `;`;

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows[0]);
    }
  });
}

// Route 4: GET /jobs/avg-salary-by-state
const avg_salary_by_state = async function(req, res) {
  const requiresAI = req.query.requiresAI ?? null;
  const minPostings = req.query.minPostings ?? null;

  let Query = `SELECT
                job_country AS state,
                AVG(normalized_salary) AS avg_salary
              FROM linkedin_jobs
              WHERE normalized_salary IS NOT NULL
                AND job_country ~ '^[A-Z]{2}$'
                `
  let params = [];
  let idx = 1;

  if (requiresAI !== null) {
    Query += ` AND requires_ai_skill = $${idx++}\n`;
    params.push(requiresAI === 'true');
  }

  Query += ` GROUP BY state`
  if (minPostings !== null) {
    Query += ` HAVING COUNT(*) >= $${idx++}`
    params.push(Number(minPostings));
  }
  Query += ` ORDER BY avg_salary DESC;`;

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 5: GET /jobs/ai-vs-non-ai-salaries
const ai_vs_non_ai_salaries = async function(req, res) {
  const country = req.query.country ?? null;
  const family = req.query.family ?? null;
  // Query Implementation
  let Query = `
    SELECT
      CASE WHEN requires_ai_skill = TRUE THEN 'AI Jobs'
            ELSE 'Non-AI Jobs'
      END AS job_type,
      COUNT(*) AS num_postings,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY normalized_salary) AS median_salary
    FROM linkedin_jobs
    WHERE normalized_salary IS NOT NULL
  `
  let params = [];
  let idx = 1;

  if (country) {
    Query += ` AND job_country ILIKE $${idx++}\n`;
    params.push(`%${country}%`);
  }

  if (family) {
    Query += ` AND job_family ILIKE $${idx++}\n`;
    params.push(`%${family}%`);
  }

  Query += `GROUP BY job_type;`;

  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 6: GET /companies/ai-highest-paying
const ai_highest_paying = async function(req, res) {
  const minPostings = req.query.minPostings ? parseInt(req.query.minPostings) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 20;

  let params = [minPostings, limit];
  let idx = 1;
  let Query = `SELECT
                company_name,
                COUNT(*) AS ai_job_count,
              AVG(normalized_salary) AS avg_ai_salary
              FROM linkedin_jobs
              WHERE requires_ai_skill = TRUE 
                AND normalized_salary IS NOT NULL
              GROUP BY company_name
              HAVING COUNT(*) >= $${idx++}
              ORDER BY avg_ai_salary DESC
              LIMIT $${idx++};
              `

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 7: GET /skills/popularity
const popularity = async function(req, res) {
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;
  const family = req.query.family ?? null;
  const minSalary = req.query.minSalary ? parseInt(req.query.minSalary) : null;

  let Query = `
    SELECT
      lang.language,
      COUNT(*) AS survey_usage_count,
      COALESCE(job.job_mentions, 0) AS linkedin_job_mentions
    FROM (
      SELECT unnest(string_to_array(language_have_worked_with, ';')) AS language
      FROM survey_responses
    `
  let params = [];
  let idx = 1;

  if (minSalary) {
    Query += `WHERE salary IS NOT NULL
                AND salary >= $${idx++}
              `
    params.push(Number(minSalary))
  }

  Query += `
    ) lang
    LEFT JOIN (
      SELECT
          language AS language,
          COUNT(*) AS job_mentions
      FROM (
          SELECT unnest(string_to_array(skills_desc, ' ')) AS language
          FROM linkedin_jobs
  `

  if (family) {
    Query += `WHERE job_family ILIKE $${idx++}\n`
    params.push(`%${family}%`)
  }

  Query += `) t
      GROUP BY language
    ) job
    ON LOWER(lang.language) = LOWER(job.language)
    GROUP BY lang.language, job.job_mentions
    ORDER BY survey_usage_count DESC
    LIMIT $${idx++};
    `
  params.push(limit);

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 8: GET /analysis/salary-alignment
const salary_alignment = async function(req, res) {
  const family = req.query.family ?? null;
  const minSalary = req.query.minSalary ?? null;

  let Query = `
    SELECT DISTINCT
      job_family,
      title,
      company_name,
      normalized_salary,
      RANK() OVER (PARTITION BY job_family ORDER BY normalized_salary DESC) AS salary_rank
    FROM linkedin_jobs
    WHERE normalized_salary IS NOT NULL
  `
  let params = [];
  let idx = 1;

  if (family) {
    Query += ` AND job_family ILIKE $${idx++}\n`
    params.push(`%${family}%`)
  }

  if (minSalary) {
    Query += ` AND normalized_salary >= $${idx++}\n`
    params.push(minSalary)
  }

  Query += `ORDER BY job_family, salary_rank;`

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 9: GET /experience/matching-levels
const matching_levels = async function(req, res) {
  const country = req.query.country ?? null;
  const family = req.query.family ?? null;

  let whereStrings = [];
  let params = [];
  let idx = 1;

  let Query = `
    WITH survey_counts AS (
      SELECT
          CASE
              WHEN experience_years IS NULL THEN 'Unknown'
              WHEN experience_years < 3 THEN 'Junior'
              WHEN experience_years BETWEEN 3 AND 7 THEN 'Mid'
              ELSE 'Senior+'
          END AS survey_level,
          COUNT(*) AS survey_count
      FROM survey_responses
  `
  if (country) {
    Query += ` WHERE country ILIKE $${idx++}\n`
    params.push(`%${country}%`)
  }

  Query += `
    GROUP BY 1
    ),
    job_counts AS (
      SELECT
          CASE
              WHEN exp_bucket IN ('0-2', '1-3') THEN 'Junior'
              WHEN exp_bucket = '3-7' THEN 'Mid'
              WHEN exp_bucket IN ('5-10', '10+', 'Unknown') THEN 'Senior+'
              ELSE 'Unknown'
          END AS job_level,
          COUNT(*) AS job_count
      FROM linkedin_jobs
  `

  if (country) {
    whereStrings.push(`job_country ILIKE $${idx++}`);
    params.push(`%${country}%`);
  }

  if (family) {
    whereStrings.push(`job_family ILIKE $${idx++}`);
    params.push(`%${family}%`);
  }

  if (whereStrings.length > 0) {
    Query += " WHERE " + whereStrings.join(" AND ") + "\n";
  }

  Query += `GROUP BY 1
    )
    SELECT
      s.survey_level,
      s.survey_count,
      COALESCE(j.job_count, 0) AS matching_jobs
    FROM survey_counts s
    LEFT JOIN job_counts j
      ON s.survey_level = j.job_level
    ORDER BY matching_jobs DESC;
  `

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

// Route 10: GET /ai/sentiment-vs-market
const sentiment_vs_market = async function(req, res) {
  const role = req.query.role ?? null;
  const minSalary = req.query.minSalary ? parseInt(req.query.minSalary) : null;
  const minExperience = req.query.minExperience ? parseInt(req.query.minExperience) : null;
  const family = req.query.family ?? null;

  let Query = `WITH survey_sentiment AS (
      SELECT
          ai_sentiment,
          COUNT(*) AS respondent_count,
          AVG(salary) AS avg_survey_salary
      FROM survey_responses
      WHERE ai_sentiment IS NOT NULL
      `
  let whereStrings = [];
  let params = [];
  let idx = 1;

  let whereStrings2 = [];

  if (role) {
    whereStrings.push(`job_role ILIKE $${idx++}`);
    params.push(`%${role}%`);
  }

  if (minSalary) {
    whereStrings.push(`salary >= $${idx++}`);
    params.push(Number(minSalary));
  }

  if (minExperience) {
    whereStrings.push(`experience_years >= $${idx++}`);
    params.push(Number(minExperience));
  }

  if (whereStrings.length > 0) {
    Query += ` AND ` + whereStrings.join(" AND ") + "\n";
  }

  Query += `
    GROUP BY ai_sentiment
    ),
    ai_jobs AS (
      SELECT
          requires_ai_skill,
          AVG(normalized_salary) AS avg_ai_job_salary
      FROM linkedin_jobs
    `
    if (family) {
      whereStrings2.push(`job_family ILIKE $${idx++}`);
      params.push(`%${family}%`);
    }

    if (whereStrings2.length > 0) {
    Query += ` WHERE ` + whereStrings2.join(" AND ") + "\n";
  }

    Query += `
    GROUP BY requires_ai_skill
    )
    SELECT
      ss.ai_sentiment,
      ss.respondent_count,
      ss.avg_survey_salary,
      aj.avg_ai_job_salary
    FROM survey_sentiment ss
    LEFT JOIN ai_jobs aj
      ON aj.requires_ai_skill = TRUE
    ORDER BY respondent_count DESC;
  `

  // Query Implementation
  connection.query(Query, params, (err, data) => {
    if (err) {
      // Error Handling
      console.log(err);
      res.json({});
    } else {
      res.json(data.rows);
    }
  });
}

module.exports = {
 highest_paid,
 experience_level_count,
 python_users, 
 avg_salary_by_state,
 ai_vs_non_ai_salaries,
 ai_highest_paying,
 popularity,
 salary_alignment,
 matching_levels,
 sentiment_vs_market
}
