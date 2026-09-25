function sanitizeAndParseJson(text) {
  if (!text || typeof text !== 'string') return null;
  let cleaned = text.trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // 1. Try standard parse first
  try {
    return JSON.parse(cleaned);
  } catch (initialErr) {
    // 2. Auto-heal: Fix bad backslash escapes and trailing commas
    try {
      // In JSON, only \" \\ \/ \b \f \n \r \t \uXXXX are valid.
      // Replace any single \ that is NOT followed by valid escape chars with \\
      let fixed = cleaned.replace(/\\(?!["\\/bfnrt]|u[0-9a-fA-F]{4})/g, '\\\\');
      // Remove trailing commas before } or ]
      fixed = fixed.replace(/,\s*([\]}])/g, '$1');
      return JSON.parse(fixed);
    } catch (secondErr) {
      throw initialErr;
    }
  }
}

// Simulating bad backslash at position like \approx, \text, \0, etc.
const badString = `[
  {
    "question": "What is \\approx value?",
    "answer": "Answer with \\delta and \\1 and trailing comma",
  }
]`;

try {
  const parsed = sanitizeAndParseJson(badString);
  console.log('Successfully healed and parsed JSON:', parsed);
} catch (e) {
  console.error('Failed to parse:', e.message);
}
