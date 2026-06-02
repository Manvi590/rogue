import fs from 'fs';
import path from 'path';

async function testSubmit() {
  console.log("Starting test record submission...");
  try {
    // 1. Create a user
    const email = "testuser" + Date.now() + "@test.com";
    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test User", email: email, password: "password123" }) 
    });
    const user = await res.json();
    if (!user.token) {
      console.log("Register failed", user);
      return;
    }
    console.log("Logged in:", user.email);

    // 2. Submit a record
    const payload = {
      title: "Test Speedrun " + Date.now(),
      category: "Gaming",
      description: "Test run with video and image evidence",
      athleteId: user.username || "testathlete",
      athleteName: user.name,
      venueName: "Test Venue",
      city: "Test City",
      recordType: "standard",
      value: "42.0",
      unit: "sec",
      evidenceUrl: "https://youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=700&q=80",
      paymentStatus: 'pending_payment'
    };

    const submitRes = await fetch("http://localhost:5001/api/records", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });
    const record = await submitRes.json();
    console.log("Record submission result:", submitRes.status, record);
    
    // 3. Test Profile Update with empty dob (should not 400 now)
    console.log("Testing profile update with empty DOB...");
    const profileRes = await fetch("http://localhost:5001/api/auth/profile", {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify({ dob: "" })
    });
    const profileObj = await profileRes.json();
    console.log("Profile update result:", profileRes.status, profileObj);
  } catch(e) {
    console.error(e);
  }
}
testSubmit();
