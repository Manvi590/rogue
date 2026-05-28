const attempts = [
  { id: 1, status: "FAILED ATTEMPT" },
  { id: 2, status: "FAILED ATTEMPT" },
  { id: 3, status: "FAILED ATTEMPT" },
  { id: 4, status: "PENDING REVIEW" },
  { id: 5, status: "CURRENT RECORD" }
];
const statusOrder = {
  "CURRENT RECORD": 1,
  "PENDING REVIEW": 2,
  "APPROVED ATTEMPT": 3,
  "BROKEN": 4,
  "FAILED ATTEMPT": 5
};
attempts.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
console.log(attempts);
