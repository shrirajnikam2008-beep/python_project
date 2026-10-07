import os
import sys
import subprocess
import shutil

def main():
    artifact_dir = r"C:\Users\shrir\.gemini\antigravity\brain\1f40356b-0571-44df-93fe-d80160353c26"
    workspace_dir = r"C:\Users\shrir\.gemini\antigravity\scratch\waypoint"
    
    html_src = os.path.join(workspace_dir, "Waypoint_Review_2_Ultimate_Preparation_Guide.html")
    if not os.path.exists(html_src):
        print(f"Error: Source HTML not found at {html_src}")
        return False
        
    html_artifact = os.path.join(artifact_dir, "Waypoint_Review_2_Ultimate_Preparation_Guide.html")
    pdf_artifact = os.path.join(artifact_dir, "Waypoint_Review_2_Ultimate_Preparation_Guide.pdf")
    pdf_workspace = os.path.join(workspace_dir, "Waypoint_Review_2_Ultimate_Preparation_Guide.pdf")
    
    # Copy HTML to artifact directory
    shutil.copy2(html_src, html_artifact)
    print(f"Copied HTML to artifact: {html_artifact}")
    
    # Locate msedge or chrome
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    ]
    browser_path = None
    for p in edge_paths:
        if os.path.exists(p):
            browser_path = p
            break
            
    if not browser_path:
        print("Error: Neither Microsoft Edge nor Google Chrome was found.")
        return False
        
    print(f"Using browser for PDF compilation: {browser_path}")
    file_uri = "file:///" + html_artifact.replace("\\", "/")
    
    cmd = [
        browser_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_artifact}",
        file_uri
    ]
    
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(pdf_artifact) and os.path.getsize(pdf_artifact) > 0:
        pdf_size = os.path.getsize(pdf_artifact)
        print(f"Artifact PDF generated successfully: {pdf_artifact} (Size: {pdf_size} bytes)")
        
        # Copy to workspace
        shutil.copy2(pdf_artifact, pdf_workspace)
        print(f"Workspace PDF copied to: {pdf_workspace}")
        return True
    else:
        print("Failed to compile PDF.")
        print("Return code:", res.returncode)
        print("Stdout:", res.stdout)
        print("Stderr:", res.stderr)
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
