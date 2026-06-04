const fs = require('fs');
const file = '/Users/manvirajput/Downloads/rougue_world_record-main--main 8/rougue_world_record-main--main 5/rougue_world_record-main--main 2/client/src/pages/Admin.jsx';
let content = fs.readFileSync(file, 'utf-8');
const replacement = `                {/* ===== COUNTRIES MANAGER ===== */}
                {contentSubTab === "countries" && (
                  <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: "white", marginBottom: "16px" }}>Add New Country to Leaderboard</h3>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const fd = new FormData(e.target);
                      const name = fd.get('name');
                      const code = fd.get('code');
                      const flag = fd.get('flag');
                      try {
                        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
                        const res = await fetch('http://localhost:5002/api/countries', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', Authorization: \`Bearer \${token}\` },
                          body: JSON.stringify({ name, code, flag })
                        });
                        if (res.ok) {
                          alert('Country added successfully!');
                          e.target.reset();
                        } else {
                          alert('Failed to add country');
                        }
                      } catch (err) { alert(err.message); }
                    }} style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
                      <input name="name" placeholder="Country Name (e.g. India)" required style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                      <input name="code" placeholder="Country Code (e.g. IND)" required style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                      <input name="flag" placeholder="Emoji Flag (e.g. 🇮🇳)" required style={{ padding: "12px", borderRadius: "8px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                      <button type="submit" style={{ background: "#FF5500", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", border: "none" }}>Add Country</button>
                    </form>
                  </div>
                )}
`;
content = content.replace('<CountriesManagerTab />', replacement);
fs.writeFileSync(file, content, 'utf-8');
