import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    lines = f.readlines()

# Find and mark lines to remove
lines_to_remove = set()

# Check for duplicate state declarations
seen_states = {}
for i, line in enumerate(lines):
    if 'const [' in line and 'useState' in line:
        # Extract the state variable name
        match = re.search(r'const \[(\w+),', line)
        if match:
            var_name = match.group(1)
            if var_name in seen_states:
                print(f"Removing duplicate {var_name} at line {i+1} (first seen at line {seen_states[var_name]+1})")
                lines_to_remove.add(i)
            else:
                seen_states[var_name] = i

# Remove marked lines
filtered_lines = [line for i, line in enumerate(lines) if i not in lines_to_remove]

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.writelines(filtered_lines)

print(f"✅ Removed {len(lines_to_remove)} duplicate state declarations")
