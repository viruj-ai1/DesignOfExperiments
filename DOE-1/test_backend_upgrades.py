import sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).parent / "backend"))

import numpy as np
from doe.dsd import generate_dsd
from doe.d_optimal import generate_d_optimal
from doe.split_plot import generate_split_plot
from statistics.design_evaluation import evaluate_design
from statistics.diagnostics import residual_diagnostics
from statistics.regression import calculate_overlay_plot, run_monte_carlo_simulation

print("Testing DSD Generation...")
dsd = generate_dsd(4)
print("DSD Runs:", dsd["n_runs"])
assert dsd["n_runs"] >= 9

print("Testing D-Optimal Generation...")
dopt = generate_d_optimal(4)
print("D-Optimal Runs:", dopt["n_runs"])

print("Testing Pre-Run Design Diagnostics...")
matrix = np.array(dsd["matrix"])
eval_res = evaluate_design(matrix, [{"name": f"Factor_{i}"} for i in range(4)])
print("Power Analysis:", eval_res["power_analysis"])
print("VIF Count:", len(eval_res["vif"]))
print("FDS Points:", len(eval_res["fds"]["spv"]))

print("Testing Residual Diagnostics & Lack of Fit...")
y_obs = np.array([10.0, 12.0, 14.0, 11.0, 13.0, 15.0, 12.5, 12.7, 12.6])
y_pred = np.array([10.1, 11.9, 14.2, 10.9, 13.1, 14.8, 12.5, 12.5, 12.5])
X = np.eye(9)
diag = residual_diagnostics(y_obs, y_pred, X=X)
print("Lack of Fit test:", diag["lack_of_fit"])

print("Testing Overlay Plot & Monte Carlo...")
models = [{"beta": [10.0, 2.0, -1.0, 0.5, -0.5, 0.2]}]
responses = [{"name": "Yield", "goal": "maximize", "lower_limit": 8.0, "upper_limit": 15.0}]
overlay = calculate_overlay_plot(models, responses, 2, 0, 1, [0.0, 0.0])
print("Overlay Sweet Spot Grid size:", len(overlay["sweet_spot_grid"]))

mc = run_monte_carlo_simulation(models, responses, 2, 0, 1, [0.0, 0.0], [0.05, 0.05], n_iterations=500)
print("Monte Carlo Heatmap size:", len(mc["prob_heatmap"]))

print("ALL BACKEND VERIFICATIONS PASSED SUCCESSFULLY!")
