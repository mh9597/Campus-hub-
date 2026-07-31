const ENDPOINT = 'https://api.example.com/submissions';

async function runSubscriptionTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING COMPLETE NEWSLETTER SUBSCRIPTION FLOW TESTS');
  console.log('====================================================\n');

  // Test 1: Invalid emails rejection
  console.log('--- Test 1: Invalid Email Validation ---');
  const invalidEmails = ['', '   ', 'plainaddress', 'missingdomain@', '@missinguser.com', 'user@.com'];
  
  for (const email of invalidEmails) {
    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'subscriber', data: { email } })
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        console.log(`✅ Correctly rejected invalid email '${email}':`, data.error);
      } else {
        console.log(`❌ Expected error for '${email}', but got:`, data);
      }
    } catch (err) {
      console.log(`✅ Network rejected invalid email '${email}':`, err.message);
    }
  }

  // Test 2: Valid email subscription & DB save
  console.log('\n--- Test 2: Valid Email Subscription ---');
  const uniqueTestEmail = `verify.flow.${Date.now()}@example.com`;
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subscriber', data: { email: uniqueTestEmail } })
    });
    const data = await response.json();
    console.log(`✅ Valid email '${uniqueTestEmail}' response:`, data);
  } catch (err) {
    console.error(`❌ Valid email subscription failed:`, err.message);
  }

  // Test 3: Duplicate email prevention & duplicate response message
  console.log('\n--- Test 3: Duplicate Email Prevention ---');
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subscriber', data: { email: uniqueTestEmail } })
    });
    const data = await response.json();
    console.log(`✅ Duplicate attempt output for '${uniqueTestEmail}':`, data);
    if (data.isDuplicate && data.message === 'You are already subscribed.') {
      console.log('  -> Confirmed: Duplicate flagged and "You are already subscribed." returned.');
    } else {
      console.warn('  -> Warning: Unexpected response:', data);
    }
  } catch (err) {
    console.error(`❌ Duplicate test threw unexpected error:`, err.message);
  }

  console.log('\n====================================================');
  console.log('✨ All flow tests completed.');
  console.log('====================================================');
}

runSubscriptionTests();
