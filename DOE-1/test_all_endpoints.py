import sys, pathlib, json
sys.path.insert(0, str(pathlib.Path(__file__).parent / "backend"))

from fastapi.testclient import TestClient
from app import app

def test_full_workflow():
    with TestClient(app) as client:
        print("1. Creating Project...")
        res = client.post("/api/projects/", json={"name": "Test Compound X", "compound": "CMP-99", "objective": "Optimize Yield"})
        print("Project create response:", res.status_code)
        assert res.status_code in [200, 201]
        project = res.json()
        pid = project["id"]

        print("2. Testing Phase 0 GET/PUT...")
        phase0_payload = {
            "qtpp_data": [{"id": "q1", "attribute": "Assay", "criterion": ">= 99%", "justification": "ICH Q6A", "type": "Chemical"}],
            "cqas_data": [{"id": "c1", "name": "Assay (%)", "appliesTo": "Final API", "linkedQtppIds": ["q1"]}],
            "stages_data": [{"id": "s1", "order": 1, "name": "Stage 1: Coupling", "unitOpType": "Reaction"}],
            "risk_assessment_data": {
                "s1": {
                    "parameters": [
                        {"id": "p1", "name": "Reaction Temp", "type": "CPP-candidate", "linkedCqaIds": ["c1"], "severity": 5, "occurrence": 4, "detectability": 6, "rpn": 120, "rationale": "High temp causes degradation", "criticalFlag": True, "overrideReason": ""}
                    ]
                }
            }
        }
        res = client.put(f"/api/projects/{pid}/phase0", json=phase0_payload)
        print("Phase 0 PUT response:", res.status_code)
        assert res.status_code == 200

        res = client.get(f"/api/projects/{pid}/phase0")
        print("Phase 0 GET response:", res.status_code)
        assert res.status_code == 200

        print("3. Testing Factors & Responses CRUD...")
        factors_payload = {
            "factors": [
                {"name": "Temp", "symbol": "X1", "unit": "C", "low": 50.0, "high": 80.0, "baseline": 65.0, "factor_order": 0, "stage_id": "s1", "linked_cqa_ids": ["c1"]},
                {"name": "Time", "symbol": "X2", "unit": "h", "low": 2.0, "high": 6.0, "baseline": 4.0, "factor_order": 1, "stage_id": "s1", "linked_cqa_ids": ["c1"]}
            ]
        }
        res = client.post(f"/api/projects/{pid}/factors", json=factors_payload)
        print("Factors POST response:", res.status_code)
        assert res.status_code == 200

        responses_payload = {
            "responses": [
                {"name": "Yield (%)", "unit": "%", "goal": "maximize", "lower_limit": 80.0, "upper_limit": 100.0, "weight": 1.0, "resp_order": 0, "stage_id": "s1", "linked_cqa_ids": ["c1"]}
            ]
        }
        res = client.post(f"/api/projects/{pid}/responses", json=responses_payload)
        print("Responses POST response:", res.status_code)
        assert res.status_code == 200

        print("4. Testing DOE Recommend, Evaluate & Generate...")
        res = client.post("/api/doe/recommend", json={"project_id": pid, "phase": "screening", "has_htc_factors": False, "constraints": []})
        print("DOE Recommend response:", res.status_code)
        assert res.status_code == 200

        res = client.post("/api/doe/evaluate", json={"project_id": pid, "design_key": "FF"})
        print("DOE Evaluate response:", res.status_code)
        assert res.status_code == 200

        res = client.post("/api/doe/generate", json={"project_id": pid, "design_key": "FF", "phase": "screening", "constraints": []})
        print("DOE Generate response:", res.status_code)
        assert res.status_code == 200

        print("5. Uploading Experiment Results...")
        res = client.get(f"/api/projects/{pid}")
        exps = res.json().get("experiments", [])
        exp_results = []
        for idx, e in enumerate(exps):
            exp_results.append({
                "experiment_id": e["id"],
                "result_values": [85.0 + idx * 1.5]
            })
        res = client.post(f"/api/projects/{pid}/results", json={"results": exp_results})
        print("Upload Results response:", res.status_code)
        assert res.status_code == 200


        print("6. Testing Statistical Analysis...")
        res = client.post("/api/analysis/run", json={"project_id": pid, "response_idx": 0})
        print("Analysis run response:", res.status_code)
        assert res.status_code == 200

        print("7. Testing Overlay & Monte Carlo...")
        res = client.post("/api/analysis/overlay", json={"project_id": pid, "factor_x": 0, "factor_y": 1})
        print("Overlay response:", res.status_code)
        assert res.status_code == 200

        res = client.post("/api/analysis/monte-carlo", json={"project_id": pid, "factor_stds": [0.05, 0.05], "n_iterations": 100, "factor_x": 0, "factor_y": 1})
        print("Monte Carlo response:", res.status_code)
        assert res.status_code == 200

        print("8. Testing Traceability Summary & Audit Log & Lock...")
        res = client.get(f"/api/reports/{pid}/summary")
        print("Report Summary response:", res.status_code)
        assert res.status_code == 200

        res = client.post(f"/api/projects/{pid}/audit", json={"action": "TEST_ACTION", "details": "Testing audit log"})
        print("Audit log response:", res.status_code)
        assert res.status_code == 200

        res = client.post(f"/api/projects/{pid}/lock-campaign", json={"stage_id": "s1"})
        print("Lock Campaign response:", res.status_code)
        assert res.status_code == 200

        print("ALL API ENDPOINTS TESTED AND WORKING PERFECTLY!")

if __name__ == "__main__":
    test_full_workflow()
