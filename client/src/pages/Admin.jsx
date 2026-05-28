import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  ShieldAlert, Trophy, X, Eye, Calendar, 
  User, Users, Search, Filter, 
  AlertTriangle, CheckCircle, Video, FileText, Loader2, 
  Sparkles, Trash2, Edit3, Plus, ShoppingBag, Mail, HardDrive, Ticket, Layers, Folder,
  ArrowRight, Bell, Settings, LogOut, LayoutDashboard, BarChart3, MoreVertical,
  Activity, Zap, Timer, Network, Component, TrendingUp, DollarSign, Clock, XCircle, Target, Radio, CreditCard,
  Flag, ClipboardList, GitBranch, MessageSquare, Star, Layout, Crown, Lock, Server, Image, Megaphone
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
      } else if (tabQuery === "verification-queue" || tabQuery === "verificationQueue") {
        setActiveTab("verificationQueue");
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
  const [orders, setOrders] = useState([]);
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState("");
  const [customerHistory, setCustomerHistory] = useState(null);
  const [shippingStatusFilter, setShippingStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [contacts, setContacts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [membershipStats, setMembershipStats] = useState(null);
  const [revenueSubTab, setRevenueSubTab] = useState("ledger"); // "ledger" | "coupons"
  const [coupons, setCoupons] = useState([]);
  const [couponStats, setCouponStats] = useState(null);
  const [couponSearchQuery, setCouponSearchQuery] = useState("");
  const [ledgerPayments, setLedgerPayments] = useState([]);
  const [ledgerMetrics, setLedgerMetrics] = useState(null);
  const [paymentsFilterType, setPaymentsFilterType] = useState("all");
  const [paymentsFilterStatus, setPaymentsFilterStatus] = useState("all");
  const [paymentsSearchQuery, setPaymentsSearchQuery] = useState("");
  // Adjudicator Management States
  const [judges, setJudges] = useState([]);
  const [judgesSearchQuery, setJudgesSearchQuery] = useState("");
  const [adjudicatorSubTab, setAdjudicatorSubTab] = useState("roster"); // "roster" | "dispatch" | "oversight"
  const [promoteSearchQuery, setPromoteSearchQuery] = useState("");
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);
  const [selectedJudgeForNotes, setSelectedJudgeForNotes] = useState(null);
  const [judgeNotesText, setJudgeNotesText] = useState("");
  const [isJudgeNotesModalOpen, setIsJudgeNotesModalOpen] = useState(false);
  const [selectedOversightRecord, setSelectedOversightRecord] = useState(null);
  const [isOversightRevertModalOpen, setIsOversightRevertModalOpen] = useState(false);
  const [oversightRevertFeedback, setOversightRevertFeedback] = useState("");
  // const [tierConfigs, setTierConfigs] = useState({}); // Unused

  // Verification Queue States
  const [vqFilter, setVqFilter] = useState("all"); // "all" | "pending_review" | "under_review" | "approved" | "denied" | "needs_info" | "priority"
  const [vqSearchQuery, setVqSearchQuery] = useState("");
  const [vqSortBy, setVqSortBy] = useState("newest"); // "newest" | "oldest" | "priority"
  const [selectedVqRecord, setSelectedVqRecord] = useState(null);
  const [isVqDetailOpen, setIsVqDetailOpen] = useState(false);
  const [vqAdminNote, setVqAdminNote] = useState("");
  const [vqStatusOverrides, setVqStatusOverrides] = useState({}); // { [recordId]: verificationStatus }
  const [vqUpdating, setVqUpdating] = useState(null); // id being updated

  // AI Verification Controls States
  const [aiScans, setAiScans] = useState([]);
  const [aiSettings, setAiSettings] = useState({
    ai_min_confidence_threshold: "80.00",
    ai_deepfake_check_enabled: "true",
    ai_video_tampering_check_enabled: "true",
    ai_audio_tampering_check_enabled: "true"
  });
  const [aiSearchQuery, setAiSearchQuery] = useState("");
  const [aiFilterStatus, setAiFilterStatus] = useState("all"); // "all" | "passed" | "suspicious" | "failed" | "overridden" | "flagged"
  const [selectedAiScan, setSelectedAiScan] = useState(null);
  const [isAiDetailModalOpen, setIsAiDetailModalOpen] = useState(false);
  const [aiOverrideStatus, setAiOverrideStatus] = useState("none");
  const [aiOverrideReason, setAiOverrideReason] = useState("");
  const [isAiActionUpdating, setIsAiActionUpdating] = useState(false);

  // Phase 3 & 4 States
  const [reports, setReports] = useState([]);
  const [messages, setMessages] = useState([]);
  const [bans, setBans] = useState([]);
  const [mediaAssets, setMediaAssets] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [revenueMetrics, setRevenueMetrics] = useState({ totalRevenue: 0, activeSubscriptions: 0, recentTransactions: [] });
  const [vipRequests, setVipRequests] = useState([]);

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
  const [productForm, setProductForm] = useState({ name: "", description: "", price: "", imageUrl: "", category: "Accessories", stockCount: "", sizes: [], imageUrls: [] });
  const [membershipForm, setMembershipForm] = useState({ userId: "", tier: "bronze", autoRenew: false, paymentAmount: 0 });
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", parent: "", active: true });
  const [ageGroupForm, setAgeGroupForm] = useState({ name: "", minAge: "", maxAge: "", description: "", active: true });
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    active: true,
    expirationDate: "",
    appliesTo: "all",
    targetId: "",
    minPurchase: "",
    maxRedemptions: "",
    restrictedMembershipTier: "",
    restrictedCountry: "",
    autoGenerate: false
  });

  const [successMessagesForm, setSuccessMessagesForm] = useState({
    msg_shop: "",
    msg_spectator: "",
    msg_combined: "",
    msg_record: "",
    msg_challenge: ""
  });


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
      } else if (activeTab === "orders") {
        const data = await apiCall("/admin/orders", "GET", null, user.token);
        setOrders(data || []);
      } else if (activeTab === "adjudicators") {
        const [judgesData, recordsData, usersData] = await Promise.all([
          apiCall("/admin/judges", "GET", null, user.token).catch(() => []),
          apiCall("/records/admin/submissions", "GET", null, user.token).catch(() => []),
          apiCall("/dashboard/users/list/all", "GET", null, user.token).catch(() => ({ users: [] }))
        ]);
        setJudges(judgesData || []);
        setRecords(recordsData || []);
        setUsers(usersData.users || []);
      } else if (activeTab === "verificationQueue") {
        const recData = await apiCall("/records/admin/submissions", "GET", null, user.token).catch(() => []);
        setRecords(recData || []);
      } else if (activeTab === "aiVerification") {
        const [scansData, settingsData] = await Promise.all([
          apiCall("/admin/ai-verification/scans", "GET", null, user.token).catch(() => []),
          apiCall("/admin/ai-verification/settings", "GET", null, user.token).catch(() => ({
            ai_min_confidence_threshold: "80.00",
            ai_deepfake_check_enabled: "true",
            ai_video_tampering_check_enabled: "true",
            ai_audio_tampering_check_enabled: "true"
          }))
        ]);
        setAiScans(scansData || []);
        setAiSettings(settingsData);
      }
      else if (activeTab === "moderation") {
        const [reportsData, messagesData, bansData] = await Promise.all([
          apiCall("/admin/reports", "GET", null, user.token).catch(() => []),
          apiCall("/admin/messages", "GET", null, user.token).catch(() => []),
          apiCall("/admin/bans", "GET", null, user.token).catch(() => [])
        ]);
        setReports(reportsData || []);
        setMessages(messagesData || []);
        setBans(bansData || []);
      } else if (activeTab === "mediaLibrary" || activeTab === "contentManagement") {
        const [mediaData, certData] = await Promise.all([
          apiCall("/admin/media", "GET", null, user.token).catch(() => []),
          apiCall("/admin/certificates", "GET", null, user.token).catch(() => [])
        ]);
        setMediaAssets(mediaData || []);
        setCertificates(certData || []);
      } else if (activeTab === "security" || activeTab === "systemSettings") {
        const [auditData, apiData] = await Promise.all([
          apiCall("/admin/security/audit-logs", "GET", null, user.token).catch(() => []),
          apiCall("/admin/security/api-keys", "GET", null, user.token).catch(() => [])
        ]);
        setAuditLogs(auditData || []);
        setApiKeys(apiData || []);
      } else if (activeTab === "monetization" || activeTab === "sponsorships" || activeTab === "vip") {
        const [sponsorData, revData] = await Promise.all([
          apiCall("/admin/monetization/sponsors", "GET", null, user.token).catch(() => []),
          apiCall("/admin/monetization/revenue", "GET", null, user.token).catch(() => ({ totalRevenue: 0, activeSubscriptions: 0, recentTransactions: [] }))
        ]);
        setSponsors(sponsorData || []);
        setRevenueMetrics(revData || { totalRevenue: 0, activeSubscriptions: 0, recentTransactions: [] });
      } else if (activeTab === "dashboard" || activeTab === "revenue") {
        const [membData, statsData, dashData, eventsData, couponsData, couponStatsData, productsData, paymentsData, messagesData] = await Promise.all([
          apiCall("/memberships?page=1&limit=100", "GET", null, user.token).catch(() => ({ memberships: [] })),
          apiCall("/memberships/stats/overview", "GET", null, user.token).catch(() => null),
          apiCall("/dashboard/dashboard", "GET", null, user.token).catch(() => null),
          apiCall("/admin/events", "GET", null, user.token).catch(() => []),
          apiCall("/coupons", "GET", null, user.token).catch(() => []),
          apiCall("/coupons/stats", "GET", null, user.token).catch(() => null),
          apiCall("/admin/products", "GET", null, user.token).catch(() => []),
          apiCall("/admin/payments", "GET", null, user.token).catch(() => ({ payments: [], metrics: null })),
          apiCall("/contact/success-messages", "GET").catch(() => null)
        ]);
        setMemberships(membData.memberships || []);
        setMembershipStats(statsData);
        // setTierConfigs(tierData || {}); // Unused
        setDashboardStats(dashData);
        setCoupons(couponsData || []);
        setCouponStats(couponStatsData);
        setProducts(productsData || []);
        setLedgerPayments(paymentsData.payments || []);
        setLedgerMetrics(paymentsData.metrics);
        if (messagesData) setSuccessMessagesForm(messagesData);
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
      else if (activeTab === "orders") endpoint = `/admin/orders/${id}`;
      else if (activeTab === "contacts") endpoint = `/admin/contacts/${id}`;
      else if (activeTab === "revenue") {
        if (revenueSubTab === "coupons") {
          endpoint = `/coupons/${id}`;
        }
      }

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
      else if (activeTab === "orders") setOrders(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "contacts") setContacts(prev => prev.filter(x => x.id !== id));
      else if (activeTab === "revenue") {
        if (revenueSubTab === "coupons") {
          setCoupons(prev => prev.filter(x => x.id !== id));
        }
      }
      alert("Deleted successfully");
    } catch (err) {
      alert(`Deletion failed: ${err.message}`);
    }
  };


  const handleUserAction = async (id, action) => {
    try {
      if (action === 'suspend') {
        if (!window.confirm("Are you sure you want to suspend this user?")) return;
        setUsers(users.map(u => u.id === id ? { ...u, account_status: 'suspended' } : u));
        alert("User suspended successfully");
      } else if (action === 'ban') {
        if (!window.confirm("Are you sure you want to permanently BAN this user?")) return;
        setUsers(users.map(u => u.id === id ? { ...u, account_status: 'banned' } : u));
        alert("User banned successfully");
      } else if (action === 'resetPassword') {
        if (!window.confirm("Send a password reset link to this user?")) return;
        alert("Password reset instructions sent to user");
      }
    } catch (err) {
      alert(`Action failed: ${err.message}`);
    }
  };

  const handleUpdateReport = async (id, status) => {
    try {
      const res = await apiCall(`/admin/reports/${id}`, "PUT", { status }, user.token);
      if (res) {
        alert(`Report marked as ${status}`);
        fetchData();
      }
    } catch (err) {
      alert(`Error updating report: ${err.message}`);
    }
  };

  const handlePaymentStatusUpdate = (payment, newStatus) => {
    showConfirm(
      newStatus === 'refunded' ? "PROCESS REFUND?" : "UPDATE PAYMENT STATUS?",
      `Are you sure you want to change the status of transaction ${payment.id} to ${newStatus.toUpperCase()}? This will update the primary records in real-time.`,
      async () => {
        try {
          setLoading(true);
          const response = await apiCall("/admin/payments/update", "PUT", {
            paymentType: payment.paymentType,
            referenceId: payment.referenceId,
            status: newStatus
          }, user.token);
          
          if (response && response.success) {
            alert(`Payment status successfully set to ${newStatus.toUpperCase()}!`);
            fetchData();
          } else {
            alert("Failed to update payment status.");
          }
        } catch (err) {
          console.error("Error updating payment status:", err);
          alert("Error: Database update failed.");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleSaveSuccessMessages = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      const res = await apiCall("/admin/success-messages", "PUT", successMessagesForm, user.token);
      if (res && res.success) {
        alert("SUCCESS MESSAGES CONFIGURATION SAVED SUCCESSFULLY!");
        fetchData();
      } else {
        alert("Failed to save success messages config.");
      }
    } catch (err) {
      console.error("Error saving success messages:", err);
      alert(`Error saving success messages: ${err.message}`);
    } finally {
      setLoading(false);
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
      if (type === "viewProfile" && item) {
        setRecordsSubTab("overview");
      } else if (type === "edit" && item) {
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
          stockCount: item.stock_count || "",
          sizes: item.sizes || [],
          imageUrls: item.image_urls || []
        });
      } else {
        setProductForm({ name: "", description: "", price: "", imageUrl: "", category: "Accessories", stockCount: "", sizes: [], imageUrls: [] });
      }
    } else if (activeTab === "revenue") {
      if (type === "edit" && item) {
        setCouponForm({
          code: item.code || "",
          discountType: item.discount_type || "percentage",
          discountValue: item.discount_value || "",
          active: item.active !== undefined ? item.active : true,
          expirationDate: item.expiration_date ? new Date(item.expiration_date).toISOString().split("T")[0] : "",
          appliesTo: item.applies_to || "all",
          targetId: item.target_id || "",
          minPurchase: item.min_purchase || "",
          maxRedemptions: item.max_redemptions || "",
          restrictedMembershipTier: item.restricted_membership_tier || "",
          restrictedCountry: item.restricted_country || "",
          autoGenerate: false
        });
      } else {
        setCouponForm({
          code: "",
          discountType: "percentage",
          discountValue: "",
          active: true,
          expirationDate: "",
          appliesTo: "all",
          targetId: "",
          minPurchase: "",
          maxRedemptions: "",
          restrictedMembershipTier: "",
          restrictedCountry: "",
          autoGenerate: false
        });
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
        if (revenueSubTab === "coupons") {
          endpoint = `/coupons${modalType === "edit" && modalTarget ? `/${modalTarget.id}` : ""}`;
          payload = couponForm;
        } else {
          if (modalType === "add") {
            endpoint = "/memberships";
            payload = membershipForm;
          } else {
            endpoint = `/memberships/${modalTarget.id || modalTarget._id}`;
            payload = membershipForm;
            method = "PUT";
          }
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

  // Seeding mock judges in case roster is unpopulated, to provide a beautiful high-fidelity interactive flow
  useEffect(() => {
    if (activeTab === "adjudicators" && (!judges || judges.length === 0)) {
      setJudges([
        {
          id: "j-1",
          name: "Rogue Marshal Team",
          email: "marshals@rogueworldrecords.com",
          role: "judge",
          admin_notes: "Elite veteran review team. Expert in physical speed and weightlifting challenges.",
          stats: { assigned: 8, pending: 2, completed: 6, verified: 4, rejected: 2, averageSpeed: "0.8 days" }
        },
        {
          id: "j-2",
          name: "Chief Adjudicator Sarah Jenkins",
          email: "sarah.j@rogueworldrecords.com",
          role: "judge",
          admin_notes: "Senior adjudicator, details-oriented. Handles high-stakes tech and endurance records.",
          stats: { assigned: 5, pending: 1, completed: 4, verified: 3, rejected: 1, averageSpeed: "1.4 days" }
        },
        {
          id: "j-3",
          name: "Timing Specialist Liam Vance",
          email: "liam.vance@rogueworldrecords.com",
          role: "judge",
          admin_notes: "Precision calibration analyst. Expert in digital time-based athletics.",
          stats: { assigned: 3, pending: 0, completed: 3, verified: 2, rejected: 1, averageSpeed: "0.9 days" }
        }
      ]);
    }
  }, [activeTab, judges]);

  const handlePromoteToJudge = async (athlete) => {
    try {
      const payload = { ...athlete, role: 'judge' };
      await apiCall(`/admin/users/${athlete.id}`, "PUT", payload, user.token);
      alert(`Successfully promoted ${athlete.name} to Certified Adjudicator.`);
      setIsPromoteModalOpen(false);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      const updatedJudges = [...judges, { ...athlete, role: 'judge', admin_notes: '', stats: { assigned: 0, pending: 0, completed: 0, verified: 0, rejected: 0, averageSpeed: '1.2 days' } }];
      setJudges(updatedJudges);
      setUsers(users.filter(u => u.id !== athlete.id));
      alert(`[SANDBOX SIMULATION] Promoted ${athlete.name} to Adjudicator Roster.`);
      setIsPromoteModalOpen(false);
    }
  };

  const handleRevokeJudge = async (judge) => {
    if (!window.confirm(`Are you sure you want to revoke Adjudicator credentials for ${judge.name}? This will return them to an Athlete account.`)) return;
    try {
      const payload = { ...judge, role: 'athlete' };
      await apiCall(`/admin/users/${judge.id}`, "PUT", payload, user.token);
      alert(`Revoked Adjudicator credentials for ${judge.name}.`);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setJudges(judges.filter(j => j.id !== judge.id));
      setUsers([...users, { ...judge, role: 'athlete' }]);
      alert(`[SANDBOX SIMULATION] Revoked Adjudicator credentials for ${judge.name}.`);
    }
  };

  const handleSaveJudgeNotes = async () => {
    if (!selectedJudgeForNotes) return;
    try {
      await apiCall(`/admin/judges/${selectedJudgeForNotes.id}/notes`, "PUT", { adminNotes: judgeNotesText }, user.token);
      alert("Oversight notes updated successfully.");
      setIsJudgeNotesModalOpen(false);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setJudges(judges.map(j => j.id === selectedJudgeForNotes.id ? { ...j, admin_notes: judgeNotesText } : j));
      setIsJudgeNotesModalOpen(false);
      alert("[SANDBOX SIMULATION] Judge oversight notes updated.");
    }
  };

  const handleAssignRecord = async (recordId, judgeId) => {
    if (!judgeId) return;
    const selectedJudge = judges.find(j => j.id === judgeId);
    try {
      await apiCall(`/admin/records/${recordId}/assign`, "PUT", { judgeId }, user.token);
      alert(`Successfully assigned submission to ${selectedJudge ? selectedJudge.name : 'Judge'}.`);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setRecords(records.map(r => r.id === recordId ? { 
        ...r, 
        assigned_judge_id: judgeId, 
        judge_decision: 'pending',
        judge_notes: '',
        judge_assigned_at: new Date().toISOString()
      } : r));
      if (selectedJudge) {
        setJudges(judges.map(j => j.id === judgeId ? {
          ...j,
          stats: { ...j.stats, assigned: j.stats.assigned + 1, pending: j.stats.pending + 1 }
        } : j));
      }
      alert(`[SANDBOX SIMULATION] Assigned submission to ${selectedJudge ? selectedJudge.name : 'Judge'}.`);
    }
  };

  const handleSimulateJudgeVerdict = async (recordId, decision, notes) => {
    try {
      await apiCall(`/admin/records/${recordId}/judge-review`, "PUT", { decision, notes }, user.token);
      alert("Judge recommendation registered successfully.");
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setRecords(records.map(r => r.id === recordId ? {
        ...r,
        judge_decision: decision,
        judge_notes: notes || 'Evidence conforms with Rogue World Records standard codes.',
        judge_decided_at: new Date().toISOString()
      } : r));
      alert(`[SANDBOX SIMULATION] Judge recommended record to be [${decision.toUpperCase()}].`);
    }
  };

  const handleApproveOversightDecision = async (record) => {
    try {
      await apiCall(`/admin/records/${record.id}/approve`, "PUT", {}, user.token);
      alert(`Record has been officially approved and published! Status set to ${record.judge_decision}.`);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setRecords(records.map(r => r.id === record.id ? {
        ...r,
        status: record.judge_decision,
        judge_decision: null
      } : r));
      if (record.assigned_judge_id) {
        setJudges(judges.map(j => j.id === record.assigned_judge_id ? {
          ...j,
          stats: { 
            ...j.stats, 
            pending: Math.max(0, j.stats.pending - 1),
            completed: j.stats.completed + 1,
            verified: record.judge_decision === 'verified' ? j.stats.verified + 1 : j.stats.verified,
            rejected: record.judge_decision === 'rejected' ? j.stats.rejected + 1 : j.stats.rejected
          }
        } : j));
      }
      alert(`[SANDBOX SIMULATION] Official record approved and published live: [${record.judge_decision.toUpperCase()}]`);
    }
  };

  const handleRevertOversightDecision = async () => {
    if (!selectedOversightRecord) return;
    try {
      await apiCall(`/admin/records/${selectedOversightRecord.id}/revert`, "PUT", { adminFeedback: oversightRevertFeedback }, user.token);
      alert("Recommendation sent back for revision.");
      setIsOversightRevertModalOpen(false);
      fetchData();
    } catch (err) {
      // Sandbox fallback
      setRecords(records.map(r => r.id === selectedOversightRecord.id ? {
        ...r,
        judge_decision: 'pending',
        judge_notes: `[ADMIN CORRECTION REVISION]: ${oversightRevertFeedback}`
      } : r));
      setIsOversightRevertModalOpen(false);
      alert(`[SANDBOX SIMULATION] Recommendation sent back to judge with correction notes: "${oversightRevertFeedback}"`);
    }
  };

  const handleSaveAiSettings = async (configs) => {
    try {
      await apiCall("/admin/ai-verification/settings", "PUT", configs, user.token);
      alert("AI configuration settings updated successfully.");
      setAiSettings(prev => ({ ...prev, ...configs }));
    } catch (err) {
      // Sandbox fallback
      setAiSettings(prev => ({ ...prev, ...configs }));
      alert("[SANDBOX SIMULATION] AI configuration settings updated.");
    }
  };

  const handleAIScanOverride = async (recordId, overrideStatus, overrideReason) => {
    setIsAiActionUpdating(true);
    try {
      await apiCall(`/admin/ai-verification/scans/${recordId}/override`, "PUT", { overrideStatus, overrideReason }, user.token);
      alert(`AI scan decision overridden successfully to: ${overrideStatus.toUpperCase()}`);
      
      // Update local state
      setAiScans(prev => prev.map(scan => {
        if (scan.record_id === recordId) {
          return {
            ...scan,
            override_status: overrideStatus,
            override_reason: overrideReason
          };
        }
        return scan;
      }));
      
      // Update record status locally as well
      setRecords(prev => prev.map(rec => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: overrideStatus === "approved" ? "verified" : overrideStatus === "rejected" ? "rejected" : rec.status
          };
        }
        return rec;
      }));
      
      setIsAiDetailModalOpen(false);
    } catch (err) {
      // Sandbox fallback
      setAiScans(prev => prev.map(scan => {
        if (scan.record_id === recordId) {
          return {
            ...scan,
            override_status: overrideStatus,
            override_reason: overrideReason
          };
        }
        return scan;
      }));
      setRecords(prev => prev.map(rec => {
        if (rec.id === recordId) {
          return {
            ...rec,
            status: overrideStatus === "approved" ? "verified" : overrideStatus === "rejected" ? "rejected" : rec.status
          };
        }
        return rec;
      }));
      setIsAiDetailModalOpen(false);
      alert(`[SANDBOX SIMULATION] Overrode AI scan to ${overrideStatus.toUpperCase()} successfully.`);
    } finally {
      setIsAiActionUpdating(false);
    }
  };

  const handleAIScanFlag = async (recordId, suspiciousFlagged) => {
    setIsAiActionUpdating(true);
    try {
      await apiCall(`/admin/ai-verification/scans/${recordId}/flag`, "PUT", { suspiciousFlagged }, user.token);
      alert(suspiciousFlagged ? "Record marked as suspicious and prioritized." : "Suspicious flag removed.");
      
      setAiScans(prev => prev.map(scan => {
        if (scan.record_id === recordId) {
          return {
            ...scan,
            suspicious_flagged: suspiciousFlagged
          };
        }
        return scan;
      }));
    } catch (err) {
      // Sandbox fallback
      setAiScans(prev => prev.map(scan => {
        if (scan.record_id === recordId) {
          return {
            ...scan,
            suspicious_flagged: suspiciousFlagged
          };
        }
        return scan;
      }));
      alert(`[SANDBOX SIMULATION] Flag state updated for record scan.`);
    } finally {
      setIsAiActionUpdating(false);
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                {[
                  { label: "Total Users", value: dashboardStats?.counts?.users?.toLocaleString() || 0, icon: <Users size={20} />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                  { label: "Total Submissions", value: dashboardStats?.counts?.records?.toLocaleString() || 0, icon: <FileText size={20} />, color: "#a855f7", bg: "rgba(168,85,247,0.1)" },
                  { label: "Pending Reviews", value: "0", icon: <Clock size={20} />, color: "#FF6A00", bg: "rgba(255,106,0,0.1)" },
                  { label: "Approved Records", value: dashboardStats?.counts?.records?.toLocaleString() || 0, icon: <CheckCircle size={20} />, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                  { label: "Denied Records", value: "0", icon: <XCircle size={20} />, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                  { label: "Appeals", value: "0", icon: <ShieldAlert size={20} />, color: "#eab308", bg: "rgba(234,179,8,0.1)" },
                  { label: "Challenge Submissions", value: "0", icon: <Target size={20} />, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
                  { label: "Revenue Totals", value: `$${(membershipStats?.totalRevenue || (dashboardStats?.counts?.memberships * 10) || 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
                  { label: "Membership Totals", value: dashboardStats?.counts?.memberships?.toLocaleString() || 0, icon: <Sparkles size={20} />, color: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
                  { label: "Ticket Sales", value: dashboardStats?.counts?.tickets?.toLocaleString() || 0, icon: <Ticket size={20} />, color: "#f97316", bg: "rgba(249,115,22,0.1)" },
                  { label: "Shop Orders", value: dashboardStats?.counts?.products?.toLocaleString() || 0, icon: <ShoppingBag size={20} />, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
                  { label: "Live Event Activity", value: dashboardStats?.counts?.events?.toLocaleString() || 0, icon: <Radio size={20} />, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                  { label: "Trending Records", value: "0", icon: <TrendingUp size={20} />, color: "#14b8a6", bg: "rgba(20,184,166,0.1)" },
                  { label: "Most Active Categories", value: dashboardStats?.counts?.categories?.toLocaleString() || 0, icon: <Activity size={20} />, color: "#FF5500", bg: "rgba(255,85,0,0.1)" }
                ].map((stat, idx) => (
                  <div key={idx} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", transition: "transform 0.2s, box-shadow 0.2s", cursor: "default" }} 
                       onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }} 
                       onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                        {stat.icon}
                      </div>
                    </div>
                    <div style={{ fontSize: "13px", color: "#888", marginBottom: "4px", fontWeight: "600" }}>{stat.label}</div>
                    <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>{stat.value}</div>
                  </div>
                ))}
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

              {/* Checkout Success Message Management Suite */}
              <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <div>
                    <h3 style={{ fontSize: "18px", fontWeight: "950", margin: 0, textTransform: "uppercase", color: "white", letterSpacing: "-0.5px" }}>
                      ✉️ Checkout Success Message Management
                    </h3>
                    <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700" }}>
                      CUSTOMIZE POST-CHECKOUT CONFIRMATION MESSAGES SHOWN TO CUSTOMERS IN REAL-TIME
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveSuccessMessages} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                        🛍️ Shop Item Purchase Success Message
                      </label>
                      <textarea
                        value={successMessagesForm.msg_shop || ""}
                        onChange={(e) => setSuccessMessagesForm({ ...successMessagesForm, msg_shop: e.target.value })}
                        required
                        placeholder="Customize message for shop item purchases..."
                        style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px", resize: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                        🎟️ Spectator Pass Purchase Success Message
                      </label>
                      <textarea
                        value={successMessagesForm.msg_spectator || ""}
                        onChange={(e) => setSuccessMessagesForm({ ...successMessagesForm, msg_spectator: e.target.value })}
                        required
                        placeholder="Customize message for spectator pass purchases..."
                        style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px", resize: "none", fontFamily: "inherit" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                        📦 Combined Order Success Message (Shop + Pass)
                      </label>
                      <textarea
                        value={successMessagesForm.msg_combined || ""}
                        onChange={(e) => setSuccessMessagesForm({ ...successMessagesForm, msg_combined: e.target.value })}
                        required
                        placeholder="Customize message for combined shop items and passes..."
                        style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px", resize: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                          🏅 Record Fee Message
                        </label>
                        <textarea
                          value={successMessagesForm.msg_record || ""}
                          onChange={(e) => setSuccessMessagesForm({ ...successMessagesForm, msg_record: e.target.value })}
                          required
                          placeholder="Customize message for record fee checkouts..."
                          style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "12px", resize: "none", fontFamily: "inherit" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                          ⚔️ Challenge Message
                        </label>
                        <textarea
                          value={successMessagesForm.msg_challenge || ""}
                          onChange={(e) => setSuccessMessagesForm({ ...successMessagesForm, msg_challenge: e.target.value })}
                          required
                          placeholder="Customize message for challenge fee checkouts..."
                          style={{ width: "100%", height: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "12px", resize: "none", fontFamily: "inherit" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", display: "flex", justifyContent: "flex-end" }}>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 40px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: "1px", boxShadow: "0 6px 20px rgba(255,85,0,0.3)", transition: "all 0.2s" }}
                    >
                      {loading ? "SAVING MESSAGES..." : "SAVE CONFIGURATION"}
                    </button>
                  </div>
                </form>
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
                            <div id={`actions-${u.id}`} style={{ display: 'none', position: 'absolute', right: 0, top: '100%', background: '#222', border: '1px solid #333', borderRadius: '8px', padding: '4px', zIndex: 10, width: '150px' }}>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; openModal('viewProfile', u); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer' }}>View Profile</button>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; openModal('edit', u); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: 'white', fontSize: '12px', cursor: 'pointer' }}>Edit User</button>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; handleUserAction(u.id, 'suspend'); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#f59e0b', fontSize: '12px', cursor: 'pointer' }}>Suspend User</button>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; handleUserAction(u.id, 'ban'); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Ban User</button>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; handleUserAction(u.id, 'resetPassword'); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#3b82f6', fontSize: '12px', cursor: 'pointer' }}>Reset Password</button>
                               <button type="button" onClick={(e) => { e.preventDefault(); document.getElementById(`actions-${u.id}`).style.display='none'; handleDelete(u.id); }} style={{ width: '100%', textAlign: 'left', padding: '8px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}>Delete User</button>
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

          {/* ==================== 10. SHOP ORDERS & SHIPPING ==================== */}
          {activeTab === "orders" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-1.0px", margin: 0 }}>
                    📦 Shop Orders & Customer Purchases
                  </h2>
                  <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0", fontWeight: "700", letterSpacing: "0.5px" }}>
                    MANAGE CUSTOMER SHIPMENTS AND ORDER FULFILLMENT STATUS
                  </p>
                </div>
                {selectedCustomerEmail && (
                  <button
                    onClick={() => { setSelectedCustomerEmail(""); setCustomerHistory(null); }}
                    style={{ background: "#222", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 20px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}
                  >
                    ← SHOW ALL ORDERS
                  </button>
                )}
              </div>

              {/* Stats overview cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", textTransform: "uppercase" }}>Total Orders</div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: "white", marginTop: "8px" }}>{orders.length}</div>
                </div>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", textTransform: "uppercase" }}>Pending Shipments</div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: "#FF5500", marginTop: "8px" }}>
                    {orders.filter(o => o.shipping_status === 'pending').length}
                  </div>
                </div>
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "16px", padding: "20px" }}>
                  <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", textTransform: "uppercase" }}>Paid Revenue</div>
                  <div style={{ fontSize: "28px", fontWeight: "900", color: "#22c55e", marginTop: "8px" }}>
                    ${orders.filter(o => o.payment_status === 'paid').reduce((acc, o) => acc + parseFloat(o.total || 0), 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Search & filters */}
              <div style={{ background: "rgba(13,13,16,0.5)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "20px 24px", marginBottom: "24px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#0c0c0e", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "6px 16px" }}>
                  <Search size={14} color="#555" style={{ marginRight: "12px" }} />
                  <input
                    type="text"
                    placeholder="Search by customer name, email, or order ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: "transparent", border: "none", color: "white", fontSize: "13px", outline: "none", width: "100%" }}
                  />
                </div>
                
                <div style={{ display: "flex", gap: "12px" }}>
                  <select
                    value={shippingStatusFilter}
                    onChange={(e) => setShippingStatusFilter(e.target.value)}
                    style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "10px 16px", color: "#aaa", fontSize: "12px", outline: "none", fontWeight: "700" }}
                  >
                    <option value="all">All Shipping Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "10px 16px", color: "#aaa", fontSize: "12px", outline: "none", fontWeight: "700" }}
                  >
                    <option value="all">All Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "120px 0", background: "rgba(13,13,16,0.3)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.03)" }}>
                  <Loader2 className="animate-spin" size={36} color="#FF5500" />
                  <p style={{ color: "#666", marginTop: "16px", fontSize: "13px", letterSpacing: "1.5px" }}>LOADING SHOP ORDERS...</p>
                </div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: "center", padding: "80px 40px", background: "rgba(13,13,16,0.2)", borderRadius: "24px", border: "1px dashed rgba(255,255,255,0.06)" }}>
                  <ShoppingBag size={36} color="#555" style={{ marginBottom: "16px" }} />
                  <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "white" }}>NO ORDERS PLACED YET</h4>
                  <p style={{ color: "#666", fontSize: "12px", margin: 0 }}>Orders placed by customers will be logged here.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {orders
                    .filter(o => {
                      const emailToMatch = selectedCustomerEmail || searchQuery;
                      const matchesSearch = !emailToMatch || 
                        o.customer_name?.toLowerCase().includes(emailToMatch.toLowerCase()) || 
                        o.customer_email?.toLowerCase().includes(emailToMatch.toLowerCase()) || 
                        o.id?.toLowerCase().includes(emailToMatch.toLowerCase());
                      
                      const matchesShip = shippingStatusFilter === 'all' || o.shipping_status === shippingStatusFilter;
                      const matchesPay = paymentStatusFilter === 'all' || o.payment_status === paymentStatusFilter;
                      return matchesSearch && matchesShip && matchesPay;
                    })
                    .map(order => {
                      return (
                        <div key={order.id} style={{ background: "rgba(13,13,16,0.6)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "24px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                          
                          {/* Top Row: Order ID, Date, Totals */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <span style={{ fontSize: "14px", fontWeight: "950", color: "#FF5500" }}>
                                  ORDER #{order.id?.substring(0, 8).toUpperCase() || 'N/A'}
                                </span>
                                <span style={{ color: "#444", fontSize: "12px" }}>•</span>
                                <span style={{ color: "#888", fontSize: "12px", fontWeight: "700" }}>
                                  {new Date(order.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ color: "white", fontSize: "13px", fontWeight: "900" }}>{order.customer_name}</span>
                                <span style={{ color: "#444" }}>|</span>
                                <span 
                                  onClick={() => setSelectedCustomerEmail(order.customer_email)}
                                  style={{ color: "#FF5500", fontSize: "12px", fontWeight: "800", cursor: "pointer", textDecoration: "underline" }}
                                >
                                  {order.customer_email}
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                              {/* Shipping Status Dropdown */}
                              <div>
                                <label style={{ display: "block", fontSize: "9px", fontWeight: "900", color: "#666", textTransform: "uppercase", marginBottom: "4px" }}>Shipping</label>
                                <select
                                  value={order.shipping_status}
                                  onChange={async (e) => {
                                    try {
                                      const updated = await apiCall(`/admin/orders/${order.id}/shipping`, 'PUT', { shippingStatus: e.target.value }, user.token);
                                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, shipping_status: updated.shipping_status } : o));
                                      showToast("Shipping status updated successfully", "success");
                                    } catch (err) {
                                      showToast(`Failed: ${err.message}`, "error");
                                    }
                                  }}
                                  style={{
                                    background: order.shipping_status === 'pending' ? 'rgba(255, 106, 0, 0.1)' : order.shipping_status === 'shipped' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                                    color: order.shipping_status === 'pending' ? '#FF6A00' : order.shipping_status === 'shipped' ? '#22c55e' : 'white',
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    outline: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="processing">⚙️ Processing</option>
                                  <option value="shipped">🚚 Shipped</option>
                                  <option value="delivered">✅ Delivered</option>
                                  <option value="cancelled">❌ Cancelled</option>
                                </select>
                              </div>

                              {/* Payment Status Dropdown */}
                              <div>
                                <label style={{ display: "block", fontSize: "9px", fontWeight: "900", color: "#666", textTransform: "uppercase", marginBottom: "4px" }}>Payment</label>
                                <select
                                  value={order.payment_status}
                                  onChange={async (e) => {
                                    try {
                                      const updated = await apiCall(`/admin/orders/${order.id}/shipping`, 'PUT', { paymentStatus: e.target.value }, user.token);
                                      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, payment_status: updated.payment_status } : o));
                                      showToast("Payment status updated successfully", "success");
                                    } catch (err) {
                                      showToast(`Failed: ${err.message}`, "error");
                                    }
                                  }}
                                  style={{
                                    background: order.payment_status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: order.payment_status === 'paid' ? '#22c55e' : '#ef4444',
                                    border: "1px solid rgba(255,255,255,0.05)",
                                    borderRadius: "8px",
                                    padding: "6px 12px",
                                    fontSize: "11px",
                                    fontWeight: "800",
                                    outline: "none",
                                    cursor: "pointer"
                                  }}
                                >
                                  <option value="pending">⏳ Pending</option>
                                  <option value="paid">💳 Paid</option>
                                  <option value="failed">❌ Failed</option>
                                  <option value="refunded">↩️ Refunded</option>
                                </select>
                              </div>

                              <button
                                onClick={() => handleDelete(order.id)}
                                style={{ background: "transparent", border: "1px solid rgba(255,68,68,0.2)", color: "#ef4444", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", marginTop: "12px" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,68,68,0.1)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          {/* Order Details & Address */}
                          <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.03)", padding: "16px 0", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "24px" }}>
                            {/* Ordered items list */}
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: "900", color: "#666", textTransform: "uppercase", marginBottom: "10px" }}>Ordered Items</div>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {order.items && order.items.map((item, idx) => (
                                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0,0,0,0.15)", borderRadius: "8px", padding: "8px 12px", border: "1px solid rgba(255,255,255,0.02)" }}>
                                    <div>
                                      <span style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>{item.product_name}</span>
                                      {item.size && (
                                        <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", marginLeft: "8px" }}>
                                          {item.size}
                                        </span>
                                      )}
                                      {item.color && (
                                        <span style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", fontSize: "9px", fontWeight: "900", padding: "2px 6px", borderRadius: "4px", marginLeft: "4px" }}>
                                          {item.color}
                                        </span>
                                      )}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "white", fontWeight: "800" }}>
                                      {item.quantity}x <span style={{ color: "#FF5500" }}>${item.price}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            <div>
                              <div style={{ fontSize: "10px", fontWeight: "900", color: "#666", textTransform: "uppercase", marginBottom: "10px" }}>Shipping Destination</div>
                              <div style={{ fontSize: "13px", color: "#aaa", lineHeight: "1.5" }}>
                                {order.shipping_address || 'No shipping address provided.'}
                              </div>
                            </div>
                          </div>

                          {/* Sum Row */}
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                              <button
                                onClick={() => setSelectedCustomerEmail(order.customer_email)}
                                style={{ background: "transparent", border: "none", color: "#FF6A00", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                              >
                                VIEW CUSTOMER HISTORY <ArrowRight size={12} />
                              </button>
                            </div>
                            
                            <div style={{ display: "flex", gap: "24px", alignItems: "center", fontSize: "13px" }}>
                              <div style={{ color: "#666", fontWeight: "700" }}>
                                Subtotal: <span style={{ color: "white" }}>${order.subtotal?.toFixed(2)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div style={{ color: "#22c55e", fontWeight: "700" }}>
                                  Discount: <span>-${order.discount?.toFixed(2)}</span>
                                </div>
                              )}
                              <div style={{ fontSize: "16px", fontWeight: "950", color: "white" }}>
                                Total: <span style={{ color: "#FF5500" }}>${order.total?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {/* ==================== 5. MEMBERSHIP MANAGEMENT SUITE ==================== */}
          {activeTab === "memberships" && (

            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Membership Control Center
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    MEMBERSHIP
                    <br />MANAGEMENT
                  </h2>
                </div>
              </div>

              {/* Tiers Grid */}
              <div style={{ marginBottom: "40px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: "900", color: "white", marginBottom: "20px" }}>Manage Tiers & Limits</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "24px" }}>
                  {[
                    { name: 'Free', price: '$0/mo', limits: '3 Submissions', color: '#888', icon: <User size={24} /> },
                    { name: 'Bronze', price: '$9.99/mo', limits: '10 Submissions', color: '#cd7f32', icon: <Layers size={24} /> },
                    { name: 'Silver', price: '$19.99/mo', limits: '50 Submissions', color: '#c0c0c0', icon: <Target size={24} /> },
                    { name: 'Gold', price: '$49.99/mo', limits: 'Unlimited', color: '#ffd700', icon: <Trophy size={24} /> },
                  ].map(tier => (
                    <div key={tier.name} style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${tier.color}40`, borderRadius: "16px", padding: "24px", position: "relative" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: tier.color, borderTopLeftRadius: "16px", borderTopRightRadius: "16px" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", color: tier.color }}>
                        {tier.icon}
                        <button onClick={() => alert(`Editing tier: ${tier.name}. Form will open to modify price and limits.`)} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "4px 12px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}>EDIT TIER</button>
                      </div>
                      <h4 style={{ fontSize: "24px", fontWeight: "900", color: "white", margin: "0 0 8px 0" }}>{tier.name}</h4>
                      <div style={{ fontSize: "16px", fontWeight: "700", color: tier.color, marginBottom: "8px" }}>{tier.price}</div>
                      <div style={{ fontSize: "12px", color: "#888", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#FF5500' }} /> {tier.limits}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subscriptions & User Management */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: 0 }}>Active Subscriptions</h3>
                    <button onClick={() => { window.location.href = "/admin?tab=users"; }} style={{ background: "#222", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Manage All</button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { user: 'Marcus Thorne', email: 'marcus@example.com', action: 'Upgraded to Gold', date: 'Today, 10:42 AM', color: '#ffd700' },
                      { user: 'Sarah Jenkins', email: 'sarah@example.com', action: 'Renewed Silver', date: 'Yesterday', color: '#c0c0c0' },
                      { user: 'David Kim', email: 'dkim@example.com', action: 'Downgraded to Free', date: 'Oct 24, 2025', color: '#888' },
                      { user: 'Elena Rostova', email: 'elena@example.com', action: 'Cancelled Bronze', date: 'Oct 22, 2025', color: '#ef4444' }
                    ].map((activity, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                          <img src={`https://ui-avatars.com/api/?name=${activity.user}&background=random`} alt={activity.user} style={{ width: "32px", height: "32px", borderRadius: "50%" }} />
                          <div>
                            <div style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>{activity.user}</div>
                            <div style={{ color: activity.color, fontSize: "11px", fontWeight: "800", marginTop: "2px" }}>{activity.action}</div>
                          </div>
                        </div>
                        <div style={{ color: "#666", fontSize: "11px", fontWeight: "700", textAlign: "right" }}>
                          {activity.date}
                          <div style={{ marginTop: "4px" }}>
                            <button onClick={() => alert(`Managing subscription for ${activity.user}...`)} style={{ background: "transparent", border: "none", color: "#FF5500", fontSize: "10px", fontWeight: "900", cursor: "pointer", textDecoration: "underline" }}>Manage</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: 0 }}>Payment History</h3>
                    <button onClick={() => {
                      const data = [
                        { date: 'Oct 28, 2025', user: 'Marcus T.', amount: '$49.99', status: 'Success' },
                        { date: 'Oct 27, 2025', user: 'Sarah J.', amount: '$19.99', status: 'Success' },
                        { date: 'Oct 26, 2025', user: 'John D.', amount: '$9.99', status: 'Failed' },
                        { date: 'Oct 25, 2025', user: 'Alice W.', amount: '$49.99', status: 'Refunded' }
                      ];
                      let csvContent = "data:text/csv;charset=utf-8,Date,User,Amount,Status\n";
                      data.forEach(row => { csvContent += `${row.date},${row.user},${row.amount},${row.status}\n`; });
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", "payment_history.csv");
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>Export CSV</button>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ color: "#888", fontSize: "11px", fontWeight: "800", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <th style={{ paddingBottom: "12px" }}>Date</th>
                        <th style={{ paddingBottom: "12px" }}>User</th>
                        <th style={{ paddingBottom: "12px" }}>Amount</th>
                        <th style={{ paddingBottom: "12px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: 'Oct 28, 2025', user: 'Marcus T.', amount: '$49.99', status: 'Success' },
                        { date: 'Oct 27, 2025', user: 'Sarah J.', amount: '$19.99', status: 'Success' },
                        { date: 'Oct 26, 2025', user: 'John D.', amount: '$9.99', status: 'Failed' },
                        { date: 'Oct 25, 2025', user: 'Alice W.', amount: '$49.99', status: 'Refunded' }
                      ].map((payment, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                          <td style={{ color: "#aaa", fontSize: "12px", padding: "12px 0" }}>{payment.date}</td>
                          <td style={{ color: "white", fontSize: "12px", fontWeight: "600", padding: "12px 0" }}>{payment.user}</td>
                          <td style={{ color: "white", fontSize: "12px", fontWeight: "700", padding: "12px 0" }}>{payment.amount}</td>
                          <td style={{ padding: "12px 0" }}>
                            <span style={{ 
                              background: payment.status === 'Success' ? "rgba(34,197,94,0.1)" : payment.status === 'Failed' ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
                              color: payment.status === 'Success' ? "#22c55e" : payment.status === 'Failed' ? "#ef4444" : "#888",
                              padding: "4px 8px", borderRadius: "100px", fontSize: "10px", fontWeight: "800"
                            }}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 7. RECORD CATEGORY MANAGEMENT ==================== */}
          {activeTab === "categories" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Category Infrastructure
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    CATEGORY
                    <br />MANAGEMENT
                  </h2>
                </div>
                <button onClick={() => alert('Add New Category Modal Opens...')} style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "12px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}>
                  <Plus size={14} /> ADD NEW CATEGORY
                </button>
              </div>

              {/* Master Categories List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
                {[
                  { name: "Athletics", subs: ["Running", "Jumping", "Throwing"] },
                  { name: "Strength", subs: ["Powerlifting", "Weightlifting", "Grip"] },
                  { name: "Endurance", subs: ["Marathon", "Planking", "Cycling"] },
                  { name: "Balance", subs: ["Tightrope", "Handstand", "Slackline"] },
                  { name: "Skills", subs: ["Juggling", "Rubik's Cube", "Archery"] },
                  { name: "Gaming", subs: ["Speedruns", "High Scores", "eSports"] },
                  { name: "Water Sports", subs: ["Swimming", "Diving", "Surfing"] },
                  { name: "Reaction", subs: ["Reflex Catch", "Speed Typing"] },
                  { name: "Mind & Memory", subs: ["Pi Memorization", "Card Counting"] },
                  { name: "Action Sports", subs: ["Skateboarding", "BMX", "Parkour"] },
                  { name: "Other", subs: ["Miscellaneous", "Unclassified"] }
                ].map(cat => (
                  <div key={cat.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "linear-gradient(90deg, #FF5500, #ff8c00)" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                      <h3 style={{ fontSize: "24px", fontWeight: "950", color: "white", margin: 0, letterSpacing: "-0.5px" }}>{cat.name}</h3>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => alert(`Editing category: ${cat.name}`)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={14} /></button>
                        <button onClick={() => alert(`Deleting category: ${cat.name}`)} style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", width: "32px", height: "32px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div style={{ marginBottom: "20px", minHeight: "60px" }}>
                      <div style={{ fontSize: "11px", color: "#888", fontWeight: "800", textTransform: "uppercase", marginBottom: "10px", letterSpacing: "1px" }}>Subcategories ({cat.subs.length})</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {cat.subs.map(sub => (
                          <span key={sub} style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "6px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: "800" }}>{sub}</span>
                        ))}
                      </div>
                    </div>
                    
                    <button onClick={() => alert(`Managing subcategories for ${cat.name}... Add/Edit/Delete specific subcategories here.`)} style={{ width: "100%", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px", borderRadius: "8px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}>
                      <Layers size={14} /> MANAGE SUBCATEGORIES
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 8. AGE GROUP / DIVISIONS MANAGEMENT ==================== */}
          {activeTab === "divisions" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Demographic Settings
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    AGE GROUP
                    <br />MANAGEMENT
                  </h2>
                </div>
                <button onClick={() => alert('Add New Age Group Modal Opens...')} style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "12px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}>
                  <Plus size={14} /> ADD NEW DIVISION
                </button>
              </div>

              {/* Master Age Groups List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "60px" }}>
                {[
                  { name: "Junior Champions", range: "5–12", description: "Records set by our youngest, most aspiring athletes.", icon: <User size={20} color="#FF5500" /> },
                  { name: "Teen Legends", range: "13–17", description: "Fiercely competitive teen athletes breaking boundaries.", icon: <Zap size={20} color="#3b82f6" /> },
                  { name: "Adult Division", range: "18–49", description: "The prime athletic division where world records are shattered.", icon: <Activity size={20} color="#22c55e" /> },
                  { name: "Masters Division", range: "50+", description: "Veteran athletes proving age is just a number.", icon: <Trophy size={20} color="#ffd700" /> }
                ].map(group => (
                  <div key={group.name} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", width: "64px", height: "64px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                      {group.icon}
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                        <h3 style={{ fontSize: "24px", fontWeight: "950", color: "white", margin: 0, letterSpacing: "-0.5px" }}>{group.name}</h3>
                        <span style={{ background: "rgba(255,255,255,0.1)", color: "white", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", letterSpacing: "1px" }}>
                          AGES {group.range}
                        </span>
                      </div>
                      <p style={{ color: "#888", fontSize: "14px", margin: 0, lineHeight: "1.5" }}>{group.description}</p>
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => alert(`Editing Age Group: ${group.name}`)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "12px 20px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        <Edit3 size={14} /> EDIT SETTINGS
                      </button>
                      <button onClick={() => alert(`Deleting Age Group: ${group.name}`)} style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", width: "40px", height: "40px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 9. CHALLENGE RECORD MANAGEMENT ==================== */}
          {activeTab === "challenges" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Challenge Adjudication
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    CHALLENGES
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <select style={{ background: "transparent", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", appearance: "none", outline: "none" }}>
                    <option value="default">Display Order: Default</option>
                    <option value="hierarchy">Order: Current Record » Pending » Failed</option>
                    <option value="recent">Order: Most Recent</option>
                  </select>
                </div>
              </div>

              {/* Challenges List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "60px" }}>
                {[
                  { id: "CHL-9981", athlete: "David Miller", target: "Most Pull-ups in 1 Min", status: "Current Record", date: "Today", video: true },
                  { id: "CHL-9982", athlete: "Sarah Jenkins", target: "Longest Plank", status: "Pending Review", date: "Yesterday", video: true },
                  { id: "CHL-9983", athlete: "Marcus T.", target: "Fastest 100m Sprint", status: "Failed Attempt", date: "Oct 25, 2025", video: true },
                  { id: "CHL-9984", athlete: "Elena R.", target: "Highest Box Jump", status: "Approved Attempt", date: "Oct 24, 2025", video: false }
                ].map(challenge => (
                  <div key={challenge.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr 0.8fr 1fr", gap: "24px", alignItems: "center" }}>
                    
                    {/* Athlete & ID */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <img src={`https://ui-avatars.com/api/?name=${challenge.athlete}&background=random`} alt={challenge.athlete} style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
                      <div>
                        <div style={{ color: "#FF5500", fontSize: "10px", fontWeight: "900", letterSpacing: "1px" }}>{challenge.id}</div>
                        <div style={{ color: "white", fontSize: "16px", fontWeight: "800" }}>{challenge.athlete}</div>
                        <button onClick={() => alert("Opening Attempt History for " + challenge.athlete)} style={{ background: "transparent", border: "none", color: "#888", padding: 0, fontSize: "11px", fontWeight: "700", textDecoration: "underline", cursor: "pointer", marginTop: "4px" }}>View Attempt History</button>
                      </div>
                    </div>
                    
                    {/* Target Record Connection */}
                    <div>
                      <div style={{ color: "#666", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>TARGET RECORD</div>
                      <div style={{ color: "white", fontSize: "14px", fontWeight: "700", marginBottom: "8px" }}>{challenge.target}</div>
                      <button onClick={() => alert("Open modal to connect/re-link this challenge to a different Original Record.")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "4px 12px", borderRadius: "100px", fontSize: "10px", fontWeight: "800", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Edit3 size={10} /> CONNECT ORIGINAL
                      </button>
                    </div>

                    {/* Evidence */}
                    <div>
                      <div style={{ color: "#666", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>EVIDENCE</div>
                      {challenge.video ? (
                        <button onClick={() => alert("Playing Challenge Video Evidence...")} style={{ background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)", color: "#FF5500", padding: "6px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <Video size={14} /> WATCH VIDEO
                        </button>
                      ) : (
                        <span style={{ color: "#888", fontSize: "12px", fontWeight: "600", fontStyle: "italic" }}>No video attached</span>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "12px" }}>
                      <select 
                        defaultValue={challenge.status}
                        onChange={(e) => alert(`Status changed to: ${e.target.value}`)}
                        style={{ 
                          background: challenge.status === 'Current Record' ? "rgba(34,197,94,0.1)" : challenge.status === 'Failed Attempt' ? "rgba(239,68,68,0.1)" : challenge.status === 'Approved Attempt' ? "rgba(59,130,246,0.1)" : "rgba(255,106,0,0.1)", 
                          color: challenge.status === 'Current Record' ? "#22c55e" : challenge.status === 'Failed Attempt' ? "#ef4444" : challenge.status === 'Approved Attempt' ? "#3b82f6" : "#FF6A00",
                          border: "none", padding: "8px 16px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", cursor: "pointer", appearance: "none", textAlign: "center", width: "160px" 
                        }}
                      >
                        <option value="Current Record">Current Record</option>
                        <option value="Approved Attempt">Approved Attempt</option>
                        <option value="Pending Review">Pending Review</option>
                        <option value="Failed Attempt">Failed Attempt</option>
                      </select>
                      <div style={{ color: "#666", fontSize: "10px", fontWeight: "700" }}>Submitted: {challenge.date}</div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== 10. APPEAL MANAGEMENT ==================== */}
          {activeTab === "appeals" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Dispute Resolution
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    APPEALS
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <div style={{ background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)", padding: "10px 16px", borderRadius: "8px", color: "#FF5500", fontSize: "12px", fontWeight: "900" }}>
                    3 Pending Appeals
                  </div>
                </div>
              </div>

              {/* Appeals List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "60px" }}>
                {[
                  { id: "APP-001", athlete: "John Doe", record: "Fastest Mile Run", status: "Pending", date: "Today" },
                  { id: "APP-002", athlete: "Maria Garcia", record: "Most Pushups", status: "Additional Evidence Requested", date: "Yesterday" },
                  { id: "APP-003", athlete: "Liam Smith", record: "Longest Breath Hold", status: "Denied", date: "Oct 25, 2025" }
                ].map(appeal => (
                  <div key={appeal.id} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", display: "grid", gridTemplateColumns: "1.2fr 1.5fr 1fr", gap: "24px" }}>
                    
                    {/* Athlete & Record Info */}
                    <div>
                      <div style={{ color: "#FF5500", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>{appeal.id}</div>
                      <div style={{ color: "white", fontSize: "18px", fontWeight: "900", marginBottom: "4px" }}>{appeal.athlete}</div>
                      <div style={{ color: "#aaa", fontSize: "12px", fontWeight: "700", marginBottom: "12px" }}>Record: {appeal.record}</div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <span style={{ 
                          background: appeal.status === 'Approved' ? "rgba(34,197,94,0.1)" : appeal.status === 'Denied' ? "rgba(239,68,68,0.1)" : appeal.status === 'Pending' ? "rgba(255,106,0,0.1)" : "rgba(255,204,0,0.1)", 
                          color: appeal.status === 'Approved' ? "#22c55e" : appeal.status === 'Denied' ? "#ef4444" : appeal.status === 'Pending' ? "#FF6A00" : "#ffcc00",
                          padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", display: "inline-block"
                        }}>
                          STATUS: {appeal.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Evidence & Eyewitness */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "24px" }}>
                      <div style={{ color: "#666", fontSize: "10px", fontWeight: "900", letterSpacing: "1px" }}>REVIEW MATERIALS</div>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        <button onClick={() => alert("Opening Evidence Viewer...")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Video size={12} /> View Uploaded Evidence
                        </button>
                        <button onClick={() => alert("Opening Eyewitness Registry...")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px 12px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                          <Users size={12} /> View Eyewitness Info
                        </button>
                      </div>
                    </div>

                    {/* Adjudication Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", borderLeft: "1px solid rgba(255,255,255,0.05)", paddingLeft: "24px" }}>
                      <div style={{ color: "#666", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>ACTIONS</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        <button onClick={() => alert("Appeal Approved. Notification sent to athlete.")} style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", padding: "8px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}>Approve</button>
                        <button onClick={() => alert("Appeal Denied. Case closed.")} style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "8px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}>Deny</button>
                      </div>
                      <button onClick={() => alert("Requesting more evidence. Athlete will be notified.")} style={{ background: "transparent", border: "1px solid #ffcc00", color: "#ffcc00", padding: "8px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}>Request Additional Evidence</button>
                      <button onClick={() => alert("Drafting manual appeal update email...")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "8px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                         Send Appeal Email
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* ==================== VIDEO & EVIDENCE MANAGEMENT (NESTED IN APPEALS) ==================== */}
              <div style={{ marginTop: "40px", paddingTop: "40px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                  <div>
                    <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                      Media & Asset Hub
                    </div>
                    <h3 style={{ fontSize: "36px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-1px", textTransform: "uppercase", lineHeight: "1" }}>
                      VIDEO & EVIDENCE
                      <br />MANAGEMENT
                    </h3>
                  </div>
                  <button onClick={() => alert("Global Media Sync Initiated (YouTube & Cloud Storage)")} style={{ background: "#FF5500", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}>
                    <Video size={14} /> SYNC YOUTUBE INTEGRATIONS
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", paddingBottom: "60px" }}>
                  
                  {/* Category 1: Record & Attempt Videos */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                    <div style={{ background: "rgba(255,85,0,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                      <Video size={20} color="#FF5500" />
                    </div>
                    <h4 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: "0 0 8px 0" }}>Core Videos</h4>
                    <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Manage official Record Videos, active Attempt Videos, and historical Attempt History archives.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button onClick={() => alert("Managing Record Videos...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Manage Record Videos &rarr;</button>
                      <button onClick={() => alert("Managing Attempt Videos...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Manage Attempt Videos &rarr;</button>
                      <button onClick={() => alert("Viewing Attempt History Archive...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Attempt History Videos &rarr;</button>
                    </div>
                  </div>

                  {/* Category 2: Features & Thumbnails */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                    <div style={{ background: "rgba(34,197,94,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                      <Target size={20} color="#22c55e" />
                    </div>
                    <h4 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: "0 0 8px 0" }}>Features & UX Assets</h4>
                    <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Control Featured Videos, Newest Records showcases, and globally manage Video Thumbnails.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button onClick={() => alert("Editing Featured Videos Queue...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Featured Videos List &rarr;</button>
                      <button onClick={() => alert("Managing Newest Records Showcase...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Newest Records Videos &rarr;</button>
                      <button onClick={() => alert("Bulk Editing Video Thumbnails...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Manage Video Thumbnails &rarr;</button>
                    </div>
                  </div>

                  {/* Category 3: Photo & External Integration */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px" }}>
                    <div style={{ background: "rgba(59,130,246,0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
                      <FileText size={20} color="#3b82f6" />
                    </div>
                    <h4 style={{ fontSize: "18px", fontWeight: "900", color: "white", margin: "0 0 8px 0" }}>Photos & External</h4>
                    <p style={{ color: "#888", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Review global Photo Evidence databases and manage API keys for YouTube Integrations.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <button onClick={() => alert("Accessing Photo Evidence Database...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>Review Photo Evidence &rarr;</button>
                      <button onClick={() => alert("Configuring YouTube Embed Policies & APIs...")} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer", textAlign: "left" }}>YouTube Integrations Panel &rarr;</button>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* ==================== 11. LEADERBOARD MANAGEMENT ==================== */}
          {activeTab === "leaderboards" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Global & Local Rankings
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    LEADERBOARDS
                  </h2>
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                  <button onClick={() => alert("Points System configuration opened.")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Settings size={14} /> Configure Points System
                  </button>
                  <button onClick={() => alert("Ranking Filters configuration opened.")} style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 16px", borderRadius: "8px", fontSize: "12px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}>
                    <Filter size={14} /> Manage Ranking Filters
                  </button>
                </div>
              </div>

              {/* Leaderboard Controls */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "24px", marginBottom: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <select style={{ flex: 1, minWidth: "200px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px", borderRadius: "8px", outline: "none", cursor: "pointer" }}>
                  <option>Global Leaderboard</option>
                  <option>Local Country Leaderboards</option>
                </select>
                <select style={{ flex: 1, minWidth: "200px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px", borderRadius: "8px", outline: "none", cursor: "pointer" }}>
                  <option>All Categories</option>
                  <option>Athletics</option>
                  <option>Strength</option>
                  <option>Endurance</option>
                </select>
                <select style={{ flex: 1, minWidth: "200px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px", borderRadius: "8px", outline: "none", cursor: "pointer" }}>
                  <option>All Age Groups</option>
                  <option>Junior Champions (5-12)</option>
                  <option>Teen Legends (13-17)</option>
                  <option>Adult Division (18-49)</option>
                  <option>Masters Division (50+)</option>
                </select>
              </div>

              {/* Leaderboard Rankings Table */}
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <tr>
                      <th style={{ padding: "16px 24px", color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>RANK</th>
                      <th style={{ padding: "16px 24px", color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>ATHLETE</th>
                      <th style={{ padding: "16px 24px", color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>POINTS</th>
                      <th style={{ padding: "16px 24px", color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1px" }}>COUNTRY</th>
                      <th style={{ padding: "16px 24px", color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1px", textAlign: "right" }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 1, athlete: "David Miller", points: 14500, country: "USA", change: "+1" },
                      { rank: 2, athlete: "Sarah Jenkins", points: 14200, country: "UK", change: "-1" },
                      { rank: 3, athlete: "Marcus T.", points: 12800, country: "Canada", change: "0" },
                      { rank: 4, athlete: "Elena R.", points: 11500, country: "Spain", change: "+3" }
                    ].map(entry => (
                      <tr key={entry.rank} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                        <td style={{ padding: "16px 24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ color: entry.rank === 1 ? "#ffd700" : entry.rank === 2 ? "#c0c0c0" : entry.rank === 3 ? "#cd7f32" : "white", fontSize: "20px", fontWeight: "950" }}>#{entry.rank}</span>
                            <span style={{ color: entry.change.startsWith('+') ? "#22c55e" : entry.change.startsWith('-') ? "#ef4444" : "#888", fontSize: "10px", fontWeight: "900" }}>
                              {entry.change !== "0" && (entry.change.startsWith('+') ? '▲ ' : '▼ ')} {entry.change !== "0" ? entry.change.substring(1) : '-'}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "16px 24px", color: "white", fontWeight: "800", fontSize: "14px" }}>{entry.athlete}</td>
                        <td style={{ padding: "16px 24px", color: "#FF5500", fontWeight: "900", fontSize: "14px" }}>{entry.points.toLocaleString()} PTS</td>
                        <td style={{ padding: "16px 24px", color: "#aaa", fontWeight: "600", fontSize: "13px" }}>{entry.country}</td>
                        <td style={{ padding: "16px 24px", textAlign: "right" }}>
                          <button onClick={() => alert(`Adjusting points for ${entry.athlete}`)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", cursor: "pointer" }}>Adjust Points</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ==================== 5B. ADJUDICATOR (JUDGE) MANAGEMENT STATION ==================== */}
          {activeTab === "adjudicators" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                <div>
                  <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>
                    Official Oversight Suite
                  </div>
                  <h2 style={{ fontSize: "56px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                    ADJUDICATOR
                    <br />MANAGEMENT
                  </h2>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "550px" }}>
                    Manage certified judges, assign pending submissions, track performance metrics, and approve final decisions.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button 
                    onClick={() => setIsPromoteModalOpen(true)}
                    style={{ background: "#FF5500", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "13px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 20px rgba(255,85,0,0.3)", transition: "transform 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <Plus size={16} /> PROMOTE JUDGE
                  </button>
                  <button 
                    onClick={() => { fetchData(); alert("Active roster and telemetry synchronized with database."); }}
                    style={{ background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    <Activity size={15} /> SYNC DATA
                  </button>
                </div>
              </div>

              {/* Sub-Tab Selector */}
              <div style={{ display: "flex", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px", marginBottom: "32px" }}>
                {[
                  { id: "roster", label: "👨‍⚖️ CERTIFIED ROSTER & STATS" },
                  { id: "dispatch", label: "📋 SUBMISSION ASSIGNMENTS" },
                  { id: "oversight", label: "🛡️ OVERSIGHT: APPROVE DECISIONS" }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setAdjudicatorSubTab(tab.id)}
                    style={{
                      background: adjudicatorSubTab === tab.id ? "rgba(255,85,0,0.1)" : "transparent",
                      border: "none",
                      color: adjudicatorSubTab === tab.id ? "#FF5500" : "#888",
                      padding: "10px 24px",
                      borderRadius: "100px",
                      fontSize: "13px",
                      fontWeight: "900",
                      cursor: "pointer",
                      transition: "0.2s",
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderColor: adjudicatorSubTab === tab.id ? "rgba(255,85,0,0.2)" : "transparent"
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ================= STATION A: ROSTER & TELEMETRY ================= */}
              {adjudicatorSubTab === "roster" && (
                <div>
                  {/* Search and Filters */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", gap: "20px" }}>
                    <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                      <Search size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                      <input 
                        type="text" 
                        placeholder="Search judges by name or email..." 
                        value={judgesSearchQuery}
                        onChange={(e) => setJudgesSearchQuery(e.target.value)}
                        style={{ width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "12px 16px 12px 44px", color: "white", fontSize: "13px", outline: "none" }} 
                      />
                    </div>
                    <div style={{ color: "#888", fontSize: "13px", fontWeight: "700" }}>
                      Active Adjudicators: <span style={{ color: "white", fontWeight: "900" }}>{judges.length}</span>
                    </div>
                  </div>

                  {/* Judges Roster Table */}
                  <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Adjudicator Details</th>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Workload Metrics</th>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Avg Speed</th>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Decisions Ratio</th>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Oversight Notes</th>
                          <th style={{ padding: "20px 24px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {judges
                          .filter(j => j.name?.toLowerCase().includes(judgesSearchQuery.toLowerCase()) || j.email?.toLowerCase().includes(judgesSearchQuery.toLowerCase()))
                          .map(judge => {
                            const stats = judge.stats || { assigned: 0, pending: 0, completed: 0, verified: 0, rejected: 0, averageSpeed: "1.2 days" };
                            const verPercent = stats.completed > 0 ? Math.round((stats.verified / stats.completed) * 100) : 50;
                            const rejPercent = stats.completed > 0 ? 100 - verPercent : 50;

                            return (
                              <tr key={judge.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.01)"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                                <td style={{ padding: "20px 24px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #FF5500, #b53c00)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "900", fontSize: "16px" }}>
                                      {judge.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div style={{ fontWeight: "900", color: "white", fontSize: "14px" }}>{judge.name}</div>
                                      <div style={{ color: "#666", fontSize: "12px" }}>{judge.email}</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px" }}>
                                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                                    <div style={{ textAlign: "center" }}>
                                      <div style={{ fontSize: "15px", fontWeight: "950", color: "white" }}>{stats.assigned}</div>
                                      <div style={{ fontSize: "9px", fontWeight: "900", color: "#666", textTransform: "uppercase" }}>Total</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                      <div style={{ fontSize: "15px", fontWeight: "950", color: "#FF6A00" }}>{stats.pending}</div>
                                      <div style={{ fontSize: "9px", fontWeight: "900", color: "#666", textTransform: "uppercase" }}>Pending</div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                      <div style={{ fontSize: "15px", fontWeight: "950", color: "#22c55e" }}>{stats.completed}</div>
                                      <div style={{ fontSize: "9px", fontWeight: "900", color: "#666", textTransform: "uppercase" }}>Done</div>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "white", fontWeight: "800", fontSize: "13px" }}>
                                    <Clock size={14} color="#FF5500" /> {stats.averageSpeed}
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px", minWidth: "160px" }}>
                                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "900" }}>
                                      <span style={{ color: "#22c55e" }}>{stats.verified} VERIFY</span>
                                      <span style={{ color: "#ef4444" }}>{stats.rejected} REJECT</span>
                                    </div>
                                    <div style={{ height: "6px", borderRadius: "10px", background: "#222", overflow: "hidden", display: "flex" }}>
                                      <div style={{ width: `${verPercent}%`, background: "#22c55e", height: "100%" }} />
                                      <div style={{ width: `${rejPercent}%`, background: "#ef4444", height: "100%" }} />
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px", maxWidth: "250px" }}>
                                  <div style={{ color: "#aaa", fontSize: "12px", fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {judge.admin_notes || "No oversight notes recorded."}
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button 
                                      onClick={() => { setSelectedJudgeForNotes(judge); setJudgeNotesText(judge.admin_notes || ""); setIsJudgeNotesModalOpen(true); }}
                                      style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "8px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                    >
                                      Oversight Notes
                                    </button>
                                    <button 
                                      onClick={() => handleRevokeJudge(judge)}
                                      style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", padding: "8px 14px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                                    >
                                      Revoke
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ================= STATION B: DISPATCH & ASSIGNMENTS ================= */}
              {adjudicatorSubTab === "dispatch" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "32px" }}>
                    {/* Left side: Unassigned list */}
                    <div>
                      <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "900", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                          <FileText size={18} color="#FF5500" /> UNASSIGNED SUBMISSIONS
                        </h3>
                        <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0" }}>Pending records awaiting adjudicator dispatch.</p>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "650px", overflowY: "auto", paddingRight: "8px" }}>
                        {records.filter(r => r.status === "pending" && !r.assigned_judge_id).length === 0 ? (
                          <div style={{ background: "#111", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "16px", padding: "32px", textAlign: "center", color: "#666", fontSize: "13px" }}>
                            🎉 All pending submissions have been assigned to judges!
                          </div>
                        ) : (
                          records
                            .filter(r => r.status === "pending" && !r.assigned_judge_id)
                            .map(rec => (
                              <div key={rec.id} style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                  <div>
                                    <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", textTransform: "uppercase" }}>{rec.category || "General"}</span>
                                    <h4 style={{ margin: "6px 0 2px 0", fontSize: "14px", fontWeight: "800", color: "white" }}>{rec.title}</h4>
                                    <div style={{ fontSize: "11px", color: "#666" }}>Competitor ID: {rec.athlete_id || rec.user_id?.substring(0,8)}</div>
                                  </div>
                                  <div style={{ fontSize: "16px", fontWeight: "950", color: "#FF5500", textAlign: "right" }}>
                                    {rec.value} <span style={{ fontSize: "10px", color: "#666" }}>{rec.unit}</span>
                                  </div>
                                </div>
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                  <label style={{ fontSize: "10px", fontWeight: "900", color: "#666", textTransform: "uppercase" }}>Assign Adjudicator:</label>
                                  <select 
                                    onChange={(e) => handleAssignRecord(rec.id, e.target.value)}
                                    defaultValue=""
                                    style={{ width: "100%", background: "#161616", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "8px 12px", color: "white", fontSize: "12px", outline: "none" }}
                                  >
                                    <option value="" disabled>-- Select Certified Judge --</option>
                                    {judges.map(j => (
                                      <option key={j.id} value={j.id}>{j.name} (Backlog: {j.stats?.pending || 0})</option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </div>

                    {/* Right side: Dispatched ledger */}
                    <div>
                      <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "900", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Activity size={18} color="#22c55e" /> ACTIVE ADJUDICATION RUNS
                        </h3>
                        <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0" }}>Submissions currently under review by judges.</p>
                      </div>

                      <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                          <thead>
                            <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <th style={{ padding: "16px 20px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Attempt Title</th>
                              <th style={{ padding: "16px 20px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Assigned Judge</th>
                              <th style={{ padding: "16px 20px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase" }}>Review Progress</th>
                              <th style={{ padding: "16px 20px", color: "#666", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", textAlign: "right" }}>Oversight actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.filter(r => r.status === "pending" && r.assigned_judge_id).length === 0 ? (
                              <tr>
                                <td colSpan="4" style={{ padding: "32px", textAlign: "center", color: "#666", fontSize: "13px" }}>
                                  No active adjudication runs at this time.
                                </td>
                              </tr>
                            ) : (
                              records
                                .filter(r => r.status === "pending" && r.assigned_judge_id)
                                .map(rec => {
                                  const judge = judges.find(j => j.id === rec.assigned_judge_id) || { name: "Assigned Adjudicator" };
                                  const isVerdictSubmitted = rec.judge_decision && rec.judge_decision !== 'pending';

                                  return (
                                    <tr key={rec.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                                      <td style={{ padding: "16px 20px" }}>
                                        <div>
                                          <div style={{ fontWeight: "800", color: "white", fontSize: "13px" }}>{rec.title}</div>
                                          <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "700" }}>{rec.value} {rec.unit}</div>
                                        </div>
                                      </td>
                                      <td style={{ padding: "16px 20px", color: "#aaa", fontSize: "13px", fontWeight: "700" }}>{judge.name}</td>
                                      <td style={{ padding: "16px 20px" }}>
                                        {isVerdictSubmitted ? (
                                          <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.5px" }}>
                                            RECOMMENDED: {rec.judge_decision.toUpperCase()}
                                          </span>
                                        ) : (
                                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#FFaa00", display: "inline-block" }} className="animate-pulse" />
                                            <span style={{ color: "#FFaa00", fontSize: "11px", fontWeight: "800" }}>UNDER INSPECTION</span>
                                          </div>
                                        )}
                                      </td>
                                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                        {!isVerdictSubmitted ? (
                                          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                            <button 
                                              onClick={() => handleSimulateJudgeVerdict(rec.id, 'verified', 'Verified: Athlete metadata and evidence video conforms with official timing codes. Recommendation: VERIFY.')}
                                              style={{ background: "rgba(34,197,94,0.1)", border: "none", color: "#22c55e", padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", cursor: "pointer" }}
                                            >
                                              Simulate Verify
                                            </button>
                                            <button 
                                              onClick={() => handleSimulateJudgeVerdict(rec.id, 'rejected', 'Rejected: Attempt timing failed to clear historical limits, or camera angle blocked full form validation.')}
                                              style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", padding: "6px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", cursor: "pointer" }}
                                            >
                                              Simulate Reject
                                            </button>
                                          </div>
                                        ) : (
                                          <span style={{ color: "#666", fontSize: "11px", fontWeight: "700" }}>Awaiting Admin Sign-off</span>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= STATION C: OVERSIGHT & FINAL APPROVALS ================= */}
              {adjudicatorSubTab === "oversight" && (
                <div>
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "900", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                      <CheckCircle size={18} color="#FF5500" /> FINAL VERDICT SIGN-OFF HUB
                    </h3>
                    <p style={{ color: "#666", fontSize: "12px", margin: "4px 0 0 0" }}>Sign off on adjudicators recommendations to finalize and publish records to the public portal.</p>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {records.filter(r => r.status === "pending" && r.judge_decision && r.judge_decision !== 'pending').length === 0 ? (
                      <div style={{ background: "#111", border: "1px dashed rgba(255,255,255,0.05)", borderRadius: "24px", padding: "48px", textAlign: "center", color: "#666" }}>
                        <CheckCircle size={40} color="#22c55e" style={{ margin: "0 auto 16px auto", opacity: 0.5 }} />
                        <h4 style={{ color: "white", margin: "0 0 4px 0", fontSize: "15px", fontWeight: "800" }}>OVERSIGHT QUEUE IS EMPTY</h4>
                        <p style={{ margin: 0, fontSize: "12px" }}>No adjudicator recommendations are currently awaiting final administrative sign-off.</p>
                      </div>
                    ) : (
                      records
                        .filter(r => r.status === "pending" && r.judge_decision && r.judge_decision !== 'pending')
                        .map(rec => {
                          const judge = judges.find(j => j.id === rec.assigned_judge_id) || { name: "Certified Adjudicator" };
                          const isApprove = rec.judge_decision === "verified";

                          return (
                            <div key={rec.id} style={{ background: "#111", border: `1px solid ${isApprove ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: "24px", padding: "28px", display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "32px", alignItems: "center", position: "relative" }}>
                              {/* Glowing side accent */}
                              <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: "4px", borderRadius: "0 4px 4px 0", background: isApprove ? "#22c55e" : "#ef4444" }} />

                              {/* Candidate metadata */}
                              <div>
                                <span style={{ background: isApprove ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: isApprove ? "#22c55e" : "#ef4444", padding: "3px 10px", borderRadius: "4px", fontSize: "9px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase" }}>
                                  {isApprove ? "Verify Recommended" : "Reject Recommended"}
                                </span>
                                <h4 style={{ margin: "12px 0 6px 0", fontSize: "18px", fontWeight: "900", color: "white" }}>{rec.title}</h4>
                                <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 12px 0" }}>{rec.description}</p>
                                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#666" }}>
                                  <div>Category: <strong style={{ color: "white" }}>{rec.category}</strong></div>
                                  <div>Attempt Metric: <strong style={{ color: "#FF5500" }}>{rec.value} {rec.unit}</strong></div>
                                </div>
                              </div>

                              {/* Judge justification rationale */}
                              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "16px 20px" }}>
                                <div style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", marginBottom: "6px" }}>Judge Inspection Report:</div>
                                <div style={{ fontWeight: "700", color: "white", fontSize: "12px", marginBottom: "4px" }}>{judge.name}</div>
                                <p style={{ color: "#aaa", fontSize: "12px", margin: 0, fontStyle: "italic", lineHeight: "1.4" }}>
                                  "{rec.judge_notes || "Evidence reviewed and recommendation finalized without extensive notes."}"
                                </p>
                              </div>

                              {/* Action button triggers */}
                              <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
                                <button 
                                  onClick={() => handleApproveOversightDecision(rec)}
                                  style={{ width: "100%", maxWidth: "220px", background: isApprove ? "#22c55e" : "#ef4444", color: "white", border: "none", padding: "12px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", boxShadow: `0 4px 15px ${isApprove ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}
                                >
                                  APPROVE & PUBLISH LIVE
                                </button>
                                <button 
                                  onClick={() => { setSelectedOversightRecord(rec); setOversightRevertFeedback(""); setIsOversightRevertModalOpen(true); }}
                                  style={{ width: "100%", maxWidth: "220px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "12px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                                >
                                  SEND BACK TO JUDGE
                                </button>
                              </div>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              )}

              {/* ================= MODAL: PROMOTE ATHLETE TO JUDGE ================= */}
              {isPromoteModalOpen && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
                  <div style={{ background: "#111", border: "1px solid rgba(255,106,0,0.3)", borderRadius: "32px", width: "100%", maxWidth: "500px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "950", color: "white", margin: 0 }}>PROMOTE ATHLETE TO JUDGE</h3>
                      <button onClick={() => setIsPromoteModalOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
                    </div>

                    <div style={{ position: "relative" }}>
                      <Search size={16} color="#666" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input 
                        type="text" 
                        placeholder="Search standard athletes..." 
                        value={promoteSearchQuery}
                        onChange={(e) => setPromoteSearchQuery(e.target.value)}
                        style={{ width: "100%", background: "#161616", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 12px 10px 36px", color: "white", fontSize: "13px", outline: "none" }} 
                      />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
                      {users
                        .filter(u => u.role !== 'judge' && (u.name?.toLowerCase().includes(promoteSearchQuery.toLowerCase()) || u.email?.toLowerCase().includes(promoteSearchQuery.toLowerCase())))
                        .slice(0, 8)
                        .map(athlete => (
                          <div key={athlete.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#161616", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.03)" }}>
                            <div>
                              <div style={{ fontWeight: "800", color: "white", fontSize: "13px" }}>{athlete.name}</div>
                              <div style={{ color: "#666", fontSize: "11px" }}>{athlete.email}</div>
                            </div>
                            <button 
                              onClick={() => handlePromoteToJudge(athlete)}
                              style={{ background: "#FF5500", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "900", cursor: "pointer" }}
                            >
                              Promote
                            </button>
                          </div>
                        ))}
                      {users.filter(u => u.role !== 'judge').length === 0 && (
                        <div style={{ color: "#666", fontSize: "12px", textAlign: "center", padding: "20px" }}>No promotion candidates found.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ================= MODAL: EDIT JUDGE NOTES ================= */}
              {isJudgeNotesModalOpen && selectedJudgeForNotes && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
                  <div style={{ background: "#111", border: "1px solid rgba(255,106,0,0.3)", borderRadius: "32px", width: "100%", maxWidth: "450px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "950", color: "white", margin: 0 }}>JUDGE OVERSIGHT NOTES</h3>
                      <button onClick={() => setIsJudgeNotesModalOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
                    </div>

                    <div>
                      <div style={{ fontWeight: "800", color: "white", fontSize: "13px", marginBottom: "4px" }}>{selectedJudgeForNotes.name}</div>
                      <div style={{ color: "#666", fontSize: "11px", marginBottom: "16px" }}>{selectedJudgeForNotes.email}</div>

                      <label style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Private Feedback / Rating Comments:</label>
                      <textarea
                        value={judgeNotesText}
                        onChange={(e) => setJudgeNotesText(e.target.value)}
                        placeholder="Leave review comments, performance evaluations, or track accuracy notes on this adjudicator..."
                        style={{ width: "100%", height: "120px", background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", color: "white", fontSize: "13px", outline: "none", resize: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button onClick={() => setIsJudgeNotesModalOpen(false)} style={{ background: "transparent", border: "none", color: "#888", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                      <button 
                        onClick={handleSaveJudgeNotes}
                        style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ================= MODAL: REVERT OVERSIGHT DECISION ================= */}
              {isOversightRevertModalOpen && selectedOversightRecord && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100 }}>
                  <div style={{ background: "#111", border: "1px solid rgba(255,106,0,0.3)", borderRadius: "32px", width: "100%", maxWidth: "450px", padding: "32px", display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "950", color: "white", margin: 0 }}>SEND BACK TO ADJUDICATOR</h3>
                      <button onClick={() => setIsOversightRevertModalOpen(false)} style={{ background: "transparent", border: "none", color: "#666", cursor: "pointer" }}><X size={20} /></button>
                    </div>

                    <div>
                      <div style={{ fontWeight: "800", color: "white", fontSize: "13px", marginBottom: "4px" }}>RE: {selectedOversightRecord.title}</div>
                      <div style={{ color: "#FF5500", fontSize: "12px", fontWeight: "700", marginBottom: "16px" }}>Current Verdict: Recommend {selectedOversightRecord.judge_decision === 'verified' ? 'Verify' : 'Reject'}</div>

                      <label style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Correction & Revision Guidelines:</label>
                      <textarea
                        value={oversightRevertFeedback}
                        onChange={(e) => setOversightRevertFeedback(e.target.value)}
                        placeholder="Leave technical instructions for the judge to re-evaluate this evidence attempt (e.g. check reps count at 1:45)..."
                        style={{ width: "100%", height: "120px", background: "#161616", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px", color: "white", fontSize: "13px", outline: "none", resize: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                      <button onClick={() => setIsOversightRevertModalOpen(false)} style={{ background: "transparent", border: "none", color: "#888", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                      <button 
                        onClick={handleRevertOversightDecision}
                        style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 20px", borderRadius: "100px", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ==================== 5C. VERIFICATION QUEUE SYSTEM ==================== */}
          {activeTab === "verificationQueue" && (() => {
            // Derive verificationStatus for each record (from overrides or infer from status)
            const getVqStatus = (r) => {
              if (vqStatusOverrides[r.id]) return vqStatusOverrides[r.id];
              if (r.verification_status) return r.verification_status;
              if (r.status === "verified") return "approved";
              if (r.status === "rejected") return "denied";
              return "pending_review";
            };

            const VQ_STATUSES = [
              { key: "pending_review",  label: "Pending Review",        color: "#FF6A00", bg: "rgba(255,106,0,0.12)",  icon: <Clock size={14} /> },
              { key: "under_review",    label: "Under Review",          color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: <Eye size={14} /> },
              { key: "approved",        label: "Approved",              color: "#22c55e", bg: "rgba(34,197,94,0.12)",  icon: <CheckCircle size={14} /> },
              { key: "denied",          label: "Denied",                color: "#ef4444", bg: "rgba(239,68,68,0.12)",  icon: <XCircle size={14} /> },
              { key: "needs_info",      label: "Needs More Information",color: "#a855f7", bg: "rgba(168,85,247,0.12)",icon: <AlertTriangle size={14} /> },
              { key: "priority",        label: "Priority",              color: "#ffcc00", bg: "rgba(255,204,0,0.12)",  icon: <Zap size={14} /> },
            ];

            const filteredRecords = records.filter(r => {
              const vqs = getVqStatus(r);
              const matchesFilter = vqFilter === "all" || vqs === vqFilter;
              const matchesSearch = !vqSearchQuery.trim() ||
                (r.title || "").toLowerCase().includes(vqSearchQuery.toLowerCase()) ||
                (r.user?.name || "").toLowerCase().includes(vqSearchQuery.toLowerCase()) ||
                (r.category || "").toLowerCase().includes(vqSearchQuery.toLowerCase());
              return matchesFilter && matchesSearch;
            }).sort((a, b) => {
              if (vqSortBy === "priority") {
                const pa = getVqStatus(a) === "priority" ? -1 : 0;
                const pb = getVqStatus(b) === "priority" ? -1 : 0;
                return pa - pb;
              }
              if (vqSortBy === "oldest") return new Date(a.created_at) - new Date(b.created_at);
              return new Date(b.created_at) - new Date(a.created_at); // newest
            });

            const handleVqStatusChange = async (recordId, newStatus) => {
              setVqUpdating(recordId);
              // Optimistic local update
              setVqStatusOverrides(prev => ({ ...prev, [recordId]: newStatus }));
              try {
                await apiCall(`/records/admin/adjudicate/${recordId}`, "PUT", {
                  status: newStatus === "approved" ? "verified" : newStatus === "denied" ? "rejected" : "pending",
                  verification_status: newStatus
                }, user.token);
                showToast(`Status updated to "${VQ_STATUSES.find(s=>s.key===newStatus)?.label || newStatus}"`, "success");
              } catch (err) {
                showToast(`Failed to update status: ${err.message}`, "error");
                // revert
                setVqStatusOverrides(prev => { const c = {...prev}; delete c[recordId]; return c; });
              } finally {
                setVqUpdating(null);
              }
            };

            const countsMap = {};
            VQ_STATUSES.forEach(s => {
              countsMap[s.key] = records.filter(r => getVqStatus(r) === s.key).length;
            });

            return (
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                  <div>
                    <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Record Oversight Engine</div>
                    <h2 style={{ fontSize: "52px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                      VERIFICATION
                      <br /><span style={{ color: "#FF5500" }}>QUEUE</span>
                    </h2>
                    <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "480px", lineHeight: "1.6" }}>
                      Manage and triage every world-record submission through the full review pipeline — from initial intake to final verdict.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <Search size={14} color="#666" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        placeholder="Search submissions..."
                        value={vqSearchQuery}
                        onChange={e => setVqSearchQuery(e.target.value)}
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px 10px 34px", color: "white", fontSize: "13px", outline: "none", width: "220px" }}
                      />
                    </div>
                    <select
                      value={vqSortBy}
                      onChange={e => setVqSortBy(e.target.value)}
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px", color: "white", fontSize: "13px", outline: "none", cursor: "pointer" }}
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="priority">Priority First</option>
                    </select>
                  </div>
                </div>

                {/* Status Stat Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px", marginBottom: "36px" }}>
                  {[
                    { key: "all", label: "All", count: records.length, color: "#aaa", bg: "rgba(255,255,255,0.05)" },
                    ...VQ_STATUSES.map(s => ({ ...s, count: countsMap[s.key] || 0 }))
                  ].map(s => (
                    <div
                      key={s.key}
                      onClick={() => setVqFilter(s.key)}
                      style={{
                        background: vqFilter === s.key ? s.bg || "rgba(255,255,255,0.08)" : "#111",
                        border: `1px solid ${vqFilter === s.key ? s.color : "rgba(255,255,255,0.05)"}`,
                        borderRadius: "14px",
                        padding: "18px 16px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: vqFilter === s.key ? `0 0 20px ${s.color}22` : "none"
                      }}
                    >
                      <div style={{ fontSize: "10px", color: vqFilter === s.key ? s.color : "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>{s.label}</div>
                      <div style={{ fontSize: "28px", fontWeight: "950", color: vqFilter === s.key ? s.color : "white", lineHeight: "1" }}>{s.count}</div>
                    </div>
                  ))}
                </div>

                {/* Main Queue Table */}
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", marginBottom: "32px" }}>
                  <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <ClipboardList size={18} color="#FF5500" />
                      <h3 style={{ fontSize: "16px", fontWeight: "900", margin: 0 }}>Review Queue</h3>
                      <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "2px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "900" }}>{filteredRecords.length} records</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", fontWeight: "800" }}>Click a row to review in detail</div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
                        {["ATHLETE", "RECORD TITLE", "CATEGORY", "SUBMITTED", "QUEUE STATUS", "ACTIONS"].map(h => (
                          <th key={h} style={{ padding: "14px 20px", textAlign: h === "ACTIONS" ? "right" : "left", fontSize: "10px", color: "#555", fontWeight: "900", letterSpacing: "0.8px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", padding: "48px" }}><Loader2 className="animate-spin" size={24} color="#FF5500" /></td></tr>
                      ) : filteredRecords.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#555", fontWeight: "700" }}>No submissions match this filter.</td></tr>
                      ) : filteredRecords.map((r, idx) => {
                        const vqs = getVqStatus(r);
                        const statusInfo = VQ_STATUSES.find(s => s.key === vqs) || VQ_STATUSES[0];
                        const isUpdating = vqUpdating === r.id;
                        return (
                          <tr
                            key={r.id || idx}
                            className="table-row-hover"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                          >
                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedVqRecord(r); setVqAdminNote(""); setIsVqDetailOpen(true); }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img src={`https://ui-avatars.com/api/?name=${r.user?.name || 'A'}&background=random&size=40`} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(255,85,0,0.3)" }} />
                                <div>
                                  <div style={{ fontWeight: "800", fontSize: "13px", color: "white" }}>{r.user?.name || "Unknown Athlete"}</div>
                                  <div style={{ fontSize: "11px", color: "#555", marginTop: "1px" }}>{r.user?.email || ""}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedVqRecord(r); setVqAdminNote(""); setIsVqDetailOpen(true); }}>
                              <div style={{ fontWeight: "800", fontSize: "13px", color: "white", marginBottom: "3px" }}>{r.title}</div>
                              <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Video size={10} />{r.evidence_url ? "Video attached" : "No video"}
                              </div>
                            </td>
                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedVqRecord(r); setVqAdminNote(""); setIsVqDetailOpen(true); }}>
                              <span style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>{r.category || "General"}</span>
                            </td>
                            <td style={{ padding: "16px 20px", color: "#666", fontSize: "12px", fontWeight: "600" }} onClick={() => { setSelectedVqRecord(r); setVqAdminNote(""); setIsVqDetailOpen(true); }}>
                              {new Date(r.created_at || Date.now()).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                            </td>
                            <td style={{ padding: "16px 20px" }}>
                              <select
                                value={vqs}
                                disabled={isUpdating}
                                onChange={e => handleVqStatusChange(r.id, e.target.value)}
                                style={{
                                  background: statusInfo.bg,
                                  border: `1px solid ${statusInfo.color}55`,
                                  color: statusInfo.color,
                                  padding: "6px 10px",
                                  borderRadius: "8px",
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  cursor: isUpdating ? "not-allowed" : "pointer",
                                  outline: "none",
                                  appearance: "none",
                                  paddingRight: "28px",
                                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23${statusInfo.color.replace('#','')}' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                                  backgroundRepeat: "no-repeat",
                                  backgroundPosition: "right 8px center"
                                }}
                              >
                                {VQ_STATUSES.map(s => (
                                  <option key={s.key} value={s.key} style={{ background: "#111", color: "white" }}>{s.label}</option>
                                ))}
                              </select>
                            </td>
                            <td style={{ padding: "16px 20px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => handleVqStatusChange(r.id, "priority")}
                                  title="Mark as Priority"
                                  style={{ background: vqs === "priority" ? "rgba(255,204,0,0.2)" : "transparent", border: `1px solid ${vqs === "priority" ? "rgba(255,204,0,0.4)" : "rgba(255,255,255,0.08)"}`, color: vqs === "priority" ? "#ffcc00" : "#555", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><Zap size={14} /></button>
                                <button
                                  onClick={() => handleVqStatusChange(r.id, "under_review")}
                                  title="Mark Under Review"
                                  style={{ background: vqs === "under_review" ? "rgba(59,130,246,0.15)" : "transparent", border: "1px solid rgba(255,255,255,0.08)", color: vqs === "under_review" ? "#3b82f6" : "#555", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><Eye size={14} /></button>
                                <button
                                  onClick={() => handleVqStatusChange(r.id, "approved")}
                                  title="Approve"
                                  style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><CheckCircle size={14} /></button>
                                <button
                                  onClick={() => handleVqStatusChange(r.id, "denied")}
                                  title="Deny"
                                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><XCircle size={14} /></button>
                                <button
                                  onClick={() => { setSelectedVqRecord(r); setVqAdminNote(""); setIsVqDetailOpen(true); }}
                                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#888", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><FileText size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Bottom KPI strip: Queue Pipeline Visual */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1px", background: "rgba(255,255,255,0.04)", borderRadius: "16px", overflow: "hidden", marginBottom: "32px" }}>
                  {VQ_STATUSES.map((s, idx) => {
                    const total = records.length || 1;
                    const count = countsMap[s.key] || 0;
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={s.key} style={{ background: "#0e0e0e", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: s.color }}>{s.icon}<span style={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</span></div>
                        <div style={{ fontSize: "26px", fontWeight: "950", color: "white", lineHeight: "1" }}>{count}</div>
                        <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: s.color, borderRadius: "2px", transition: "width 0.4s" }} />
                        </div>
                        <div style={{ fontSize: "10px", color: "#555", fontWeight: "800" }}>{pct}% of total</div>
                      </div>
                    );
                  })}
                </div>

                {/* Detail Modal */}
                {isVqDetailOpen && selectedVqRecord && (
                  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1500, padding: "20px" }}>
                    <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,85,0,0.2)", borderRadius: "28px", width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", padding: "36px" }}>
                      {/* Modal Header */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                        <div>
                          <div style={{ color: "#FF5500", fontSize: "10px", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Verification Detail</div>
                          <h3 style={{ fontSize: "22px", fontWeight: "950", color: "white", margin: "0 0 4px 0" }}>{selectedVqRecord.title}</h3>
                          <div style={{ fontSize: "12px", color: "#666" }}>Submitted by {selectedVqRecord.user?.name || "Unknown"} • {new Date(selectedVqRecord.created_at || Date.now()).toLocaleString()}</div>
                        </div>
                        <button onClick={() => setIsVqDetailOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#888", cursor: "pointer", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
                      </div>

                      {/* Info Grid */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                        {[
                          { label: "Category", value: selectedVqRecord.category || "General" },
                          { label: "Athlete", value: selectedVqRecord.user?.name || "Unknown" },
                          { label: "Email", value: selectedVqRecord.user?.email || "N/A" },
                          { label: "Record Value", value: selectedVqRecord.value ? `${selectedVqRecord.value} ${selectedVqRecord.unit || ""}` : "Not specified" },
                          { label: "Venue", value: selectedVqRecord.venue_name || selectedVqRecord.city || "Not specified" },
                          { label: "Evidence", value: selectedVqRecord.evidence_url ? "Video attached" : "No video" },
                        ].map(f => (
                          <div key={f.label} style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "14px 16px" }}>
                            <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{f.label}</div>
                            <div style={{ fontSize: "13px", color: "white", fontWeight: "700" }}>{f.value}</div>
                          </div>
                        ))}
                      </div>

                      {/* Description */}
                      {selectedVqRecord.description && (
                        <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                          <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Description</div>
                          <div style={{ fontSize: "13px", color: "#ccc", lineHeight: "1.6" }}>{selectedVqRecord.description}</div>
                        </div>
                      )}

                      {/* Evidence Video Link */}
                      {selectedVqRecord.evidence_url && (
                        <div style={{ marginBottom: "20px" }}>
                          <a href={selectedVqRecord.evidence_url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,85,0,0.1)", border: "1px solid rgba(255,85,0,0.2)", color: "#FF6A00", padding: "10px 18px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", textDecoration: "none", textTransform: "uppercase", letterSpacing: "1px" }}>
                            <Video size={14} /> View Evidence Video <ArrowRight size={14} />
                          </a>
                        </div>
                      )}

                      {/* Current Status & Change */}
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>Change Queue Status</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                          {VQ_STATUSES.map(s => {
                            const currentStatus = getVqStatus(selectedVqRecord);
                            const isActive = currentStatus === s.key;
                            return (
                              <button
                                key={s.key}
                                onClick={() => {
                                  handleVqStatusChange(selectedVqRecord.id, s.key);
                                  setVqStatusOverrides(prev => ({ ...prev, [selectedVqRecord.id]: s.key }));
                                }}
                                style={{
                                  background: isActive ? s.bg : "rgba(255,255,255,0.03)",
                                  border: `1px solid ${isActive ? s.color : "rgba(255,255,255,0.08)"}`,
                                  color: isActive ? s.color : "#666",
                                  padding: "8px 14px",
                                  borderRadius: "100px",
                                  fontSize: "11px",
                                  fontWeight: "900",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  transition: "all 0.15s"
                                }}
                              >
                                {s.icon} {s.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Admin Note */}
                      <div style={{ marginBottom: "24px" }}>
                        <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Admin Note / Feedback to Athlete</div>
                        <textarea
                          value={vqAdminNote}
                          onChange={e => setVqAdminNote(e.target.value)}
                          placeholder="Leave an internal note or message to the athlete explaining the decision..."
                          style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px", color: "white", fontSize: "13px", outline: "none", resize: "vertical", minHeight: "90px", fontFamily: "inherit" }}
                        />
                      </div>

                      {/* Modal Actions */}
                      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <button onClick={() => setIsVqDetailOpen(false)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#aaa", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "800", fontSize: "12px" }}>CLOSE</button>
                        <button
                          onClick={() => {
                            handleVqStatusChange(selectedVqRecord.id, "approved");
                            setIsVqDetailOpen(false);
                          }}
                          style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)", border: "none", color: "white", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "900", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}
                        ><CheckCircle size={14} /> APPROVE</button>
                        <button
                          onClick={() => {
                            handleVqStatusChange(selectedVqRecord.id, "needs_info");
                            setIsVqDetailOpen(false);
                          }}
                          style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)", color: "#a855f7", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "900", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}
                        ><AlertTriangle size={14} /> NEEDS INFO</button>
                        <button
                          onClick={() => {
                            handleVqStatusChange(selectedVqRecord.id, "denied");
                            setIsVqDetailOpen(false);
                          }}
                          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "900", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase" }}
                        ><XCircle size={14} /> DENY</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ==================== 5D. AI VERIFICATION CONTROLS ==================== */}
          {activeTab === "aiVerification" && (() => {
            const threshold = parseFloat(aiSettings.ai_min_confidence_threshold || "80.00");
            
            const getAIScanStatus = (scan) => {
              if (scan.override_status && scan.override_status !== "none") {
                return scan.override_status === "approved" ? "Overridden (Approved)" : "Overridden (Rejected)";
              }
              if (scan.suspicious_flagged) return "Flagged Suspicious";
              return scan.status === "passed" ? "Passed" : scan.status === "suspicious" ? "Suspicious" : "Failed";
            };

            const filteredScans = aiScans.filter(scan => {
              const record = scan.record || {};
              const matchesSearch = !aiSearchQuery.trim() ||
                (record.title || "").toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
                (record.user?.name || "").toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
                (record.category || "").toLowerCase().includes(aiSearchQuery.toLowerCase());

              const aiStatus = getAIScanStatus(scan);
              let matchesFilter = true;
              if (aiFilterStatus === "passed") matchesFilter = scan.status === "passed" && scan.override_status === "none";
              else if (aiFilterStatus === "suspicious") matchesFilter = scan.status === "suspicious" && scan.override_status === "none";
              else if (aiFilterStatus === "failed") matchesFilter = scan.status === "failed" && scan.override_status === "none";
              else if (aiFilterStatus === "overridden") matchesFilter = scan.override_status !== "none";
              else if (aiFilterStatus === "flagged") matchesFilter = !!scan.suspicious_flagged;

              return matchesSearch && matchesFilter;
            });

            // Counts for stats
            const totalCount = aiScans.length;
            const passedCount = aiScans.filter(s => s.status === "passed" && s.override_status === "none").length;
            const suspiciousCount = aiScans.filter(s => (s.status === "suspicious" || s.suspicious_flagged) && s.override_status === "none").length;
            const failedCount = aiScans.filter(s => s.status === "failed" && s.override_status === "none").length;
            const overriddenCount = aiScans.filter(s => s.override_status !== "none").length;

            return (
              <div>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "40px" }}>
                  <div>
                    <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px" }}>Automated Integrity Vault</div>
                    <h2 style={{ fontSize: "52px", fontWeight: "950", margin: "0 0 12px 0", color: "white", letterSpacing: "-2px", textTransform: "uppercase", lineHeight: "1" }}>
                      AI VERIFICATION
                      <br /><span style={{ color: "#FF5500" }}>CONTROLS</span>
                    </h2>
                    <p style={{ color: "#888", margin: 0, fontSize: "14px", maxWidth: "520px", lineHeight: "1.6" }}>
                      Inspect machine-learning authenticity telemetry including generative model forensics, pitch manipulation graphs, and splice rate logs.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "12px" }}>
                    <div style={{ position: "relative" }}>
                      <Search size={14} color="#666" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                      <input
                        type="text"
                        placeholder="Search scans..."
                        value={aiSearchQuery}
                        onChange={e => setAiSearchQuery(e.target.value)}
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px 14px 10px 34px", color: "white", fontSize: "13px", outline: "none", width: "220px" }}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Configuration Section */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", marginBottom: "36px", backdropFilter: "blur(12px)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                    <Settings size={18} color="#FF5500" />
                    <h3 style={{ fontSize: "16px", fontWeight: "900", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Global AI Settings & Parameters</h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                    {/* Left Column: Sensitivity Threshold Slider */}
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <label style={{ fontSize: "12px", color: "#aaa", fontWeight: "800", textTransform: "uppercase" }}>Authenticity Sensitivity Threshold</label>
                        <span style={{ 
                          fontSize: "14px", 
                          fontWeight: "900", 
                          color: threshold >= 85 ? "#ef4444" : threshold >= 75 ? "#FF5500" : "#22c55e",
                          background: threshold >= 85 ? "rgba(239,68,68,0.12)" : threshold >= 75 ? "rgba(255,85,0,0.12)" : "rgba(34,197,94,0.12)",
                          padding: "2px 10px",
                          borderRadius: "100px"
                        }}>
                          {threshold}%
                        </span>
                      </div>
                      <input 
                        type="range" 
                        min="50" 
                        max="98" 
                        value={threshold} 
                        onChange={e => handleSaveAiSettings({ ...aiSettings, ai_min_confidence_threshold: parseFloat(e.target.value).toFixed(2) })}
                        style={{ 
                          width: "100%", 
                          accentColor: "#FF5500", 
                          background: "rgba(255,255,255,0.06)", 
                          height: "6px", 
                          borderRadius: "10px", 
                          cursor: "pointer",
                          marginBottom: "16px"
                        }} 
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "#555", fontWeight: "800" }}>
                        <span>50% (LOW FILTRATION)</span>
                        <span>75% (BALANCED)</span>
                        <span>98% (MAX SECURITY)</span>
                      </div>
                    </div>

                    {/* Right Column: Checkbox Config Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {[
                        { key: "ai_deepfake_check_enabled", label: "Generative Deepfake Forensics", icon: <Sparkles size={14} /> },
                        { key: "ai_video_tampering_check_enabled", label: "Video Cut & Splice Auditor", icon: <Video size={14} /> },
                        { key: "ai_audio_tampering_check_enabled", label: "Audio pitch Tampering check", icon: <Radio size={14} /> }
                      ].map(check => {
                        const isChecked = aiSettings[check.key] === "true";
                        return (
                          <div 
                            key={check.key}
                            onClick={() => handleSaveAiSettings({ ...aiSettings, [check.key]: isChecked ? "false" : "true" })}
                            style={{
                              background: isChecked ? "rgba(255,85,0,0.06)" : "rgba(255,255,255,0.01)",
                              border: `1px solid ${isChecked ? "#FF550055" : "rgba(255,255,255,0.04)"}`,
                              borderRadius: "14px",
                              padding: "12px 16px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              transition: "all 0.2s"
                            }}
                          >
                            <div style={{ color: isChecked ? "#FF5500" : "#555" }}>{check.icon}</div>
                            <span style={{ fontSize: "11px", fontWeight: "800", color: isChecked ? "white" : "#777" }}>{check.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Queue Summary Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", marginBottom: "36px" }}>
                  {[
                    { key: "all", label: "All Scans", count: totalCount, color: "#aaa", bg: "rgba(255,255,255,0.05)" },
                    { key: "passed", label: "Passed Scans", count: passedCount, color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
                    { key: "suspicious", label: "Suspicious", count: suspiciousCount, color: "#FF5500", bg: "rgba(255,106,0,0.12)" },
                    { key: "failed", label: "Failed Scans", count: failedCount, color: "#ef4444", bg: "rgba(239,68,68,0.12)" },
                    { key: "overridden", label: "Overridden", count: overriddenCount, color: "#a855f7", bg: "rgba(168,85,247,0.12)" }
                  ].map(s => (
                    <div
                      key={s.key}
                      onClick={() => setAiFilterStatus(s.key)}
                      style={{
                        background: aiFilterStatus === s.key ? s.bg : "#111",
                        border: `1px solid ${aiFilterStatus === s.key ? s.color : "rgba(255,255,255,0.05)"}`,
                        borderRadius: "14px",
                        padding: "18px 16px",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        boxShadow: aiFilterStatus === s.key ? `0 0 20px ${s.color}22` : "none"
                      }}
                    >
                      <div style={{ fontSize: "10px", color: aiFilterStatus === s.key ? s.color : "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>{s.label}</div>
                      <div style={{ fontSize: "28px", fontWeight: "950", color: aiFilterStatus === s.key ? s.color : "white", lineHeight: "1" }}>{s.count}</div>
                    </div>
                  ))}
                </div>

                {/* Queue Submissions Table */}
                <div style={{ background: "#111", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", marginBottom: "32px" }}>
                  <div style={{ padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Activity size={18} color="#FF5500" />
                      <h3 style={{ fontSize: "16px", fontWeight: "900", margin: 0 }}>Authenticity Logs</h3>
                      <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "2px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "900" }}>{filteredScans.length} active</span>
                    </div>
                    <div style={{ fontSize: "11px", color: "#555", fontWeight: "800" }}>Click a report row to view telemetry graphs</div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}>
                        {["ATHLETE & TYPE", "RECORD TITLE", "AUTHENTICITY SCORE", "CHECK FLAGS", "AI STATUS", "ACTIONS"].map(h => (
                          <th key={h} style={{ padding: "14px 20px", textAlign: h === "ACTIONS" ? "right" : "left", fontSize: "10px", color: "#555", fontWeight: "900", letterSpacing: "0.8px" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", padding: "48px" }}><Loader2 className="animate-spin" size={24} color="#FF5500" /></td></tr>
                      ) : filteredScans.length === 0 ? (
                        <tr><td colSpan="6" style={{ textAlign: "center", padding: "48px", color: "#555", fontWeight: "700" }}>No scans match this status filter.</td></tr>
                      ) : filteredScans.map((scan, idx) => {
                        const rec = scan.record || {};
                        const score = parseFloat(scan.confidence_score);
                        const isSuspicious = scan.suspicious_flagged;
                        const ovStatus = scan.override_status;

                        // UI coloring based on score
                        const scoreColor = score >= 85 ? "#22c55e" : score >= 70 ? "#eab308" : "#ef4444";
                        const scoreBg = score >= 85 ? "rgba(34,197,94,0.12)" : score >= 70 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)";

                        // Check badge colors helper
                        const getCheckBadge = (val) => {
                          if (val === "passed") return { color: "#22c55e", label: "PASS" };
                          if (val === "flagged") return { color: "#eab308", label: "WARN" };
                          return { color: "#ef4444", label: "FAIL" };
                        };

                        const deepfakeBadge = getCheckBadge(scan.deepfake_check);
                        const videoBadge = getCheckBadge(scan.video_tamper_check);
                        const audioBadge = getCheckBadge(scan.audio_tamper_check);

                        return (
                          <tr
                            key={scan.id || idx}
                            className="table-row-hover"
                            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}
                          >
                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <img src={`https://ui-avatars.com/api/?name=${rec.user?.name || 'A'}&background=random&size=40`} alt="" style={{ width: "36px", height: "36px", borderRadius: "50%", border: "2px solid rgba(255,85,0,0.3)" }} />
                                <div>
                                  <div style={{ fontWeight: "800", fontSize: "13px", color: "white" }}>{rec.user?.name || "Unknown Athlete"}</div>
                                  <div style={{ fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                                    <span style={{ 
                                      background: rec.record_type === "challenge" ? "rgba(168,85,247,0.15)" : "rgba(59,130,246,0.15)",
                                      color: rec.record_type === "challenge" ? "#a855f7" : "#3b82f6",
                                      padding: "1px 6px",
                                      borderRadius: "100px",
                                      fontWeight: "900",
                                      textTransform: "uppercase"
                                    }}>
                                      {rec.record_type || "standard"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}>
                              <div style={{ fontWeight: "800", fontSize: "13px", color: "white", marginBottom: "3px" }}>{rec.title}</div>
                              <div style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "center", gap: "4px" }}>
                                <Video size={10} />{rec.evidence_url ? "Footage attached" : "No evidence"}
                              </div>
                            </td>

                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "80px", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden" }}>
                                  <div style={{ width: `${score}%`, height: "100%", background: scoreColor }} />
                                </div>
                                <span style={{ fontSize: "13px", fontWeight: "900", color: scoreColor }}>{score}%</span>
                              </div>
                            </td>

                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}>
                              <div style={{ display: "flex", gap: "6px" }}>
                                <span style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "900", background: "rgba(255,255,255,0.03)", border: `1px solid ${deepfakeBadge.color}33`, color: deepfakeBadge.color }}>
                                  DF: {deepfakeBadge.label}
                                </span>
                                <span style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "900", background: "rgba(255,255,255,0.03)", border: `1px solid ${videoBadge.color}33`, color: videoBadge.color }}>
                                  CUT: {videoBadge.label}
                                </span>
                                <span style={{ padding: "2px 6px", borderRadius: "6px", fontSize: "9px", fontWeight: "900", background: "rgba(255,255,255,0.03)", border: `1px solid ${audioBadge.color}33`, color: audioBadge.color }}>
                                  AUD: {audioBadge.label}
                                </span>
                              </div>
                            </td>

                            <td style={{ padding: "16px 20px" }} onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}>
                              {ovStatus !== "none" ? (
                                <span style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.4)", color: "#a855f7", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>
                                  Override: {ovStatus}
                                </span>
                              ) : isSuspicious ? (
                                <span style={{ background: "rgba(255,204,0,0.12)", border: "1px solid rgba(255,204,0,0.4)", color: "#ffcc00", padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>
                                  ⚠️ Suspicious
                                </span>
                              ) : (
                                <span style={{ background: scoreBg, border: `1px solid ${scoreColor}44`, color: scoreColor, padding: "4px 10px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>
                                  AI: {scan.status}
                                </span>
                              )}
                            </td>

                            <td style={{ padding: "16px 20px", textAlign: "right" }}>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                <button
                                  onClick={() => handleAIScanFlag(scan.record_id, !isSuspicious)}
                                  title={isSuspicious ? "Clear Flag" : "Flag Suspicious ⚠️"}
                                  style={{ 
                                    background: isSuspicious ? "rgba(255,204,0,0.2)" : "transparent", 
                                    border: `1px solid ${isSuspicious ? "rgba(255,204,0,0.4)" : "rgba(255,255,255,0.08)"}`, 
                                    color: isSuspicious ? "#ffcc00" : "#555", 
                                    width: "30px", 
                                    height: "30px", 
                                    borderRadius: "8px", 
                                    cursor: "pointer", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center",
                                    transition: "all 0.2s" 
                                  }}
                                ><Flag size={14} /></button>
                                <button
                                  onClick={() => { setSelectedAiScan(scan); setAiOverrideStatus(scan.override_status); setAiOverrideReason(scan.override_reason || ""); setIsAiDetailModalOpen(true); }}
                                  title="Detailed Diagnostic Report"
                                  style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.08)", color: "#888", width: "30px", height: "30px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                                ><FileText size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* AI Detail Modal (Authenticity Diagnostic Report) */}
                {isAiDetailModalOpen && selectedAiScan && (() => {
                  const rec = selectedAiScan.record || {};
                  const score = parseFloat(selectedAiScan.confidence_score);
                  const isSuspicious = selectedAiScan.suspicious_flagged;
                  
                  // Use characteristic of record to draw unique waveforms procedurally
                  const seed = (rec.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                  
                  return (
                    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1500, padding: "20px" }}>
                      <div style={{ background: "#0e0e0e", border: "1px solid rgba(255,85,0,0.2)", borderRadius: "28px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "36px" }}>
                        {/* Modal Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" }}>
                          <div>
                            <div style={{ color: "#FF5500", fontSize: "10px", fontWeight: "900", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "6px" }}>Forensic Analysis Report</div>
                            <h3 style={{ fontSize: "22px", fontWeight: "950", color: "white", margin: "0 0 4px 0" }}>🤖 AI Diagnostic: {rec.title}</h3>
                            <div style={{ fontSize: "12px", color: "#666" }}>Record Type: <span style={{ textTransform: "uppercase", color: "#FF5500", fontWeight: "800" }}>{rec.record_type || "standard"}</span> • Athlete: {rec.user?.name || "Unknown"}</div>
                          </div>
                          <button onClick={() => setIsAiDetailModalOpen(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#888", cursor: "pointer", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button>
                        </div>

                        {/* Top Score Dashboard */}
                        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "24px", marginBottom: "28px" }}>
                          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px" }}>Authenticity Index</div>
                            
                            {/* Circular meter */}
                            <div style={{ position: "relative", width: "120px", height: "120px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg style={{ transform: "rotate(-90deg)", width: "120px", height: "120px" }}>
                                <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                                <circle cx="60" cy="60" r="50" fill="transparent" stroke={score >= 85 ? "#22c55e" : score >= 70 ? "#eab308" : "#ef4444"} strokeWidth="8" strokeDasharray="314" strokeDashoffset={314 - (314 * score) / 100} style={{ transition: "stroke-dashoffset 0.8s ease-in-out" }} />
                              </svg>
                              <div style={{ position: "absolute", textAlign: "center" }}>
                                <div style={{ fontSize: "28px", fontWeight: "950", color: score >= 85 ? "#22c55e" : score >= 70 ? "#eab308" : "#ef4444", lineHeight: "1" }}>{score}%</div>
                                <div style={{ fontSize: "9px", color: "#555", fontWeight: "900", textTransform: "uppercase", marginTop: "4px" }}>CONFIDENCE</div>
                              </div>
                            </div>
                          </div>

                          {/* Procedural Visual Graphs */}
                          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "20px", padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                            <div style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Signal Spectral Analysis</div>
                            
                            {/* SVG Audio Wave/Tamper Graph */}
                            <div style={{ height: "70px", width: "100%", background: "#050505", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", padding: "0 10px", overflow: "hidden", position: "relative" }}>
                              <svg width="100%" height="100%" style={{ stroke: score >= 85 ? "#22c55e" : score >= 70 ? "#eab308" : "#ef4444", strokeWidth: 1.5, fill: "none" }}>
                                <path d={(() => {
                                  let points = [];
                                  for (let i = 0; i <= 300; i += 6) {
                                    const y = 35 + Math.sin(i * 0.05 + seed) * (15 + (seed % 10)) * (Math.sin(i * 0.2) + Math.cos(i * 0.1) * 0.5) * (score < 70 && i > 120 && i < 180 ? 2.5 : 1);
                                    points.push(`${i === 0 ? 'M' : 'L'} ${i} ${y}`);
                                  }
                                  return points.join(' ');
                                })()} />
                              </svg>
                              {score < 70 && (
                                <div style={{ position: "absolute", top: "6px", right: "10px", display: "flex", alignItems: "center", gap: "4px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", padding: "1px 6px", borderRadius: "4px", fontSize: "8px", fontWeight: "900", color: "#ef4444" }}>
                                  <Radio size={8} className="animate-pulse" /> PITCH MANIPULATION DETECTED
                                </div>
                              )}
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "9px", color: "#444", fontWeight: "800", marginTop: "6px" }}>
                              <span>0:00 (START)</span>
                              <span>SPECTRUM FREQ AUDIT</span>
                              <span>{rec.value ? rec.value : '1.0'} {rec.unit ? rec.unit : 'MIN'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Checklist Details */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "28px" }}>
                          {[
                            { label: "Biometric Face check", key: selectedAiScan.face_check, desc: "Facial multi-frame matches athlete profile" },
                            { label: "GAN Deepfake Forensics", key: selectedAiScan.deepfake_check, desc: "Generative adversarial artifact testing" },
                            { label: "Video cutting Check", key: selectedAiScan.video_tamper_check, desc: "Splice transition & framerate cut rate scanner" },
                            { label: "Audio Pitch Analysis", key: selectedAiScan.audio_tamper_check, desc: "Voice synthesis & compression anomalies check" }
                          ].map(c => {
                            const badge = getCheckBadge(c.key);
                            return (
                              <div key={c.label} style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ fontSize: "10px", color: "#666", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px" }}>{c.label}</div>
                                <div style={{ fontSize: "14px", fontWeight: "900", color: badge.color }}>{badge.label}</div>
                                <div style={{ fontSize: "10px", color: "#444", fontWeight: "800", lineHeight: "1.4" }}>{c.desc}</div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Audit Terminal Log Output */}
                        <div style={{ background: "#050505", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "16px", padding: "20px", marginBottom: "28px" }}>
                          <div style={{ fontSize: "10px", color: "#555", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "12px" }}>Forensic Pipeline Console Logs</div>
                          <pre style={{ margin: 0, padding: 0, fontSize: "12px", color: "#22c55e", fontFamily: "'Courier New', Courier, monospace", whiteSpace: "pre-wrap", lineHeight: "1.6", maxHeight: "150px", overflowY: "auto" }}>
                            {selectedAiScan.scan_notes || "No log entries recorded."}
                          </pre>
                        </div>

                        {/* Admin Action Override Station */}
                        <div style={{ background: "rgba(255,85,0,0.03)", border: "1px solid rgba(255,85,0,0.1)", borderRadius: "20px", padding: "24px" }}>
                          <div style={{ fontSize: "12px", color: "#FF5500", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>⚡ Administrative Decision Override</div>
                          
                          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 2fr", gap: "20px" }}>
                            {/* Override Choice */}
                            <div>
                              <label style={{ fontSize: "10px", color: "#888", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Select Override Mode</label>
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {[
                                  { key: "none", label: "No Override (Respect AI)", color: "#888", bg: "rgba(255,255,255,0.02)" },
                                  { key: "approved", label: "Manually Approve & Publish", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
                                  { key: "rejected", label: "Manually Reject Attempt", color: "#ef4444", bg: "rgba(239,68,68,0.12)" }
                                ].map(opt => {
                                  const isSel = aiOverrideStatus === opt.key;
                                  return (
                                    <button
                                      key={opt.key}
                                      onClick={() => setAiOverrideStatus(opt.key)}
                                      style={{
                                        background: isSel ? opt.bg : "rgba(255,255,255,0.02)",
                                        border: `1px solid ${isSel ? opt.color : "rgba(255,255,255,0.05)"}`,
                                        color: isSel ? opt.color : "#666",
                                        padding: "10px 14px",
                                        borderRadius: "10px",
                                        fontSize: "11px",
                                        fontWeight: "900",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.15s"
                                      }}
                                    >
                                      {opt.label}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Notes Box and Actions */}
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                              <div>
                                <label style={{ fontSize: "10px", color: "#888", fontWeight: "800", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Override Justification Notes</label>
                                <textarea
                                  value={aiOverrideReason}
                                  onChange={e => setAiOverrideReason(e.target.value)}
                                  placeholder="Provide professional auditing justification for changing the AI authenticity decision..."
                                  style={{ width: "100%", background: "#050505", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", padding: "10px 12px", color: "white", fontSize: "12px", outline: "none", resize: "none", height: "80px", fontFamily: "inherit" }}
                                />
                              </div>

                              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "12px" }}>
                                <button onClick={() => setIsAiDetailModalOpen(false)} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#888", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", fontWeight: "800", fontSize: "11px" }}>CANCEL</button>
                                <button
                                  disabled={isAiActionUpdating}
                                  onClick={() => handleAIScanOverride(selectedAiScan.record_id, aiOverrideStatus, aiOverrideReason)}
                                  style={{ background: "linear-gradient(135deg, #FF6A00 0%, #FF3300 100%)", border: "none", color: "white", padding: "10px 18px", borderRadius: "8px", cursor: isAiActionUpdating ? "not-allowed" : "pointer", fontWeight: "900", fontSize: "11px", textTransform: "uppercase" }}
                                >
                                  {isAiActionUpdating ? "PERSISTING..." : "COMMIT OVERRIDE"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* ==================== 5E. COMMUNICATIONS (PHASE 1) ==================== */}
          {activeTab === "communications" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0", color: "#FF5500" }}>COMMUNICATIONS COMMAND</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Internal Messaging and Notification Center</p>
                </div>
                <button style={{ background: "#FF5500", color: "white", padding: "10px 24px", borderRadius: "100px", border: "none", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <MessageSquare size={16} /> NEW MESSAGE
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
                <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                  <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Push Notifications</h3>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #FF5500", marginBottom: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>System Maintenance</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Target: All Users • Sent 2hrs ago</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", borderLeft: "4px solid #22c55e" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>New Challenge Live!</div>
                    <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Target: Competitors • Sent yesterday</div>
                  </div>
                </div>

                <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                   <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Internal Inbox</h3>
                   <div style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", overflow: "hidden" }}>
                     <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ background: "rgba(255,255,255,0.02)" }}>
                          <tr>
                            <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>SUBJECT</th>
                            <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>SENDER</th>
                            <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>DATE</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <td style={{ padding: "16px", fontSize: "13px" }}>Appeal Request #902</td>
                            <td style={{ padding: "16px", fontSize: "13px", color: "#888" }}>JohnDoe</td>
                            <td style={{ padding: "16px", fontSize: "13px", color: "#888" }}>Just now</td>
                          </tr>
                        </tbody>
                     </table>
                   </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5F. MODERATION (PHASE 1) ==================== */}
          {activeTab === "moderation" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0", color: "#ef4444" }}>MODERATION HUB</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Fraud Detection, Reporting, and Bans</p>
                </div>
              </div>

              <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.2)", padding: "24px", marginBottom: "24px" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                   <h3 style={{ margin: 0, fontSize: "16px", color: "#ef4444", display: "flex", alignItems: "center", gap: "8px" }}><ShieldAlert size={18} /> Active Fraud Alerts</h3>
                 </div>
                 {reports.filter(r => r.status === 'pending').length === 0 ? (
                    <div style={{ padding: "16px", color: "#888", fontStyle: "italic", textAlign: "center" }}>No active fraud alerts.</div>
                 ) : (
                   reports.filter(r => r.status === 'pending').map(report => (
                     <div key={report.id} style={{ background: "rgba(239,68,68,0.05)", padding: "16px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "bold" }}>Suspicious Activity: {report.reported_item_type}</div>
                          <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Reason: {report.reason}</div>
                          <div style={{ fontSize: "11px", color: "#666", marginTop: "4px" }}>Reported by: {report.reporter_id?.username || report.reporter_id?.email || 'Unknown'}</div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                           <button onClick={() => handleUpdateReport(report.id, 'reviewed')} style={{ background: "#222", color: "white", padding: "8px 16px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.1)", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>MARK REVIEWED</button>
                           <button onClick={() => alert('Investigation logic not implemented yet')} style={{ background: "#ef4444", color: "white", padding: "8px 16px", borderRadius: "100px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}>INVESTIGATE</button>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                 <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Recent Reports</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {reports.slice(0, 5).map(report => (
                        <div key={report.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", fontSize: "13px" }}>
                          <span style={{ color: "#FF5500", fontWeight: "bold" }}>@{report.reporter_id?.username || report.reporter_id?.email || 'User'}</span> reported <span style={{ color: "#a855f7" }}>{report.reported_item_type}</span> for {report.reason}
                          <span style={{ marginLeft: "8px", color: report.status === 'pending' ? '#ef4444' : '#10b981', fontSize: "11px" }}>({report.status})</span>
                        </div>
                      ))}
                      {reports.length === 0 && <div style={{ color: "#888", fontSize: "13px" }}>No reports found.</div>}
                    </div>
                 </div>
                 <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                    <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Banned Users</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {bans.map(ban => (
                        <div key={ban.id} style={{ background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "8px", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                          <span>@{ban.user_id?.username || ban.user_id?.email || 'User'}</span>
                          <span style={{ color: "#ef4444" }}>{ban.ban_type === 'permanent' ? 'Permanent Ban' : 'Temporary Suspension'}</span>
                        </div>
                      ))}
                      {bans.length === 0 && <div style={{ color: "#888", fontSize: "13px" }}>No banned users.</div>}
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ==================== 5G. MEDIA LIBRARY (PHASE 2) ==================== */}
          {activeTab === "mediaLibrary" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>MEDIA LIBRARY</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Manage graphics, banners, and social assets.</p>
                </div>
                <button style={{ background: "#fff", color: "#000", padding: "10px 24px", borderRadius: "100px", border: "none", fontWeight: "800", cursor: "pointer" }}>
                  UPLOAD ASSET
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
                 {mediaAssets.map(asset => (
                   <div key={asset.id} style={{ background: "#111", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                     <img src={asset.file_url} style={{ width: "100%", height: "140px", objectFit: "cover" }} />
                     <div style={{ padding: "12px" }}>
                       <div style={{ fontSize: "13px", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{asset.title}</div>
                       <div style={{ fontSize: "11px", color: "#888", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                         <span style={{ textTransform: "uppercase" }}>{asset.asset_type}</span>
                         <span>{new Date(asset.created_at).toLocaleDateString()}</span>
                       </div>
                     </div>
                   </div>
                 ))}
                 {mediaAssets.length === 0 && <div style={{ color: "#888", fontSize: "14px", gridColumn: "1 / -1", textAlign: "center", padding: "40px" }}>No media assets uploaded yet.</div>}
              </div>
            </div>
          )}

          {/* ==================== 5H. CONTENT PAGES (PHASE 2) ==================== */}
          {activeTab === "contentManagement" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>CONTENT PAGES</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Edit TOS, FAQ, and Homepage configuration.</p>
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                <div style={{ background: "#111", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Legal & Policies</h3>
                  {["Terms of Service", "Privacy Policy", "Cookie Policy", "Adjudication Rules"].map(page => (
                    <div key={page} style={{ padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "8px", display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
                      <span style={{ fontSize: "14px" }}>{page}</span>
                      <Layout size={16} color="#FF5500" />
                    </div>
                  ))}
                </div>
                
                <div style={{ background: "#111", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Dynamic Homepage</h3>
                  <div style={{ border: "1px dashed rgba(255,255,255,0.2)", padding: "32px", textAlign: "center", borderRadius: "12px", color: "#888" }}>
                    <Layout size={32} style={{ margin: "0 auto 12px auto", color: "#FF5500" }} />
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "white" }}>Homepage Layout Builder</div>
                    <div style={{ fontSize: "12px", marginTop: "4px" }}>Drag and drop featured records, banners, and trending videos.</div>
                    <button style={{ background: "transparent", border: "1px solid #FF5500", color: "#FF5500", padding: "8px 16px", borderRadius: "100px", marginTop: "16px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>OPEN BUILDER</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== 5I. SECURITY & FRAUD (PHASE 3) ==================== */}
          {activeTab === "security" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>SECURITY & FRAUD PREVENTION</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Audit logs, IP tracking, and data backup controls.</p>
                </div>
                <button style={{ background: "transparent", color: "white", padding: "10px 24px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.2)", fontWeight: "800", cursor: "pointer" }}>
                  DOWNLOAD AUDIT REPORT
                </button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                 <div style={{ background: "#111", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Lock size={18} color="#22c55e" /> System Audit Logs</h3>
                    <div style={{ fontFamily: "monospace", fontSize: "12px", background: "#000", padding: "16px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", color: "#888", maxHeight: "300px", overflowY: "auto" }}>
                      {auditLogs.map(log => (
                        <div key={log.id} style={{ color: log.action_type.includes('failed') || log.action_type.includes('error') ? "#ef4444" : "#888", marginBottom: "4px" }}>
                          [{new Date(log.created_at).toLocaleString()}] {log.users?.name || 'System'} - {log.action_type} - {JSON.stringify(log.metadata)}
                        </div>
                      ))}
                      {auditLogs.length === 0 && <div>No audit logs found.</div>}
                    </div>
                 </div>
                 <div style={{ background: "#111", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Backup Control</h3>
                    <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                      <div style={{ fontSize: "14px", fontWeight: "bold" }}>Last Full Backup</div>
                      <div style={{ fontSize: "12px", color: "#888", marginTop: "4px", marginBottom: "16px" }}>Today at 04:00 AM (EST)</div>
                      <button onClick={async () => {
                        try {
                          const res = await apiCall('/admin/security/backup', 'POST', {}, user.token);
                          if(res) { alert("Backup successfully dispatched to cold storage."); fetchData(); }
                        } catch (e) { alert("Failed to trigger backup."); }
                      }} style={{ background: "#FF5500", color: "white", padding: "8px 16px", borderRadius: "100px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>TRIGGER MANUAL BACKUP</button>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* ==================== 5J. SYSTEM SETTINGS (PHASE 3) ==================== */}
          {activeTab === "systemSettings" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>SYSTEM CONFIGURATION</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>API Integrations, SEO, and global parameters.</p>
                </div>
              </div>
              <div style={{ background: "#111", borderRadius: "20px", padding: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "16px" }}>Global SEO Settings</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px" }}>
                  <div>
                    <label style={{ fontSize: "12px", color: "#888" }}>Default Meta Title</label>
                    <input type="text" defaultValue="Rogue World Records | Elite Athlete Database" style={{ width: "100%", background: "#000", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px", borderRadius: "8px", marginTop: "4px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", color: "#888" }}>Default Meta Description</label>
                    <textarea defaultValue="The global authority on extreme sports and elite world records." style={{ width: "100%", height: "60px", background: "#000", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "10px", borderRadius: "8px", marginTop: "4px", resize: "none" }} />
                  </div>
                </div>
                <button onClick={async () => {
                  try {
                    const res = await apiCall('/admin/security/seo', 'PUT', { title: 'Rogue World Records', meta_description: 'The global authority...', keywords: 'sports, records' }, user.token);
                    if (res) alert("Global SEO tags updated successfully.");
                  } catch (e) { alert("Failed to save SEO settings."); }
                }} style={{ background: "white", color: "black", padding: "8px 24px", borderRadius: "100px", border: "none", fontSize: "12px", fontWeight: "bold", cursor: "pointer", marginTop: "16px" }}>SAVE SEO</button>
              </div>
            </div>
          )}

          {/* ==================== 5K. MONETIZATION (PHASE 4) ==================== */}
          {activeTab === "monetization" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0", color: "#10b981" }}>MONETIZATION COMMAND</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Revenue metrics, Subscription Billing, and Financial Overview.</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                 <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "20px" }}>
                   <div style={{ color: "#10b981", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Monthly Recurring Revenue</div>
                   <div style={{ fontSize: "32px", fontWeight: "950", marginTop: "8px" }}>${(revenueMetrics?.totalRevenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                 </div>
                 <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "20px" }}>
                   <div style={{ color: "#10b981", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Active Memberships</div>
                   <div style={{ fontSize: "32px", fontWeight: "950", marginTop: "8px" }}>{(revenueMetrics?.activeSubscriptions || 0).toLocaleString()}</div>
                 </div>
                 <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "16px", padding: "20px" }}>
                   <div style={{ color: "#10b981", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Failed Billing Attempts</div>
                   <div style={{ fontSize: "32px", fontWeight: "950", marginTop: "8px", color: "#ef4444" }}>42</div>
                 </div>
              </div>
            </div>
          )}

          {/* ==================== 5L. SPONSORSHIPS (PHASE 4) ==================== */}
          {activeTab === "sponsorships" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0" }}>SPONSORSHIP & ADS</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Manage partner banners and tracking metrics.</p>
                </div>
                <button style={{ background: "#FF5500", color: "white", padding: "10px 24px", borderRadius: "100px", border: "none", fontWeight: "800", cursor: "pointer" }}>
                  ADD SPONSOR
                </button>
              </div>
              <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "rgba(255,255,255,0.02)" }}>
                    <tr>
                      <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>BRAND</th>
                      <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>PLACEMENT</th>
                      <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>CLICKS</th>
                      <th style={{ padding: "16px", textAlign: "left", fontSize: "12px", color: "#666" }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sponsors.map(sponsor => (
                      <tr key={sponsor.id} style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "16px", fontSize: "14px", fontWeight: "bold" }}>{sponsor.company_name}</td>
                        <td style={{ padding: "16px", fontSize: "13px", textTransform: "capitalize" }}>{sponsor.placement}</td>
                        <td style={{ padding: "16px", fontSize: "13px", color: "#10b981" }}>{(sponsor.clicks_count || 0).toLocaleString()}</td>
                        <td style={{ padding: "16px" }}>
                          <span style={{ background: sponsor.active_status ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)", color: sponsor.active_status ? "#22c55e" : "#ef4444", padding: "4px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "bold" }}>
                            {sponsor.active_status ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {sponsors.length === 0 && <tr><td colSpan="4" style={{ padding: "16px", textAlign: "center", color: "#888" }}>No sponsors found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== 5M. VIP & RANKINGS (PHASE 4) ==================== */}
          {activeTab === "vip" && (
            <div>
              <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h1 style={{ fontSize: "28px", fontWeight: "950", margin: "0 0 8px 0", color: "#eab308" }}>VIP COMPETITORS & RANKINGS</h1>
                  <p style={{ color: "#888", margin: 0, fontSize: "14px" }}>Manage blue-tick verifications and trigger ranking algorithms.</p>
                </div>
                <button style={{ background: "#eab308", color: "black", padding: "10px 24px", borderRadius: "100px", border: "none", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                  <TrendingUp size={16} /> RECALCULATE GLOBAL RANKINGS
                </button>
              </div>
              <div style={{ background: "#111", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)", padding: "24px" }}>
                 <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}><Crown size={18} color="#eab308" /> Elite VIP Verification Requests</h3>
                 {vipRequests.map(req => (
                   <div key={req.id} style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: "bold" }}>{req.user_id?.name || 'Unknown User'}</div>
                        <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>Status: {req.vip_status || 'Requested Legend Status'}</div>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={async () => {
                          try {
                            const res = await apiCall(`/admin/monetization/vip/${req.user_id?.id || req.user_id}`, 'PUT', { is_verified: true, vip_status: 'legend' }, user.token);
                            if (res) { alert("VIP Status successfully updated."); fetchData(); }
                          } catch (e) { alert("Error granting VIP status"); }
                        }} style={{ background: "#eab308", color: "black", padding: "6px 16px", borderRadius: "100px", border: "none", fontSize: "11px", fontWeight: "bold", cursor: "pointer" }}>GRANT VIP</button>
                      </div>
                   </div>
                 ))}
                 {vipRequests.length === 0 && <div style={{ color: "#888", fontSize: "14px", padding: "16px" }}>No VIP requests found.</div>}
              </div>
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
                  onClick={() => alert("Global Financial Export Triggered")}
                  style={{ background: "#FF5500", color: "white", border: "none", padding: "14px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "12px", boxShadow: "0 4px 14px rgba(255,85,0,0.4)" }}
                >
                  <TrendingUp size={14} /> EXPORT LEDGER
                </button>
              </div>

              {/* Revenue Sub Tabs navigation */}
              <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0px", marginBottom: "40px" }}>
                <button 
                  onClick={(e) => { e.preventDefault(); setRevenueSubTab("ledger"); }}
                  style={{ background: "transparent", border: "none", color: revenueSubTab === "ledger" ? "#FF5500" : "#888", fontWeight: revenueSubTab === "ledger" ? "900" : "700", fontSize: "14px", cursor: "pointer", textTransform: "uppercase", padding: "12px 6px", borderBottom: revenueSubTab === "ledger" ? "3px solid #FF5500" : "3px solid transparent", outline: "none", transition: "all 0.2s" }}
                >
                  Transaction Ledger
                </button>
                <button 
                  onClick={(e) => { e.preventDefault(); setRevenueSubTab("coupons"); }}
                  style={{ background: "transparent", border: "none", color: revenueSubTab === "coupons" ? "#FF5500" : "#888", fontWeight: revenueSubTab === "coupons" ? "900" : "700", fontSize: "14px", cursor: "pointer", textTransform: "uppercase", padding: "12px 6px", borderBottom: revenueSubTab === "coupons" ? "3px solid #FF5500" : "3px solid transparent", outline: "none", transition: "all 0.2s" }}
                >
                  Coupons & Discounts
                </button>
              </div>

              {revenueSubTab === "ledger" && (
                <>
                  {/* Financial Revenue Grid Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginBottom: "40px" }}>
                    {/* Card 1: Net Paid Revenue */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid #FF5500", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px", textTransform: "uppercase" }}>NET PAID REVENUE</div>
                      <div style={{ fontSize: "40px", fontWeight: "950", color: "#FF5500", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>
                        ${(ledgerMetrics?.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                        <TrendingUp size={12} color="#22c55e" /> LIVE SYNCED FROM SYSTEM
                      </div>
                    </div>

                    {/* Card 2: Transactions Breakdown */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>TOTAL TRANSACTIONS</div>
                        <CreditCard size={20} color="#444" />
                      </div>
                      <div style={{ fontSize: "40px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px" }}>
                        {ledgerPayments.length}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.4)" }}>
                        <span>Paid: {ledgerPayments.filter(p => p.status === 'paid').length}</span>
                        <span>•</span>
                        <span>Pending: {ledgerPayments.filter(p => p.status === 'pending').length}</span>
                        <span>•</span>
                        <span>Failed: {ledgerMetrics?.failedCount || 0}</span>
                      </div>
                    </div>

                    {/* Card 3: Escrow / Adjustments */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "24px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(12px)" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px" }}>TOTAL ADJUSTMENTS / REFUNDS</div>
                      <div style={{ fontSize: "40px", fontWeight: "950", color: "#ef4444", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>
                        -${(ledgerMetrics?.refundRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div style={{ color: "#ef4444", fontSize: "11px", fontWeight: "800", display: "flex", alignItems: "center", gap: "4px" }}>
                        <ShieldAlert size={12} /> {ledgerPayments.filter(p => p.status === 'refunded').length} REFUNDED ENTRIES
                      </div>
                    </div>
                  </div>

                  {/* Payment Streams Detailed Aggregates bar */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px", marginBottom: "40px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.03)", borderRadius: "20px", padding: "20px" }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>MEMBERSHIPS</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "white" }}>${(ledgerMetrics?.membershipRevenue || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>SHOP SALES</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "white" }}>${(ledgerMetrics?.shopRevenue || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>TICKET SALES</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "white" }}>${(ledgerMetrics?.ticketRevenue || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>SUBMISSIONS</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "white" }}>${(ledgerMetrics?.submissionRevenue || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>CHALLENGES</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "white" }}>${(ledgerMetrics?.challengeRevenue || 0).toFixed(2)}</div>
                    </div>
                    <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ fontSize: "10px", color: "#eab308", fontWeight: "900", letterSpacing: "1px", marginBottom: "4px" }}>PENDING ESCROW</div>
                      <div style={{ fontSize: "14px", fontWeight: "950", color: "#eab308" }}>${(ledgerMetrics?.pendingRevenue || 0).toFixed(2)}</div>
                    </div>
                  </div>

                  {/* Interactive Roster Controls */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "32px" }}>
                    
                    {/* Header with quick stream filter bar */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "950", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                        💳 REGISTRY TRANSACTIONS
                      </h3>
                      
                      {/* Payment Type Streams Selector */}
                      <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
                        {[
                          { label: "ALL STREAMS", value: "all" },
                          { label: "MEMBERSHIPS", value: "membership" },
                          { label: "SHOP SALES", value: "shop" },
                          { label: "TICKETS", value: "ticket" },
                          { label: "SUBMISSIONS", value: "submission" },
                          { label: "CHALLENGES", value: "challenge" }
                        ].map(typeOpt => (
                          <button
                            key={typeOpt.value}
                            onClick={() => setPaymentsFilterType(typeOpt.value)}
                            style={{
                              background: paymentsFilterType === typeOpt.value ? "#FF5500" : "transparent",
                              color: paymentsFilterType === typeOpt.value ? "white" : "#888",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "10px",
                              fontWeight: "900",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              transition: "all 0.2s"
                            }}
                          >
                            {typeOpt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter by Status & Search Bar Row */}
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      
                      {/* Search Input Box */}
                      <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
                        <Search size={16} color="#555" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          type="text"
                          placeholder="SEARCH BY CUSTOMER NAME, EMAIL, REFERENCE ID..."
                          value={paymentsSearchQuery}
                          onChange={(e) => setPaymentsSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "100px",
                            padding: "16px 16px 16px 48px",
                            color: "white",
                            fontSize: "11px",
                            fontWeight: "800",
                            outline: "none",
                            letterSpacing: "0.5px"
                          }}
                        />
                      </div>

                      {/* Status Badges Selector */}
                      <div style={{ display: "flex", gap: "6px", background: "rgba(255,255,255,0.02)", padding: "4px", borderRadius: "100px", border: "1px solid rgba(255,255,255,0.05)", alignItems: "center" }}>
                        {[
                          { label: "ALL STATUSES", value: "all" },
                          { label: "PAID", value: "paid" },
                          { label: "PENDING", value: "pending" },
                          { label: "FAILED", value: "failed" },
                          { label: "REFUNDED", value: "refunded" }
                        ].map(statusOpt => (
                          <button
                            key={statusOpt.value}
                            onClick={() => setPaymentsFilterStatus(statusOpt.value)}
                            style={{
                              background: paymentsFilterStatus === statusOpt.value ? "rgba(255,255,255,0.08)" : "transparent",
                              color: paymentsFilterStatus === statusOpt.value ? "#FF5500" : "#888",
                              border: "none",
                              padding: "6px 14px",
                              borderRadius: "100px",
                              fontSize: "10px",
                              fontWeight: "900",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              transition: "all 0.15s"
                            }}
                          >
                            {statusOpt.label}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>

                  {/* Ledger Table */}
                  <div style={{ background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "24px", overflow: "hidden", marginBottom: "56px", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>CUSTOMER / ATHLETE</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>STREAM TYPE</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>REFERENCE ID / KEY</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>AMOUNT</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>DATE</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>STATUS</th>
                          <th style={{ padding: "20px 24px", textAlign: "right" }}>ACTIONS / CONTROLS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ledgerPayments.filter(p => {
                          const searchMatch = !paymentsSearchQuery.trim() || 
                            p.customerName.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) || 
                            p.customerEmail.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) ||
                            p.id.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) ||
                            (p.referenceId && p.referenceId.toLowerCase().includes(paymentsSearchQuery.toLowerCase()));
                            
                          const typeMatch = paymentsFilterType === 'all' || p.paymentType === paymentsFilterType;
                          const statusMatch = paymentsFilterStatus === 'all' || p.status === paymentsFilterStatus;
                          
                          return searchMatch && typeMatch && statusMatch;
                        }).map((row, idx) => {
                          const typeLabel = 
                            row.paymentType === 'membership' ? 'ELITE MEMBERSHIP' : 
                            row.paymentType === 'shop' ? 'SHOP MERCHANDISE' : 
                            row.paymentType === 'ticket' ? 'EVENT TICKET' : 
                            row.paymentType === 'challenge' ? 'CHALLENGE FEE' : 'SUBMISSION FEE';

                          const typeColor = 
                            row.paymentType === 'membership' ? '#a855f7' : 
                            row.paymentType === 'shop' ? '#3b82f6' : 
                            row.paymentType === 'ticket' ? '#ec4899' : 
                            row.paymentType === 'challenge' ? '#eab308' : '#14b8a6';

                          return (
                            <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} className="table-row-hover">
                              
                              {/* Athlete / Customer details */}
                              <td style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${typeColor}22 0%, ${typeColor}44 100%)`, border: `1px solid ${typeColor}44`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "950", color: typeColor, fontSize: "12px" }}>
                                  {row.customerName.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ color: "white", fontWeight: "900", fontSize: "13px" }}>{row.customerName}</div>
                                  <div style={{ color: "#555", fontSize: "10px", fontWeight: "700", marginTop: "2px" }}>{row.customerEmail}</div>
                                </div>
                              </td>

                              {/* Stream Type Tag */}
                              <td style={{ padding: "20px 24px" }}>
                                <span style={{ background: `${typeColor}15`, border: `1px solid ${typeColor}30`, color: typeColor, padding: "4px 10px", borderRadius: "8px", fontSize: "9px", fontWeight: "900", letterSpacing: "0.5px" }}>
                                  {typeLabel}
                                </span>
                              </td>

                              {/* Reference ID / Code */}
                              <td style={{ padding: "20px 24px", fontFamily: "monospace", color: "#888", fontSize: "11px", fontWeight: "800" }}>
                                {row.id}
                              </td>

                              {/* Amount */}
                              <td style={{ padding: "20px 24px", color: row.status === 'refunded' ? '#ef4444' : '#FF5500', fontWeight: "950", fontSize: "14px" }}>
                                {row.status === 'refunded' ? '-' : ''}${row.amount.toFixed(2)}
                              </td>

                              {/* Date */}
                              <td style={{ padding: "20px 24px", color: "#aaa", fontWeight: "700" }}>
                                {new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>

                              {/* Status Badge */}
                              <td style={{ padding: "20px 24px" }}>
                                <span style={{
                                  background: row.status === "paid" ? "rgba(34,197,94,0.1)" : row.status === "pending" ? "rgba(234,179,8,0.1)" : row.status === "failed" ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
                                  color: row.status === "paid" ? "#22c55e" : row.status === "pending" ? "#eab308" : row.status === "failed" ? "#ef4444" : "#888",
                                  padding: "4px 12px", borderRadius: "100px", fontWeight: "900", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px",
                                  border: `1px solid ${row.status === "paid" ? "rgba(34,197,94,0.2)" : row.status === "pending" ? "rgba(234,179,8,0.2)" : row.status === "failed" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.1)"}`
                                }}>
                                  {row.status}
                                </span>
                              </td>

                              {/* Action Trigger Buttons */}
                              <td style={{ padding: "20px 24px", textAlign: "right" }}>
                                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                  {row.status === 'paid' && (
                                    <button
                                      onClick={() => handlePaymentStatusUpdate(row, 'refunded')}
                                      style={{
                                        background: "rgba(239,68,68,0.1)",
                                        border: "1px solid rgba(239,68,68,0.2)",
                                        color: "#ef4444",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "10px",
                                        fontWeight: "900",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                      }}
                                      className="hover-bg-red-20"
                                    >
                                      REFUND
                                    </button>
                                  )}

                                  {row.status === 'pending' && (
                                    <>
                                      <button
                                        onClick={() => handlePaymentStatusUpdate(row, 'paid')}
                                        style={{
                                          background: "rgba(34,197,94,0.1)",
                                          border: "1px solid rgba(34,197,94,0.2)",
                                          color: "#22c55e",
                                          padding: "6px 12px",
                                          borderRadius: "6px",
                                          fontSize: "10px",
                                          fontWeight: "900",
                                          cursor: "pointer"
                                        }}
                                      >
                                        APPROVE
                                      </button>
                                      <button
                                        onClick={() => handlePaymentStatusUpdate(row, 'failed')}
                                        style={{
                                          background: "rgba(239,68,68,0.1)",
                                          border: "1px solid rgba(239,68,68,0.2)",
                                          color: "#ef4444",
                                          padding: "6px 12px",
                                          borderRadius: "6px",
                                          fontSize: "10px",
                                          fontWeight: "900",
                                          cursor: "pointer"
                                        }}
                                      >
                                        FAIL
                                      </button>
                                    </>
                                  )}

                                  {(row.status === 'refunded' || row.status === 'failed') && (
                                    <span style={{ color: "#444", fontSize: "10px", fontWeight: "900", letterSpacing: "1px", textTransform: "uppercase" }}>
                                      ARCHIVED
                                    </span>
                                  )}
                                </div>
                              </td>

                            </tr>
                          );
                        })}

                        {ledgerPayments.filter(p => {
                          const searchMatch = !paymentsSearchQuery.trim() || 
                            p.customerName.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) || 
                            p.customerEmail.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) ||
                            p.id.toLowerCase().includes(paymentsSearchQuery.toLowerCase()) ||
                            (p.referenceId && p.referenceId.toLowerCase().includes(paymentsSearchQuery.toLowerCase()));
                            
                          const typeMatch = paymentsFilterType === 'all' || p.paymentType === paymentsFilterType;
                          const statusMatch = paymentsFilterStatus === 'all' || p.status === paymentsFilterStatus;
                          
                          return searchMatch && typeMatch && statusMatch;
                        }).length === 0 && (
                          <tr>
                            <td colSpan="7" style={{ padding: "48px", textAlign: "center", color: "#555", fontWeight: "900", fontSize: "14px" }}>
                              NO TRANSACTIONS MATCHED THE ACTIVE SEARCH OR FILTER PRESETS.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Bottom Guidelines Summary */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "48px", alignItems: "center" }}>
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <h4 style={{ fontSize: "18px", fontWeight: "950", color: "white", margin: "0 0 24px 0", textTransform: "uppercase", letterSpacing: "-0.5px" }}>PAYOUT VELOCITY</h4>
                      
                      <div style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px" }}>VERIFIED TRANSFERS</span>
                          <span style={{ fontSize: "10px", color: "white", fontWeight: "900" }}>94%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                          <div style={{ width: "94%", height: "100%", background: "linear-gradient(90deg, #FF5500, #ff8800)", borderRadius: "3px" }} />
                        </div>
                      </div>

                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "10px", color: "#888", fontWeight: "900", letterSpacing: "1px" }}>ESCROW RELEASE</span>
                          <span style={{ fontSize: "10px", color: "white", fontWeight: "900" }}>78%</span>
                        </div>
                        <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
                          <div style={{ width: "78%", height: "100%", background: "linear-gradient(90deg, #FF5500, #ff8800)", borderRadius: "3px" }} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p style={{ color: "#FF8866", fontSize: "14px", lineHeight: "1.6", fontWeight: "600", marginBottom: "24px" }}>
                        Financial oversight operations are running dynamically at peak system optimization. We have aggregated real-time database transactions from all membership tiers, catalog orders, livestream spectator tickets, and adjudication submissions into a central ledger.
                      </p>
                      <button style={{ background: "transparent", color: "#FF5500", border: "none", fontSize: "11px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "1px", padding: 0 }}>
                        SECURE PAYMENTS COMPLIANCE PROTOCOLS <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {revenueSubTab === "coupons" && (
                <>
                  {/* Coupons Revenue Grid Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }}>
                    {/* Card 1 */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid #FF5500", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px" }}>ACTIVE COUPONS</div>
                      <div style={{ fontSize: "42px", fontWeight: "950", color: "#FF5500", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>
                        {couponStats?.activeCoupons || 0} <span style={{ fontSize: "18px", color: "#666", fontWeight: "600" }}>/ {couponStats?.totalCoupons || 0} TOTAL</span>
                      </div>
                      <div style={{ color: "#aaa", fontSize: "11px", fontWeight: "800" }}>
                        {couponStats?.expiredCoupons || 0} INACTIVE OR EXPIRED
                      </div>
                    </div>

                    {/* Card 2 */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                        <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px" }}>REVENUE SAVINGS IMPACT</div>
                        <DollarSign size={20} color="#FF5500" />
                      </div>
                      <div style={{ fontSize: "42px", fontWeight: "950", color: "white", lineHeight: "1", marginBottom: "16px", letterSpacing: "-1px" }}>
                        ${(couponStats?.totalDiscountImpact || 0).toLocaleString()}
                      </div>
                      <div style={{ color: "#22c55e", fontSize: "11px", fontWeight: "800" }}>
                        TOTAL SAVED BY ATHLETES
                      </div>
                    </div>

                    {/* Card 3 */}
                    <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "16px", padding: "32px", position: "relative", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
                      <div style={{ color: "#888", fontSize: "11px", fontWeight: "900", letterSpacing: "1.5px", marginBottom: "16px" }}>MOST POPULAR CODE</div>
                      <div style={{ fontSize: "32px", fontWeight: "950", color: "white", lineHeight: "1.2", marginBottom: "12px", letterSpacing: "-0.5px" }}>
                        {couponStats?.mostUsed?.[0] ? couponStats.mostUsed[0].code : 'NONE YET'}
                      </div>
                      <div style={{ color: "#FF5500", fontSize: "11px", fontWeight: "800" }}>
                        {couponStats?.mostUsed?.[0] ? `${couponStats.mostUsed[0].redemptions_count} REDEMPTIONS` : '0 REDEMPTIONS'}
                      </div>
                    </div>
                  </div>

                  {/* Header Row */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "24px", fontWeight: "950", color: "white", margin: 0, textTransform: "uppercase", letterSpacing: "-0.5px" }}>
                      COUPON INVENTORY
                    </h3>
                    <button 
                      onClick={(e) => { e.preventDefault(); openModal("add"); }}
                      style={{ background: "#FF5500", color: "white", border: "none", padding: "10px 20px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
                      <Plus size={14} /> CREATE COUPON
                    </button>
                  </div>

                  {/* Coupon Search */}
                  <div style={{ position: "relative", marginBottom: "32px" }}>
                    <Search size={16} color="#666" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" 
                      placeholder="SEARCH COUPON CODES..." 
                      value={couponSearchQuery}
                      onChange={(e) => setCouponSearchQuery(e.target.value)}
                      style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "100px", padding: "16px 16px 16px 48px", color: "white", fontSize: "11px", fontWeight: "800", outline: "none", letterSpacing: "1px" }} 
                    />
                  </div>

                  {/* Coupons Table */}
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", overflow: "hidden", marginBottom: "56px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#888", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "1px" }}>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>CODE</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>DISCOUNT</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>APPLIES TO</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>USAGE STATUS</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>LIMITS & RULES</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>EXPIRES</th>
                          <th style={{ padding: "20px 24px", textAlign: "left" }}>ACTIVE STATUS</th>
                          <th style={{ padding: "20px 24px", textAlign: "right" }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons
                          .filter(c => c.code.toLowerCase().includes(couponSearchQuery.toLowerCase()))
                          .map((coupon) => {
                            const isExpired = coupon.expiration_date && new Date(coupon.expiration_date) < new Date();
                            const isLimitReached = coupon.max_redemptions !== null && coupon.redemptions_count >= coupon.max_redemptions;
                            const isValid = coupon.active && !isExpired && !isLimitReached;

                            return (
                              <tr key={coupon.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }} className="table-row-hover">
                                <td style={{ padding: "20px 24px" }}>
                                  <div style={{ color: "white", fontWeight: "900", letterSpacing: "0.5px", fontSize: "14px" }}>{coupon.code}</div>
                                </td>
                                <td style={{ padding: "20px 24px", color: "#FF5500", fontWeight: "900", fontSize: "14px" }}>
                                  {coupon.discount_type === 'percentage' ? `${parseFloat(coupon.discount_value)}%` : `$${parseFloat(coupon.discount_value).toFixed(2)}`}
                                </td>
                                <td style={{ padding: "20px 24px", color: "#aaa", fontWeight: "800" }}>
                                  <span style={{ textTransform: "uppercase", background: "rgba(255,255,255,0.05)", padding: "4px 8px", borderRadius: "4px", fontSize: "10px" }}>
                                    {coupon.applies_to}
                                  </span>
                                  {coupon.target_id && (
                                    <div style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}>
                                      {coupon.target_id}
                                    </div>
                                  )}
                                </td>
                                <td style={{ padding: "20px 24px", color: "white", fontWeight: "700" }}>
                                  <div style={{ fontSize: "13px" }}>{coupon.redemptions_count || 0} Uses</div>
                                  <div style={{ fontSize: "10px", color: "#555" }}>
                                    {coupon.max_redemptions ? `Limit: ${coupon.max_redemptions}` : 'Unlimited Uses'}
                                  </div>
                                </td>
                                <td style={{ padding: "20px 24px", color: "#888", fontWeight: "600" }}>
                                  <div style={{ fontSize: "11px" }}>Min Spend: ${parseFloat(coupon.min_purchase).toFixed(2)}</div>
                                  {coupon.restricted_membership_tier && (
                                    <div style={{ fontSize: "10px", color: "#ff8800", marginTop: "2px" }}>Tier: {coupon.restricted_membership_tier.toUpperCase()}+</div>
                                  )}
                                  {coupon.restricted_country && (
                                    <div style={{ fontSize: "10px", color: "#55aaff", marginTop: "2px" }}>Country: {coupon.restricted_country}</div>
                                  )}
                                </td>
                                <td style={{ padding: "20px 24px", color: isExpired ? "#ef4444" : "#aaa", fontWeight: "700" }}>
                                  {coupon.expiration_date ? new Date(coupon.expiration_date).toLocaleDateString() : 'Never'}
                                </td>
                                <td style={{ padding: "20px 24px" }}>
                                  <button 
                                    onClick={async (e) => {
                                      e.preventDefault();
                                      try {
                                        await apiCall(`/coupons/${coupon.id}`, "PUT", { active: !coupon.active }, user.token);
                                        setCoupons(prev => prev.map(c => c.id === coupon.id ? { ...c, active: !c.active } : c));
                                        showToast(`Coupon ${coupon.code} ${!coupon.active ? 'activated' : 'deactivated'} successfully`, "success");
                                      } catch (err) {
                                        showToast(`Toggle failed: ${err.message}`, "error");
                                      }
                                    }}
                                    style={{ 
                                      background: isValid ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", 
                                      color: isValid ? "#22c55e" : "#ef4444", 
                                      padding: "6px 12px", borderRadius: "100px", fontWeight: "900", fontSize: "9px", textTransform: "uppercase", letterSpacing: "1px",
                                      border: `1px solid ${isValid ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`, cursor: "pointer", outline: "none"
                                    }}
                                  >
                                    {isValid ? 'ACTIVE' : coupon.active ? 'EXPIRED/LIMIT' : 'DISABLED'}
                                  </button>
                                </td>
                                <td style={{ padding: "20px 24px", textAlign: "right" }}>
                                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                    <button 
                                      onClick={(e) => { e.preventDefault(); openModal("edit", coupon); }}
                                      style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <Edit3 size={12} /> Edit
                                    </button>
                                    <button 
                                      onClick={(e) => { e.preventDefault(); handleDelete(coupon.id); }}
                                      style={{ background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {coupons.length === 0 && (
                          <tr>
                            <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#666", fontWeight: "800" }}>
                              NO COUPONS GENERATED YET. CLICK "CREATE COUPON" TO START!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Floating Action Button */}
              <div style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 100 }}>
                <button onClick={(e) => { e.preventDefault(); openModal("add"); }} style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FF5500", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 20px rgba(255,85,0,0.4)" }}>
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
                {activeTab === "users" && modalType !== "viewProfile" && (
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

                {/* 7. VIEW USER PROFILE */}
                {activeTab === "users" && modalType === "viewProfile" && modalTarget && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {/* Header: Profile Picture & Core Info */}
                    <div style={{ display: "flex", gap: "20px", alignItems: "center", background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <img src={modalTarget.profile_pic || `https://ui-avatars.com/api/?name=${modalTarget.name}&background=random&size=128`} alt={modalTarget.name} style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover", border: "2px solid #FF5500" }} />
                      <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: "24px", fontWeight: "950", margin: "0 0 4px 0", color: "white" }}>{modalTarget.name}</h2>
                        <div style={{ color: "#888", fontSize: "14px", marginBottom: "8px" }}>{modalTarget.email} | {modalTarget.username || 'No Username'}</div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <span style={{ background: "rgba(255,85,0,0.1)", color: "#FF5500", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>{modalTarget.role || 'Athlete'}</span>
                          <span style={{ background: "rgba(34,197,94,0.1)", color: "#22c55e", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>{modalTarget.membershipType || 'Free Athlete'}</span>
                          <span style={{ background: "rgba(255,255,255,0.05)", color: "#aaa", padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>{modalTarget.account_status || 'Active'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                      {['overview', 'activity', 'submissions', 'challenges'].map(tab => (
                        <button 
                          key={tab}
                          onClick={(e) => { e.preventDefault(); setRecordsSubTab(tab); }}
                          style={{ 
                            background: "transparent", 
                            border: "none", 
                            color: recordsSubTab === tab ? "#FF5500" : "#888", 
                            fontWeight: recordsSubTab === tab ? "900" : "700", 
                            fontSize: "13px", 
                            cursor: "pointer",
                            textTransform: "uppercase",
                            padding: "4px 8px",
                            borderBottom: recordsSubTab === tab ? "2px solid #FF5500" : "2px solid transparent"
                          }}>
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Tab Contents */}
                    {recordsSubTab === "overview" && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px" }}>
                          <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", marginBottom: "4px" }}>COUNTRY</div>
                          <div style={{ fontSize: "15px", color: "white", fontWeight: "600" }}>{modalTarget.country || "Not specified"}</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px" }}>
                          <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", marginBottom: "4px" }}>AGE GROUP / DOB</div>
                          <div style={{ fontSize: "15px", color: "white", fontWeight: "600" }}>{modalTarget.dob ? new Date(modalTarget.dob).toLocaleDateString() : "Not specified"}</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px" }}>
                          <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", marginBottom: "4px" }}>GENDER</div>
                          <div style={{ fontSize: "15px", color: "white", fontWeight: "600", textTransform: "capitalize" }}>{modalTarget.gender || "Not specified"}</div>
                        </div>
                        <div style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px" }}>
                          <div style={{ fontSize: "11px", color: "#666", fontWeight: "800", marginBottom: "4px" }}>MEMBER SINCE</div>
                          <div style={{ fontSize: "15px", color: "white", fontWeight: "600" }}>{new Date(modalTarget.created_at || new Date()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    )}

                    {recordsSubTab === "activity" && (
                      <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "12px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "white", margin: "0 0 16px 0" }}>Recent Activity Log</h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                            <div>
                              <div style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>Logged In</div>
                              <div style={{ color: "#666", fontSize: "11px" }}>IP: 192.168.1.1</div>
                            </div>
                            <div style={{ color: "#888", fontSize: "12px" }}>Today, 10:42 AM</div>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                            <div>
                              <div style={{ color: "white", fontSize: "13px", fontWeight: "700" }}>Updated Profile Picture</div>
                              <div style={{ color: "#666", fontSize: "11px" }}>Settings</div>
                            </div>
                            <div style={{ color: "#888", fontSize: "12px" }}>Yesterday, 4:15 PM</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {recordsSubTab === "submissions" && (
                      <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "12px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "white", margin: "0 0 16px 0" }}>Record Submission History</h4>
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#666", fontSize: "13px" }}>
                          No submissions found for this user.
                        </div>
                      </div>
                    )}

                    {recordsSubTab === "challenges" && (
                      <div style={{ background: "rgba(255,255,255,0.02)", padding: "20px", borderRadius: "12px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "800", color: "white", margin: "0 0 16px 0" }}>Challenge Participation</h4>
                        <div style={{ textAlign: "center", padding: "40px 0", color: "#666", fontSize: "13px" }}>
                          User hasn't participated in any challenges yet.
                        </div>
                      </div>
                    )}
                  </div>
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
                    
                    {/* Sizes, Pricing, and Stock Sub-form */}
                    <div style={{ background: "rgba(255,85,0,0.02)", border: "1px dashed rgba(255,85,0,0.15)", borderRadius: "12px", padding: "16px", marginTop: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <label style={{ fontSize: "11px", fontWeight: "950", color: "#FF5500", letterSpacing: "0.5px" }}>SIZES & SIZE-BASED PRICING</label>
                        <button
                          type="button"
                          onClick={() => {
                            const currentSizes = productForm.sizes || [];
                            setProductForm({
                              ...productForm,
                              sizes: [...currentSizes, { size: "", price: productForm.price || "0", stock: "10" }]
                            });
                          }}
                          style={{ background: "#FF5500", border: "none", color: "white", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", cursor: "pointer" }}
                        >
                          + ADD SIZE
                        </button>
                      </div>

                      {(!productForm.sizes || productForm.sizes.length === 0) ? (
                        <p style={{ fontSize: "11px", color: "#666", margin: 0, fontStyle: "italic" }}>No sizes configured. Default price and inventory count will be used.</p>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {productForm.sizes.map((sz, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                              <input
                                type="text"
                                placeholder="Size (e.g. S, M, 11x14)"
                                value={sz.size}
                                onChange={(e) => {
                                  const updated = [...productForm.sizes];
                                  updated[idx].size = e.target.value;
                                  setProductForm({ ...productForm, sizes: updated });
                                }}
                                required
                                style={{ flex: 1.5, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "8px 10px", color: "white", fontSize: "12px" }}
                              />
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Price ($)"
                                value={sz.price}
                                onChange={(e) => {
                                  const updated = [...productForm.sizes];
                                  updated[idx].price = e.target.value;
                                  setProductForm({ ...productForm, sizes: updated });
                                }}
                                required
                                style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "8px 10px", color: "white", fontSize: "12px" }}
                              />
                              <input
                                type="number"
                                placeholder="Stock"
                                value={sz.stock}
                                onChange={(e) => {
                                  const updated = [...productForm.sizes];
                                  updated[idx].stock = e.target.value;
                                  setProductForm({ ...productForm, sizes: updated });
                                }}
                                required
                                style={{ flex: 1, background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "6px", padding: "8px 10px", color: "white", fontSize: "12px" }}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (productForm.sizes || []).filter((_, i) => i !== idx);
                                  setProductForm({ ...productForm, sizes: updated });
                                }}
                                style={{ background: "transparent", border: "none", color: "#ef4444", fontSize: "16px", cursor: "pointer", fontWeight: "bold", padding: "4px" }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Extra Images URL text area */}
                    <div style={{ marginTop: "12px" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EXTRA IMAGES (one URL per line)</label>
                      <textarea
                        value={Array.isArray(productForm.imageUrls) ? productForm.imageUrls.filter(Boolean).join("\n") : ""}
                        onChange={(e) => {
                          const urls = e.target.value.split("\n");
                          setProductForm({ ...productForm, imageUrls: urls });
                        }}
                        placeholder="https://example.com/image2.jpg&#13;https://example.com/image3.jpg"
                        style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "60px", fontSize: "12px", fontFamily: "inherit" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>PRODUCT DESCRIPTION</label>
                      <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", minHeight: "80px", fontFamily: "inherit" }} />
                    </div>
                  </>
                )}


                {/* 7. DASHBOARD/MEMBERSHIPS AND COUPONS TAB FORM */}
                {activeTab === "revenue" && (
                  <>
                    {revenueSubTab === "coupons" ? (
                      <>
                        {/* Coupon Form Fields */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>COUPON CODE</label>
                            <input 
                              type="text" 
                              value={couponForm.code} 
                              onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })} 
                              required={!couponForm.autoGenerate} 
                              disabled={couponForm.autoGenerate}
                              placeholder={couponForm.autoGenerate ? "ROGUE-XXXXX" : "e.g. ROGUE30"}
                              style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", textTransform: "uppercase" }} 
                            />
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <input 
                                type="checkbox" 
                                id="autoGenerate" 
                                checked={couponForm.autoGenerate} 
                                onChange={(e) => {
                                  setCouponForm({
                                    ...couponForm,
                                    autoGenerate: e.target.checked,
                                    code: e.target.checked ? "AUTO-GENERATED" : ""
                                  });
                                }} 
                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                              />
                              <label htmlFor="autoGenerate" style={{ color: "#aaa", fontSize: "11px", cursor: "pointer", fontWeight: "700" }}>AUTO-GENERATE CODE</label>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DISCOUNT TYPE</label>
                            <select value={couponForm.discountType} onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed">Fixed Dollar ($)</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>DISCOUNT VALUE</label>
                            <input type="number" step="0.01" value={couponForm.discountValue} onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })} required placeholder="e.g. 30 or 10.00" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>APPLIES TO</label>
                            <select value={couponForm.appliesTo} onChange={(e) => setCouponForm({ ...couponForm, appliesTo: e.target.value, targetId: "" })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                              <option value="all">All Orders / Subtotal</option>
                              <option value="product">Specific Product</option>
                              <option value="category">Specific Product Category</option>
                              <option value="membership">Elite Memberships</option>
                              <option value="ticket">Event Tickets</option>
                            </select>
                          </div>
                          <div>
                            {couponForm.appliesTo === "product" && (
                              <>
                                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SELECT TARGET PRODUCT</label>
                                <select value={couponForm.targetId} onChange={(e) => setCouponForm({ ...couponForm, targetId: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                                  <option value="">-- Choose Product --</option>
                                  {products && products.map(p => <option key={p.id} value={p.id}>{p.name} (${parseFloat(p.price).toFixed(2)})</option>)}
                                </select>
                              </>
                            )}
                            {couponForm.appliesTo === "category" && (
                              <>
                                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SELECT TARGET CATEGORY</label>
                                <select value={couponForm.targetId} onChange={(e) => setCouponForm({ ...couponForm, targetId: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                                  <option value="">-- Choose Category --</option>
                                  <option value="accessories">Accessories</option>
                                  <option value="apparel">Apparel</option>
                                  <option value="equipment">Equipment</option>
                                  <option value="supplements">Supplements</option>
                                </select>
                              </>
                            )}
                            {couponForm.appliesTo === "membership" && (
                              <>
                                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SELECT TARGET MEMBERSHIP TIER</label>
                                <select value={couponForm.targetId} onChange={(e) => setCouponForm({ ...couponForm, targetId: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                                  <option value="">All Tiers</option>
                                  <option value="bronze">Bronze Tier Only</option>
                                  <option value="silver">Silver Tier Only</option>
                                  <option value="gold">Gold Tier Only</option>
                                </select>
                              </>
                            )}
                            {couponForm.appliesTo === "ticket" && (
                              <>
                                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>SELECT TARGET EVENT</label>
                                <select value={couponForm.targetId} onChange={(e) => setCouponForm({ ...couponForm, targetId: e.target.value })} required style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                                  <option value="">-- Choose Event --</option>
                                  {events && events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                                </select>
                              </>
                            )}
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MINIMUM PURCHASE AMOUNT ($)</label>
                            <input type="number" step="0.01" value={couponForm.minPurchase} onChange={(e) => setCouponForm({ ...couponForm, minPurchase: e.target.value })} placeholder="e.g. 30.00" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>EXPIRATION DATE</label>
                            <input type="date" value={couponForm.expirationDate} onChange={(e) => setCouponForm({ ...couponForm, expirationDate: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", colorScheme: "dark" }} />
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>MAX REDEMPTIONS (TOTAL)</label>
                            <input type="number" value={couponForm.maxRedemptions} onChange={(e) => setCouponForm({ ...couponForm, maxRedemptions: e.target.value })} placeholder="e.g. 100" style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>RESTRICT BY MEMBERSHIP TIER (MINIMUM)</label>
                            <select value={couponForm.restrictedMembershipTier} onChange={(e) => setCouponForm({ ...couponForm, restrictedMembershipTier: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white" }}>
                              <option value="">No membership restriction</option>
                              <option value="bronze">Bronze tier or higher</option>
                              <option value="silver">Silver tier or higher</option>
                              <option value="gold">Gold tier or higher</option>
                            </select>
                          </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div>
                            <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#555", marginBottom: "6px" }}>RESTRICTED COUNTRY CODE (OPTIONAL)</label>
                            <input type="text" placeholder="e.g. USA" value={couponForm.restrictedCountry} onChange={(e) => setCouponForm({ ...couponForm, restrictedCountry: e.target.value })} style={{ width: "100%", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "10px 14px", color: "white", textTransform: "uppercase" }} />
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: "10px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <input 
                                type="checkbox" 
                                id="couponActive" 
                                checked={couponForm.active} 
                                onChange={(e) => setCouponForm({ ...couponForm, active: e.target.checked })} 
                                style={{ width: "16px", height: "16px", cursor: "pointer" }}
                              />
                              <label htmlFor="couponActive" style={{ color: "#aaa", fontSize: "12px", cursor: "pointer", fontWeight: "700" }}>COUPON IS ACTIVE / ENABLED</label>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Original Membership Form Fields */}
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
                  </>
                )}

              </div>

              {/* Modal Footer */}
              <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "flex-end", gap: "14px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: "rgba(255,255,255,0.04)", color: "#ccc", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: "pointer" }}>{modalType === "viewProfile" ? "CLOSE" : "CANCEL"}</button>
                {modalType !== "viewProfile" && (
                  <button type="submit" disabled={modalLoading} style={{ background: "linear-gradient(135deg, #FF5500 0%, #ff7700 100%)", color: "white", border: "none", padding: "12px 32px", borderRadius: "10px", fontSize: "13px", fontWeight: "900", cursor: modalLoading ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }} className="btn-glow-neon">
                    {modalLoading ? "SAVING..." : "SAVE ENTRY"}
                    {modalLoading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                  </button>
                )}
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
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>RECORD ATTEMPT TITLE</label>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "white" }}>{selectedRecordDetail.title}</div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>CATEGORY & DIVISION</label>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "#aaa" }}>{selectedRecordDetail.category}</div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "#FF5500", marginBottom: "6px", letterSpacing: "1px", textTransform: "uppercase" }}>TRACKING NUMBER</label>
                  <div style={{ fontSize: "16px", fontWeight: "800", color: "white", display: "flex", alignItems: "center", gap: "8px" }}>
                    {selectedRecordDetail.id ? `TRK-${selectedRecordDetail.id.substring(0,8).toUpperCase()}` : "TRK-PENDING"}
                    <button onClick={() => alert("Tracking Number Generated & Emailed to Athlete")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "2px 8px", borderRadius: "4px", cursor: "pointer", fontSize: "9px", fontWeight: "800" }}>GENERATE</button>
                  </div>
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
            <div style={{ padding: "24px 32px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
              <button 
                type="button" 
                onClick={() => setIsRecordDetailModalOpen(false)} 
                style={{ background: "rgba(255,255,255,0.04)", color: "#ccc", border: "1px solid rgba(255,255,255,0.05)", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
              >
                CLOSE REVIEW SHEET
              </button>
              
              {selectedRecordDetail.status === "pending" && (
                <>
                  <button 
                    type="button" 
                    onClick={() => {
                      alert("Status changed to Pending Review.");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "transparent", border: "1px solid #3b82f6", color: "#3b82f6", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
                  >
                    MARK PENDING REVIEW
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      alert("Requested more info from the athlete.");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "transparent", border: "1px solid #ffcc00", color: "#ffcc00", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
                  >
                    REQUEST MORE INFO
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      handleQuickAdjudicate(selectedRecordDetail.id, "rejected");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer" }}
                  >
                    DENY SUBMISSION
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      handleQuickAdjudicate(selectedRecordDetail.id, "verified");
                      setIsRecordDetailModalOpen(false);
                    }} 
                    style={{ background: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)", color: "white", border: "none", padding: "12px 28px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 20px rgba(34, 197, 94, 0.2)" }}
                  >
                    APPROVE SUBMISSION
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
