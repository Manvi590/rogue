import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  ShieldAlert, Trophy, X, Eye, Calendar, 
  User, Users, Search, Filter, 
  AlertTriangle, CheckCircle, Video, FileText, Loader2, 
  Sparkles, Trash2, Edit3, Plus, ShoppingBag, Mail, HardDrive, Ticket, Layers, Folder,
  ArrowRight, Bell, Settings, LogOut, LayoutDashboard, BarChart3, MoreVertical,
  Activity, Zap, Timer, Network, Component, TrendingUp, DollarSign
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/api";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  // const navigate = useNavigate(); // Unused
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Admin View Tab: "records" | "users" | "events" | "products" | "tickets"
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "dashboard");
  const [recordsSubTab, setRecordsSubTab] = useState("submissions"); // "submissions" | "categories" | "ageGroups"
  const [usersSubTab, setUsersSubTab] = useState("registry"); // "registry" | "inquiries"

  // Synchronize state with "?tab=..." search query parameter from URL
  useEffect(() => {
    const tabQuery = searchParams.get("tab");
    if (tabQuery) {
      if (tabQuery === "user" || tabQuery === "users") {
        setActiveTab("users");
      } else if (tabQuery === "submissions") {
        setActiveTab("records");
        setRecordsSubTab("submissions");
      } else if (tabQuery === "categories") {
        setActiveTab("records");
        setRecordsSubTab("categories");
      } else if (tabQuery === "divisions") {
        setActiveTab("records");
        setRecordsSubTab("ageGroups");
      } else if (tabQuery === "challenges") {
        setActiveTab("events");
      } else if (tabQuery === "payments") {
        setActiveTab("revenue");
      } else {
        setActiveTab(tabQuery);
      }
    } else {
      setActiveTab("dashboard");
    }
  }, [searchParams]);

  // Data collections state
  const [records, setRecords] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [products, setProducts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [membershipStats, setMembershipStats] = useState(null);
  // const [tierConfigs, setTierConfigs] = useState({}); // Unused

  // UI States
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // CRUD Modal Control
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add"); // "add" or "edit"
  const [modalTarget, setModalTarget] = useState(null); // The item being edited
  const [modalLoading, setModalLoading] = useState(false);

  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);

  const handleOpenRecordDetailModal = (record) => {
    setSelectedRecordDetail(record);
    setIsRecordDetailModalOpen(true);
  };

  // Dynamic Form states bound to inputs
  const [recordForm, setRecordForm] = useState({ title: "", category: "Strength", description: "", value: "", unit: "", status: "pending", evidenceUrl: "", venueName: "", city: "", recordType: "standard", userId: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "athlete", membershipType: "free_athlete", accountStatus: "active", username: "", phone: "", gender: "male", dob: "", weight: "", height: "", country: "", city: "" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", location: "", imageUrl: "", isPaid: false, ticketPrice: 0 });
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "", category: "Accessories", stockCount: "" });
  const [membershipForm, setMembershipForm] = useState({ userId: "", tier: "bronze", autoRenew: false, paymentAmount: 0 });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", parent: "", active: true });
  const [ageGroupForm, setAgeGroupForm] = useState({ name: "", minAge: "", maxAge: "", description: "", active: true });

  // User action modal state
  const [userActionModal, setUserActionModal] = useState({ isOpen: false, type: null, userId: null, userName: "" }); // type: "suspend", "ban", "resetPassword", "activity"
  const [userActivity, setUserActivity] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDuration, setSuspendDuration] = useState("7"); // days

  // Toast notifications & custom confirm dialogues states
  const [toast, setToast] = useState(null); // { message, type: "success" | "error" | "info" }
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null });
  const [tempPassword, setTempPassword] = useState("");

  // Membership action modal state
  const [membershipActionModal, setMembershipActionModal] = useState({ isOpen: false, type: null, membershipId: null, membershipUser: null }); // type: "renew", "cancel", "upgrade", "payments"
  const [membershipPaymentHistory, setMembershipPaymentHistory] = useState([]);
  const [renewalReason, setRenewalReason] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [selectedUpgradeTier, setSelectedUpgradeTier] = useState("gold");
  const [membershipAmount, setMembershipAmount] = useState(0);

  // Security gate check
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      console.warn("Unauthorized access to administrative dashboard.");
    }
  }, [user, authLoading]);

  // Show beautiful inline custom toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Show custom modal dialogue instead of native confirm
  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  // Intercept native browser alert with our stunning custom toast
  const alert = (message) => {
    const msgLower = String(message).toLowerCase();
    const isError = msgLower.includes("fail") || msgLower.includes("error") || msgLower.includes("invalid") || msgLower.includes("must be") || msgLower.includes("required");
    const isSuccess = msgLower.includes("success") || msgLower.includes("seeded") || msgLower.includes("created") || msgLower.includes("deleted") || msgLower.includes("restored") || msgLower.includes("done");
    
    showToast(message, isError ? "error" : isSuccess ? "success" : "info");
  };

  // Unified Data Query Orchestrator
  const fetchData = async () => {
    if (!user || !user.isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      if (activeTab === "records") {
        const [recData, catData, ageData] = await Promise.all([
          apiCall("/records/admin/submissions", "GET", null, user.token),
          apiCall("/categories", "GET", null, user.token).catch(() => ({ flat: [] })),
          apiCall('/age-groups', 'GET', null, user.token).catch(() => ({ ageGroups: [] }))
        ]);
        setRecords(recData || []);
        setCategories(catData.flat || catData.categories || []);
        setAgeGroups(ageData.ageGroups || []);
      } else if (activeTab === "users") {
        const [usersData, contactsData] = await Promise.all([
          apiCall("/dashboard/users/list/all", "GET", null, user.token).catch(() => ({ users: [] })),
          apiCall("/admin/contacts", "GET", null, user.token).catch(() => [])
        ]);
        setUsers(usersData.users || []);
        setContacts(contactsData || []);
      } else if (activeTab === "events") {
        const data = await apiCall("/admin/events", "GET", null, user.token);
        setEvents(data || []);
      } else if (activeTab === "products") {
        const data = await apiCall("/admin/products", "GET", null, user.token);
        setProducts(data || []);
      } else if (activeTab === "dashboard" || activeTab === "revenue") {
        const [membData, statsData, dashData, eventsData] = await Promise.all([
          apiCall("/memberships?page=1&limit=100", "GET", null, user.token).catch(() => ({ memberships: [] })),
          apiCall("/memberships/stats/overview", "GET", null, user.token).catch(() => null),
          apiCall("/dashboard/dashboard", "GET", null, user.token).catch(() => null),
          apiCall("/admin/events", "GET", null, user.token).catch(() => [])
        ]);
        setMemberships(membData.memberships || []);
        setMembershipStats(statsData);
        // setTierConfigs(tierData || {}); // Unused
        setDashboardStats(dashData);
        if (activeTab === "dashboard") setEvents(eventsData || []);
      }
    } catch (err) {
      console.error(`Error loading ${activeTab}:`, err);
      setError(err.message || `Failed to fetch administrative data for ${activeTab}.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activeTab]);

  // Lock background scroll when any modal is open to prevent scroll chaining
  useEffect(() => {
    const isAnyModalOpen = isModalOpen || userActionModal.isOpen || membershipActionModal.isOpen || confirmModal.isOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen, userActionModal.isOpen, membershipActionModal.isOpen, confirmModal.isOpen]);

  // DELETE operation handler
  const executeDelete = async (id) => {
    try {
      let endpoint = "";
      if (activeTab === "records") {
        if (recordsSubTab === "submissions") endpoint = `/admin/records/${id}`;
        else if (recordsSubTab === "categories") endpoint = `/categories/${id}`;
        else if (recordsSubTab === "ageGroups") endpoint = `/age-groups/${id}`;
      }
      else if (activeTab === "users") endpoint = `/admin/users/${id}`;
      else if (activeTab === "events") endpoint = `/admin/events/${id}`;
      else if (activeTab === "products") endpoint = `/admin/products/${id}`;
      else if (activeTab === "contacts") endpoint = `/admin/contacts/${id}`;

      await apiCall(endpoint, "DELETE", null, user.token);

      // Instantly update UI State
      if (activeTab === "records") {
        if (recordsSubTab === "submissions") setRecords(prev => prev.filter(x => x.id !== id));
        else if (recordsSubTab === "categories") setCategories(prev => prev.filter(x => (x._id || x.id) !== id));
        else if (recordsSubTab === "ageGroups") setAgeGroups(prev => prev.filter(x => (x._id || x.id) !== id));
      }
      else if (activeTab === "users") setUsers(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "events") setEvents(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "products") setProducts(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "contacts") setContacts(prev => prev.filter(x => x.id !== id));
      alert("Deleted successfully");
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  const handleDelete = (id) => {
    showConfirm(
      "❌ DELETE PERMANENTLY",
      "Are you absolutely sure you want to delete this item? This action is irreversible.",
      () => executeDelete(id)
    );
  };

  // Open Modal Helper
  const openModal = (type, item = null) => {
    setModalType(type);
    setModalTarget(item);
    
    if (activeTab === "records") {
      if (recordsSubTab === "submissions") {
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
      } else if (recordsSubTab === "categories") {
        if (type === "edit" && item) {
          setCategoryForm({
            name: item.name || "",
            description: item.description || "",
            parent: item.parent || "",
            active: !!item.active
          });
        } else {
          setCategoryForm({ name: "", description: "", parent: "", active: true });
        }
      } else if (recordsSubTab === "ageGroups") {
        if (type === "edit" && item) {
          setAgeGroupForm({
            name: item.name || "",
            minAge: item.minAge || "",
            maxAge: item.maxAge || "",
            description: item.description || "",
            active: !!item.active
          });
        } else {
          setAgeGroupForm({ name: "", minAge: "", maxAge: "", description: "", active: true });
        }
      }
    } else if (activeTab === "users") {
      if (type === "edit" && item) {
        setUserForm({
          name: item.name || "",
          email: item.email || "",
          password: "",
          role: item.role || (item.isAdmin ? "system_admin" : "athlete"),
          membershipType: item.membershipType || "free_athlete",
          accountStatus: item.accountStatus || item.account_status || "active",
          username: item.username || "",
          phone: item.phone || "",
          gender: item.gender || "male",
          dob: item.dob ? new Date(item.dob).toISOString().split("T")[0] : "",
          weight: item.weight || "",
          height: item.height || "",
          country: item.country || "",
          city: item.city || ""
        });
      } else {
        setUserForm({ name: "", email: "", password: "", role: "athlete", membershipType: "free_athlete", accountStatus: "active", username: "", phone: "", gender: "male", dob: "", weight: "", height: "", country: "", city: "" });
      }
    } else if (activeTab === "events") {
      if (type === "edit" && item) {
        setEventForm({
          title: item.title || "",
          description: item.description || "",
          date: item.date ? item.date.split(".")[0] : "",
          location: item.location || "",
          imageUrl: item.image_url || "",
          isPaid: item.is_paid || false,
          ticketPrice: item.ticket_price || 0
        });
      } else {
        setEventForm({ title: "", description: "", date: "", location: "", imageUrl: "", isPaid: false, ticketPrice: 0 });
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
      let endpoint = "";
      let method = modalType === "add" ? "POST" : "PUT";
      let payload = {};

      if (activeTab === "users") {
        // Use dashboard endpoints for user management
        endpoint = `/dashboard/users${modalType === "edit" && modalTarget ? `/${modalTarget._id || modalTarget.id}` : ""}`;
        payload = {
          name: userForm.name,
          email: userForm.email,
          username: userForm.username,
          phone: userForm.phone,
          gender: userForm.gender,
          dob: userForm.dob,
          country: userForm.country,
          city: userForm.city,
          role: userForm.role,
          membershipType: userForm.membershipType,
          accountStatus: userForm.accountStatus,
          isAdmin: userForm.role === 'system_admin'
        };
        // Only include password for new users
        if (modalType === "add" && userForm.password) {
          payload.password = userForm.password;
        }
      } else if (activeTab === "records") {
        if (recordsSubTab === "submissions") {
          endpoint = `/admin/records${modalType === "edit" && modalTarget ? `/${modalTarget.id}` : ""}`;
          payload = recordForm;
        } else if (recordsSubTab === "categories") {
          endpoint = `/categories${modalType === "edit" && modalTarget ? `/${modalTarget._id || modalTarget.id}` : ""}`;
          payload = {
            name: categoryForm.name,
            description: categoryForm.description,
            parent: categoryForm.parent || undefined,
            active: categoryForm.active
          };
          if (modalType === "edit") method = "PUT";
        } else if (recordsSubTab === "ageGroups") {
          endpoint = `/age-groups${modalType === "edit" && modalTarget ? `/${modalTarget._id || modalTarget.id}` : ""}`;
          payload = {
            name: ageGroupForm.name,
            minAge: Number(ageGroupForm.minAge),
            maxAge: ageGroupForm.maxAge === "" ? undefined : Number(ageGroupForm.maxAge),
            description: ageGroupForm.description,
            active: ageGroupForm.active
          };
          if (modalType === "edit") method = "PUT";
        }
      } else if (activeTab === "events") {
        endpoint = `/admin/events${modalType === "edit" && modalTarget ? `/${modalTarget.id}` : ""}`;
        payload = eventForm;
      } else if (activeTab === "products") {
        endpoint = `/admin/products${modalType === "edit" && modalTarget ? `/${modalTarget.id}` : ""}`;
        payload = productForm;
      } else if (activeTab === "revenue") {
        if (modalType === "add") {
          endpoint = "/memberships";
          payload = membershipForm;
        } else {
          endpoint = `/memberships/${modalTarget.id || modalTarget._id}`;
          payload = membershipForm;
          method = "PUT";
        }
      }

      if (!endpoint) throw new Error("Invalid endpoint");

      await apiCall(endpoint, method, payload, user.token);

      // Reload dataset dynamically
      fetchData();
      setIsModalOpen(false);
      
      // Reset forms
      if (activeTab === "users") {
        setUserForm({ name: "", email: "", password: "", isAdmin: false, username: "", phone: "", gender: "male", dob: "", weight: "", height: "", country: "", city: "" });
      }
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
      showToast(`Record status updated to ${status.toUpperCase()} successfully`, "success");
    } catch (err) {
      showToast(`Quick adjudication failed: ${err.message}`, "error");
    }
  };

  // User action handlers
  const handleSuspendUser = async (userId) => {
    if (!suspendReason.trim()) {
      alert("Please provide a suspension reason");
      return;
    }
    try {
      const suspendUntil = new Date();
      suspendUntil.setDate(suspendUntil.getDate() + parseInt(suspendDuration || 7));

      await apiCall(`/dashboard/users/${userId}/suspend`, "PUT", {
        reason: suspendReason,
        suspendedUntil: suspendUntil.toISOString()
      }, user.token);

      fetchData();
      setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" });
      setSuspendReason("");
      setSuspendDuration("7");
      alert("User suspended successfully");
    } catch (err) {
      alert(`Failed to suspend user: ${err.message}`);
    }
  };

  const handleBanUser = (userId, userName) => {
    setUserActionModal({ isOpen: true, type: "ban", userId, userName });
  };

  const openResetPasswordModal = (userId, userName) => {
    setTempPassword("");
    setUserActionModal({ isOpen: true, type: "resetPassword", userId, userName });
  };

  const handleResetPassword = async (userId) => {
    if (!tempPassword || tempPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    try {
      await apiCall(`/dashboard/users/${userId}/reset-password`, "PUT", {
        password: tempPassword
      }, user.token);

      setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" });
      alert(`Password reset successfully. Temporary password: ${tempPassword}`);
      setTempPassword("");
    } catch (err) {
      alert(`Failed to reset password: ${err.message}`);
    }
  };

  const handleViewActivity = async (userId) => {
    try {
      const activity = await apiCall(`/dashboard/users/${userId}/activity`, "GET", null, user.token);
      setUserActivity(activity);
      setUserActionModal({ isOpen: true, type: "activity", userId, userName: activity.user?.name || "Unknown" });
    } catch (err) {
      alert(`Failed to fetch user activity: ${err.message}`);
    }
  };

  // Membership action handlers

  const handleRenewMembership = async (membershipId, amount = 0) => {
    try {
      await apiCall(`/memberships/${membershipId}/renew`, "PUT", { paymentAmount: amount || 0 }, user.token);
      fetchData();
      setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null });
      setMembershipAmount(0);
      alert("Membership renewed successfully");
    } catch (err) {
      alert(`Failed to renew membership: ${err.message}`);
    }
  };

  const handleCancelMembership = async (membershipId) => {
    if (!cancellationReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }
    try {
      await apiCall(`/memberships/${membershipId}/cancel`, "PUT", { reason: cancellationReason }, user.token);
      fetchData();
      setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null });
      setCancellationReason("");
      alert("Membership cancelled successfully");
    } catch (err) {
      alert(`Failed to cancel membership: ${err.message}`);
    }
  };

  const handleUpgradeMembership = async (membershipId, newTier) => {
    try {
      await apiCall(`/memberships/${membershipId}/change-tier`, "PUT", { newTier, refundAmount: 0 }, user.token);
      fetchData();
      setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null });
      alert(`Membership upgraded to ${newTier}`);
    } catch (err) {
      alert(`Failed to upgrade membership: ${err.message}`);
    }
  };

  const handleViewPaymentHistory = async (membershipId) => {
    try {
      const payments = await apiCall(`/memberships/${membershipId}/payments`, "GET", null, user.token);
      setMembershipPaymentHistory(payments.paymentHistory);
      setMembershipActionModal({ isOpen: true, type: "payments", membershipId, membershipUser: payments.user?.name || "Unknown" });
    } catch (err) {
      alert(`Failed to fetch payment history: ${err.message}`);
    }
  };

  // Category handlers
  const executeDeleteCategory = async (id) => {
    try {
      await apiCall(`/categories/${id}`, 'DELETE', {}, user.token);
      fetchData();
      alert('Category deleted');
    } catch (err) {
      alert(`Failed to delete category: ${err.message}`);
    }
  };

  const handleDeleteCategory = (id) => {
    showConfirm(
      "🗑️ DELETE CATEGORY",
      "Delete this category? This cannot be undone.",
      () => executeDeleteCategory(id)
    );
  };

  const executeSeedCategories = async () => {
    try {
      await apiCall('/categories/seed', 'GET', null, user.token);
      fetchData();
      alert('Default categories seeded');
    } catch (err) {
      alert(`Failed to seed categories: ${err.message}`);
    }
  };

  const handleSeedCategories = () => {
    showConfirm(
      "🌱 SEED CATEGORIES",
      "Seed default categories (will create missing ones)?",
      () => executeSeedCategories()
    );
  };

  // Age group handlers
  const executeDeleteAgeGroup = async (id) => {
    try {
      await apiCall(`/age-groups/${id}`, 'DELETE', {}, user.token);
      fetchData();
      alert('Age group deleted');
    } catch (err) {
      alert(`Failed to delete age group: ${err.message}`);
    }
  };

  const handleDeleteAgeGroup = (id) => {
    showConfirm(
      "🗑️ DELETE AGE GROUP",
      "Delete this age group? This cannot be undone.",
      () => executeDeleteAgeGroup(id)
    );
  };

  const executeSeedAgeGroups = async () => {
    try {
      await apiCall('/age-groups/seed', 'GET', null, user.token);
      fetchData();
      alert('Default age groups seeded');
    } catch (err) {
      alert(`Failed to seed age groups: ${err.message}`);
    }
  };

  const handleSeedAgeGroups = () => {
    showConfirm(
      "🌱 SEED AGE GROUPS",
      "Seed default age groups (will create missing ones)?",
      () => executeSeedAgeGroups()
    );
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
    const query = searchQuery ? searchQuery.toLowerCase() : "";
    if (activeTab === "records") {
      return records.filter(rec => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || (rec.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || (rec.category || "").toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" || ((rec.status || "").toLowerCase() === statusFilter.toLowerCase());
        return matchesSearch && matchesCategory && matchesStatus;
      });
    } else if (activeTab === "users") {
      if (usersSubTab === "registry") {
        return users.filter(user => 
          user.name?.toLowerCase().includes(query) || 
          user.email?.toLowerCase().includes(query)
        );
      } else {
        return contacts.filter(c => c.name?.toLowerCase().includes(query) || c.email?.toLowerCase().includes(query) || c.subject?.toLowerCase().includes(query));
      }
    } else if (activeTab === "events") {
      return events.filter(e => 
        e.title?.toLowerCase().includes(query) || 
        e.location?.toLowerCase().includes(query)
      );
    } else if (activeTab === "products") {
      return products.filter(p => p.name?.toLowerCase().includes(query));
    }
    return [];
  };

  const filteredItems = getFilteredItems();

  const handleKpiCardClick = (metricKey) => {
    switch (metricKey) {
      case 'users':
        setSearchParams({ tab: 'users' });
        setActiveTab('users');
        break;
      case 'records':
        setSearchParams({ tab: 'records' });
        setActiveTab('records');
        setRecordsSubTab('submissions');
        break;
      case 'events':
        setSearchParams({ tab: 'events' });
        setActiveTab('events');
        break;
      case 'products':
        setSearchParams({ tab: 'products' });
        setActiveTab('products');
        break;
      case 'categories':
        setSearchParams({ tab: 'records' });
        setActiveTab('records');
        setRecordsSubTab('categories');
        break;
      case 'age_groups':
        setSearchParams({ tab: 'records' });
        setActiveTab('records');
        setRecordsSubTab('ageGroups');
        break;
      case 'memberships':
        setSearchParams({ tab: 'revenue' });
        setActiveTab('revenue');
        setTimeout(() => document.getElementById('memberships-table')?.scrollIntoView({ behavior: 'smooth' }), 500);
        break;
      case 'tickets':
        setSearchParams({ tab: 'revenue' });
        setActiveTab('revenue');
        setTimeout(() => document.getElementById('tickets-table')?.scrollIntoView({ behavior: 'smooth' }), 500);
        break;
      default:
        // Optional default handler
        break;
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ 
        display: "flex", minHeight: "100vh", background: "#050505", color: "white", fontFamily: "'Outfit', sans-serif",
        overflow: "hidden"
      }}>
        {/* Main Content Area */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", position: "relative" }}>
          
          {/* Top Navbar */}
          <header style={{ padding: "16px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "rgba(5,5,5,0.8)", backdropFilter: "blur(12px)", zIndex: 10 }}>
          <div style={{ position: "relative", width: "400px" }}>
            <Search size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
            <input type="text" placeholder="Search records, users, or payments..." style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "10px 16px 10px 42px", color: "white", fontSize: "13px", outline: "none" }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><Bell size={20} /></button>
            <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><Settings size={20} /></button>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderLeft: "1px solid rgba(255,255,255,0.1)", paddingLeft: "20px" }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: "900", color: "white" }}>Admin Staff</div>
                <div style={{ fontSize: "11px", color: "#888" }}>Super Admin</div>
              </div>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FF5500", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "16px" }}>
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ padding: "32px", flex: 1, maxWidth: "1200px", margin: "0 auto", width: "100%" }}>

          {/* ==================== DASHBOARD OVERVIEW ==================== */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>Performance Overview</h1>
                <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Real-time monitoring of Rogue World Records global network.</p>
              </div>

              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "24px" }}>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,85,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF5500" }}>
                      <Users size={20} />
                    </div>
                    <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "4px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: "800" }}>Users</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Total Users</div>
                  <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>{dashboardStats?.counts?.users?.toLocaleString() || 0}</div>
                </div>

                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                      <FileText size={20} />
                    </div>
                    <span style={{ background: "rgba(255,106,0,0.15)", color: "#FF6A00", padding: "4px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: "800" }}>Attention</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Pending Submissions</div>
                  <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>{dashboardStats?.counts?.records || 0}</div>
                </div>

                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(34,197,94,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
                      <CheckCircle size={20} />
                    </div>
                    <span style={{ color: "#666", fontSize: "11px", fontWeight: "800" }}>Lifetime</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Approved Records</div>
                  <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>{dashboardStats?.counts?.evidence || 0}</div>
                </div>

                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,106,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FF6A00" }}>
                      <Ticket size={20} />
                    </div>
                    <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "4px 8px", borderRadius: "100px", fontSize: "11px", fontWeight: "800" }}>Revenue</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px" }}>Total Payments</div>
                  <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>${(membershipStats?.totalRevenue || (dashboardStats?.counts?.memberships * 10) || 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Chart & Recent Activity */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>
                
                {/* Chart Box */}
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", position: "relative", minHeight: "360px", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 4px 0" }}>Submissions Over Time</h3>
                      <div style={{ fontSize: "12px", color: "#888" }}>Monthly breakdown of record attempts</div>
                    </div>
                    <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700" }}>Last 6 Months</button>
                  </div>
                  <div style={{ flex: 1, position: "relative", width: "100%", display: "flex", alignItems: "flex-end" }}>
                    {/* SVG Chart mimic */}
                    <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="rgba(255,85,0,0.3)" />
                          <stop offset="100%" stopColor="rgba(255,85,0,0)" />
                        </linearGradient>
                      </defs>
                      <path d="M0,150 C50,140 100,160 150,140 C200,100 250,50 300,50 C350,50 400,120 450,120 C480,120 500,40 500,40 L500,200 L0,200 Z" fill="url(#chartGradient)" />
                      <path d="M0,150 C50,140 100,160 150,140 C200,100 250,50 300,50 C350,50 400,120 450,120 C480,120 500,40 500,40" fill="none" stroke="#FF5500" strokeWidth="3" />
                      <circle cx="150" cy="140" r="4" fill="#000" stroke="#FF5500" strokeWidth="2" />
                      <circle cx="300" cy="50" r="4" fill="#000" stroke="#FF5500" strokeWidth="2" />
                      <circle cx="500" cy="40" r="4" fill="#000" stroke="#FF5500" strokeWidth="2" />
                    </svg>
                    <div style={{ position: "absolute", bottom: "0", left: "0", right: "0", display: "flex", justifyContent: "space-between", color: "#666", fontSize: "10px", fontWeight: "700", paddingTop: "10px" }}>
                      <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "900", margin: 0 }}>Recent Activity</h3>
                    <button onClick={() => { setActiveTab('records'); setRecordsSubTab('submissions'); }} style={{ background: 'transparent', border: 'none', color: "#FF5500", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>View All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {dashboardStats?.recentSubmissions?.slice(0, 3).map((sub, idx) => (
                      <div key={`sub-${idx}`} style={{ display: "flex", gap: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#222", overflow: "hidden", flexShrink: 0 }}>
                          <img src={`https://ui-avatars.com/api/?name=${sub.title}&background=random`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar" />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.4" }}>New submission for <strong style={{ color: "white" }}>{sub.title}</strong></div>
                          <div style={{ fontSize: "11px", color: "#666", margin: "4px 0" }}>{new Date(sub.created_at).toLocaleDateString()}</div>
                          <span style={{ background: sub.status === 'pending' ? "rgba(59,130,246,0.15)" : (sub.status === 'rejected' ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)"), color: sub.status === 'pending' ? "#3b82f6" : (sub.status === 'rejected' ? "#ef4444" : "#22c55e"), padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "800", textTransform: "uppercase" }}>
                            {sub.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dashboardStats?.recentUsers?.slice(0, 1).map((usr, idx) => (
                      <div key={`usr-${idx}`} style={{ display: "flex", gap: "12px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#222", overflow: "hidden", flexShrink: 0 }}>
                          <img src={`https://ui-avatars.com/api/?name=${usr.name}&background=random`} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Avatar" />
                        </div>
                        <div>
                          <div style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.4" }}><strong style={{ color: "white" }}>{usr.name}</strong> joined the platform</div>
                          <div style={{ fontSize: "11px", color: "#666", margin: "4px 0" }}>{new Date(usr.created_at).toLocaleDateString()}</div>
                          <span style={{ background: "rgba(168,85,247,0.15)", color: "#a855f7", padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "800", textTransform: "uppercase" }}>New User</span>
                        </div>
                      </div>
                    ))}
                    {(!dashboardStats?.recentSubmissions?.length && !dashboardStats?.recentUsers?.length) && (
                      <div style={{ color: "#888", fontSize: "13px" }}>No recent activity found.</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Trending Challenges */}
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>Trending Challenges</h3>
                  <button onClick={() => { setActiveTab('events'); }} style={{ background: "transparent", border: "1px solid #FF5500", color: "#FF5500", padding: "8px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>Manage Challenges</button>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {events && events.length > 0 ? events.slice(0, 3).map((ev, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", padding: "16px 0", borderBottom: idx < Math.min(events.length - 1, 2) ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                      <div style={{ fontSize: "24px", fontWeight: "950", color: idx === 0 ? "#FF5500" : (idx === 1 ? "#FF6A00" : "#FF8800"), width: "40px" }}>0{idx + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "15px", fontWeight: "800", color: "white", marginBottom: "2px" }}>{ev.title}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>Location: {ev.location || 'Global'} • {new Date(ev.date).toLocaleDateString()}</div>
                      </div>
                      <div style={{ textAlign: "right", marginRight: "16px" }}>
                        <div style={{ fontSize: "13px", fontWeight: "800", color: "white", marginBottom: "2px" }}>Active</div>
                        <div style={{ fontSize: "10px", color: idx === 0 ? "#FF5500" : "#888", fontWeight: "900", letterSpacing: "0.5px", textTransform: "uppercase" }}>{idx === 0 ? 'TRENDING 🔥' : 'STEADY'}</div>
                      </div>
                      <ArrowRight size={16} color="#666" />
                    </div>
                  )) : (
                    <div style={{ color: "#888", fontSize: "13px", padding: "16px 0" }}>No active challenges found. Data connected.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================== 1. RECORDS & SUBMISSIONS OVERHAUL ==================== */}
          {activeTab === "records" && (

            <div>
              {recordsSubTab === "submissions" && (
                <div>
                  {/* Header Title with glowing status badge */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                    <div>
                      <h2 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>Submissions Management</h2>
                      <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "600px", lineHeight: "1.5" }}>
                        Review and verify new record attempts from around the world.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Filter size={16} /> Filter
                      </button>
                      <button style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        <ArrowRight size={16} /> Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
                    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Total Pending</div>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: "#FF6A00", marginBottom: "8px" }}>
                        {records.filter(r => r.status === 'pending').length}
                      </div>
                      <div style={{ color: "#22c55e", fontSize: "12px", fontWeight: "700" }}>↗ 12% from last week</div>
                    </div>
                    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Avg Review Time</div>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "8px" }}>4.2h</div>
                      <div style={{ color: "#888", fontSize: "12px", fontWeight: "700" }}>Internal SLA: 24h</div>
                    </div>
                    <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Verified Today</div>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "8px" }}>
                        {records.filter(r => r.status === 'verified').length}
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        {records.filter(r => r.status === 'verified').slice(0,3).map((r, i) => (
                          <img key={i} src={`https://ui-avatars.com/api/?name=${r.user?.name || 'A'}&background=random`} alt="Avatar" style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #111", marginLeft: i > 0 ? "-8px" : "0" }} />
                        ))}
                      </div>
                    </div>
                    <div style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", borderRadius: "16px", padding: "24px", color: "white" }}>
                      <div style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", marginBottom: "12px", opacity: 0.9 }}>High Priority</div>
                      <div style={{ fontSize: "32px", fontWeight: "950", marginBottom: "8px" }}>03</div>
                      <div style={{ fontSize: "12px", fontWeight: "700", opacity: 0.9 }}>Requires immediate verification</div>
                    </div>
                  </div>

                  {/* Main Table */}
                  <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "12px", fontWeight: "800", textAlign: "left" }}>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>USER</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>RECORD TITLE</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800", textAlign: "center" }}>CATEGORY</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800", textAlign: "center" }}>STATUS</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800", textAlign: "center" }}>PAYMENT</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>SUBMITTED</th>
                          <th style={{ padding: "0 0 16px 0", fontWeight: "800", textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px" }}><Loader2 className="animate-spin" size={24} color="#FF5500" /></td></tr>
                        ) : records.length === 0 ? (
                          <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "#888" }}>No submissions found</td></tr>
                        ) : records.slice(0, 10).map((r, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                              <img src={`https://ui-avatars.com/api/?name=${r.user?.name || 'Athlete'}&background=random`} alt={r.user?.name || 'User'} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                              <div>
                                <div style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>{r.user?.name || "Rogue Athlete"}</div>
                                <div style={{ color: "#666", fontSize: "11px", marginTop: "2px" }}>{r.user?.email || "athlete@rogue.com"}</div>
                              </div>
                            </td>
                            <td style={{ padding: "16px 0" }}>
                              <div style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>{r.title}</div>
                              <div style={{ color: "#888", fontSize: "11px", marginTop: "2px", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Video size={10} /> {r.evidence_url ? 'Video evidence attached' : 'Photos verified'}
                              </div>
                            </td>
                            <td style={{ padding: "16px 0", textAlign: "center" }}>
                              <span style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", padding: "4px 8px", borderRadius: "100px", fontSize: "9px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                {r.category || "General"}
                              </span>
                            </td>
                            <td style={{ padding: "16px 0", textAlign: "center" }}>
                              <span style={{ 
                                background: r.status === 'pending' ? "rgba(255,106,0,0.15)" : r.status === 'verified' ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", 
                                color: r.status === 'pending' ? "#FF6A00" : r.status === 'verified' ? "#22c55e" : "#ef4444", 
                                padding: "4px 8px", 
                                borderRadius: "100px", 
                                fontSize: "10px", 
                                fontWeight: "900",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                textTransform: "uppercase"
                              }}>
                                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: r.status === 'pending' ? "#FF6A00" : r.status === 'verified' ? "#22c55e" : "#ef4444" }}></div>
                                {r.status === 'verified' ? 'Approved' : r.status}
                              </span>
                            </td>
                            <td style={{ padding: "16px 0", textAlign: "center" }}>
                              {(() => {
                                const paymentStatus = r.record_meta?.[0]?.admin_notes?.includes('paid') ? 'Paid' : 'Pending';
                                return (
                                  <span style={{ 
                                    background: paymentStatus === 'Pending' ? "rgba(255,255,255,0.05)" : "rgba(34,197,94,0.15)", 
                                    color: paymentStatus === 'Pending' ? "#888" : "#22c55e", 
                                    padding: "4px 8px", 
                                    borderRadius: "100px", 
                                    fontSize: "10px", 
                                    fontWeight: "900",
                                    display: "inline-flex",
                                    textTransform: "uppercase"
                                  }}>
                                    {paymentStatus}
                                  </span>
                                );
                              })()}
                            </td>
                            <td style={{ padding: "16px 0", color: "#aaa", fontSize: "13px" }}>
                              {new Date(r.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </td>
                            <td style={{ padding: "16px 0", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                {r.status === "pending" && (
                                  <>
                                    <button onClick={() => handleQuickAdjudicate(r.id, "verified")} style={{ background: "#FF5500", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>Approve</button>
                                    <button onClick={() => handleQuickAdjudicate(r.id, "rejected")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "800" }}>Request Changes</button>
                                  </>
                                )}
                                {r.status === "verified" && (
                                  <button onClick={() => handleOpenRecordDetailModal(r)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "800" }}>View Details</button>
                                )}
                                {r.status === "rejected" && (
                                  <button onClick={() => handleOpenRecordDetailModal(r)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "800" }}>Appeal Log</button>
                                )}
                                <button onClick={() => handleDelete(r.id)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "4px" }}>
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {/* Pagination */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "700" }}>
                        Showing 1-{Math.min(10, records.length)} of {records.length} results
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>&lt;</button>
                        <button style={{ background: "#FF5500", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>1</button>
                        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>2</button>
                        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>3</button>
                        <span style={{ color: "#888", display: "flex", alignItems: "center" }}>...</span>
                        <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>&gt;</button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Cards: Activity Log & Tip */}
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                    <div style={{ background: "#111", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                        <div style={{ color: "#FF5500" }}><Calendar size={20} /></div>
                        <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>Activity Log</h3>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e", marginTop: "6px" }}></div>
                          <div>
                            <div style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>System approved "Highest Vertical Jump" by Marcus Thorne</div>
                            <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Today, 2:45 PM • Automated Verification passed</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF6A00", marginTop: "6px" }}></div>
                          <div>
                            <div style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>Julian West uploaded new video evidence</div>
                            <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Today, 1:12 PM • 4K_pushup_verification.mp4</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "16px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444", marginTop: "6px" }}></div>
                          <div>
                            <div style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>Admin Alex Rivers rejected Sarah Chen's submission</div>
                            <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Yesterday, 4:55 PM • Reason: Inconsistent metadata</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #111 100%)", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 12px 0", color: "white" }}>Record Review Tip</h3>
                      <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
                        Always check the frame rate of video submissions to ensure no "speed-ramping" has been applied to athletic feats.
                      </p>
                      <div>
                        <a href="#" style={{ color: "#FF5500", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          READ REVIEW GUIDELINES <ArrowRight size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Categories Sub-Tab rendering */}
              {recordsSubTab === "categories" && (
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                    <div>
                      <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                        Administration Engine
                      </div>
                      <h2 style={{ fontSize: "36px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-1px", textTransform: "uppercase" }}>
                        Category<br />Management
                      </h2>
                      <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "450px", lineHeight: "1.6" }}>
                        Control the foundational pillars of the Rogue World Records ecosystem. Audit, expand, and monitor global category performance in real-time.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "20px" }}>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ color: "#888", fontSize: "11px", fontWeight: "800", letterSpacing: "1px" }}>TOTAL RECORDS</div>
                        <div style={{ color: "#FF5500", fontSize: "18px", fontWeight: "900" }}>{records.length.toLocaleString()}</div>
                      </div>
                      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "100px", display: "flex", alignItems: "center", gap: "16px" }}>
                        <div style={{ color: "#888", fontSize: "11px", fontWeight: "800", letterSpacing: "1px" }}>ACTIVE CATS</div>
                        <div style={{ color: "#FF5500", fontSize: "18px", fontWeight: "900" }}>{categories.filter(c => c.active !== false).length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Categories Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "24px", marginBottom: "40px" }}>
                    {categories.length === 0 ? (
                      <div style={{ gridColumn: "span 6", padding: "80px", textAlign: "center", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <Layers size={48} color="#FF5500" style={{ marginBottom: "16px" }} />
                        <h3 style={{ color: "white", fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0" }}>NO CATEGORIES FOUND</h3>
                        <p style={{ color: "#888", fontSize: "14px", margin: "0 0 24px 0" }}>Create your first foundational category to start classifying records.</p>
                        <button onClick={() => openModal("add")} style={{ background: "#FF5500", color: "white", border: "none", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <Plus size={16} /> ADD CATEGORY
                        </button>
                      </div>
                    ) : categories.map((cat, index) => {
                      // Dynamic layout: first is huge (span 4), second is large (span 2), rest are medium (span 2)
                      const isFirstRow = index < 2;
                      const colSpan = index === 0 ? 4 : 2;
                      const height = isFirstRow ? "360px" : "260px";
                      
                      // Assign relevant high-quality sports images based on index
                      const bgImages = [
                        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop", // Strength/Gym
                        "https://images.unsplash.com/photo-1552674605-1e16977fb794?q=80&w=1472&auto=format&fit=crop", // Endurance/Running
                        "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=1470&auto=format&fit=crop", // Combat/Boxing
                        "https://images.unsplash.com/photo-1563823251-4045f09623e1?q=80&w=1470&auto=format&fit=crop", // Urban/Parkour
                        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=1470&auto=format&fit=crop", // Winter/Snow
                        "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop"  // General Athletics
                      ];
                      const bgImage = bgImages[index % bgImages.length];

                      return (
                        <div key={cat._id || index} style={{ 
                          gridColumn: `span ${colSpan}`,
                          height: height,
                          position: "relative", 
                          borderRadius: "24px", 
                          overflow: "hidden",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                          transition: "transform 0.2s"
                        }}>
                          {/* Background Image */}
                          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                          {/* Dark overlay gradient */}
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)" }} />
                          
                          {/* Content */}
                          <div style={{ position: "relative", zIndex: 1, padding: "32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            {/* Top row */}
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <span style={{ 
                                background: "rgba(0,0,0,0.4)", 
                                border: "1px solid rgba(255,255,255,0.05)", 
                                color: cat.active !== false ? "#FF5500" : "#888", 
                                padding: "6px 16px", 
                                borderRadius: "100px", 
                                fontSize: "10px", 
                                fontWeight: "900", 
                                letterSpacing: "1px",
                                backdropFilter: "blur(8px)" 
                              }}>
                                {cat.active !== false ? (index === 0 ? "ACTIVE" : index === 2 ? "STABLE" : index === 3 ? "EXPANDING" : index === 4 ? "SEASONAL" : "ACTIVE") : "INACTIVE"}
                              </span>
                              
                              <div style={{ display: "flex", gap: "8px" }}>
                                <button onClick={() => openModal("edit", cat)} style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} className="hover-bg-white-10">
                                  <Edit3 size={16} />
                                </button>
                                {index === 0 && (
                                  <button style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "36px", height: "36px", borderRadius: "50%", cursor: "pointer", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Zap size={16} />
                                  </button>
                                )}
                                {index === 1 && (
                                  <button style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding: "8px" }}>
                                    <MoreVertical size={20} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Bottom row */}
                            <div>
                              <h3 style={{ 
                                fontSize: colSpan === 4 ? "48px" : "32px", 
                                fontWeight: "950", 
                                color: "white", 
                                textTransform: "uppercase", 
                                margin: "0 0 20px 0", 
                                letterSpacing: "-1.5px",
                                lineHeight: "1"
                              }}>
                                {cat.name}
                              </h3>
                              
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                <div>
                                  <div style={{ color: "#aaa", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "6px" }}>{colSpan === 4 ? "ACTIVE RECORDS" : "RECORDS"}</div>
                                  <div style={{ color: "white", fontSize: "24px", fontWeight: "900" }}>
                                    {records.filter(r => r.category === cat.name || r.category?.toLowerCase() === cat.name.toLowerCase()).length || Math.floor(Math.random() * 5000)}
                                  </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                  <div style={{ color: "#aaa", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "6px" }}>{colSpan === 4 ? "GROWTH" : "DELTA"}</div>
                                  <div style={{ color: index === 4 ? "#ef4444" : "#22c55e", fontSize: "18px", fontWeight: "900" }}>
                                    {index === 4 ? "-" : "+"}{(Math.random() * 15).toFixed(1)}%
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Category Button Row */}
                  {categories.length > 0 && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button onClick={() => openModal("add")} style={{ background: "#FF5500", color: "white", border: "none", padding: "16px 32px", borderRadius: "100px", fontSize: "14px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 10px 20px rgba(255,85,0,0.3)" }}>
                        <Plus size={18} /> Add New Category
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Age Groups / Divisions Sub-Tab rendering */}
              {recordsSubTab === "ageGroups" && (
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                    <div>
                      <h2 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>Management Console</h2>
                      <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>
                        Control the foundational structures of Rogue World Records.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button style={{ background: "transparent", color: "#FF5500", border: "1px solid #FF5500", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                        Export Schema
                      </button>
                      <button onClick={() => openModal("add")} style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                        Add Component
                      </button>
                    </div>
                  </div>

                  {/* Division Management Section */}
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <Network size={20} color="#FF5500" />
                      <h3 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>Division Management</h3>
                    </div>
                    
                    {ageGroups.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", background: "#111", borderRadius: "16px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                        <p style={{ color: "#888", fontWeight: "700" }}>No Divisions / Age Groups found.</p>
                      </div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                        {ageGroups.map((g, i) => {
                          const isPrimary = g.name?.toLowerCase().includes("adult") && !g.name?.toLowerCase().includes("young");
                          return (
                            <div key={g._id || i} style={{ 
                              background: "#111", 
                              border: isPrimary ? "2px solid #FF5500" : "1px solid rgba(255,255,255,0.05)", 
                              borderRadius: "16px", 
                              padding: "24px",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              minHeight: "180px"
                            }}>
                              <div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                  <span style={{ 
                                    background: isPrimary ? "#FF5500" : "rgba(255,85,0,0.1)", 
                                    color: isPrimary ? "white" : "#FF5500", 
                                    padding: "4px 8px", 
                                    borderRadius: "4px", 
                                    fontSize: "10px", 
                                    fontWeight: "900",
                                    textTransform: "uppercase"
                                  }}>
                                    {isPrimary ? "PRIMARY" : (g.active ? "ACTIVE" : "INACTIVE")}
                                  </span>
                                  <button onClick={() => openModal("edit", g)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><MoreVertical size={16} /></button>
                                </div>
                                <h4 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 8px 0", color: "white" }}>{g.name}</h4>
                                <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", margin: 0 }}>
                                  Ages {g.minAge}-{g.maxAge || '+'}. Foundational metric bracket for records.
                                </p>
                              </div>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
                                <span style={{ color: "#666", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>{categories.length} CATEGORIES</span>
                                <button onClick={() => openModal("edit", g)} style={{ background: "transparent", border: "none", color: "#FF5500", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                                  Manage <ArrowRight size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Bottom Grid: Categories & Weight Classes */}
                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
                    
                    {/* Categories Hierarchy */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Layers size={20} color="#FF5500" />
                          <h3 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>Categories Hierarchy</h3>
                        </div>
                        <button style={{ background: "transparent", border: "none", color: "#FF5500", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>Reorder All</button>
                      </div>

                      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "0" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>
                              <th style={{ padding: "20px 24px", textAlign: "left" }}>NAME</th>
                              <th style={{ padding: "20px 24px", textAlign: "center" }}>TOTAL RECORDS</th>
                              <th style={{ padding: "20px 24px", textAlign: "center" }}>GLOBAL RANK</th>
                              <th style={{ padding: "20px 24px", textAlign: "right" }}>ACTIONS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.length === 0 ? (
                              <tr><td colSpan="4" style={{ textAlign: "center", padding: "40px", color: "#888" }}>No categories found</td></tr>
                            ) : categories.slice(0, 5).map((cat, i) => (
                              <tr key={cat._id || i} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                <td style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "12px" }}>
                                  <div style={{ background: "rgba(255,85,0,0.1)", padding: "8px", borderRadius: "8px", color: "#FF5500", display: "flex" }}>
                                    {i % 4 === 0 ? <Activity size={16} /> : i % 4 === 1 ? <Zap size={16} /> : i % 4 === 2 ? <Timer size={16} /> : <Sparkles size={16} />}
                                  </div>
                                  <span style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{cat.name}</span>
                                </td>
                                <td style={{ padding: "16px 24px", textAlign: "center", color: "#aaa", fontSize: "13px", fontWeight: "600" }}>
                                  {Math.floor(Math.random() * 1000) + 100} {/* Dummy stat since we don't track total records per category yet */}
                                </td>
                                <td style={{ padding: "16px 24px", textAlign: "center", color: "#FF5500", fontSize: "13px", fontWeight: "900" }}>
                                  #{i + 1}
                                </td>
                                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", gap: "12px", color: "#666" }}>
                                    <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><Edit3 size={16} /></button>
                                    <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}><Trash2 size={16} /></button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button style={{ width: "100%", padding: "16px", background: "transparent", border: "none", borderTop: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <Plus size={16} /> Add New Category
                        </button>
                      </div>
                    </div>

                    {/* Weight Classes */}
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                        <Component size={20} color="#FF5500" />
                        <h3 style={{ fontSize: "20px", fontWeight: "900", margin: 0 }}>Weight Classes</h3>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "4px solid #FF5500", borderRadius: "12px", padding: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: "900", color: "white", margin: 0 }}>Lightweight</h4>
                            <span style={{ background: "rgba(255,255,255,0.1)", color: "#888", fontSize: "9px", fontWeight: "900", padding: "4px 8px", borderRadius: "4px" }}>LW</span>
                          </div>
                          <p style={{ color: "#666", fontSize: "11px", margin: "0 0 16px 0" }}>Weight limit up to 155 lbs (70.3 kg)</p>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#888", fontWeight: "800", marginBottom: "8px" }}>
                            <span>320 Registered</span>
                            <span>35% of total</span>
                          </div>
                          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                            <div style={{ width: "35%", height: "100%", background: "#FF5500", borderRadius: "2px" }}></div>
                          </div>
                        </div>

                        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "4px solid #FF5500", borderRadius: "12px", padding: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: "900", color: "white", margin: 0 }}>Middleweight</h4>
                            <span style={{ background: "rgba(255,255,255,0.1)", color: "#888", fontSize: "9px", fontWeight: "900", padding: "4px 8px", borderRadius: "4px" }}>MW</span>
                          </div>
                          <p style={{ color: "#666", fontSize: "11px", margin: "0 0 16px 0" }}>Weight limit 156 - 185 lbs (83.9 kg)</p>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#888", fontWeight: "800", marginBottom: "8px" }}>
                            <span>412 Registered</span>
                            <span>48% of total</span>
                          </div>
                          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                            <div style={{ width: "48%", height: "100%", background: "#FF5500", borderRadius: "2px" }}></div>
                          </div>
                        </div>

                        <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderLeft: "4px solid #FF5500", borderRadius: "12px", padding: "20px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                            <h4 style={{ fontSize: "16px", fontWeight: "900", color: "white", margin: 0 }}>Heavyweight</h4>
                            <span style={{ background: "rgba(255,255,255,0.1)", color: "#888", fontSize: "9px", fontWeight: "900", padding: "4px 8px", borderRadius: "4px" }}>HW</span>
                          </div>
                          <p style={{ color: "#666", fontSize: "11px", margin: "0 0 16px 0" }}>Weight 186 lbs+ (84 kg+)</p>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#888", fontWeight: "800", marginBottom: "8px" }}>
                            <span>155 Registered</span>
                            <span>17% of total</span>
                          </div>
                          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                            <div style={{ width: "17%", height: "100%", background: "#FF5500", borderRadius: "2px" }}></div>
                          </div>
                        </div>

                        <button style={{ background: "transparent", border: "1px dashed rgba(255,255,255,0.1)", color: "#888", padding: "20px", borderRadius: "12px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <Plus size={16} /> Define New Weight Class
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 2. USER MANAGEMENT OVERHAUL ==================== */}
          {activeTab === "users" && (
            <div>
              {/* Header Title with glowing status badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>Users</h2>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "600px", lineHeight: "1.5" }}>
                    Manage your global record-keeping community. Control permissions, verify identities, and monitor activity levels.
                  </p>
                </div>
                <button 
                  onClick={() => openModal("add")}
                  style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Add New User
                </button>
              </div>

              {/* Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Total Users</div>
                  <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "8px" }}>{users.length.toLocaleString()}</div>
                  <div style={{ color: "#22c55e", fontSize: "12px", fontWeight: "700" }}>↗ 12% from last month</div>
                </div>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Active Now</div>
                  <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "8px" }}>{users.filter(u => u.accountStatus === 'active' || u.account_status === 'active' || !u.account_status).length.toLocaleString() || '0'}</div>
                  <div style={{ color: "#888", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }}></div> Live sessions
                  </div>
                </div>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>New Applications</div>
                  <div style={{ fontSize: "32px", fontWeight: "950", color: "#FF6A00", marginBottom: "8px" }}>84</div>
                  <div style={{ color: "#888", fontSize: "12px", fontWeight: "700" }}>Pending verification</div>
                </div>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ fontSize: "12px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "12px" }}>Avg Participation</div>
                  <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "8px" }}>3.4</div>
                  <div style={{ color: "#888", fontSize: "12px", fontWeight: "700" }}>Records per user</div>
                </div>
              </div>

              {/* Main Table */}
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", margin: 0 }}>Registered Members</h3>
                    <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.05)", padding: "4px", borderRadius: "8px" }}>
                      <button style={{ background: "#222", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>All</button>
                      <button style={{ background: "transparent", border: "none", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Verified</button>
                      <button style={{ background: "transparent", border: "none", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700" }}>Pending</button>
                    </div>
                  </div>
                  <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <Filter size={14} /> More Filters
                  </button>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "12px", fontWeight: "800", textAlign: "left" }}>
                      <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>Name</th>
                      <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>Email Address</th>
                      <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>Joined Date</th>
                      <th style={{ padding: "0 0 16px 0", fontWeight: "800" }}>Status</th>
                      <th style={{ padding: "0 0 16px 0", fontWeight: "800", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 10).map((u, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: "12px" }}>
                          <img src={`https://ui-avatars.com/api/?name=${u.name}&background=random`} alt={u.name} style={{ width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" }} />
                          <div>
                            <div style={{ color: "white", fontSize: "14px", fontWeight: "700" }}>{u.name}</div>
                            <div style={{ color: "#666", fontSize: "11px", marginTop: "2px" }}>{u.is_admin ? "Admin" : "Athlete"} • {u.country || "Global"}</div>
                          </div>
                        </td>
                        <td style={{ padding: "16px 0", color: "#aaa", fontSize: "13px" }}>{u.email}</td>
                        <td style={{ padding: "16px 0", color: "#aaa", fontSize: "13px" }}>{new Date(u.created_at || new Date()).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                        <td style={{ padding: "16px 0" }}>
                          <span style={{ 
                            background: u.account_status === 'active' || !u.account_status ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.05)", 
                            color: u.account_status === 'active' || !u.account_status ? "#22c55e" : "#888", 
                            padding: "4px 8px", 
                            borderRadius: "100px", 
                            fontSize: "11px", 
                            fontWeight: "800",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px"
                          }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: u.account_status === 'active' || !u.account_status ? "#22c55e" : "#888" }}></div>
                            {(u.account_status || 'active').charAt(0).toUpperCase() + (u.account_status || 'active').slice(1)}
                          </span>
                        </td>
                        <td style={{ padding: "16px 0", textAlign: "right" }}>
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <button onClick={() => {
                                const actionsDiv = document.getElementById(`actions-${u.id}`);
                                if(actionsDiv) actionsDiv.style.display = actionsDiv.style.display === 'none' ? 'block' : 'none';
                              }} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", padding: "4px" }}>
                              <MoreVertical size={16} />
                            </button>
                            <div id={`actions-${u.id}`} style={{ display: 'none', position: 'absolute', right: 0, top: '100%', background: '#222', border: '1px solid #333', borderRadius: '8px', padding: '4px', zIndex: 10, width: '120px' }}>
                               <button onClick={() => openModal('edit', u)} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Edit User</button>
                               <button onClick={() => handleDelete(u.id)} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Delete</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontSize: "12px", color: "#888", fontWeight: "700" }}>
                    Showing 1-{Math.min(10, users.length)} of {users.length} users
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>&lt;</button>
                    <button style={{ background: "#FF5500", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>1</button>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>2</button>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}>3</button>
                    <span style={{ color: "#888", display: "flex", alignItems: "center" }}>...</span>
                    <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "#888", padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }}>&gt;</button>
                  </div>
                </div>
              </div>

              {/* Bottom Cards: Recent Activity & Need Help */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", margin: "0 0 24px 0" }}>Recent Activity</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#FF5500", marginTop: "6px" }}></div>
                      <div>
                        <div style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>New Record Verified</div>
                        <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Marcus Thorne completed 'Fastest 10k Carry'</div>
                        <div style={{ color: "#666", fontSize: "10px", fontWeight: "800", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>2 Mins Ago</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#888", marginTop: "6px" }}></div>
                      <div>
                        <div style={{ color: "white", fontSize: "14px", fontWeight: "800" }}>System Maintenance</div>
                        <div style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>Global server sync completed for APAC region</div>
                        <div style={{ color: "#666", fontSize: "10px", fontWeight: "800", marginTop: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>1 Hour Ago</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #111 100%)", borderRadius: "16px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <h3 style={{ fontSize: "24px", fontWeight: "950", margin: "0 0 12px 0", color: "white" }}>Need Help?</h3>
                  <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6", margin: "0 0 24px 0" }}>
                    Access our expert documentation on record verification protocols and admin security.
                  </p>
                  <div>
                    <a href="#" style={{ color: "#FF5500", fontSize: "14px", fontWeight: "800", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                      View Admin Guide <ArrowRight size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 3. CHALLENGES (formerly Events) ==================== */}
          {activeTab === "events" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Administration Panel
                  </div>
                  <h2 style={{ fontSize: "48px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-1.5px", textTransform: "uppercase", lineHeight: "1" }}>
                    CHALLENGES
                  </h2>
                </div>
                <button 
                  onClick={() => openModal("add")}
                  style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "13px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "12px" }}
                >
                  CREATE NEW CHALLENGE <Plus size={16} />
                </button>
              </div>

              {/* Top Stats Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }}>
                {/* Card 1 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", transform: "skew(-3deg)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ transform: "skew(3deg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>ACTIVE NOW</div>
                      <Zap size={20} color="#444" />
                    </div>
                    <div style={{ fontSize: "48px", fontWeight: "950", color: "#FF8866", lineHeight: "1", marginBottom: "16px" }}>{events.length > 0 ? events.length : 14}</div>
                    <div style={{ color: "#aaa", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                      <TrendingUp size={12} color="#aaa" /> +2 SINCE LAST WEEK
                    </div>
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", transform: "skew(-3deg)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ transform: "skew(3deg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>PARTICIPANTS</div>
                      <Users size={20} color="#444" />
                    </div>
                    <div style={{ fontSize: "48px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px" }}>{users.length}</div>
                    <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ width: "100%", height: "100%", background: "#FF5500", borderRadius: "2px" }} />
                    </div>
                  </div>
                </div>

                {/* Card 3 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", transform: "skew(-3deg)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ transform: "skew(3deg)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>TOTAL EVENTS</div>
                      <Trophy size={20} color="#444" />
                    </div>
                    <div style={{ fontSize: "48px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>{events.length}</div>
                    <div style={{ color: "#aaa", fontSize: "11px", fontWeight: "800" }}>ACTIVE NOW</div>
                  </div>
                </div>
              </div>

              {/* Roster Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: "950", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                  CURRENT ROSTER
                </h3>
                <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <button style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>ALL</button>
                  <button style={{ background: "transparent", color: "#888", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>ACTIVE</button>
                  <button style={{ background: "transparent", color: "#888", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>SCHEDULED</button>
                </div>
              </div>

              {/* Loading & Empty States */}
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px", fontWeight: "800" }}>LOADING ROSTER...</p>
                </div>
              ) : events.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                  <Trophy size={48} color="#444" style={{ marginBottom: "16px" }} />
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "18px", color: "white", fontWeight: "900" }}>NO CHALLENGES ACTIVE</h4>
                  <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Create a new challenge to populate the roster.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {events.map((item, index) => {
                    const fallbackImages = [
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1552674605-1e16977fb794?q=80&w=1472&auto=format&fit=crop",
                      "https://images.unsplash.com/photo-1563823251-4045f09623e1?q=80&w=1470&auto=format&fit=crop"
                    ];
                    const bgImg = item.image_url || item.imageUrl || fallbackImages[index % fallbackImages.length];
                    
                    // Determine status based on index for variety if real status isn't available
                    const isCompleted = index === 2;
                    const isScheduled = index === 1;
                    const isActive = !isCompleted && !isScheduled;

                    return (
                      <div key={item.id || index} style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        background: "rgba(255,255,255,0.02)", 
                        borderRadius: "20px", 
                        padding: "20px", 
                        border: "1px solid rgba(255,255,255,0.04)",
                        transition: "background 0.2s"
                      }} className="hover-bg-white-05">
                        
                        {/* Thumbnail */}
                        <div style={{ width: "180px", height: "100px", borderRadius: "12px", overflow: "hidden", marginRight: "32px", position: "relative" }}>
                          <img src={bgImg} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: isCompleted ? 0.5 : 1 }} />
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)" }} />
                        </div>

                        {/* Title & Info */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                            {isActive && <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", padding: "4px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", letterSpacing: "1px" }}>ACTIVE</span>}
                            {isScheduled && <span style={{ background: "rgba(59,130,246,0.15)", color: "#3b82f6", padding: "4px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", letterSpacing: "1px" }}>SCHEDULED</span>}
                            {isCompleted && <span style={{ background: "rgba(156,163,175,0.15)", color: "#9ca3af", padding: "4px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", letterSpacing: "1px" }}>COMPLETED</span>}
                            
                            <h3 style={{ fontSize: "20px", fontWeight: "950", color: isCompleted ? "#aaa" : "white", margin: 0, textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                              {item.title}
                            </h3>
                          </div>
                          <p style={{ color: "#aaa", fontSize: "13px", margin: 0, maxWidth: "400px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {item.description || "No description provided."}
                          </p>
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", gap: "48px", marginRight: "48px" }}>
                          <div>
                            <div style={{ color: "#777", fontSize: "9px", fontWeight: "900", letterSpacing: "1px", marginBottom: "6px" }}>
                              {isCompleted ? "FINAL FINISHERS" : "PARTICIPANTS"}
                            </div>
                            <div style={{ color: "white", fontSize: "16px", fontWeight: "900" }}>
                              {Math.floor(Math.random() * 2000)} {isScheduled && <span style={{ fontSize: "12px", color: "#888", fontWeight: "700" }}>(Waitlist)</span>}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: "#777", fontSize: "9px", fontWeight: "900", letterSpacing: "1px", marginBottom: "6px" }}>
                              {isCompleted ? "TOTAL PAYOUT" : "PRIZE POOL"}
                            </div>
                            <div style={{ color: isCompleted ? "white" : "#FF5500", fontSize: "16px", fontWeight: "900" }}>
                              ${item.ticket_price ? (item.ticket_price * 1000).toLocaleString() : (Math.floor(Math.random() * 30) * 1000).toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: "flex", gap: "16px", paddingLeft: "32px", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                          {isScheduled && <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={14} /></button>}
                          {isCompleted && <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart2 size={14} /></button>}
                          
                          <button onClick={() => openModal("edit", item)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} className="hover-bg-white-10">
                            {isCompleted ? <Eye size={14} /> : <Edit3 size={14} />}
                          </button>
                          
                          {!isCompleted && (
                            <>
                              <button style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.05)", color: "white", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} className="hover-bg-white-10">
                                <Eye size={14} />
                              </button>
                              <button onClick={() => handleDelete(item.id)} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} className="hover-bg-red-20">
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 4. PRODUCTS & SHOP INVENTORY ==================== */}
          {activeTab === "products" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0 }}>
                    🛍️ Products & Shop Inventory
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    MANAGE THE ROGUE OFFICIAL MERCHANDISE AND STOCK
                  </p>
                </div>
                <button 
                  onClick={() => openModal("add")}
                  style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> ADD PRODUCT
                </button>
              </div>

              {/* Products Filter bar */}
              <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 24px", marginBottom: "24px", display: "flex", alignItems: "center" }}>
                <Search size={14} color="#555" style={{ marginRight: "12px" }} />
                <input
                  type="text"
                  placeholder="Search merchandise catalog by product name or division..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "100%" }}
                />
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>QUERYING MERCHANDISE CATALOG...</p>
                </div>
              ) : products.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                  <ShoppingBag size={36} color="#555" style={{ marginBottom: "16px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>SHOP CATALOG EMPTY</h4>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                  {products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).map(item => {
                    const stock = item.stock_count || item.stockCount || 0;
                    const isOutOfStock = stock === 0;
                    const isLowStock = stock > 0 && stock <= 10;
                    
                    return (
                      <div key={item.id} style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "24px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.25s" }}>
                        
                        {/* Product image thumbnail */}
                        <div style={{ height: "200px", position: "relative", background: "#050507" }}>
                          {item.image_url || item.imageUrl ? (
                            <img src={item.image_url || item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#222" }}><ShoppingBag size={48} /></div>
                          )}
                          {/* Price Tag Overlay */}
                          <div style={{ position: "absolute", top: "16px", left: "16px" }}>
                            <span style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,85,0,0.3)", padding: "6px 12px", borderRadius: "100px", fontSize: "14px", fontWeight: "950", color: "#FF5500" }}>
                              ${item.price}
                            </span>
                          </div>
                          {/* Stock status tag */}
                          <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                            <span style={{
                              background: isOutOfStock ? "rgba(239,68,68,0.85)" : isLowStock ? "rgba(255,204,0,0.85)" : "rgba(34,197,94,0.85)",
                              backdropFilter: "blur(8px)",
                              color: isLowStock ? "black" : "white",
                              padding: "4px 10px",
                              borderRadius: "100px",
                              fontSize: "9px",
                              fontWeight: "950",
                              textTransform: "uppercase"
                            }}>
                              {isOutOfStock ? "🔴 OUT OF STOCK" : isLowStock ? `🟡 LOW STOCK (${stock})` : "🟢 IN STOCK"}
                            </span>
                          </div>
                        </div>

                        {/* Product description block */}
                        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                          <span style={{ fontSize: "10px", color: "#FF6A00", fontWeight: "900", textTransform: "uppercase" }}>{item.category}</span>
                          <h4 style={{ fontSize: "16px", fontWeight: "900", color: "white", margin: 0 }}>{item.name}</h4>
                          <p style={{ fontSize: "11px", color: "#aaa", margin: 0, lineHeight: "1.4", flex: 1 }}>{item.description}</p>
                          
                          <div style={{ display: "flex", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "12px", marginTop: "4px" }}>
                            <button onClick={() => openModal("edit", item)} style={{ flex: 1, padding: "8px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }} className="btn-premium-edit"><Edit3 size={13} /> EDIT STOCK</button>
                            <button onClick={() => handleDelete(item.id)} style={{ padding: "8px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-delete"><Trash2 size={13} /></button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 5. TICKETS & REVENUE FINANCIAL SUITE ==================== */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0 }}>
                    📊 Global Database Metrics
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    REAL-TIME STATISTICS ACROSS ALL SUPABASE TABLES
                  </p>
                </div>
              </div>

              {/* KPI Grid Cards */}
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)", marginBottom: "40px" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>COMPUTING KPI METRICS...</p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>
                  {[
                    { key: 'users', label: 'Total Athletes', icon: <User size={24} />, color: '#FF5500' },
                    { key: 'records', label: 'Global Records', icon: <Trophy size={24} />, color: '#FF5500' },
                    { key: 'events', label: 'Live Events', icon: <Calendar size={24} />, color: '#FF5500' },
                    { key: 'products', label: 'Shop Products', icon: <ShoppingBag size={24} />, color: '#FF5500' },
                    { key: 'videos', label: 'Uploaded Videos', icon: <Video size={24} />, color: '#FF5500' },
                    { key: 'evidence', label: 'Evidence Files', icon: <Folder size={24} />, color: '#FF5500' },
                    { key: 'categories', label: 'Categories', icon: <Filter size={24} />, color: '#FF5500' },
                    { key: 'age_groups', label: 'Age Groups', icon: <Users size={24} />, color: '#FF5500' },
                    { key: 'memberships', label: 'Memberships', icon: <Sparkles size={24} />, color: '#FF5500' },
                    { key: 'tickets', label: 'Tickets', icon: <Ticket size={24} />, color: '#FF5500' },
                    { key: 'contact_messages', label: 'Contact Messages', icon: <Mail size={24} />, color: '#FF5500' },
                    { key: 'record_meta', label: 'Record Metadata', icon: <Layers size={24} />, color: '#FF5500' }
                  ].map((metric) => (
                    <div key={metric.key} className="kpi-card-hover" onClick={() => handleKpiCardClick(metric.key)} style={{ 
                      background: `rgba(13,13,16,0.5)`, 
                      border: `1px solid rgba(255,85,0,0.15)`, 
                      borderRadius: "20px", 
                      padding: "24px",
                      position: "relative",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: metric.color }}></div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{ color: metric.color, background: `${metric.color}20`, padding: "10px", borderRadius: "12px" }}>
                          {metric.icon}
                        </div>
                      </div>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: "white", marginBottom: "4px", fontFamily: "monospace" }}>
                        {dashboardStats?.counts?.[metric.key] || 0}
                      </div>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================== 6. TICKETS & REVENUE FINANCIAL SUITE ==================== */}
          {activeTab === "revenue" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Central Treasury
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    FINANCIAL
                    <br />OVERSIGHT
                  </h2>
                </div>
                <button 
                  style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "12px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}
                >
                  EXPORT REPORT <ArrowRight size={14} />
                </button>
              </div>

              {/* Financial Revenue Grid Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }}>
                {/* Card 1 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid #FF5500", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px" }}>TOTAL REVENUE</div>
                  <div style={{ fontSize: "48px", fontWeight: "950", color: "#FF5500", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>${(membershipStats?.totalRevenue || (dashboardStats?.counts?.memberships * 10) || 0).toLocaleString()}</div>
                  <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                    <TrendingUp size={12} color="#22c55e" /> +0% THIS MONTH
                  </div>
                </div>

                {/* Card 2 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>MEMBERSHIPS</div>
                    <CreditCard size={20} color="#444" />
                  </div>
                  <div style={{ fontSize: "48px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px" }}>{dashboardStats?.counts?.memberships || 0}</div>
                  <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: "white", borderRadius: "2px" }} />
                  </div>
                </div>

                {/* Card 3 */}
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                  <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px" }}>GLOBAL PRIZE POOL</div>
                  <div style={{ fontSize: "48px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>$1,200,000</div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                    <ShieldAlert size={12} /> Escrow Locked
                  </div>
                </div>
              </div>

              {/* Roster Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h3 style={{ fontSize: "24px", fontWeight: "950", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                  TRANSACTION LEDGER
                </h3>
                <div style={{ display: "flex", gap: "8px", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <button style={{ background: "#FF5500", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>ALL</button>
                  <button style={{ background: "transparent", color: "#888", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>PAID</button>
                  <button style={{ background: "transparent", color: "#888", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>PENDING</button>
                  <button style={{ background: "transparent", color: "#888", border: "none", padding: "6px 16px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}>FLAGGED</button>
                </div>
              </div>

              {/* Search */}
              <div style={{ position: "relative", marginBottom: "32px" }}>
                <Search size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="SEARCH BY ATHLETE OR CHALLENGE..." style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "100px", padding: "16px 16px 16px 48px", color: "white", fontSize: "11px", fontWeight: "800", outline: "none", letterSpacing: "1px" }} />
              </div>

              {/* Ledger Table */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", marginBottom: "56px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
                      <th style={{ padding: "24px", textAlign: "left" }}>ATHLETE</th>
                      <th style={{ padding: "24px", textAlign: "left" }}>CHALLENGE TYPE</th>
                      <th style={{ padding: "24px", textAlign: "left" }}>AMOUNT</th>
                      <th style={{ padding: "24px", textAlign: "left" }}>STATUS</th>
                      <th style={{ padding: "24px", textAlign: "right" }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "MARCUS REED", img: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=100&h=100", type: "DEADLIFT WORLD RECORD", amount: "$50,000", status: "PAID" },
                      { name: "SARAH CHEN", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100", type: "IRONMAN ELITE SPRINT", amount: "$12,500", status: "PENDING" },
                      { name: "VIKTOR VOLKOV", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100", type: "HEAVYWEIGHT GAUNTLET", amount: "$25,000", status: "FLAGGED" },
                      { name: "ELARA VANCE", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100", type: "VERTICAL SPEED CLIMB", amount: "$8,200", status: "PAID" },
                    ].map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }} className="table-row-hover">
                        <td style={{ padding: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
                          <img src={row.img} alt={row.name} style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover" }} />
                          <div style={{ color: "white", fontWeight: "900", letterSpacing: "0.5px" }}>{row.name}</div>
                        </td>
                        <td style={{ padding: "24px", color: "white", fontWeight: "900", fontSize: "11px", letterSpacing: "1px" }}>{row.type}</td>
                        <td style={{ padding: "24px", color: "#FF5500", fontWeight: "900", fontSize: "14px" }}>{row.amount}</td>
                        <td style={{ padding: "24px" }}>
                          <span style={{ 
                            background: row.status === "PAID" ? "rgba(34,197,94,0.1)" : row.status === "PENDING" ? "rgba(234,179,8,0.1)" : "rgba(239,68,68,0.1)", 
                            color: row.status === "PAID" ? "#22c55e" : row.status === "PENDING" ? "#eab308" : "#ef4444", 
                            padding: "6px 12px", borderRadius: "100px", fontWeight: "900", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px",
                            border: `1px solid ${row.status === "PAID" ? "rgba(34,197,94,0.2)" : row.status === "PENDING" ? "rgba(234,179,8,0.2)" : "rgba(239,68,68,0.2)"}`
                          }}>
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: "24px", textAlign: "right" }}>
                          <button style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "48px", alignItems: "center" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h4 style={{ fontSize: "20px", fontWeight: "950", color: "white", margin: "0 0 24px 0", textTransform: "uppercase", letterSpacing: "-0.5px" }}>PAYOUT VELOCITY</h4>
                  
                  <div style={{ marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px" }}>VERIFIED TRANSFERS</span>
                      <span style={{ fontSize: "10px", color: "white", fontWeight: "900" }}>88%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                      <div style={{ width: "88%", height: "100%", background: "linear-gradient(90deg, #FF5500, #ff8800)", borderRadius: "3px" }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px" }}>ESCROW RELEASE</span>
                      <span style={{ fontSize: "10px", color: "white", fontWeight: "900" }}>62%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                      <div style={{ width: "62%", height: "100%", background: "linear-gradient(90deg, #FF5500, #ff8800)", borderRadius: "3px" }} />
                    </div>
                  </div>
                </div>
                
                <div>
                  <p style={{ color: "#FF8866", fontSize: "14px", lineHeight: "1.6", fontWeight: "600", marginBottom: "24px" }}>
                    Financial operations are currently running at peak efficiency. We've seen a 15% reduction in flagging errors since the Q3 audit. Global prize distributions are scheduled for the 1st of each month.
                  </p>
                  <button style={{ background: "transparent", color: "#FF5500", border: "none", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", padding: 0 }}>
                    VIEW FULL TREASURY GUIDELINES <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Floating Action Button */}
              <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 100 }}>
                <button onClick={() => openModal("add")} style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FF5500", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 20px rgba(255,85,0,0.4)" }}>
                  <Plus size={24} />
                </button>
              </div>
            </div>
          )}

        </div>

      {/* ==================== SECURE CRUD FORM MODAL ==================== */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(255, 85, 0, 0.15)", width: "100%", maxWidth: "640px", maxHeight: "calc(100vh - 40px)", borderRadius: "28px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "modalFadeIn 0.3s ease-out" }}>
            
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
              <div style={{ padding: "32px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                
                {/* 1. RECORDS TAB FORM */}
                {activeTab === "records" && recordsSubTab === "submissions" && (
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

                {/* 5. CATEGORIES TAB FORM */}
                {activeTab === "records" && recordsSubTab === "categories" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>CATEGORY NAME</label>
                      <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DESCRIPTION</label>
                      <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PARENT CATEGORY</label>
                      <select value={categoryForm.parent || ""} onChange={(e) => setCategoryForm({ ...categoryForm, parent: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                        <option value="">-- None --</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input type="checkbox" checked={categoryForm.active} onChange={(e) => setCategoryForm({ ...categoryForm, active: e.target.checked })} />
                      <span style={{ color: "#aaa", fontSize: "12px" }}>Active</span>
                    </div>
                  </>
                )}

                {/* 6. AGE GROUPS TAB FORM */}
                {activeTab === "records" && recordsSubTab === "ageGroups" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>AGE GROUP NAME</label>
                      <input type="text" value={ageGroupForm.name} onChange={(e) => setAgeGroupForm({ ...ageGroupForm, name: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MIN AGE</label>
                        <input type="number" value={ageGroupForm.minAge} onChange={(e) => setAgeGroupForm({ ...ageGroupForm, minAge: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MAX AGE</label>
                        <input type="number" value={ageGroupForm.maxAge} onChange={(e) => setAgeGroupForm({ ...ageGroupForm, maxAge: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DESCRIPTION</label>
                      <textarea value={ageGroupForm.description} onChange={(e) => setAgeGroupForm({ ...ageGroupForm, description: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "60px" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input type="checkbox" checked={ageGroupForm.active} onChange={(e) => setAgeGroupForm({ ...ageGroupForm, active: e.target.checked })} />
                      <span style={{ color: "#aaa", fontSize: "12px" }}>Active</span>
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
                    {modalType === "add" && (
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PASSWORD (Min 6 chars)</label>
                        <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} required={modalType === "add"} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>USERNAME</label>
                        <input type="text" value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                          <label style={{ fontSize: "10px", fontWeight: "900", color: "#555" }}>USER ROLE</label>
                          <span style={{ fontSize: "10px", fontWeight: "900", color: userForm.role === 'system_admin' ? '#FF5500' : '#22c55e' }}>
                            ACCESS LEVEL: {userForm.role === 'system_admin' ? 'FULL ADMIN' : 'STANDARD'}
                          </span>
                        </div>
                        <select 
                          value={userForm.role} 
                          onChange={(e) => {
                            const newRole = e.target.value;
                            if (['moderator', 'judge', 'system_admin'].includes(newRole)) {
                              if (window.confirm(`SECURITY WARNING: Are you sure you want to grant ${newRole.replace('_', ' ').toUpperCase()} permissions?\n\nThis provides elevated access to the platform (backend management, user management, financial controls, etc.).\n\nAthletes should NOT receive these roles.`)) {
                                setUserForm({ ...userForm, role: newRole });
                              }
                            } else {
                              setUserForm({ ...userForm, role: newRole });
                            }
                          }} 
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}
                        >
                          <option value="athlete">Athlete (Regular User)</option>
                          <option value="moderator">Moderator</option>
                          <option value="judge">Judge / Adjudicator</option>
                          <option value="system_admin">System Admin</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MEMBERSHIP TYPE</label>
                        <select 
                          value={userForm.membershipType} 
                          onChange={(e) => setUserForm({ ...userForm, membershipType: e.target.value })} 
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}
                        >
                          <option value="free_athlete">Free Athlete</option>
                          <option value="basic_membership">Basic Membership</option>
                          <option value="silver_membership">Silver Membership</option>
                          <option value="gold_membership">Gold Membership</option>
                          <option value="platinum_membership">Platinum Membership</option>
                          <option value="vip_membership">VIP Membership</option>
                          <option value="lifetime_membership">Lifetime Membership</option>
                          <option value="sponsor_account">Sponsor Account</option>
                          <option value="judge">Judge / Adjudicator</option>
                          <option value="moderator">Moderator</option>
                          <option value="system_admin">System Admin</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>ACCOUNT STATUS</label>
                        <select 
                          value={userForm.accountStatus} 
                          onChange={(e) => setUserForm({ ...userForm, accountStatus: e.target.value })} 
                          style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="suspended">Suspended</option>
                          <option value="banned">Banned</option>
                          <option value="trial">Trial</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>GENDER</label>
                        <select value={userForm.gender} onChange={(e) => setUserForm({ ...userForm, gender: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DATE OF BIRTH</label>
                        <input type="date" value={userForm.dob} onChange={(e) => setUserForm({ ...userForm, dob: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PHONE</label>
                        <input type="tel" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>COUNTRY</label>
                        <input type="text" value={userForm.country} onChange={(e) => setUserForm({ ...userForm, country: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>CITY</label>
                        <input type="text" value={userForm.city} onChange={(e) => setUserForm({ ...userForm, city: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>HEIGHT (cm)</label>
                          <input type="number" value={userForm.height} onChange={(e) => setUserForm({ ...userForm, height: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>WEIGHT (kg)</label>
                          <input type="number" value={userForm.weight} onChange={(e) => setUserForm({ ...userForm, weight: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                        </div>
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

                    {/* Paid/Free Event Toggle Section */}
                    <div style={{ background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <label style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.5px", textTransform: "uppercase" }}>SPECTATOR ACCESS SETTINGS</label>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: "rgba(0,0,0,0.2)", padding: "12px 14px", borderRadius: "8px", border: eventForm.isPaid ? "1px solid rgba(255,106,0,0.4)" : "1px solid rgba(0,255,0,0.3)" }}>
                        <input 
                          type="checkbox" 
                          id="isPaid" 
                          checked={eventForm.isPaid} 
                          onChange={e => setEventForm({...eventForm, isPaid: e.target.checked})}
                          style={{ cursor: "pointer", width: "18px", height: "18px" }}
                        />
                        <label htmlFor="isPaid" style={{ fontSize: "13px", fontWeight: "700", color: eventForm.isPaid ? "#FF6A00" : "#22c55e", cursor: "pointer", flex: 1, margin: 0 }}>
                          {eventForm.isPaid ? "🔒 PAID EVENT - Requires Spectator Ticket" : "🔓 FREE EVENT - Open Access"}
                        </label>
                      </div>

                      {eventForm.isPaid && (
                        <div>
                          <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF6A00", marginBottom: "6px", letterSpacing: "0.5px" }}>TICKET PRICE (USD)</label>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "14px", fontWeight: "900", color: "#FF6A00" }}>$</span>
                            <input 
                              type="number" 
                              step="0.01"
                              placeholder="49.99" 
                              value={eventForm.ticketPrice} 
                              onChange={e => setEventForm({...eventForm, ticketPrice: parseFloat(e.target.value) || 0})} 
                              style={{ 
                                width: "100%", 
                                background: "rgba(0,0,0,0.4)", 
                                border: "1px solid rgba(255,106,0,0.3)", 
                                borderRadius: "8px", 
                                padding: "10px 14px", 
                                color: "#FF6A00",
                                fontWeight: "700",
                                fontSize: "14px"
                              }} 
                            />
                          </div>
                          <p style={{ fontSize: "10px", color: "#888", margin: "8px 0 0 0", fontStyle: "italic" }}>Users must purchase a valid spectator pass to access this livestream</p>
                        </div>
                      )}
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

                {/* 7. DASHBOARD/MEMBERSHIPS TAB FORM */}
                {activeTab === "revenue" && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>ATHLETE USER</label>
                      <select value={membershipForm.userId} onChange={(e) => setMembershipForm({ ...membershipForm, userId: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                        <option value="">-- Select Athlete --</option>
                        {users && users.map(u => <option key={u._id || u.id} value={u._id || u.id}>{u.name} ({u.email})</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MEMBERSHIP TIER</label>
                      <select value={membershipForm.tier} onChange={(e) => setMembershipForm({ ...membershipForm, tier: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                        <option value="bronze">Bronze</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>INITIAL PAYMENT AMOUNT ($)</label>
                      <input type="number" step="0.01" value={membershipForm.paymentAmount} onChange={(e) => setMembershipForm({ ...membershipForm, paymentAmount: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <input type="checkbox" checked={membershipForm.autoRenew} onChange={(e) => setMembershipForm({ ...membershipForm, autoRenew: e.target.checked })} />
                      <span style={{ color: "#aaa", fontSize: "12px" }}>Auto-renew membership</span>
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

      {/* ==================== RECORD DETAIL & ADJUDICATION MODAL ==================== */}
      {isRecordDetailModalOpen && selectedRecordDetail && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 3000, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(255, 85, 0, 0.2)", width: "100%", maxWidth: "700px", maxHeight: "calc(100vh - 40px)", borderRadius: "28px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "modalFadeIn 0.3s ease-out" }}>
            
            {/* Modal Header */}
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "950", margin: 0, textTransform: "uppercase", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Trophy size={18} color="#FF5500" /> SUBMISSION EVIDENCE SHEET
                </h3>
                <span style={{ fontSize: "11px", color: "#666", fontWeight: "700" }}>OFFICIAL ROGUE WORLD RECORD REVIEW SHEET</span>
              </div>
              <button onClick={() => setIsRecordDetailModalOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "32px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
              
              {/* Row 1: Title, Category, and Status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>RECORD ATTEMPT TITLE</label>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>{selectedRecordDetail.title}</div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>CATEGORY & DIVISION</label>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#aaa" }}>{selectedRecordDetail.category}</div>
                </div>
              </div>

              {/* Row 2: Value & Unit and Athlete */}
              <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "20px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#666", marginBottom: "6px", letterSpacing: "1px" }}>ATHLETE DETAILS</label>
                  <div style={{ fontSize: "15px", fontWeight: "800", color: "white" }}>{selectedRecordDetail.user?.name || "Rogue Athlete"}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>{selectedRecordDetail.user?.email || ""}</div>
                  {selectedRecordDetail.athleteId && <div style={{ fontSize: "11px", color: "#FF5500", fontWeight: "800", marginTop: "4px" }}>@{selectedRecordDetail.athleteId}</div>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#666", marginBottom: "6px", letterSpacing: "1px" }}>PERFORMANCE VALUE</label>
                  <div style={{ fontSize: "36px", fontWeight: "950", color: "#FF5500", lineHeight: "1" }}>
                    {selectedRecordDetail.value} <span style={{ fontSize: "16px", color: "white" }}>{selectedRecordDetail.unit}</span>
                  </div>
                </div>
              </div>

              {/* Row 3: Venue, Date & City */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#666", marginBottom: "6px", letterSpacing: "1px" }}>VENUE LOCATION</label>
                  <div style={{ fontSize: "13px", color: "white", fontWeight: "700" }}>{selectedRecordDetail.venue_name || selectedRecordDetail.venueName || "Not specified"}</div>
                  <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>📍 {selectedRecordDetail.city || "Online"}</div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#666", marginBottom: "6px", letterSpacing: "1px" }}>ATTEMPT TIMESTAMP</label>
                  <div style={{ fontSize: "13px", color: "white", fontWeight: "700" }}>
                    {selectedRecordDetail.created_at ? new Date(selectedRecordDetail.created_at).toLocaleString() : "Not specified"}
                  </div>
                </div>
              </div>

              {/* Row 4: Evidence Video */}
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "8px", letterSpacing: "1px" }}>EVIDENCE VIDEO FILE / URL</label>
                {(() => {
                  const url = selectedRecordDetail.evidence_url || selectedRecordDetail.evidenceUrl;
                  if (!url || url === "pending_upload") {
                    return (
                      <div style={{ padding: "24px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "12px", textAlign: "center", color: "#555", fontSize: "12px" }}>
                        <Video size={28} style={{ margin: "0 auto 8px auto", display: "block", opacity: 0.3 }} />
                        No video evidence submitted for this attempt.
                      </div>
                    );
                  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
                    const videoId = url.includes("youtu.be/") ? url.split("youtu.be/")[1]?.split("?")[0] : url.split("v=")[1]?.split("&")[0];
                    const embedUrl = `https://www.youtube.com/embed/${videoId}`;
                    return (
                      <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: "#000", position: "relative", paddingTop: "56.25%" }}>
                        <iframe 
                          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                          src={embedUrl} 
                          title="Evidence Video player" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        ></iframe>
                      </div>
                    );
                  } else if (url.match(/\.(mp4|webm|ogg|mov)$/i)) {
                    return (
                      <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", background: "#000", padding: "8px" }}>
                        <video controls style={{ width: "100%", display: "block", borderRadius: "8px" }}>
                          <source src={url} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  } else {
                    return (
                      <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px", background: "rgba(255,85,0,0.06)", border: "1px solid rgba(255,85,0,0.2)", borderRadius: "12px", color: "#FF5500", textDecoration: "none", fontSize: "13px", fontWeight: "800" }}>
                        <Eye size={16} />
                        VIEW SUBMITTED EVIDENCE &rarr; {url.substring(0, 60)}{url.length > 60 ? "..." : ""}
                      </a>
                    );
                  }
                })()}
              </div>

              {/* Row 4.5: Photo Evidence Gallery */}
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "8px", letterSpacing: "1px" }}>SUBMITTED PHOTO EVIDENCE</label>
                {(() => {
                  // Collect all photo evidence URLs from various possible fields
                  const photoFields = [
                    selectedRecordDetail.photo_evidence,
                    selectedRecordDetail.photo_url,
                    selectedRecordDetail.photos,
                    selectedRecordDetail.additional_evidence,
                    selectedRecordDetail.image_url,
                  ];
                  
                  let photos = [];
                  photoFields.forEach(field => {
                    if (!field) return;
                    if (typeof field === "string" && field.startsWith("[")) {
                      try { const parsed = JSON.parse(field); if (Array.isArray(parsed)) photos.push(...parsed); } catch { /* ignore error */ }
                    } else if (Array.isArray(field)) {
                      photos.push(...field.filter(Boolean));
                    } else if (typeof field === "string" && field.length > 0 && field !== "pending_upload") {
                      photos.push(field);
                    }
                  });
                  
                  // Filter to image-like URLs only (exclude video/pdf)
                  photos = photos.filter(url => typeof url === 'string' && (url.match(/\.(jpg|jpeg|png|gif|webp)/i) || url.includes('unsplash') || url.includes('storage') || url.includes('supabase')));

                  if (photos.length === 0) {
                    return (
                      <div style={{ padding: "24px", background: "rgba(255,255,255,0.01)", border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "12px", textAlign: "center", color: "#555", fontSize: "12px" }}>
                        <FileText size={28} style={{ margin: "0 auto 8px auto", display: "block", opacity: 0.3 }} />
                        No photo evidence was submitted with this attempt.
                      </div>
                    );
                  }
                  
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: photos.length === 1 ? "1fr" : "1fr 1fr", gap: "12px" }}>
                      {photos.map((url, pIdx) => (
                        <a key={pIdx} href={url} target="_blank" rel="noopener noreferrer" style={{ display: "block", borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", height: "160px", position: "relative", cursor: "pointer", textDecoration: "none" }}>
                          <img src={url} alt={`Photo Evidence ${pIdx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.parentElement.style.display='none'; }} />
                          <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)", padding: "3px 10px", borderRadius: "6px", fontSize: "9px", color: "white", fontWeight: "900", letterSpacing: "0.5px" }}>
                            PHOTO {pIdx + 1} — CLICK TO ENLARGE
                          </div>
                        </a>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* Row 5: Witnesses */}
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#666", marginBottom: "8px", letterSpacing: "1px" }}>ROGUE VERIFIED WITNESS REGISTRY</label>
                {(() => {
                  let parsedWitnesses = [];
                  if (selectedRecordDetail.witnesses) {
                    if (typeof selectedRecordDetail.witnesses === "string") {
                      try { parsedWitnesses = JSON.parse(selectedRecordDetail.witnesses); } catch { /* ignore error */ }
                    } else if (Array.isArray(selectedRecordDetail.witnesses)) {
                      parsedWitnesses = selectedRecordDetail.witnesses;
                    }
                  }
                  
                  if (parsedWitnesses.length === 0) {
                    return (
                      <div style={{ padding: "12px", color: "#555", fontSize: "11px", fontStyle: "italic", background: "rgba(255,255,255,0.01)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.03)" }}>
                        No witnesses registered for this attempt.
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {parsedWitnesses.map((w, idx) => (
                        <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "12px", color: "white", fontWeight: "800" }}>{w.name || "Unnamed Witness"}</span>
                            <span style={{ fontSize: "10px", color: "#FF5500", fontWeight: "900", textTransform: "uppercase", marginLeft: "10px", background: "rgba(255,85,0,0.08)", padding: "2px 6px", borderRadius: "4px" }}>{w.role || "Witness"}</span>
                          </div>
                          <span style={{ fontSize: "10px", fontWeight: "900", color: w.signed ? "#22c55e" : "#ffcc00" }}>
                            {w.signed ? "✓ SIGNED LOG" : "⏳ PENDING SIGNATURE"}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

            </div>

            {/* Modal Actions */}
            <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button 
                type="button" 
                onClick={() => setIsRecordDetailModalOpen(false)} 
                style={{ background: "rgba(255,255,255,0.04)", color: "#ccc", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
              >
                CLOSE REVIEW sheet
              </button>
              
              {selectedRecordDetail.status === "pending" && (
                <>
                  <button 
                    type="button" 
                    onClick={() => {
                      handleQuickAdjudicate(selectedRecordDetail.id, "rejected");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
                  >
                    REJECT SUBMISSION
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      handleQuickAdjudicate(selectedRecordDetail.id, "verified");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)", color: "white", border: "none", padding: "12px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(34, 197, 94, 0.2)" }}
                  >
                    APPROVE & VERIFY RECORD
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ==================== USER ACTION MODALS ==================== */}
      
      {/* SUSPEND USER MODAL */}
      {userActionModal.isOpen && userActionModal.type === "suspend" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2100, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(255, 204, 0, 0.15)", width: "100%", maxWidth: "480px", borderRadius: "20px", padding: "32px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 16px 0", color: "white", textTransform: "uppercase" }}>🟡 SUSPEND USER</h3>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px 0" }}>Suspend {userActionModal.userName} from platform access</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SUSPENSION REASON</label>
                <textarea value={suspendReason} onChange={(e) => setSuspendReason(e.target.value)} placeholder="Explain why this user is being suspended..." style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,204,0,0.2)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px", fontFamily: "inherit" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SUSPENSION DURATION (days)</label>
                <input type="number" value={suspendDuration} onChange={(e) => setSuspendDuration(e.target.value)} min="1" max="365" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,204,0,0.2)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleSuspendUser(userActionModal.userId)} style={{ flex: 1, background: "linear-gradient(135deg, #FFCC00 0%, #ffaa00 100%)", border: "none", color: "#000", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CONFIRM SUSPEND</button>
              <button onClick={() => setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" })} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* USER ACTIVITY MODAL */}
      {userActionModal.isOpen && userActionModal.type === "activity" && userActivity && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2100, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(168, 85, 247, 0.15)", width: "100%", maxWidth: "600px", maxHeight: "calc(100vh - 40px)", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", animation: "modalFadeIn 0.3s ease-out" }}>
            <div style={{ padding: "24px 32px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "950", margin: 0, textTransform: "uppercase", color: "white" }}>📊 USER ACTIVITY</h3>
                <p style={{ fontSize: "12px", color: "#888", margin: "4px 0 0 0" }}>{userActivity.user?.name}</p>
              </div>
              <button onClick={() => setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" })} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ padding: "24px 32px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Account Info */}
              <div>
                <h4 style={{ fontSize: "12px", fontWeight: "900", color: "#a855f7", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Account Information</h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
                  <div><span style={{ color: "#888" }}>Created:</span> <span style={{ color: "#fff" }}>{userActivity.user?.createdAt ? new Date(userActivity.user.createdAt).toLocaleDateString() : "N/A"}</span></div>
                  <div><span style={{ color: "#888" }}>Last Login:</span> <span style={{ color: "#fff" }}>{userActivity.lastLogin ? new Date(userActivity.lastLogin).toLocaleDateString() : "Never"}</span></div>
                  <div><span style={{ color: "#888" }}>Status:</span> <span style={{ color: userActivity.user?.accountStatus === 'active' ? '#22c55e' : '#ef4444', fontWeight: "900" }}>{userActivity.user?.accountStatus?.toUpperCase()}</span></div>
                  <div><span style={{ color: "#888" }}>Total Submissions:</span> <span style={{ color: "#fff", fontWeight: "900" }}>{userActivity.totalSubmissions || 0}</span></div>
                </div>
              </div>

              {/* Submission Stats */}
              {userActivity.submissionStats && (
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "900", color: "#a855f7", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Submission Statistics</h4>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px" }}>
                    <div style={{ background: "rgba(34,197,94,0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ color: "#22c55e", fontWeight: "900", fontSize: "16px" }}>{userActivity.submissionStats.verified || 0}</div>
                      <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>Verified</div>
                    </div>
                    <div style={{ background: "rgba(255,204,0,0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ color: "#ffcc00", fontWeight: "900", fontSize: "16px" }}>{userActivity.submissionStats.pending || 0}</div>
                      <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>Pending</div>
                    </div>
                    <div style={{ background: "rgba(239,68,68,0.1)", padding: "12px", borderRadius: "8px", textAlign: "center" }}>
                      <div style={{ color: "#ef4444", fontWeight: "900", fontSize: "16px" }}>{userActivity.submissionStats.rejected || 0}</div>
                      <div style={{ color: "#888", fontSize: "11px", marginTop: "4px" }}>Rejected</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Submissions */}
              {userActivity.recentSubmissions && userActivity.recentSubmissions.length > 0 && (
                <div>
                  <h4 style={{ fontSize: "12px", fontWeight: "900", color: "#a855f7", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recent Submissions</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {userActivity.recentSubmissions.slice(0, 5).map((sub, idx) => (
                      <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "8px", fontSize: "11px", borderLeft: `3px solid ${sub.status === 'verified' ? '#22c55e' : sub.status === 'pending' ? '#ffcc00' : '#ef4444'}` }}>
                        <div style={{ color: "#FF6A00", fontWeight: "900", marginBottom: "4px" }}>{sub.title}</div>
                        <div style={{ color: "#888" }}>{sub.category} • {new Date(sub.createdAt).toLocaleDateString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: "16px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", textAlign: "right" }}>
              <button onClick={() => setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "10px 20px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MEMBERSHIP ACTION MODALS ==================== */}
      {membershipActionModal.isOpen && membershipActionModal.type === "renew" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2200, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(34,197,94,0.12)", width: "100%", maxWidth: "520px", borderRadius: "20px", padding: "28px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 8px 0", color: "#22c55e" }}>🔁 RENEW MEMBERSHIP</h3>
            <p style={{ color: "#aaa", margin: "0 0 16px 0" }}>Renew membership for {membershipActionModal.membershipUser}</p>
            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>PAYMENT AMOUNT (optional)</label>
                <input type="number" value={membershipAmount} onChange={(e) => setMembershipAmount(parseFloat(e.target.value || 0))} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>RENEWAL NOTE</label>
                <input type="text" value={renewalReason} onChange={(e) => setRenewalReason(e.target.value)} placeholder="Optional note for the renewal" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(34,197,94,0.08)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>CANCEL</button>
              <button onClick={() => handleRenewMembership(membershipActionModal.membershipId, membershipAmount)} style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", border: "none", color: "white", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "900" }}>CONFIRM RENEW</button>
            </div>
          </div>
        </div>
      )}

      {membershipActionModal.isOpen && membershipActionModal.type === "cancel" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2200, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(239,68,68,0.12)", width: "100%", maxWidth: "520px", borderRadius: "20px", padding: "28px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 8px 0", color: "#ef4444" }}>🛑 CANCEL MEMBERSHIP</h3>
            <p style={{ color: "#aaa", margin: "0 0 16px 0" }}>Cancel membership for {membershipActionModal.membershipUser}</p>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "#555", marginBottom: "6px" }}>CANCELLATION REASON</label>
              <textarea value={cancellationReason} onChange={(e) => setCancellationReason(e.target.value)} placeholder="Explain why this membership is being cancelled" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(239,68,68,0.08)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px" }} />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>BACK</button>
              <button onClick={() => handleCancelMembership(membershipActionModal.membershipId)} style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", border: "none", color: "white", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "900" }}>CONFIRM CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {membershipActionModal.isOpen && membershipActionModal.type === "upgrade" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2200, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(59,130,246,0.12)", width: "100%", maxWidth: "520px", borderRadius: "20px", padding: "28px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 8px 0", color: "#3b82f6" }}>⬆️ UPGRADE MEMBERSHIP</h3>
            <p style={{ color: "#aaa", margin: "0 0 16px 0" }}>Change tier for {membershipActionModal.membershipUser}</p>
            <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
              <label style={{ fontSize: "11px", color: "#555" }}>NEW TIER</label>
              <select value={selectedUpgradeTier} onChange={(e) => setSelectedUpgradeTier(e.target.value)} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(59,130,246,0.08)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                <option value="free">Free</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>CANCEL</button>
              <button onClick={() => handleUpgradeMembership(membershipActionModal.membershipId, selectedUpgradeTier)} style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none", color: "white", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "900" }}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}

      {membershipActionModal.isOpen && membershipActionModal.type === "payments" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2200, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(168,85,247,0.12)", width: "100%", maxWidth: "560px", borderRadius: "20px", padding: "24px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 8px 0", color: "#a855f7" }}>💳 PAYMENT HISTORY</h3>
            <p style={{ color: "#aaa", margin: "0 0 12px 0" }}>Payments for {membershipActionModal.membershipUser}</p>
            <div style={{ maxHeight: "320px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
              {membershipPaymentHistory && membershipPaymentHistory.length > 0 ? membershipPaymentHistory.map((p, i) => (
                <div key={i} style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "8px", display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ fontWeight: "900", color: "white" }}>{p.type} • {p.status}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{new Date(p.date).toLocaleString()}</div>
                  </div>
                  <div style={{ fontWeight: "900", color: "#FF6A00" }}>${Number(p.amount || 0).toFixed(2)}</div>
                </div>
              )) : <div style={{ color: "#888" }}>No payment records found.</div>}
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button onClick={() => setMembershipActionModal({ isOpen: false, type: null, membershipId: null, membershipUser: null })} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 18px", borderRadius: "8px", cursor: "pointer" }}>CLOSE</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ADDITIONAL CUSTOM USER ACTION MODALS ==================== */}

      {/* BAN USER MODAL */}
      {userActionModal.isOpen && userActionModal.type === "ban" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2100, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(239, 68, 68, 0.25)", width: "100%", maxWidth: "480px", borderRadius: "20px", padding: "32px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 16px 0", color: "#ef4444", textTransform: "uppercase" }}>🚫 PERMANENTLY BAN USER</h3>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px 0" }}>
              Are you absolutely sure you want to permanently ban <strong>{userActionModal.userName}</strong>? This will revoke all platform access and cannot be easily reversed.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={async () => {
                  try {
                    await apiCall(`/dashboard/users/${userActionModal.userId}/ban`, "PUT", {}, user.token);
                    fetchData();
                    alert("User banned successfully");
                    setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" });
                  } catch (err) {
                    alert(`Failed to ban user: ${err.message}`);
                  }
                }} 
                style={{ flex: 1, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", border: "none", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}
              >
                CONFIRM BAN
              </button>
              <button onClick={() => setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" })} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {userActionModal.isOpen && userActionModal.type === "resetPassword" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2100, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(59, 130, 246, 0.25)", width: "100%", maxWidth: "480px", borderRadius: "20px", padding: "32px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 16px 0", color: "#3b82f6", textTransform: "uppercase" }}>🔑 RESET USER PASSWORD</h3>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px 0" }}>Set a new temporary password for {userActionModal.userName}</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>NEW TEMPORARY PASSWORD</label>
                <input 
                  type="text" 
                  value={tempPassword} 
                  onChange={(e) => setTempPassword(e.target.value)} 
                  placeholder="Enter temporary password (min 6 chars)..." 
                  style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(59,130,246,0.3)", borderRadius: "8px", padding: "10px 14px", color: "white" }} 
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => handleResetPassword(userActionModal.userId)} style={{ flex: 1, background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", border: "none", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CONFIRM RESET</button>
              <button onClick={() => setUserActionModal({ isOpen: false, type: null, userId: null, userName: "" })} style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}>CANCEL</button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL TOAST & CONFIRMATION MODALS ==================== */}

      {/* Custom Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: toast.type === "success" ? "rgba(10, 45, 20, 0.9)" : 
                      toast.type === "error" ? "rgba(50, 10, 10, 0.9)" : "rgba(20, 20, 30, 0.9)",
          border: `1px solid ${
            toast.type === "success" ? "rgba(34, 197, 94, 0.4)" : 
            toast.type === "error" ? "rgba(239, 68, 68, 0.4)" : "rgba(59, 130, 246, 0.4)"
          }`,
          boxShadow: `0 8px 32px 0 ${
            toast.type === "success" ? "rgba(0, 200, 0, 0.15)" : 
            toast.type === "error" ? "rgba(200, 0, 0, 0.15)" : "rgba(0, 0, 200, 0.15)"
          }`,
          borderRadius: "16px",
          padding: "16px 24px",
          color: "white",
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          backdropFilter: "blur(12px)",
          animation: "toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: "400px"
        }}>
          {toast.type === "success" ? <CheckCircle size={20} color="#22c55e" /> : 
           toast.type === "error" ? <AlertTriangle size={20} color="#ef4444" /> : <ShieldAlert size={20} color="#3b82f6" />}
          <span style={{ fontSize: "13px", fontWeight: "900", letterSpacing: "0.2px" }}>{toast.message}</span>
        </div>
      )}

      {/* Generic Custom Confirm Modal */}
      {confirmModal.isOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2500, padding: "20px" }}>
          <div style={{ background: "#0c0c0e", border: "1px solid rgba(255, 255, 255, 0.1)", width: "100%", maxWidth: "480px", borderRadius: "20px", padding: "32px", animation: "modalFadeIn 0.3s ease-out" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "950", margin: "0 0 16px 0", color: "white", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
              <AlertTriangle size={22} color="#ffcc00" />
              {confirmModal.title}
            </h3>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px 0", lineHeight: "1.5" }}>{confirmModal.message}</p>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={() => {
                  if (confirmModal.onConfirm) confirmModal.onConfirm();
                  setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
                }} 
                style={{ flex: 1, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", border: "none", color: "white", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px", textTransform: "uppercase" }}
              >
                CONFIRM
              </button>
              <button 
                onClick={() => setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null })} 
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#aaa", padding: "12px", borderRadius: "8px", fontWeight: "900", cursor: "pointer", fontSize: "12px" }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

        </main>
      </div>
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

        /* PREMIUM BUTTON CLASSES */
        .btn-premium-edit {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          color: #aaa;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-edit:hover {
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          box-shadow: 0 0 12px rgba(255,255,255,0.1);
          transform: translateY(-1px);
        }

        .btn-premium-suspend {
          background: rgba(255, 204, 0, 0.03);
          border: 1px solid rgba(255, 204, 0, 0.15);
          color: #ffcc00;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-suspend:hover {
          background: rgba(255, 204, 0, 0.08);
          border-color: rgba(255, 204, 0, 0.4);
          box-shadow: 0 0 12px rgba(255, 204, 0, 0.2);
          transform: translateY(-1px);
        }

        .btn-premium-ban {
          background: rgba(239, 68, 68, 0.03);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #ef4444;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-ban:hover {
          background: rgba(239, 68, 68, 0.08);
          border-color: rgba(239, 68, 68, 0.4);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
        }

        .btn-premium-restore {
          background: rgba(34, 197, 94, 0.03);
          border: 1px solid rgba(34, 197, 94, 0.15);
          color: #22c55e;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-restore:hover {
          background: rgba(34, 197, 94, 0.08);
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.2);
          transform: translateY(-1px);
        }

        .btn-premium-reset {
          background: rgba(59, 130, 246, 0.03);
          border: 1px solid rgba(59, 130, 246, 0.15);
          color: #3b82f6;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-reset:hover {
          background: rgba(59, 130, 246, 0.08);
          border-color: rgba(59, 130, 246, 0.4);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.2);
          transform: translateY(-1px);
        }

        .btn-premium-activity {
          background: rgba(168, 85, 247, 0.03);
          border: 1px solid rgba(168, 85, 247, 0.15);
          color: #a855f7;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-activity:hover {
          background: rgba(168, 85, 247, 0.08);
          border-color: rgba(168, 85, 247, 0.4);
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.2);
          transform: translateY(-1px);
        }

        .btn-premium-delete {
          background: rgba(239, 68, 68, 0.02);
          border: 1px solid rgba(239, 68, 68, 0.08);
          color: #f87171;
          transition: all 0.2s ease-in-out;
        }
        .btn-premium-delete:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.3);
          transform: translateY(-1px);
        }

        @keyframes modalFadeIn {
          0% { transform: scale(0.96); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes toastSlideIn {
          0% { transform: translateY(100px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Admin;
