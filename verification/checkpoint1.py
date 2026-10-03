"""
Checkpoint 1: Passport Integrity Validator
Verifies agent.yaml manifest, SOUL.md, AGENTS.md, DUTIES.md role separation,
and checks that all referenced tools and skills exist on disk.
"""
import os
import re
import json
from typing import Dict, Any, List, Tuple

def parse_simple_yaml(text: str) -> Dict[str, Any]:
    """Lightweight robust YAML parser for OpenGAP agent.yaml manifests without external dependencies."""
    data: Dict[str, Any] = {}
    current_key = None
    current_list = None
    current_dict = None

    for raw_line in text.splitlines():
        # Remove comments and trailing whitespace
        line = raw_line.split("#")[0].rstrip()
        if not line.strip():
            continue

        indent = len(line) - len(line.lstrip())

        # List item: "  - tools/foo.json"
        if line.strip().startswith("- "):
            val = line.strip()[2:].strip().strip('"').strip("'")
            if current_list is not None:
                current_list.append(val)
            continue

        # Key-value or section header
        if ":" in line:
            parts = line.split(":", 1)
            key = parts[0].strip()
            val = parts[1].strip()

            if indent == 0:
                current_list = None
                current_dict = None
                if not val:
                    # Could be list or dict
                    data[key] = []
                    current_key = key
                    current_list = data[key]
                else:
                    clean_val = val.strip('"').strip("'")
                    data[key] = clean_val
                    current_key = key
            elif indent >= 2 and current_key:
                # Subkey in dictionary
                if not isinstance(data.get(current_key), dict):
                    # convert if it was empty or list
                    if not data.get(current_key) or not isinstance(data.get(current_key), dict):
                        data[current_key] = {}
                clean_val = val.strip('"').strip("'")
                if clean_val.lower() == "true":
                    clean_val = True
                elif clean_val.lower() == "false":
                    clean_val = False
                data[current_key][key] = clean_val
                # Also reset current_list if we are in dict mode
                current_list = None

    return data

def parse_yaml_manifest(root_dir: str) -> Tuple[bool, Dict[str, Any], List[str]]:
    errors = []
    agent_yaml_path = os.path.join(root_dir, "agent.yaml")
    if not os.path.exists(agent_yaml_path):
        return False, {}, ["Missing agent.yaml manifest at root."]

    try:
        with open(agent_yaml_path, "r", encoding="utf-8") as f:
            raw_content = f.read()
        try:
            import yaml
            data = yaml.safe_load(raw_content)
        except ImportError:
            data = parse_simple_yaml(raw_content)
    except Exception as e:
        return False, {}, [f"Failed to parse agent.yaml: {str(e)}"]

    if not isinstance(data, dict):
        return False, {}, ["agent.yaml must be a valid YAML dictionary mapping."]

    spec_version = data.get("spec_version")
    if spec_version != "0.1.0":
        errors.append(f"spec_version MUST be exactly '0.1.0', found '{spec_version}'.")

    name = data.get("name", "")
    if not name:
        errors.append("Manifest 'name' is required.")
    else:
        if not re.match(r"^[a-z][a-z0-9-]*$", name):
            errors.append(f"Name '{name}' invalid: must start with a lowercase letter and contain only lowercase letters, digits, and hyphens.")

    if not data.get("version"):
        errors.append("Manifest 'version' is required.")
    if not data.get("description"):
        errors.append("Manifest 'description' is required.")

    return len(errors) == 0, data, errors

def validate_soul(root_dir: str) -> Tuple[bool, Dict[str, str], List[str]]:
    errors = []
    soul_path = os.path.join(root_dir, "SOUL.md")
    if not os.path.exists(soul_path):
        return False, {}, ["Missing SOUL.md at root."]

    with open(soul_path, "r", encoding="utf-8") as f:
        content = f.read()

    required_headings = [
        "Identity",
        "Personality",
        "Communication Style",
        "Values",
        "Behavioral Principles"
    ]
    sections: Dict[str, str] = {}

    for heading in required_headings:
        pattern = rf"^#\s+{re.escape(heading)}\s*$(.*?)(?=^#|\Z)"
        match = re.search(pattern, content, flags=re.MULTILINE | re.DOTALL)
        if not match:
            errors.append(f"SOUL.md is missing required heading '# {heading}'.")
        else:
            body = match.group(1).strip()
            if not body or len(body.split()) < 5:
                errors.append(f"SOUL.md heading '# {heading}' contains insufficient or empty content.")
            else:
                key = heading.lower().replace(" ", "_")
                sections[key] = body

    return len(errors) == 0, sections, errors

def validate_duties(root_dir: str) -> Tuple[bool, List[str]]:
    errors = []
    duties_path = os.path.join(root_dir, "DUTIES.md")
    if not os.path.exists(duties_path):
        return False, ["Missing DUTIES.md at root."]

    with open(duties_path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    full_text = "".join(lines)
    required_roles = ["Maker", "Checker", "Executor", "Auditor"]
    for role in required_roles:
        if not re.search(rf"\b{role}\b", full_text):
            errors.append(f"DUTIES.md missing required role '{role}'.")

    # Critical rule: Never place Maker and Checker on the same line!
    for idx, line in enumerate(lines, 1):
        if re.search(r"\bMaker\b", line, re.IGNORECASE) and re.search(r"\bChecker\b", line, re.IGNORECASE):
            # Only trigger if it's not a generic negation/warning comment stating never do it
            cleaned = line.strip().lower()
            if "never place maker and checker" in cleaned or "must never be assigned" in cleaned or "never conflate maker and checker" in cleaned:
                continue
            errors.append(f"Prohibited role conflation on line {idx}: Maker and Checker appear on the same line ('{line.strip()}').")

    return len(errors) == 0, errors

def validate_tools_and_skills(root_dir: str, manifest: Dict[str, Any]) -> Tuple[bool, List[Dict[str, Any]], List[str], List[str]]:
    errors = []
    tools_data = []
    skills_data = []

    # Check tools
    declared_tools = manifest.get("tools", [])
    if not declared_tools:
        errors.append("Manifest declares no tools.")

    for tool_ref in declared_tools:
        tool_path = os.path.join(root_dir, tool_ref) if not os.path.isabs(tool_ref) else tool_ref
        if not os.path.exists(tool_path):
            errors.append(f"Referenced tool '{tool_ref}' does not exist on disk.")
            continue

        try:
            with open(tool_path, "r", encoding="utf-8") as f:
                t_json = json.load(f)
            required_fields = ["name", "description", "input_schema", "output_schema", "permission_level"]
            for field in required_fields:
                if field not in t_json:
                    errors.append(f"Tool '{tool_ref}' missing required property '{field}'.")
            tools_data.append(t_json)
        except Exception as e:
            errors.append(f"Invalid JSON in tool '{tool_ref}': {str(e)}")

    # Check skills
    declared_skills = manifest.get("skills", [])
    if not declared_skills:
        errors.append("Manifest declares no skills.")

    for skill_ref in declared_skills:
        skill_dir = os.path.join(root_dir, skill_ref) if not os.path.isabs(skill_ref) else skill_ref
        skill_file = os.path.join(skill_dir, "SKILL.md")
        if not os.path.exists(skill_dir) or not os.path.exists(skill_file):
            errors.append(f"Referenced skill directory or SKILL.md not found at '{skill_ref}'.")
        else:
            with open(skill_file, "r", encoding="utf-8") as f:
                skill_content = f.read().strip()
            if len(skill_content) < 20:
                errors.append(f"Skill '{skill_ref}/SKILL.md' has insufficient content.")
            else:
                skills_data.append(os.path.basename(skill_ref))

    return len(errors) == 0, tools_data, skills_data, errors

def run_checkpoint1(root_dir: str = ".") -> Dict[str, Any]:
    """Runs Checkpoint 1 - Passport Integrity"""
    manifest_ok, manifest, manifest_errs = parse_yaml_manifest(root_dir)
    soul_ok, soul, soul_errs = validate_soul(root_dir)
    duties_ok, duties_errs = validate_duties(root_dir)

    agents_path = os.path.join(root_dir, "AGENTS.md")
    agents_ok = os.path.exists(agents_path)
    agents_errs = [] if agents_ok else ["Missing AGENTS.md at root."]

    tools_ok, tools, skills, tool_skill_errs = validate_tools_and_skills(root_dir, manifest) if manifest_ok else (False, [], [], ["Manifest not loaded"])

    all_errors = manifest_errs + soul_errs + duties_errs + agents_errs + tool_skill_errs
    passed = manifest_ok and soul_ok and duties_ok and agents_ok and tools_ok and len(all_errors) == 0

    return {
        "checkpoint": "Checkpoint 1 — Passport Integrity",
        "passed": passed,
        "status": "PASS" if passed else "FAIL",
        "errors": all_errors,
        "details": {
            "manifest_valid": manifest_ok,
            "soul_valid": soul_ok,
            "duties_valid": duties_ok,
            "agents_valid": agents_ok,
            "tools_count": len(tools),
            "skills_count": len(skills),
            "tools": tools,
            "skills": skills,
            "manifest": manifest,
            "soul": soul
        }
    }
