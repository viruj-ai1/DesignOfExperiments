import os, sys, subprocess

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.abspath(__file__))
    doe1_dir = os.path.join(base_dir, "DOE-1")
    run_script = os.path.join(doe1_dir, "run.py")

    if os.path.exists(run_script):
        sys.exit(subprocess.call([sys.executable, run_script], cwd=doe1_dir))
    else:
        print(f"Error: Could not find {run_script}")




