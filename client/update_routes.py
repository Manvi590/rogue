import re

# Read App.jsx
with open('src/App.jsx', 'r') as f:
    content = f.read()

# Add new imports after GlobalRankings import
old_imports = """import GlobalRankings from './pages/GlobalRankings'
import LoadingScreen from './components/LoadingScreen'"""

new_imports = """import GlobalRankings from './pages/GlobalRankings'
import GlobalRankingsPage from './pages/GlobalRankingsPage'
import MemberProfilePage from './pages/MemberProfilePage'
import LoadingScreen from './components/LoadingScreen'"""

content = content.replace(old_imports, new_imports)

# Update the route for global-rankings
old_route = """<Route path="/global-rankings" element={<GlobalRankings />} />"""
new_route = """<Route path="/global-rankings" element={<GlobalRankingsPage />} />
            <Route path="/profile/:username" element={<MemberProfilePage />} />"""

content = content.replace(old_route, new_route)

# Write back
with open('src/App.jsx', 'w') as f:
    f.write(content)

print("✅ Updated App.jsx with new ranking routes")
