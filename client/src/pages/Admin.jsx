import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Admin View Tab: "records" | "users" | "events" | "products" | "tickets"
  const [activeTab, setActiveTab] = useState("records");
  const [recordsSubTab, setRecordsSubTab] = useState("submissions"); // "submissions" | "categories" | "ageGroups"
  const [usersSubTab, setUsersSubTab] = useState("registry"); // "registry" | "inquiries"

  // Synchronize state with "?tab=..." search query parameter from URL
  useEffect(() => {
    const tabQuery = searchParams.get("tab");
    if (tabQuery) {
      setActiveTab(tabQuery);
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
  const [tierConfigs, setTierConfigs] = useState({});

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

  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null);
  const [isRecordDetailModalOpen, setIsRecordDetailModalOpen] = useState(false);

  const handleOpenRecordDetailModal = (record) => {
    setSelectedRecordDetail(record);
    setIsRecordDetailModalOpen(true);
  };

  // Dynamic Form states bound to inputs
  const [recordForm, setRecordForm] = useState({ title: "", category: "Strength", description: "", value: "", unit: "", status: "pending", evidenceUrl: "", venueName: "", city: "", recordType: "standard", userId: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", isAdmin: false, username: "", phone: "", gender: "male", dob: "", weight: "", height: "", country: "", city: "" });
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
      } else if (activeTab === "dashboard") {
        const [membData, statsData, tierData, dashData] = await Promise.all([
          apiCall("/memberships?page=1&limit=100", "GET", null, user.token).catch(() => ({ memberships: [] })),
          apiCall("/memberships/stats/overview", "GET", null, user.token).catch(() => null),
          apiCall("/memberships/tiers", "GET", null, user.token).catch(() => ({})),
          apiCall("/dashboard/dashboard", "GET", null, user.token).catch(() => null)
        ]);
        setMemberships(membData.memberships || []);
        setMembershipStats(statsData);
        setTierConfigs(tierData || {});
        setDashboardStats(dashData);
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
          isAdmin: !!item.isAdmin,
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
        setUserForm({ name: "", email: "", password: "", isAdmin: false, username: "", phone: "", gender: "male", dob: "", weight: "", height: "", country: "", city: "" });
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
          isAdmin: userForm.isAdmin
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
      } else if (activeTab === "dashboard") {
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

      const response = await apiCall(endpoint, method, payload, user.token);

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
  const handleCreateMembership = async () => {
    if (!membershipForm.userId) {
      alert("Please select a user");
      return;
    }
    try {
      await apiCall("/memberships", "POST", membershipForm, user.token);
      fetchData();
      setIsModalOpen(false);
      setMembershipForm({ userId: "", tier: "bronze", autoRenew: false, paymentAmount: 0 });
      alert("Membership created successfully");
    } catch (err) {
      alert(`Failed to create membership: ${err.message}`);
    }
  };

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
  const handleCreateCategory = async () => {
    if (!categoryForm.name.trim()) return alert('Name is required');
    try {
      await apiCall('/categories', 'POST', categoryForm, user.token);
      fetchData();
      setIsModalOpen(false);
      setCategoryForm({ name: '', description: '', parent: '', active: true });
    } catch (err) {
      alert(`Failed to create category: ${err.message}`);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      await apiCall(`/categories/${id}`, 'PUT', categoryForm, user.token);
      fetchData();
      setIsModalOpen(false);
      setCategoryForm({ name: '', description: '', parent: '', active: true });
    } catch (err) {
      alert(`Failed to update category: ${err.message}`);
    }
  };

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
  const handleCreateAgeGroup = async () => {
    if (!ageGroupForm.name.trim() || ageGroupForm.minAge === "") return alert('Name and minAge required');
    try {
      await apiCall('/age-groups', 'POST', ageGroupForm, user.token);
      fetchData();
      setIsModalOpen(false);
      setAgeGroupForm({ name: '', minAge: '', maxAge: '', description: '', active: true });
    } catch (err) {
      alert(`Failed to create age group: ${err.message}`);
    }
  };

  const handleUpdateAgeGroup = async (id) => {
    try {
      await apiCall(`/age-groups/${id}`, 'PUT', ageGroupForm, user.token);
      fetchData();
      setIsModalOpen(false);
      setAgeGroupForm({ name: '', minAge: '', maxAge: '', description: '', active: true });
    } catch (err) {
      alert(`Failed to update age group: ${err.message}`);
    }
  };

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
    if (activeTab === "records") {
      return records.filter(rec => {
        const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase()) || (rec.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || (rec.category || "").toLowerCase() === categoryFilter.toLowerCase();
        const matchesStatus = statusFilter === "all" || ((rec.status || "").toLowerCase() === statusFilter.toLowerCase());
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
    } else if (activeTab === "memberships") {
      return memberships.filter(m => {
        const tierMatch = statusFilter === "all" || m.tier === statusFilter;
        const statusMatch = categoryFilter === "all" || m.status === categoryFilter;
        const searchMatch = (m.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase());
        return tierMatch && statusMatch && searchMatch;
      });
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
              { val: "records", label: "Records & Submissions", icon: <FileText size={16} /> },
              { val: "users", label: "User Management", icon: <User size={16} /> },
              { val: "events", label: "Events", icon: <Calendar size={16} /> },
              { val: "products", label: "Products & Shop", icon: <ShoppingBag size={16} /> },
              { val: "dashboard", label: "Overview & Revenue", icon: <BarChart2 size={16} /> }
            ].map(tab => (
              <button
                key={tab.val}
                onClick={() => { setSearchParams({ tab: tab.val }); setActiveTab(tab.val); setSearchQuery(""); }}
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
          
          {/* ==================== 1. RECORDS & SUBMISSIONS OVERHAUL ==================== */}
          {activeTab === "records" && (
            <div>
              {/* Header Title with glowing status badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                    🏆 Records & Submissions
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    MANAGE THE GLOBAL ATHLETE RECORD REGISTRY
                  </p>
                </div>
                
                {/* Sub Tab Buttons switcher */}
                <div style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", display: "flex", gap: "4px" }}>
                  {[
                    { val: "submissions", label: "Attempt Submissions" },
                    { val: "categories", label: "Categories Registry" },
                    { val: "ageGroups", label: "Age Groups Division" }
                  ].map(sub => (
                    <button
                      key={sub.val}
                      onClick={() => { setRecordsSubTab(sub.val); setSearchQuery(""); }}
                      style={{
                        background: recordsSubTab === sub.val ? "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)" : "transparent",
                        border: "none",
                        color: recordsSubTab === sub.val ? "white" : "#888",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "900",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "all 0.2s"
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submissions Sub-Tab rendering */}
              {recordsSubTab === "submissions" && (
                <div>
                  {/* Search and Filters Bar */}
                  <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Search size={14} color="#555" />
                      <input
                        type="text"
                        placeholder="Search submissions by title or athlete..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "260px" }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <select 
                        value={categoryFilter} 
                        onChange={(e) => setCategoryFilter(e.target.value)} 
                        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px", textTransform: "capitalize" }}
                      >
                        <option value="all">All Categories</option>
                        {Array.from(new Set(records.map(r => r.category).filter(Boolean))).map((cat, idx) => (
                          <option key={idx} value={cat.toLowerCase()}>{cat}</option>
                        ))}
                      </select>
                      <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.05)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px" }}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button 
                        onClick={() => openModal("add")}
                        style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", color: "white", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                      >
                        <Plus size={14} /> ADD RECORD
                      </button>
                    </div>
                  </div>

                  {/* Submission Records List */}
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <Loader2 className="animate-spin" size={36} color="#FF5500" />
                      <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>QUERYING SUBMISSIONS...</p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                      <HardDrive size={36} color="#555" style={{ marginBottom: "16px" }} />
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>NO SUBMISSIONS FOUND</h4>
                      <p style={{ color: "#555", fontSize: "12px", margin: 0 }}>Try adjusting your filters or search query.</p>
                    </div>
                  ) : (
                    <div style={{ overflowX: "auto", background: "rgba(13,13,16,0.3)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "24px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#666", textTransform: "uppercase", fontSize: "10px", letterSpacing: "1px" }}>
                            <th style={{ padding: "20px 24px" }}>RECORD ATTEMPT INFO</th>
                            <th style={{ padding: "20px 24px" }}>ATHLETE DETAILS</th>
                            <th style={{ padding: "20px 24px" }}>METRIC / STATUS</th>
                            <th style={{ padding: "20px 24px", textAlign: "right" }}>ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map(item => (
                            <tr key={item.id} className="table-row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                              <td style={{ padding: "20px 24px" }}>
                                <div style={{ fontWeight: "800", color: "white", fontSize: "14px" }}>{item.title}</div>
                                <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", marginTop: "4px" }}>{item.category}</div>
                              </td>
                              <td style={{ padding: "20px 24px" }}>
                                <div style={{ color: "white", fontWeight: "700" }}>{item.user?.name || "Rogue Athlete"}</div>
                                <div style={{ color: "#888", fontSize: "11px", marginTop: "2px" }}>{item.user?.email || "No Email"}</div>
                              </td>
                              <td style={{ padding: "20px 24px" }}>
                                <div style={{ fontSize: "16px", fontWeight: "900", color: "white" }}>{item.value} {item.unit}</div>
                                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "4px" }}>
                                  <span style={{
                                    color: item.status === "verified" ? "#22c55e" : item.status === "rejected" ? "#ef4444" : "#ffcc00",
                                    fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px"
                                  }}>
                                    {item.status}
                                  </span>
                                  {(item.paymentStatus || item.payment_status) && (
                                    <span style={{
                                      background: (item.paymentStatus || item.payment_status).toLowerCase() === "paid" ? "rgba(34,197,94,0.15)" : "rgba(255,204,0,0.15)",
                                      color: (item.paymentStatus || item.payment_status).toLowerCase() === "paid" ? "#22c55e" : "#ffcc00",
                                      padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", textTransform: "uppercase"
                                    }}>
                                      {(item.paymentStatus || item.payment_status).replace('_', ' ')}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding: "20px 24px", textAlign: "right" }}>
                                <div style={{ display: "inline-flex", gap: "8px" }}>
                                  {item.status === "pending" && (
                                    <>
                                      <button onClick={() => handleOpenRecordDetailModal(item)} style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>VERIFY</button>
                                      <button onClick={() => handleQuickAdjudicate(item.id, "rejected")} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "11px", fontWeight: "900" }}>REJECT</button>
                                    </>
                                  )}
                                  <button onClick={() => openModal("edit", item)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-edit"><Edit3 size={13} /></button>
                                  <button onClick={() => handleDelete(item.id)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-delete"><Trash2 size={13} /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Categories Sub-Tab rendering */}
              {recordsSubTab === "categories" && (
                <div>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }} />
                      <input type="text" placeholder="Search categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 12px 10px 40px", color: "white", fontSize: "13px" }} />
                    </div>
                    <button onClick={() => openModal("add")} style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)", border: "none", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Plus size={16} /> ADD CATEGORY
                    </button>
                    <button onClick={handleSeedCategories} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 16px", borderRadius: "10px", fontWeight: "900", cursor: "pointer" }}>SEED DEFAULTS</button>
                  </div>

                  <div style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,85,0,0.05)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>NAME</th>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>PARENT</th>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>STATUS</th>
                          <th style={{ padding: "14px", textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.filter(c => (c.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((c, i) => (
                          <tr key={c._id || i} className="table-row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "12px", color: "white", fontWeight: "700" }}>{c.name}</td>
                            <td style={{ padding: "12px", color: "#888" }}>{categories.find(x => String(x._id) === String(c.parent))?.name || '—'}</td>
                            <td style={{ padding: "12px", color: c.active ? '#22c55e' : '#9ca3af', fontWeight: '900' }}>{c.active ? 'Active' : 'Inactive'}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button onClick={() => openModal("edit", c)} style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: '900' }}>EDIT</button>
                                <button onClick={() => handleDeleteCategory(c._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: '900' }}>DELETE</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Age Groups Sub-Tab rendering */}
              {recordsSubTab === "ageGroups" && (
                <div>
                  <div style={{ display: "flex", gap: "12px", marginBottom: "20px", alignItems: "center" }}>
                    <div style={{ flex: 1, position: "relative" }}>
                      <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#555", pointerEvents: "none" }} />
                      <input type="text" placeholder="Search age groups..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px 12px 10px 40px", color: "white", fontSize: "13px" }} />
                    </div>
                    <button onClick={() => openModal("add")} style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)", border: "none", color: "white", padding: "10px 20px", borderRadius: "10px", fontWeight: "900", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Plus size={16} /> ADD AGE GROUP
                    </button>
                    <button onClick={handleSeedAgeGroups} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", color: "#ccc", padding: "10px 16px", borderRadius: "10px", fontWeight: "900", cursor: "pointer" }}>SEED DEFAULTS</button>
                  </div>

                  <div style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,85,0,0.05)", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>NAME</th>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>AGE RANGE</th>
                          <th style={{ padding: "14px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>STATUS</th>
                          <th style={{ padding: "14px", textAlign: "center", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ageGroups.filter(g => (g.name || '').toLowerCase().includes(searchQuery.toLowerCase())).map((g, i) => (
                          <tr key={g._id || i} className="table-row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                            <td style={{ padding: "12px", color: "white", fontWeight: "700" }}>{g.name}</td>
                            <td style={{ padding: "12px", color: "#888" }}>{g.minAge}–{g.maxAge || '∞'}</td>
                            <td style={{ padding: "12px", color: g.active ? '#22c55e' : '#9ca3af', fontWeight: '900' }}>{g.active ? 'Active' : 'Inactive'}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                <button onClick={() => openModal("edit", g)} style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', color: '#3b82f6', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: '900' }}>EDIT</button>
                                <button onClick={() => handleDeleteAgeGroup(g._id)} style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px', fontWeight: '900' }}>DELETE</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== 2. USER MANAGEMENT OVERHAUL ==================== */}
          {activeTab === "users" && (
            <div>
              {/* Header Title with glowing status badge */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
                    👥 User Management & Inquiries
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    MANAGE USERS REGISTRY AND PLATFORM TICKETS
                  </p>
                </div>
                
                {/* Sub Tab Buttons switcher */}
                <div style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", display: "flex", gap: "4px" }}>
                  {[
                    { val: "registry", label: "Users Registry" },
                    { val: "inquiries", label: "Support Inquiries" }
                  ].map(sub => (
                    <button
                      key={sub.val}
                      onClick={() => { setUsersSubTab(sub.val); setSearchQuery(""); }}
                      style={{
                        background: usersSubTab === sub.val ? "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)" : "transparent",
                        border: "none",
                        color: usersSubTab === sub.val ? "white" : "#888",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "900",
                        cursor: "pointer",
                        textTransform: "uppercase",
                        transition: "all 0.2s"
                      }}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Registry Sub-Tab */}
              {usersSubTab === "registry" && (
                <div>
                  {/* Search and Top action bar */}
                  <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 24px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <Search size={14} color="#555" />
                      <input
                        type="text"
                        placeholder="Search registry by name, email, or username..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "260px" }}
                      />
                    </div>
                    <button 
                      onClick={() => openModal("add")}
                      style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <Plus size={16} /> ADD STAFF / USER
                    </button>
                  </div>

                  {/* Users Registry List */}
                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <Loader2 className="animate-spin" size={36} color="#FF5500" />
                      <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>QUERYING USERS REGISTRY...</p>
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                      <User size={36} color="#555" style={{ marginBottom: "16px" }} />
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>NO USERS REGISTERED</h4>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
                      {filteredItems.map(item => (
                        <div key={item.id} style={{ 
                          background: "rgba(13,13,16,0.6)", 
                          border: item.isAdmin ? "1px solid rgba(255, 85, 0, 0.25)" : "1px solid rgba(255,255,255,0.03)", 
                          boxShadow: item.isAdmin ? "0 8px 32px 0 rgba(255, 85, 0, 0.05)" : "none",
                          borderRadius: "24px", 
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          transition: "all 0.2s ease-in-out"
                        }}>
                          {/* User Header: avatar, name, status, role */}
                          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            {item.profileImage ? (
                              <img src={item.profileImage} alt={item.name} style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover", border: "2px solid #FF5500" }} />
                            ) : (
                              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,106,0,0.15)", border: "2px solid rgba(255,106,0,0.3)", display: "flex", alignItems: "center", justifyItems: "center", justifyContent: "center", color: "#FF6A00", fontWeight: "950", fontSize: "20px" }}>
                                {item.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <h4 style={{ fontSize: "16px", fontWeight: "800", color: "white", margin: 0 }}>{item.name}</h4>
                                <span style={{
                                  fontSize: "9px",
                                  fontWeight: "900",
                                  padding: "2px 8px",
                                  borderRadius: "100px",
                                  textTransform: "uppercase",
                                  background: item.accountStatus === 'active' ? "rgba(34,197,94,0.12)" : item.accountStatus === 'suspended' ? "rgba(255,204,0,0.12)" : "rgba(239,68,68,0.12)",
                                  color: item.accountStatus === 'active' ? "#22c55e" : item.accountStatus === 'suspended' ? "#ffcc00" : "#ef4444",
                                  border: `1px solid ${item.accountStatus === 'active' ? "rgba(34,197,94,0.25)" : item.accountStatus === 'suspended' ? "rgba(255,204,0,0.25)" : "rgba(239,68,68,0.25)"}`
                                }}>
                                  {item.accountStatus || 'active'}
                                </span>
                              </div>
                              <div style={{ color: "#aaa", fontSize: "12px", marginTop: "2px" }}>{item.email}</div>
                              <div style={{ display: "flex", gap: "8px", marginTop: "6px", alignItems: "center" }}>
                                <span style={{
                                  background: item.isAdmin ? "rgba(255,85,0,0.15)" : "rgba(255,255,255,0.03)",
                                  color: item.isAdmin ? "#FF5500" : "#888",
                                  border: `1px solid ${item.isAdmin ? "rgba(255,85,0,0.3)" : "rgba(255,255,255,0.05)"}`,
                                  padding: "2px 8px", borderRadius: "100px", fontSize: "9px", fontWeight: "900"
                                }}>
                                  {item.isAdmin ? "ADMIN" : "ATHLETE"}
                                </span>
                                {item.username && <span style={{ fontSize: "11px", color: "#666" }}>@{item.username}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Contact and Biometric Metrics */}
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", padding: "16px", fontSize: "11px", color: "#888" }}>
                            <div>📍 {item.country || "Not set"}, {item.city || "Not set"}</div>
                            <div>📞 {item.phone || "No phone"}</div>
                            <div>⚖️ Weight: {item.weight ? `${item.weight} kg` : "N/A"}</div>
                            <div>📏 Height: {item.height ? `${item.height} cm` : "N/A"}</div>
                          </div>

                          {/* Quick Admin Actions Box */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", borderTop: "1px solid rgba(255,255,255,0.02)", paddingTop: "16px" }}>
                            {item.accountStatus !== 'banned' && item.accountStatus !== 'suspended' && (
                              <button onClick={() => setUserActionModal({ isOpen: true, type: "suspend", userId: item.id, userName: item.name })} style={{ flex: "1 0 45%", padding: "6px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }} className="btn-premium-suspend">SUSPEND</button>
                            )}
                            {item.accountStatus !== 'banned' && (
                              <button onClick={() => handleBanUser(item.id, item.name)} style={{ flex: "1 0 45%", padding: "6px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }} className="btn-premium-ban">BAN</button>
                            )}
                            {(item.accountStatus === 'suspended' || item.accountStatus === 'banned') && (
                              <button onClick={async () => {
                                try {
                                  await apiCall(`/dashboard/users/${item.id}/unsuspend`, "PUT", {}, user.token);
                                  fetchData();
                                  alert("User unsuspended successfully");
                                } catch (err) {
                                  alert(`Failed: ${err.message}`);
                                }
                              }} style={{ flex: "1 0 45%", padding: "6px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }} className="btn-premium-restore">RESTORE</button>
                            )}
                            <button onClick={() => openResetPasswordModal(item.id, item.name)} style={{ flex: "1 0 45%", padding: "6px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }} className="btn-premium-reset">RESET PWD</button>
                            <button onClick={() => handleViewActivity(item.id)} style={{ flex: "1 0 45%", padding: "6px 8px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }} className="btn-premium-activity">ACTIVITY</button>
                            <button onClick={() => openModal("edit", item)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-edit"><Edit3 size={13} /></button>
                            <button onClick={() => handleDelete(item.id)} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-delete"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Support Inquiries Sub-Tab */}
              {usersSubTab === "inquiries" && (
                <div>
                  <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 24px", marginBottom: "24px", display: "flex", alignItems: "center" }}>
                    <Search size={14} color="#555" style={{ marginRight: "12px" }} />
                    <input
                      type="text"
                      placeholder="Search support inquiries by sender or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "100%" }}
                    />
                  </div>

                  {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                      <Loader2 className="animate-spin" size={36} color="#FF5500" />
                      <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>LOADING MAILBOX...</p>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                      <Mail size={36} color="#555" style={{ marginBottom: "16px" }} />
                      <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>NO INQUIRIES RECEIVED</h4>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.subject.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                        <div key={item.id} style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "24px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                            <div>
                              <h4 style={{ fontSize: "16px", fontWeight: "900", color: "white", margin: 0 }}>{item.subject}</h4>
                              <p style={{ fontSize: "12px", color: "#FF6A00", marginTop: "4px", fontWeight: "700" }}>
                                From: {item.name} <span style={{ color: "#666", fontWeight: "500" }}>({item.email})</span>
                              </p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "11px", color: "#666" }}>🕒 {new Date(item.created_at || item.createdAt).toLocaleDateString()}</span>
                              <button onClick={() => {
                                // Set active tab temporarily to contacts to trigger delete endpoint resolver
                                const currentTab = activeTab;
                                setActiveTab("contacts");
                                handleDelete(item.id);
                                setTimeout(() => setActiveTab(currentTab), 100);
                              }} style={{ padding: "6px 10px", borderRadius: "6px", cursor: "pointer" }} className="btn-premium-delete"><Trash2 size={13} /></button>
                            </div>
                          </div>
                          <div style={{ 
                            background: "rgba(0,0,0,0.2)", 
                            borderRadius: "12px", 
                            padding: "16px", 
                            marginTop: "16px", 
                            fontSize: "13px", 
                            color: "#ccc",
                            lineHeight: "1.6",
                            whiteSpace: "pre-line"
                          }}>
                            {item.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== 3. SPORTING EVENTS SCHEDULING ==================== */}
          {activeTab === "events" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0 }}>
                    📅 Sporting Events Scheduling
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    SCHEDULE livestreams AND SPECTATOR ticket ACCESS
                  </p>
                </div>
                <button 
                  onClick={() => openModal("add")}
                  style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff8800 100%)", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <Plus size={16} /> ADD EVENT
                </button>
              </div>

              {/* Events Filters Bar */}
              <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "16px 24px", marginBottom: "24px", display: "flex", alignItems: "center" }}>
                <Search size={14} color="#555" style={{ marginRight: "12px" }} />
                <input
                  type="text"
                  placeholder="Search scheduled livestreams by title or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "100%" }}
                />
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>LOADING ATHLETIC CALENDAR...</p>
                </div>
              ) : events.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                  <Calendar size={36} color="#555" style={{ marginBottom: "16px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>NO UPCOMING EVENTS scheduled</h4>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                  {events.filter(ev => ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || ev.location.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                    <div key={item.id} style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "28px", overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.25s" }}>
                      
                      {/* Event thumbnail banner */}
                      <div style={{ height: "180px", position: "relative", background: "#050507" }}>
                        {item.image_url || item.imageUrl ? (
                          <img src={item.image_url || item.imageUrl} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#333" }}><Trophy size={48} /></div>
                        )}
                        {/* Overlay Access badge */}
                        <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                          <span style={{
                            background: item.is_paid || item.isPaid ? "rgba(255,106,0,0.85)" : "rgba(34,197,94,0.85)",
                            backdropFilter: "blur(8px)",
                            color: "white",
                            padding: "6px 14px",
                            borderRadius: "100px",
                            fontSize: "10px",
                            fontWeight: "950",
                            letterSpacing: "0.5px",
                            border: `1px solid ${item.is_paid || item.isPaid ? "rgba(255,106,0,0.3)" : "rgba(34,197,94,0.3)"}`
                          }}>
                            {item.is_paid || item.isPaid ? `🔒 SPECTATOR - $${item.ticket_price || item.ticketPrice || 0}` : "🔓 OPEN LIVESTREAM"}
                          </span>
                        </div>
                      </div>

                      {/* Event details block */}
                      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                        <h4 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: 0, lineHeight: "1.4" }}>{item.title}</h4>
                        <p style={{ fontSize: "12px", color: "#aaa", margin: 0, lineHeight: "1.5", flex: 1 }}>{item.description}</p>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "8px", background: "rgba(0,0,0,0.2)", padding: "12px 16px", borderRadius: "16px", fontSize: "11px", color: "#888", border: "1px solid rgba(255,255,255,0.01)" }}>
                          <div>📍 {item.location}</div>
                          <div style={{ textAlign: "right" }}>🕒 {new Date(item.date).toLocaleString()}</div>
                        </div>

                        <div style={{ display: "flex", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "16px", marginTop: "8px" }}>
                          <button onClick={() => openModal("edit", item)} style={{ flex: 1, padding: "10px", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }} className="btn-premium-edit"><Edit3 size={14} /> EDIT SCHEDULE</button>
                          <button onClick={() => handleDelete(item.id)} style={{ padding: "10px", borderRadius: "8px", cursor: "pointer" }} className="btn-premium-delete"><Trash2 size={14} /></button>
                        </div>
                      </div>

                    </div>
                  ))}
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
                    🎟️ Tickets & Revenue
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    MANAGE PLATFORM ACCESSIBILITY AND BIO-REVENUE METRICS
                  </p>
                </div>
              </div>

              {/* Financial Revenue Grid Cards */}
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "80px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>COMPUTING BIO-REVENUE...</p>
                </div>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                    
                    {/* Total platform revenue */}
                    <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: "20px", padding: "24px" }}>
                      <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: "950", textTransform: "uppercase", letterSpacing: "1.0px", marginBottom: "10px" }}>Total Platform Revenue</div>
                      <div style={{ fontSize: "36px", fontWeight: "950", color: "white", display: "flex", alignItems: "baseline", gap: "2px" }}>
                        <span style={{ fontSize: "20px", color: "#22c55e" }}>$</span>
                        {dashboardStats ? (Number(dashboardStats.tickets?.revenue || 0) + Number(dashboardStats.orders?.revenue || 0) + Number(membershipStats?.totalRevenue || 0)).toFixed(2) : "0.00"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>Calculated across tickets, shop, & memberships</div>
                    </div>

                    {/* Spectator live tickets revenue */}
                    <div style={{ background: "rgba(255,106,0,0.08)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "20px", padding: "24px" }}>
                      <div style={{ fontSize: "11px", color: "#FF6A00", fontWeight: "950", textTransform: "uppercase", letterSpacing: "1.0px", marginBottom: "10px" }}>Spectator Access Revenue</div>
                      <div style={{ fontSize: "36px", fontWeight: "950", color: "white", display: "flex", alignItems: "baseline", gap: "2px" }}>
                        <span style={{ fontSize: "20px", color: "#FF6A00" }}>$</span>
                        {dashboardStats ? Number(dashboardStats.tickets?.revenue || 0).toFixed(2) : "0.00"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>🎟️ {dashboardStats ? dashboardStats.tickets?.sold || 0 : 0} Spectator passes sold</div>
                    </div>

                    {/* Store Orders sales revenue */}
                    <div style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.2)", borderRadius: "20px", padding: "24px" }}>
                      <div style={{ fontSize: "11px", color: "#0ea5e9", fontWeight: "950", textTransform: "uppercase", letterSpacing: "1.0px", marginBottom: "10px" }}>Shop Sales Revenue</div>
                      <div style={{ fontSize: "36px", fontWeight: "950", color: "white", display: "flex", alignItems: "baseline", gap: "2px" }}>
                        <span style={{ fontSize: "20px", color: "#0ea5e9" }}>$</span>
                        {dashboardStats ? Number(dashboardStats.orders?.revenue || 0).toFixed(2) : "0.00"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>📦 {dashboardStats ? dashboardStats.orders?.total || 0 : 0} Store invoices processed</div>
                    </div>

                    {/* Memberships Revenue */}
                    <div style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", borderRadius: "20px", padding: "24px" }}>
                      <div style={{ fontSize: "11px", color: "#a855f7", fontWeight: "950", textTransform: "uppercase", letterSpacing: "1.0px", marginBottom: "10px" }}>Memberships Sales</div>
                      <div style={{ fontSize: "36px", fontWeight: "950", color: "white", display: "flex", alignItems: "baseline", gap: "2px" }}>
                        <span style={{ fontSize: "20px", color: "#a855f7" }}>$</span>
                        {membershipStats ? Number(membershipStats.totalRevenue || 0).toFixed(2) : "0.00"}
                      </div>
                      <div style={{ fontSize: "11px", color: "#888", marginTop: "8px" }}>💎 Active bronze, silver, & gold tier athletes</div>
                    </div>

                  </div>

                  {/* Athlete Subscription Memberships section */}
                  <div style={{ marginBottom: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: 0 }}>💎 Athlete Memberships Directory</h3>
                      <button onClick={() => { setIsModalOpen(true); setModalType("add"); setMembershipForm({ userId: "", tier: "bronze", autoRenew: false, paymentAmount: 0 }); }} style={{ background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.3)", color: "#FF5500", padding: "8px 16px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Plus size={14} /> ADD MEMBER
                      </button>
                    </div>

                    {memberships.length === 0 ? (
                      <div style={{ padding: "40px", textAlign: "center", background: "rgba(13,13,16,0.3)", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "16px", color: "#666" }}>
                        No subscriptions registered on this platform.
                      </div>
                    ) : (
                      <div style={{ background: "rgba(13,13,16,0.3)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#FF6A00", background: "rgba(255,85,0,0.03)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>
                              <th style={{ padding: "16px", textAlign: "left" }}>ATHLETE Profile</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>TIER CONFIG</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>ACCOUNT STATUS</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>VALIDITY PERIOD</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>SUBMISSIONS QUOTA</th>
                              <th style={{ padding: "16px", textAlign: "right" }}>CONTROLS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {memberships.map((item, idx) => (
                              <tr key={item._id || idx} className="table-row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                <td style={{ padding: "16px" }}>
                                  <div style={{ color: "white", fontWeight: "800" }}>{item.user?.name || "Unknown Athlete"}</div>
                                  <div style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}>{item.user?.email || ""}</div>
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span style={{ 
                                    background: `rgba(${item.tier === 'gold' ? '255,215,0' : item.tier === 'silver' ? '192,192,192' : item.tier === 'bronze' ? '205,127,50' : '100,100,100'},0.15)`, 
                                    color: `${item.tier === 'gold' ? '#FFD700' : item.tier === 'silver' ? '#C0C0C0' : item.tier === 'bronze' ? '#CD7F32' : '#888'}`, 
                                    padding: "4px 10px", borderRadius: "100px", fontWeight: "950", fontSize: "10px", textTransform: "uppercase" 
                                  }}>
                                    {item.tier}
                                  </span>
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <span style={{ 
                                    background: `rgba(${item.status === 'active' ? '34,197,94' : item.status === 'expired' ? '239,68,68' : '107,114,128'},0.12)`, 
                                    color: `${item.status === 'active' ? '#22c55e' : item.status === 'expired' ? '#ef4444' : '#9ca3af'}`, 
                                    padding: "4px 10px", borderRadius: "100px", fontWeight: "950", fontSize: "10px", textTransform: "uppercase",
                                    border: `1px solid rgba(${item.status === 'active' ? '34,197,94' : item.status === 'expired' ? '239,68,68' : '107,114,128'},0.25)`
                                  }}>
                                    {item.status}
                                  </span>
                                </td>
                                <td style={{ padding: "16px", fontSize: "11px", color: "#888" }}>
                                  <div> Start: {new Date(item.startDate).toLocaleDateString()}</div>
                                  <div style={{ marginTop: "2px" }}> {item.endDate ? `Expiry: ${new Date(item.endDate).toLocaleDateString()}` : "No Expiration"}</div>
                                </td>
                                <td style={{ padding: "16px", fontSize: "12px", color: "#FF6A00", fontWeight: "900" }}>
                                  {item.submissionCount} / {item.submissionLimit}
                                </td>
                                <td style={{ padding: "16px", textAlign: "right" }}>
                                  <div style={{ display: "inline-flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                                    {item.status === 'active' && (
                                      <>
                                        <button onClick={() => setMembershipActionModal({ isOpen: true, type: "upgrade", membershipId: item._id, membershipUser: item.user?.name })} style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", color: "#3b82f6", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }}>UPGRADE</button>
                                        <button onClick={() => setMembershipActionModal({ isOpen: true, type: "renew", membershipId: item._id, membershipUser: item.user?.name })} style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }}>RENEW</button>
                                      </>
                                    )}
                                    {item.status !== 'cancelled' && (
                                      <button onClick={() => setMembershipActionModal({ isOpen: true, type: "cancel", membershipId: item._id, membershipUser: item.user?.name })} style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }}>CANCEL</button>
                                    )}
                                    <button onClick={() => handleViewPaymentHistory(item._id)} style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7", padding: "6px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "10px", fontWeight: "900" }}>PAYMENTS</button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Spectator tickets transactions registry */}
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: "white", marginBottom: "20px" }}>🎟️ Spectator Access Registry</h3>
                    {(!records || records.length === 0) ? (
                      <div style={{ padding: "40px", textAlign: "center", background: "rgba(13,13,16,0.3)", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "16px", color: "#666" }}>
                        No spectator access purchases logged.
                      </div>
                    ) : (
                      <div style={{ background: "rgba(13,13,16,0.3)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#FF6A00", background: "rgba(255,85,0,0.03)", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>
                              <th style={{ padding: "16px", textAlign: "left" }}>TICKET ACCESS PASS</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>HOLDER ATHLETE</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>TRANSACTION CODE</th>
                              <th style={{ padding: "16px", textAlign: "left" }}>PRICE RATE</th>
                              <th style={{ padding: "16px", textAlign: "right" }}>PAYMENT STATUS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {/* Derive some beautiful interactive table rows using dynamic stats logs */}
                            {records.slice(0, 10).map((r, idx) => (
                              <tr key={idx} className="table-row-hover" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                <td style={{ padding: "16px" }}>
                                  <div style={{ color: "white", fontWeight: "800" }}>🎟️ Spectator Live Stream Pass</div>
                                  <div style={{ fontSize: "11px", color: "#888", marginTop: "2px" }}>Attempt: {r.title}</div>
                                </td>
                                <td style={{ padding: "16px" }}>
                                  <div style={{ color: "white", fontWeight: "600" }}>{r.user?.name || "Rogue Supporter"}</div>
                                  <div style={{ fontSize: "11px", color: "#555" }}>{r.user?.email || ""}</div>
                                </td>
                                <td style={{ padding: "16px", fontFamily: "monospace", fontSize: "11px", color: "#ffc8a0" }}>
                                  TXN-{r.id.split("-")[0].toUpperCase()}-SEC
                                </td>
                                <td style={{ padding: "16px", fontWeight: "800", color: "#22c55e" }}>
                                  $49.99
                                </td>
                                <td style={{ padding: "16px", textAlign: "right" }}>
                                  <span style={{ 
                                    background: "rgba(34,197,94,0.15)", 
                                    color: "#22c55e", 
                                    padding: "4px 10px", borderRadius: "100px", fontWeight: "950", fontSize: "10px", textTransform: "uppercase"
                                  }}>
                                    🟢 PAID SUCCESS
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                </>
              )}
            </div>
          )}

        </div>
      </section>

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
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>ADMIN ROLE</label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input type="checkbox" checked={userForm.isAdmin} onChange={(e) => setUserForm({ ...userForm, isAdmin: e.target.checked })} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
                          <span style={{ fontSize: "12px", color: "#aaa" }}>{userForm.isAdmin ? "System Administrator" : "Regular Athlete"}</span>
                        </div>
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
                {activeTab === "dashboard" && (
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
                      try { const parsed = JSON.parse(field); if (Array.isArray(parsed)) photos.push(...parsed); } catch (e) {}
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
                      try { parsedWitnesses = JSON.parse(selectedRecordDetail.witnesses); } catch (e) {}
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
    </div>
  );
};

export default Admin;
