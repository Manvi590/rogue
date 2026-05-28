const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  createRecordByAdmin,
  updateRecordByAdmin,
  deleteRecordByAdmin,
  getAllEventsByAdmin,
  createEventByAdmin,
  updateEventByAdmin,
  deleteEventByAdmin,
  getAllProductsByAdmin,
  createProductByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  getAllInquiries,
  deleteInquiry,
  getAllOrdersByAdmin,
  updateOrderShippingStatusByAdmin,
  deleteOrderByAdmin,
  getCustomerPurchaseHistoryByAdmin,
  getPaymentsLedger,
  updatePaymentStatus,
  updateSuccessMessages,
  getJudgesRoster,
  assignRecordToJudge,
  submitJudgeDecision,
  approveFinalDecision,
  revertJudgeDecision,
  updateJudgeNotes
} = require('../controllers/adminController');

const {
  getAIScans,
  updateAIScanOverride,
  flagSuspiciousActivity,
  getAISettings,
  updateAISettings
} = require('../controllers/aiVerificationController');

const {
  getReports,
  updateReport,
  getMessages,
  sendMessage,
  getBans
} = require('../controllers/adminModerationController');

const {
  getMediaAssets,
  getCertificates,
  updateCertificateOrder
} = require('../controllers/adminContentController');

const { protect, admin } = require('../middleware/authMiddleware');

// Lock down all endpoints underneath protection check
router.use(protect);
router.use(admin);

// 👥 User Operations
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

// ⚔️ Records Operations
router.post('/records', createRecordByAdmin);
router.put('/records/:id', updateRecordByAdmin);
router.delete('/records/:id', deleteRecordByAdmin);

// 📅 Events Operations
router.get('/events', getAllEventsByAdmin);
router.post('/events', createEventByAdmin);
router.put('/events/:id', updateEventByAdmin);
router.delete('/events/:id', deleteEventByAdmin);

// 🛍️ Shop Catalog Operations
router.get('/products', getAllProductsByAdmin);
router.post('/products', createProductByAdmin);
router.put('/products/:id', updateProductByAdmin);
router.delete('/products/:id', deleteProductByAdmin);

// 📦 Shop Orders Operations
router.get('/orders', getAllOrdersByAdmin);
router.put('/orders/:id/shipping', updateOrderShippingStatusByAdmin);
router.delete('/orders/:id', deleteOrderByAdmin);
router.get('/orders/customer/:email', getCustomerPurchaseHistoryByAdmin);

// ✉️ Support Ticket Operations
router.get('/contacts', getAllInquiries);
router.delete('/contacts/:id', deleteInquiry);

// 💳 Dynamic Payments & Oversight Operations
router.get('/payments', getPaymentsLedger);
router.put('/payments/update', updatePaymentStatus);

// ✉️ Success Message Settings Operations
router.put('/success-messages', updateSuccessMessages);

// 👨‍⚖️ Adjudicator Operations
router.get('/judges', getJudgesRoster);
router.put('/judges/:id/notes', updateJudgeNotes);
router.put('/records/:id/assign', assignRecordToJudge);
router.put('/records/:id/judge-review', submitJudgeDecision);
router.put('/records/:id/approve', approveFinalDecision);
router.put('/records/:id/revert', revertJudgeDecision);

// 🤖 AI Verification Operations
router.get('/ai-verification/scans', getAIScans);
router.put('/ai-verification/scans/:id/override', updateAIScanOverride);
router.put('/ai-verification/scans/:id/flag', flagSuspiciousActivity);
router.get('/ai-verification/settings', getAISettings);
router.put('/ai-verification/settings', updateAISettings);

// 🛡️ Moderation & Communications (Phase 1)
router.get('/reports', getReports);
router.put('/reports/:id', updateReport);
router.get('/messages', getMessages);
router.post('/messages', sendMessage);
router.get('/bans', getBans);

// 🎬 Content, Media & Certificates (Phase 2)
router.get('/media', getMediaAssets);
router.get('/certificates', getCertificates);
router.put('/certificates/:id/order', updateCertificateOrder);

// 🔒 Security & Infrastructure (Phase 3)
const { getAuditLogs, triggerBackup, getApiKeys, updateSeoSettings } = require('../controllers/adminSecurityController');
router.get('/security/audit-logs', getAuditLogs);
router.post('/security/backup', triggerBackup);
router.get('/security/api-keys', getApiKeys);
router.put('/security/seo', updateSeoSettings);

// 💰 Monetization, Rankings & VIP (Phase 4)
const { getSponsors, updateVipStatus, getRevenueMetrics, recalculateRankings } = require('../controllers/adminMonetizationController');
router.get('/monetization/sponsors', getSponsors);
router.put('/monetization/vip/:userId', updateVipStatus);
router.get('/monetization/revenue', getRevenueMetrics);
router.post('/monetization/rankings/recalculate', recalculateRankings);

module.exports = router;
