# DesignOfExperiments

**Viruj Pharma | Fosravuconazole DOE Optimizer**

An AI-assisted Design of Experiments (DOE) optimization system for planning and optimizing the synthesis stages of Fosravuconazole L-Lysine Ethanolate.

---

## 🚀 API Documentation

The backend exposes a comprehensive set of RESTful APIs to manage the entire DOE workflow—from project initialization to statistical analysis. Below is a detailed explanation of all available endpoints:

### 1. Project & Risk Assessment (Phase 0)
* **`POST /api/projects/`**
  Creates a new optimization project. Accepts parameters like project name, target compound, and overall objective.
* **`GET /api/projects/{project_id}`**
  Retrieves full details of a specific project, including generated experiments and results.
* **`PUT /api/projects/{project_id}/phase0`**
  Saves the Phase 0 configuration. This includes defining QTPP (Quality Target Product Profile), CQAs (Critical Quality Attributes), synthesis stages, and the initial risk assessment matrix (e.g., severity, occurrence, detectability).
* **`GET /api/projects/{project_id}/phase0`**
  Fetches the saved Phase 0 configuration for a project.

### 2. Factors & Responses Configuration
* **`POST /api/projects/{project_id}/factors`**
  Defines the independent variables (factors) for the experiment, such as Temperature, Time, or Pressure. Includes their baseline, lower limits, and upper limits.
* **`POST /api/projects/{project_id}/responses`**
  Defines the dependent variables (responses) you want to measure and optimize, such as Yield (%) or Purity (%), along with their goals (maximize/minimize).

### 3. Design of Experiments (DOE) Engine
* **`POST /api/doe/recommend`**
  Analyzes the configured factors and constraints and recommends the optimal statistical design type (e.g., Full Factorial, Fractional Factorial, Plackett-Burman).
* **`POST /api/doe/evaluate`**
  Evaluates a selected DOE design key, providing statistical power analysis and identifying any factor aliasing/confounding.
* **`POST /api/doe/generate`**
  Generates the actual matrix of experimental runs based on the selected design type and predefined constraints.

### 4. Data Entry & Statistical Analysis
* **`POST /api/projects/{project_id}/results`**
  Uploads the observed results (e.g., measured yield) for the generated experimental runs.
* **`POST /api/analysis/run`**
  Performs core statistical analysis on the results. Generates ANOVA tables, calculates main effects, and fits regression models.
* **`POST /api/analysis/overlay`**
  Generates data for Design Space Overlay plots, allowing users to visualize the optimal operating window across two factors simultaneously.
* **`POST /api/analysis/monte-carlo`**
  Runs Monte Carlo simulations using standard deviations of factors to predict response robustness and failure probabilities.

### 5. Reporting, Auditing & Compliance
* **`GET /api/reports/{project_id}/summary`**
  Generates a full traceability summary report, linking CQAs to factors, designs, and final analysis results.
* **`POST /api/projects/{project_id}/audit`**
  Manually appends an action to the 21 CFR Part 11 compliant audit log.
* **`POST /api/projects/{project_id}/lock-campaign`**
  Locks a specific experimental campaign/stage to prevent further modifications, ensuring data integrity for regulatory compliance.
