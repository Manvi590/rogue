import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ShieldAlert, ShieldCheck, Trophy, Check, X, Eye, Calendar, 
  MapPin, User, Search, RefreshCw, BarChart2, Activity, Filter, 
  AlertTriangle, CheckCircle, Video, FileText, ArrowRight, Loader2, 
  Sparkles, Trash2, Edit3, Plus, ShoppingBag, Mail, HardDrive, DollarSign, Scale, Ruler
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/api";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Active Admin View Tab: "records" | "users" | "events" | "products" | "contacts"
  const [activeTab, setActiveTab] = useState("records");

  // Data collections state
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // CRUD Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [modalTarget, setModalTarget] = useState(null); // The item being edited
  const [modalLoading, setModalLoading] = useState(false);

  // Dynamic Form states bound to inputs
  const [recordForm, setRecordForm] = useState({ title: "", category: "Strength", description: "", value: "", unit: "", status: "pending", evidenceUrl: "", venueName: "", city: "", recordType: "standard", userId: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", is_admin: false, username: "", phone: "", gender: "male", dob: "", weight: "", weight_unit: "kg", height: "", height_unit: "cm", country: "", city: "" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", location: "", imageUrl: "" });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "", category: "Accessories", stockCount: "" });

  // Security gate check
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      console.warn("Unauthorized access to administrative dashboard.");
    }
  }, [user, authLoading]);

  // Unified Data Query Orchestrator
  const fetchData = async () => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "records") {
        const data = await apiCall("/admin/records", "GET", null, user.token).catch(() => 
          // Fallback if unified endpoint needs records list
          apiCall("/records/admin/submissions", "GET", null, user.token)
        );
        setRecords(data || []);
      } else if (activeTab === "users") {
        const data = await apiCall("/admin/users", "GET", null, user.token);
        setUsers(data || []);
      } else if (activeTab === "events") {
        const data = await apiCall("/admin/events", "GET", null, user.token);
        setEvents(data || []);
      } else if (activeTab === "products") {
        const data = await apiCall("/admin/products", "GET", null, user.token);
        setProducts(data || []);
      } else if (activeTab === "contacts") {
        const data = await apiCall("/admin/contacts", "GET", null, user.token);
        setContacts(data || []);
      }
    } catch (err) {
      console.error(`Error loading ${activeTab}:`, err);
      setError(err.message || `Failed to fetch administrative data for ${activeTab}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, activeTab]);

  // DELETE operation handler
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you absolutely sure you want to delete this item? This action is irreversible.`)) return;
    try {
      let endpoint = "";
      if (activeTab === "records") endpoint = `/admin/records/${id}`;
      else if (activeTab === "users") endpoint = `/admin/users/${id}`;
      else if (activeTab === "events") endpoint = `/admin/events/${id}`;
      else if (activeTab === "products") endpoint = `/admin/products/${id}`;
      else if (activeTab === "contacts") endpoint = `/admin/contacts/${id}`;

      await apiCall(endpoint, "DELETE", null, user.token);

      // Instantly update UI State
      if (activeTab === "records") setRecords(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "users") setUsers(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "events") setEvents(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "products") setProducts(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "contacts") setContacts(prev => prev.filter(x => x.id !== id));
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  // Open Modal Helper
  const openModal = (type, item = null) => {
    setModalType(type);
    setModalTarget(item);
    
    if (activeTab === "records") {
      if (type === "edit" && item) {
        setRecordForm({
          title: item.title || "",
          category: item.category || "Strength",
          description: item.description || "",
          value: item.value || "",
          unit: item.unit || "",
          status: item.status || "pending",
          evidenceUrl: item.evidence_url || "",
          venueName: item.venue_name || "",
          city: item.city || "",
          recordType: item.record_type || "standard",
          userId: item.user_id || ""
        });
      } else {
        setRecordForm({ title: "", category: "Strength", description: "", value: "", unit: "", status: "pending", evidenceUrl: "", venueName: "", city: "", recordType: "standard", userId: users[0]?.id || "" });
      }
    } else if (activeTab === "users") {
      if (type === "edit" && item) {
        setUserForm({
          name: item.name || "",
          email: item.email || "",
          is_admin: !!item.is_admin,
          username: item.username || "",
          phone: item.phone || "",
          gender: item.gender || "male",
          dob: item.dob ? item.dob.split("T")[0] : "",
          weight: item.weight || "",
          weight_unit: item.weight_unit || "kg",
          height: item.height || "",
          height_unit: item.height_unit || "cm",
          country: item.country || "",
          city: item.city || ""
        });
      } else {
        setUserForm({ name: "", email: "", is_admin: false, username: "", phone: "", gender: "male", dob: "", weight: "", weight_unit: "kg", height: "", height_unit: "cm", country: "", city: "" });
      }
    } else if (activeTab === "events") {
      if (type === "edit" && item) {
        setEventForm({
          title: item.title || "",
          description: item.description || "",
          date: item.date ? item.date.split(".")[0] : "",
          location: item.location || "",
          imageUrl: item.image_url || ""
        });
      } else {
        setEventForm({ title: "", description: "", date: "", location: "", imageUrl: "" });
      }
    } else if (activeTab === "products") {
      if (type === "edit" && item) {
        setProductForm({
          name: item.name || "",
          description: item.description || "",
          price: item.price || "",
          imageUrl: item.image_url || "",
          category: item.category || "Accessories",
          stockCount: item.stock_count || ""
        });
      } else {
        setProductForm({ name: "", description: "", price: "", imageUrl: "", category: "Accessories", stockCount: "" });
      }
    }
    setIsModalOpen(true);
  };

  // Submit modal form CRUD updates
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      let endpoint = `/admin/${activeTab}`;
      let method = modalType === "add" ? "POST" : "PUT";
      let payload = {};

      if (activeTab === "records") payload = recordForm;
      else if (activeTab === "users") payload = userForm;
      else if (activeTab === "events") payload = eventForm;
      else if (activeTab === "products") payload = productForm;

      if (modalType === "edit" && modalTarget) {
        endpoint = `/admin/${activeTab}/${modalTarget.id}`;
      }

      const response = await apiCall(endpoint, method, payload, user.token);

      // Reload dataset dynamically
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      alert(`Save operation failed: ${err.message}`);
    } finally {
      setModalLoading(false);
    }
  };

  // Quick verify/reject record helper
  const handleQuickAdjudicate = async (id, status) => {
    try {
      await apiCall(`/records/admin/adjudicate/${id}`, "PUT", { status }, user.token);
      setRecords(prev => prev.map(x => x.id === id ? { ...x, status } : x));
    } catch (err) {
      alert(`Quick adjudication failed: ${err.message}`);
    }
  };

  // loading view
  if (authLoading) {
    return (
      <div style={{ background: "#030303", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Loader2 className="animate-spin" size={48} color="#FF5500" />
        <p style={{ marginTop: "16px", color: "#aaa", fontFamily: "'Outfit', 'Inter', sans-serif" }}>SYNCING SECURITY ENVELOPE...</p>
      </div>
    );
  }

  // RENDER ACCESS DENIED IF NOT ADMIN
  if (!user || !user.isAdmin) {
    return (
      <div style={{ background: "#030303", color: "white", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
          <div style={{ maxWidth: "520px", width: "100%", background: "rgba(20, 10, 10, 0.4)", border: "1px solid rgba(239, 68, 68, 0.25)", borderRadius: "32px", padding: "48px 40px", textAlign: "center" }}>
            <ShieldAlert size={48} color="#ef4444" style={{ margin: "0 auto 20px auto" }} />
            <h1 style={{ fontSize: "28px", fontWeight: "950", color: "white", margin: "0 0 12px 0" }}>ACCESS DENIED</h1>
            <p style={{ color: "#ef4444", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", margin: "0 0 20px 0" }}>PROTOCOL VIOLATION [403]</p>
            <Link to="/" style={{ textDecoration: "none" }}><button style={{ background: "#ef4444", color: "white", border: "none", padding: "12px 32px", borderRadius: "100px", fontWeight: "900" }}>RETURN TO PORTAL</button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter lists based on search and drop-downs
  const getFilteredItems = () => {
    if (activeTab === "records") {
      return records.filter(rec => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || (rec.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || rec.category.toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
      });
    } else if (activeTab === "users") {
      return users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase()) || (u.username || "").toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "events") {
      return events.filter(ev => ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.location.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "products") {
      return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "contacts") {
      return contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return [];
  };

  const filteredItems = getFilteredItems();

  return (
    <div style={{ 
      background: "#030303", color: "white", minHeight: "100vh", fontFamily: "'Outfit', sans-serif",
      backgroundImage: "radial-gradient(circle at 50% -10%, rgba(255, 85, 0, 0.1) 0%, transparent 60%)",
      overflowX: "hidden", paddingTop: "80px"
    }}>
      <Navbar />

      {/* Main Layout Grid */}
      <section className="container" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", padding: "40px 0 80px 0" }}>
        
        {/* Left Column: Cyber Dashboard Sidebar Controls */}
        <div style={{ position: "sticky", top: "110px", height: "fit-content", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Main Title Shield */}
          <div style={{ background: "rgba(255,85,0,0.02)", border: "1px solid rgba(255, 85, 0, 0.2)", borderRadius: "20px", padding: "20px", textAlign: "center" }}>
            <ShieldCheck size={28} color="#FF5500" style={{ margin: "0 auto 10px auto" }} />
            <h3 style={{ fontSize: "14px", fontWeight: "950", letterSpacing: "1px", margin: 0, textTransform: "uppercase" }}>ADJUDICATOR SUITE</h3>
            <span style={{ fontSize: "10px", color: "#666", fontWeight: "700" }}>VERSION 2.4 SECURE</span>
          </div>

          {/* Navigation Control List */}
          <div style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { val: "records", label: "VERIFICATION HUB", icon: <Trophy size={16} /> },
              { val: "users", label: "USERS REGISTRY", icon: <User size={16} /> },
              { val: "events", label: "EVENTS SCHEDULING", icon: <Calendar size={16} /> },
              { val: "products", label: "SHOP INVENTORY", icon: <ShoppingBag size={16} /> },
              { val: "contacts", label: "SUPPORT MESSAGES", icon: <Mail size={16} /> }
            ].map(tab => (
              <button
                key={tab.val}
                onClick={() => { setActiveTab(tab.val); setSearchQuery(""); }}
                style={{
                  background: activeTab === tab.val ? "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)" : "transparent",
                  border: "none",
                  color: activeTab === tab.val ? "white" : "#888",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: "900",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  textAlign: "left",
                  transition: "all 0.25s"
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* SQL Activation Protocol Card */}
          <div style={{ 
            background: "rgba(255, 85, 0, 0.03)", 
            border: "1px solid rgba(255, 85, 0, 0.12)", 
            borderRadius: "20px", 
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            <h4 style={{ fontSize: "11px", fontWeight: "950", color: "#FF5500", letterSpacing: "1.0px", margin: 0, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={13} /> ROLE ELEVATION FLOW
            </h4>
            <p style={{ fontSize: "11px", color: "#888", margin: 0, lineHeight: "1.4" }}>
              To elevate a registered staff member to Adjudicator, execute this script in Supabase:
            </p>
            <pre style={{ 
              background: "#08080a", 
              border: "1px solid rgba(255,255,255,0.04)", 
              borderRadius: "8px", 
              padding: "10px", 
              fontSize: "10px", 
              color: "#ffc8a0", 
              margin: 0,
              overflowX: "auto",
              fontFamily: "monospace",
              lineHeight: "1.3"
            }}>
{`-- DEDICATED ADMIN ROLE
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@rogue.com';`}
            </pre>
          </div>

          {/* Database Control Status */}
          <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 20px", fontSize: "11px", color: "#666" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}><span>Database Host</span><span style={{ color: "#22c55e", fontWeight: "900" }}>ONLINE</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span>Server Ping</span><span style={{ color: "#22c55e", fontWeight: "900" }}>14ms</span></div>
          </div>

        </div>

        {/* Right Column: Premium Active Table View */}
        <div>
          
          {/* Action Header bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1px", margin: 0 }}>
                {activeTab === "records" ? "Athlete Submissions" : activeTab === "users" ? "Database Users" : activeTab === "events" ? "Sporting Events" : activeTab === "products" ? "Store Inventory" : "Customer Inquiries"}
              </h2>
              <p style={{ color: "#555", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                SECURE ACCESS TABLE FOR COLLECTION '{activeTab.toUpperCase()}'
              </p>
            </div>

            {activeTab !== "contacts" && (
              <button 
                onClick={() => openModal("add")}
                style={{
                  background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: "900",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 10px 20px rgba(255, 85, 0, 0.25)"
                }}
                className="btn-glow-neon"
              >
                <Plus size={16} /> ADD ENTRY
              </button>
            )}
          </div>

          {/* Filtering Panel */}
          <div style={{ 
            background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", 
            padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" 
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Search size={14} color="#555" />
              <input
                type="text"
                placeholder={`Search current list...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "260px" }}
              />
            </div>

            {activeTab === "records" && (
              <div style={{ display: "flex", gap: "12px" }}>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px" }}>
                  <option value="all">All Categories</option>
                  <option value="strength">Strength</option>
                  <option value="speed">Speed</option>
                  <option value="endurance">Endurance</option>
                  <option value="agility">Agility</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px" }}>
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>

          {/* Main Cyber Table list */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
              <Loader2 className="animate-spin" size={36} color="#FF5500" />
              <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>QUERYING SUPABASE TABLE...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
              <HardDrive size={36} color="#555" style={{ marginBottom: "16px" }} />
              <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>TABLE EMPTY</h4>
              <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>No records match your query.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto", background: "rgba(13,13,16,0.3)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "24px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#666", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>
                    <th style={{ padding: "20px 24px" }}>Main Info</th>
                    <th style={{ padding: "20px 24px" }}>Additional Metadata</th>
                    <th style={{ padding: "20px 24px" }}>Verification / Value</th>
                    <th style={{ padding: "20px 24px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map(item => (
                    <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "all 0.2s" }} className="table-row-hover">
                      
                      {/* Column 1: Core Details */}
                      <td style={{ padding: "20px 24px" }}>
                        {activeTab === "records" && (
                          <div>
                            <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.title}</div>
                            <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", marginTop: "4px" }}>{item.category}</div>
                          </div>
                        )}
                        {activeTab === "users" && (
                          <div>
                            <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.name}</div>
                            <div style={{ color: "#aaa", fontSize: "12px", marginTop: "2px" }}>{item.email}</div>
                          </div>
                        )}
                        {activeTab === "events" && (
                          <div>
                            <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.title}</div>
                            <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>{item.location}</div>
                          </div>
                        )}
                        {activeTab === "products" && (
                          <div>
                            <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.name}</div>
                            <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", marginTop: "4px" }}>{item.category}</div>
                          </div>
                        )}
                        {activeTab === "contacts" && (
                          <div>
                            <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.subject}</div>
                            <div style={{ color: "#aaa", fontSize: "11px", marginTop: "2px" }}>From: {item.name} ({item.email})</div>
                          </div>
                        )}
                      </td>

                      {/* Column 2: Additional Metadata */}
                      <td style={{ padding: "20px 24px" }}>
                        {activeTab === "records" && (
                          <div style={{ color: "#aaa" }}>
                            <div style={{ fontSize: "11px" }}>Submitted: {new Date(item.created_at).toLocaleDateString()}</div>
                            {item.venue_name && <div style={{ fontSize: "11px", marginTop: "2px" }}>Venue: {item.venue_name}</div>}
                          </div>
                        )}
                        {activeTab === "users" && (
                          <div style={{ color: "#aaa" }}>
                            {item.username && <div style={{ fontSize: "11px" }}>Username: @{item.username}</div>}
                            {item.phone && <div style={{ fontSize: "11px", marginTop: "2px" }}>Phone: {item.phone}</div>}
                          </div>
                        )}
                        {activeTab === "events" && (
                          <div style={{ color: "#aaa" }}>
                            <div style={{ fontSize: "12px" }}>Date: {new Date(item.date).toLocaleDateString()}</div>
                          </div>
                        )}
                        {activeTab === "products" && (
                          <div style={{ color: "#aaa" }}>
                            <div style={{ fontSize: "12px" }}>Stock: {item.stock_count} units</div>
                          </div>
                        )}
                        {activeTab === "contacts" && (
                          <div style={{ color: "#888", maxWidth: "280px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.message}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Biometric/Verification/Price metric value */}
                      <td style={{ padding: "20px 24px" }}>
                        {activeTab === "records" && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <div style={{ fontSize: "16px", fontWeight: "900", color: "white" }}>{item.value} {item.unit}</div>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <span style={{
                                color: item.status === "verified" ? "#22c55e" : item.status === "rejected" ? "#ef4444" : "#ffcc00",
                                fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px"
                              }}>
                                {item.status}
                              </span>
                              {(item.paymentStatus || item.payment_status) && (
                                <span style={{
                                  background: (item.paymentStatus || item.payment_status).toLowerCase() === "paid" ? "rgba(34,197,94,0.15)" : 
                                              (item.paymentStatus || item.payment_status).toLowerCase() === "failed" ? "rgba(239,68,68,0.15)" : "rgba(255,204,0,0.15)",
                                  color: (item.paymentStatus || item.payment_status).toLowerCase() === "paid" ? "#22c55e" : 
                                         (item.paymentStatus || item.payment_status).toLowerCase() === "failed" ? "#ef4444" : "#ffcc00",
                                  padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", textTransform: "uppercase"
                                }}>
                                  PAY: {(item.paymentStatus || item.payment_status).replace('_', ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        {activeTab === "users" && (
                          <div>
                            <span style={{
                              background: item.is_admin ? "rgba(255,85,0,0.15)" : "rgba(255,255,255,0.03)",
                              color: item.is_admin ? "#FF5500" : "#888",
                              border: `1px solid ${item.is_admin ? "rgba(255,85,0,0.3)" : "rgba(255,255,255,0.05)"}`,
                              padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900"
                            }}>
                              {item.is_admin ? "SYSTEM ADMIN" : "ATHLETE"}
                            </span>
                          </div>
                        )}
                        {activeTab === "events" && <div style={{ fontSize: "14px", fontWeight: "800", color: "white" }}>LIVE MATCH</div>}
                        {activeTab === "products" && <div style={{ fontSize: "16px", fontWeight: "900", color: "white" }}>${item.price}</div>}
                        {activeTab === "contacts" && <div style={{ fontSize: "11px", color: "#555" }}>Received: {new Date(item.created_at).toLocaleDateString()}</div>}
                      </td>

                      {/* Column 4: CRUD Actions Buttons */}
                      <td style={{ padding: "20px 24px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "8px" }}>
                          
                          {/* Special records verification handles */}
                          {activeTab === "records" && item.status === "pending" && (
                            <>
                              <button onClick={() => handleQuickAdjudicate(item.id, "verified")} style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>VERIFY</button>
                              <button onClick={() => handleQuickAdjudicate(item.id, "rejected")} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>REJECT</button>
                            </>
                          )}

                          {activeTab !== "contacts" && (
                            <button 
                              onClick={() => openModal("edit", item)}
                              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#aaa", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}
                              className="hover-white"
                            >
                              <Edit3 size={13} />
                            </button>
                          )}

                          <button 
                            onClick={() => handleDelete(item.id)}
                            style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)", color: "#f87171", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}
                            className="hover-danger"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </section>

      {/* ==================== SECURE CRUD FORM MODAL ==================== */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(255, 85, 0, 0.15)", width: "100%", maxWidth: "640px", borderRadius: "28px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "modalFadeIn 0.3s ease-out" }}>
            
            {/* Modal Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "950", margin: 0, textTransform: "uppercase", color: "white" }}>
                  {modalType === "add" ? `ADD NEW ${activeTab.toUpperCase()}` : `EDIT ${activeTab.toUpperCase()} DETAILS`}
                </h3>
                <span style={{ fontSize: "11px", color: "#555" }}>SECURE DIRECT DATABASE CRUD WRITER</span>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
              <div style={{ padding: "32px", overflowY: "auto", maxHeight: "60vh", display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* 1. RECORDS TAB FORM */}
                {activeTab === "records" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>RECORD TITLE</label>
                      <input type="text" value={recordForm.title} onChange={(e) => setRecordForm({ ...recordForm, title: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DIVISION CATEGORY</label>
                        <select value={recordForm.category} onChange={(e) => setRecordForm({ ...recordForm, category: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                          <option value="Strength">Strength</option>
                          <option value="Speed">Speed</option>
                          <option value="Endurance">Endurance</option>
                          <option value="Agility">Agility</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>VERIFICATION STATUS</label>
                        <select value={recordForm.status} onChange={(e) => setRecordForm({ ...recordForm, status: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>RECORD METRIC VALUE</label>
                        <input type="text" value={recordForm.value} onChange={(e) => setRecordForm({ ...recordForm, value: e.target.value })} required placeholder="e.g. 180" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>METRIC UNIT</label>
                        <input type="text" value={recordForm.unit} onChange={(e) => setRecordForm({ ...recordForm, unit: e.target.value })} required placeholder="e.g. kg or seconds" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EVIDENCE MEDIA URL</label>
                      <input type="url" value={recordForm.evidenceUrl} onChange={(e) => setRecordForm({ ...recordForm, evidenceUrl: e.target.value })} placeholder="https://youtube.com/watch?v=..." style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>RECORD DESCRIPTION</label>
                      <textarea value={recordForm.description} onChange={(e) => setRecordForm({ ...recordForm, description: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px", fontFamily: "inherit" }} />
                    </div>
                  </>
                )}

                {/* 2. USERS TAB FORM */}
                {activeTab === "users" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>NAME</label>
                        <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EMAIL</label>
                        <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>USERNAME</label>
                        <input type="text" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>ROLE SELECT</label>
                        <select value={userForm.is_admin ? "true" : "false"} onChange={(e) => setUserForm({ ...userForm, is_admin: e.target.value === "true" })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                          <option value="false">Standard Athlete</option>
                          <option value="true">System Administrator</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>WEIGHT ({userForm.weight_unit})</label>
                        <input type="text" value={userForm.weight} onChange={(e) => setUserForm({ ...userForm, weight: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>HEIGHT ({userForm.height_unit})</label>
                        <input type="text" value={userForm.height} onChange={(e) => setUserForm({ ...userForm, height: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>COUNTRY</label>
                        <input type="text" value={userForm.country} onChange={(e) => setUserForm({ ...userForm, country: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>CITY</label>
                        <input type="text" value={userForm.city} onChange={(e) => setUserForm({ ...userForm, city: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                  </>
                )}

                {/* 3. EVENTS TAB FORM */}
                {activeTab === "events" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EVENT TITLE</label>
                      <input type="text" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EVENT DATE & TIME</label>
                        <input type="datetime-local" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", colorScheme: "dark" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>LOCATION</label>
                        <input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required placeholder="e.g. London Arena" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EVENT IMAGE URL</label>
                      <input type="url" value={eventForm.imageUrl} onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })} placeholder="https://images.unsplash.com/..." style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EVENT DESCRIPTION</label>
                      <textarea value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px", fontFamily: "inherit" }} />
                    </div>
                  </>
                )}

                {/* 4. PRODUCTS TAB FORM */}
                {activeTab === "products" && (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PRODUCT NAME</label>
                        <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PRODUCT PRICE ($)</label>
                        <input type="number" step="0.01" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>CATALOG CATEGORY</label>
                        <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                          <option value="Accessories">Accessories</option>
                          <option value="Apparel">Apparel</option>
                          <option value="Equipment">Equipment</option>
                          <option value="Supplements">Supplements</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>STOCK INVENTORY COUNT</label>
                        <input type="number" value={productForm.stockCount} onChange={(e) => setProductForm({ ...productForm, stockCount: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PRODUCT IMAGE URL</label>
                      <input type="url" value={productForm.imageUrl} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} placeholder="https://..." style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PRODUCT DESCRIPTION</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px", fontFamily: "inherit" }} />
                    </div>
                  </>
                )}

              </div>

              {/* Modal Footer */}
              <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "flex-end", gap: "14px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.04)", color: "#ccc", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}>CANCEL</button>
                <button type="submit" disabled={modalLoading} style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)", color: "white", border: "none", padding: "12px 32px", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: modalLoading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }} className="btn-glow-neon">
                  {modalLoading ? "SAVING..." : "SAVE ENTRY"}
                  {modalLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <Footer />

      {/* Styled Inline Hover Animations */}
      <style>{`
        .table-row-hover:hover {
          background: rgba(255, 255, 255, 0.015) !important;
        }

        .btn-glow-neon:hover {
          box-shadow: 0 0 20px rgba(255, 85, 0, 0.4) !important;
          transform: translateY(-1.5px);
        }

        .hover-white:hover {
          background: rgba(255,255,255,0.08) !important;
          color: white !important;
        }

        .hover-danger:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.4) !important;
          transform: translateY(-1px);
        }

        @keyframes modalFadeIn {
          0% { transform: scale(0.96); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Admin;
