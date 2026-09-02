const assert = require('assert');

// Load implementations
const DomainChecker = require('./src/domain-checker.js');
const AiGenerator = require('./src/ai-generator.js');

console.log('Running Domain Scout Test Suite...\n');

// Test 1: Clean Domain Input
console.log('Test 1: cleanDomainInput sanitization');
assert.strictEqual(DomainChecker.cleanDomainInput('1. **LaunchScout** - A curated directory'), 'launchscout');
assert.strictEqual(DomainChecker.cleanDomainInput('2. **Noviqo.com** — Modern AI tool'), 'noviqo.com');
assert.strictEqual(DomainChecker.cleanDomainInput('3. *Brevio.io* – Smart naming'), 'brevio.io');
assert.strictEqual(DomainChecker.cleanDomainInput('4. **Novli**: The ultimate assistant'), 'novli');
assert.strictEqual(DomainChecker.cleanDomainInput('5. `LaunchBase` -> Next-gen platform'), 'launchbase');
assert.strictEqual(DomainChecker.cleanDomainInput('6. 🚀 StartupShelf (High growth startups)'), 'startupshelf');
assert.strictEqual(DomainChecker.cleanDomainInput('7. [CloudForge](https://cloudforge.dev) - Cloud automation'), 'cloudforge.dev');
assert.strictEqual(DomainChecker.cleanDomainInput('8. "BrandSprint" = Rapid framework'), 'brandsprint');
assert.strictEqual(DomainChecker.cleanDomainInput('9. Idea #9: AlphaStream // Streaming data'), 'alphastream');
assert.strictEqual(DomainChecker.cleanDomainInput('10. Option 10: DataPulse [Analytics]'), 'datapulse');
console.log('✓ Passed cleanDomainInput tests');

// Test 2: Parenthetical TLD extraction
console.log('\nTest 2: Parenthetical TLD extraction');
const payloadParen = DomainChecker.parseDomainPayload(
  '1. **LaunchScout** (.com, .io, .ai) - Great for startups\n2. **Noviqo** (com / co)\n3. Brevio (.ai or .io)',
  ['com']
);
assert.strictEqual(payloadParen.length, 3);
assert.strictEqual(payloadParen[0].name, 'launchscout');
assert.deepStrictEqual(payloadParen[0].tlds.sort(), ['ai', 'com', 'io']);
assert.strictEqual(payloadParen[1].name, 'noviqo');
assert.deepStrictEqual(payloadParen[1].tlds.sort(), ['co', 'com']);
assert.strictEqual(payloadParen[2].name, 'brevio');
assert.deepStrictEqual(payloadParen[2].tlds.sort(), ['ai', 'io']);
console.log('✓ Passed Parenthetical TLD tests');

// Test 3: Markdown Table parsing
console.log('\nTest 3: Markdown Table parsing');
const markdownTable = `
| # | Domain Name | TLD | Description |
|---|---|---|---|
| 1 | LaunchScout | .com | SaaS directory |
| 2 | Noviqo | .ai | AI engine |
| 3 | Brevio.io | | Short name |
`;
const payloadTable = DomainChecker.parseDomainPayload(markdownTable, ['com', 'io']);
assert.strictEqual(payloadTable.length, 3);
assert.strictEqual(payloadTable[0].name, 'launchscout');
assert.deepStrictEqual(payloadTable[0].tlds, ['com']);
assert.strictEqual(payloadTable[1].name, 'noviqo');
assert.deepStrictEqual(payloadTable[1].tlds, ['ai']);
assert.strictEqual(payloadTable[2].name, 'brevio');
assert.deepStrictEqual(payloadTable[2].tlds, ['io']);
console.log('✓ Passed Markdown Table tests');

// Test 4: JSON payload parsing
console.log('\nTest 4: JSON parsing');
const jsonArray = '["launchscout.com", "noviqo.io", "brevio"]';
const payloadJson = DomainChecker.parseDomainPayload(jsonArray, ['com', 'ai']);
assert.strictEqual(payloadJson.length, 3);
assert.strictEqual(payloadJson[0].name, 'launchscout');
assert.deepStrictEqual(payloadJson[0].tlds, ['com']);
assert.strictEqual(payloadJson[1].name, 'noviqo');
assert.deepStrictEqual(payloadJson[1].tlds, ['io']);
assert.strictEqual(payloadJson[2].name, 'brevio');
assert.deepStrictEqual(payloadJson[2].tlds, ['com', 'ai']);
console.log('✓ Passed JSON tests');

// Test 5: Complex ChatGPT conversation output
console.log('\nTest 5: Full ChatGPT conversational output');
const chatGptOutput = `
### AI Brand Names
Here are 10 domain name suggestions for your project:
1. **LaunchScout** (.com, .io, .ai) - A curated directory of tools
2. **Noviqo** (com / co) — Modern AI assistant
3. *Brevio* [Short and punchy name]
4. **Novli** (A creative tool for novelists)
5. \`LaunchBase\` -> Next-gen developer portal
6. 🚀 **StartupShelf** : Community platform for startups
7. [CloudForge](https://cloudforge.dev) - Cloud automation
8. "BrandSprint" = Rapid branding framework
9. Idea #9: AlphaStream // Streaming data
10. 10. DataPulse

Hope this helps! Let me know if you need more ideas.
`;
const payloadChat = DomainChecker.parseDomainPayload(chatGptOutput, ['com', 'io', 'ai']);
assert.strictEqual(payloadChat.length, 10);
const names = payloadChat.map(p => p.name);
assert.deepStrictEqual(names, [
  'launchscout',
  'noviqo',
  'brevio',
  'novli',
  'launchbase',
  'startupshelf',
  'cloudforge',
  'brandsprint',
  'alphastream',
  'datapulse'
]);
console.log('✓ Passed Full ChatGPT output tests');

// Test 6: Legacy backward compatibility
console.log('\nTest 6: Legacy formats');
const legacy1 = "name1\nname2\nname3.org";
const payloadLegacy1 = DomainChecker.parseDomainPayload(legacy1, ['com']);
assert.strictEqual(payloadLegacy1.length, 3);
assert.strictEqual(payloadLegacy1[2].name, 'name3');
assert.deepStrictEqual(payloadLegacy1[2].tlds, ['org']);

const legacy2 = "LaunchList — products get listed for discovery\nTinyLaunch — fits small founders";
const payloadLegacy2 = DomainChecker.parseDomainPayload(legacy2, ['com']);
assert.strictEqual(payloadLegacy2.length, 2);
assert.strictEqual(payloadLegacy2[0].name, 'launchlist');
assert.strictEqual(payloadLegacy2[1].name, 'tinylaunch');
console.log('✓ Passed Legacy backward compatibility tests');

// Test 7: AI Generator Keyword Extraction & Category Detection
console.log('\nTest 7: AI Keyword Extraction & Category Detection');
const kw1 = AiGenerator.extractKeywords('suggest me domain ideas for a product hunt alternative');
assert.ok(kw1.length > 0);
assert.strictEqual(AiGenerator.detectCategory('product hunt alternative for new startups'), 'curation');
assert.strictEqual(AiGenerator.detectCategory('smart AI automated coding assistant and LLM tools'), 'ai');
assert.strictEqual(AiGenerator.detectCategory('developer git cloud kubernetes deploy tool'), 'devtools');
assert.strictEqual(AiGenerator.detectCategory('crypto payments and digital banking invoice tracker'), 'business');
assert.strictEqual(AiGenerator.detectCategory('creative vector design photo studio and icons'), 'creative');
console.log('✓ Passed AI Keyword Extraction & Category Detection tests');

// Test 8: AI Smart Local Semantic Brain Generation & Exclusion Handling
console.log('\nTest 8: AI Smart Local Semantic Brain Generation');
const ideas1 = AiGenerator.generateWithSmartBrain('product hunt alternative', new Set(), 10);
assert.ok(Array.isArray(ideas1));
assert.strictEqual(ideas1.length, 10);
ideas1.forEach(name => {
  assert.ok(/^[a-z0-9]{3,16}$/.test(name), `Invalid domain format: ${name}`);
});

// Test exclusion adherence
const excluded = new Set([ideas1[0], ideas1[1], ideas1[2]]);
const ideas2 = AiGenerator.generateWithSmartBrain('product hunt alternative', excluded, 10);
ideas2.forEach(name => {
  assert.ok(!excluded.has(name), `Generated name ${name} should have been excluded!`);
});
console.log('✓ Passed AI Smart Brain Generation & Exclusion tests');

// Test 9: AI Exclusion Prompt Construction
console.log('\nTest 9: AI Exclusion Prompt Construction');
const promptWithoutExclusions = AiGenerator.buildPromptWithExclusions('AI video editor', []);
assert.ok(promptWithoutExclusions.includes('AI video editor'));
assert.ok(!promptWithoutExclusions.includes('ALREADY TAKEN'));

const promptWithExclusions = AiGenerator.buildPromptWithExclusions('AI video editor', ['videospark', 'filmflow', 'clipcraft']);
assert.ok(promptWithExclusions.includes('videospark, filmflow, clipcraft'));
assert.ok(promptWithExclusions.includes('ALREADY TAKEN / REGISTERED'));
assert.ok(promptWithExclusions.includes('DO NOT suggest or repeat'));
console.log('✓ Passed AI Exclusion Prompt Construction tests');

// Test 10: AI Autonomous Reiteration Loop with Mock DomainChecker
console.log('\nTest 10: AI Autonomous Reiteration Loop');
async function testReiterationLoop() {
  let roundCounter = 0;
  const mockDomainChecker = {
    parseDomainPayload: (text, tlds) => {
      const names = text.split(/[\r\n]+/)
        .map(l => l.replace(/^\d+\.\s*/, '').replace(/\*/g, '').trim().toLowerCase())
        .filter(Boolean);
      return names.map(n => ({ name: n, hash: '123', tlds }));
    },
    checkDomains: async (inputText, tlds) => {
      roundCounter++;
      const names = inputText.split(/[\r\n]+/).map(s => s.trim().toLowerCase()).filter(Boolean);
      
      // In Round 1: make all names taken
      // In Round 2: make 3 names available
      return names.map((name, idx) => {
        const isAvailable = (roundCounter >= 2 && idx < 3);
        return {
          domain: `${name}.${tlds[0]}`,
          name,
          tld: tlds[0],
          isAvailable,
          isRegistered: !isAvailable,
          isAftermarket: false
        };
      });
    }
  };

  const progressEvents = [];
  const result = await AiGenerator.huntAvailableDomains({
    prompt: 'Product Hunt alternative for indie founders',
    defaultTlds: ['com'],
    provider: 'smart_brain',
    targetAvailableCount: 3,
    maxRounds: 3,
    domainCheckerInstance: mockDomainChecker,
    onProgress: (p) => progressEvents.push(p)
  });

  assert.ok(result.rounds >= 2, 'Should have iterated to round 2');
  assert.ok(result.availableCount >= 3, 'Should have found at least 3 available domains');
  assert.strictEqual(result.availableDomains.length, 3);
  assert.strictEqual(result.engine, 'smart_brain');
  assert.strictEqual(result.engineName, 'Smart Brain (Offline)');
  assert.ok(progressEvents.length > 0, 'Should have emitted progress events');
  console.log(`✓ Reiteration loop completed in ${result.rounds} rounds with ${result.availableCount} available domains found (Engine: ${result.engineName})`);
}

// Test 11: AI Engine Display Names
console.log('\nTest 11: AI Engine Display Names');
assert.strictEqual(AiGenerator.getEngineDisplayName('smart_brain'), 'Smart Brain (Offline)');
assert.strictEqual(AiGenerator.getEngineDisplayName('openai'), 'OpenAI (GPT-4o mini)');
assert.strictEqual(AiGenerator.getEngineDisplayName('gemini'), 'Google Gemini');
assert.strictEqual(AiGenerator.getEngineDisplayName('groq'), 'Groq (Llama 3)');
assert.strictEqual(AiGenerator.getEngineDisplayName('openrouter'), 'OpenRouter');
console.log('✓ Passed AI Engine Display Names tests');

// Test 12: OpenRouter Response Extraction & Fallback Parsing
console.log('\nTest 12: OpenRouter Response Extraction & Fallback Parsing');
async function testOpenRouterParsing() {
  // Mock global fetch for testing custom API parser
  const originalFetch = global.fetch;

  try {
    // 1. Standard choices[0].message.content
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '1. AppCraft.io\n2. LaunchForge.ai' } }]
      })
    });
    const res1 = await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'app generator');
    assert.ok(res1.includes('AppCraft.io'));

    // 2. Reasoning model fallback (content is null, output is in reasoning)
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: null,
            reasoning: '1. BrainStack.ai\n2. CortexFlow.io'
          }
        }]
      })
    });
    const res2 = await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'brain assistant');
    assert.ok(res2.includes('BrainStack.ai'));

    // 3. Rate limit / 429 error message formatting
    global.fetch = async () => ({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
      json: async () => ({
        error: { message: 'Provider returned error: rate-limited upstream' }
      })
    });
    let caughtErr = null;
    try {
      await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'prompt');
    } catch (e) {
      caughtErr = e;
    }
    assert.ok(caughtErr, 'Should throw on 429 error');
    assert.ok(caughtErr.message.includes('rate-limited') || caughtErr.message.includes('busy'));

  } finally {
    global.fetch = originalFetch;
  }
  console.log('✓ Passed OpenRouter Response Extraction & Fallback tests');
}

// Test 13: Semantic Smart Brain Quality on Real-World User Queries
console.log('\nTest 13: Semantic Smart Brain Quality on Real-World User Queries');
function testSmartBrainSemanticQuality() {
  // 1. "pokemon store"
  const pokemonResults = AiGenerator.generateWithSmartBrain('pokemon store', new Set(), 15);
  assert.strictEqual(pokemonResults.length, 15);
  const pokemonMatches = pokemonResults.filter(name => /poke|pokemon|mon|mart|vault|deck/i.test(name));
  assert.ok(pokemonMatches.length >= 10, `Expected at least 10 pokemon-relevant names, got ${pokemonMatches.length}: ${pokemonResults.join(', ')}`);

  // 2. "service to decrease aws spends"
  const awsResults = AiGenerator.generateWithSmartBrain('service to decrease aws spends', new Set(), 15);
  assert.strictEqual(awsResults.length, 15);
  const awsMatches = awsResults.filter(name => /aws|cloud|spend|cost|cut|trim|save|less|opt|guard|slash/i.test(name));
  assert.ok(awsMatches.length >= 10, `Expected at least 10 AWS cost-cutting relevant names, got ${awsMatches.length}: ${awsResults.join(', ')}`);

  // 3. "coffee shop"
  const coffeeResults = AiGenerator.generateWithSmartBrain('coffee shop', new Set(), 15);
  assert.strictEqual(coffeeResults.length, 15);
  const coffeeMatches = coffeeResults.filter(name => /coffee|brew|roast|cafe|bean|bar|cup|sip|espresso/i.test(name));
  assert.ok(coffeeMatches.length >= 10, `Expected at least 10 coffee relevant names, got ${coffeeMatches.length}: ${coffeeResults.join(', ')}`);

  // 4. "food delivery app"
  const foodResults = AiGenerator.generateWithSmartBrain('food delivery app', new Set(), 15);
  assert.strictEqual(foodResults.length, 15);
  const foodMatches = foodResults.filter(name => /food|meal|eats|bite|dash|drop|swift|express/i.test(name));
  assert.ok(foodMatches.length >= 10, `Expected at least 10 food delivery relevant names, got ${foodMatches.length}: ${foodResults.join(', ')}`);

  // 5. "crypto payments"
  const cryptoResults = AiGenerator.generateWithSmartBrain('crypto payments', new Set(), 15);
  assert.strictEqual(cryptoResults.length, 15);
  const cryptoMatches = cryptoResults.filter(name => /crypto|pay|coin|token|wallet|chain|mint/i.test(name));
  assert.ok(cryptoMatches.length >= 10, `Expected at least 10 crypto payment relevant names, got ${cryptoMatches.length}: ${cryptoResults.join(', ')}`);

  console.log('✓ Passed Semantic Smart Brain Quality tests on all key queries');
}
testSmartBrainSemanticQuality();

Promise.all([testReiterationLoop(), testOpenRouterParsing()]).then(() => {
  console.log('\n🎉 ALL 13 TEST SUITES PASSED SUCCESSFULLY!');
}).catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});

