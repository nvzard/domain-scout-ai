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

// Test 12: OpenRouter Response Extraction & Error Handling
console.log('\nTest 12: OpenRouter Response Extraction & Error Handling');
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

    // 2. <think> tag stripping
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{
          message: {
            content: '<think>Let me brainstorm some names for an AI tool...</think>\n1. BrainCraft.io\n2. CortexFlow.ai'
          }
        }]
      })
    });
    const res2 = await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'brain assistant');
    assert.ok(!res2.includes('<think>'));
    assert.ok(res2.includes('BrainCraft.io'));

    // 3. Reasoning model token limit (content is null, finish_reason is length)
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{
          finish_reason: 'length',
          message: {
            content: null,
            reasoning: 'First, the user wants a plain numbered list...'
          }
        }]
      })
    });
    let caughtLengthErr = null;
    try {
      await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'prompt');
    } catch (e) {
      caughtLengthErr = e;
    }
    assert.ok(caughtLengthErr, 'Should throw error when model ran out of tokens during reasoning');
    assert.ok(caughtLengthErr.message.includes('ran out of tokens during reasoning'));

    // 4. Rate limit / 429 error message formatting
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

    // 5. Network AbortError / NS_BINDING_ABORTED handling
    global.fetch = async () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    };
    let caughtAbortErr = null;
    try {
      await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'prompt');
    } catch (e) {
      caughtAbortErr = e;
    }
    assert.ok(caughtAbortErr, 'Should catch AbortError');
    assert.ok(caughtAbortErr.message.includes('timed out or was aborted'), 'Message should describe timeout or abort');

    // 6. Verification of OpenRouter Anti-Reasoning payload flags
    let capturedBody = null;
    let capturedHeaders = null;
    global.fetch = async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      capturedHeaders = opts.headers;
      return {
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '1. FastLaunch.io\n2. ScoutApp.ai' } }]
        })
      };
    };
    await AiGenerator.generateWithCustomApi('openrouter', 'test-key', 'fast launch');
    assert.strictEqual(capturedBody.include_reasoning, false, 'Should disable reasoning to speed up response');
    assert.strictEqual(capturedBody.reasoning?.effort, 'low', 'Should set reasoning effort to low');
    assert.strictEqual(capturedBody.reasoning?.max_tokens, undefined, 'Should not specify max_tokens when effort is specified');
    assert.strictEqual(capturedHeaders['X-Title'], 'Domain Scout AI', 'Should include X-Title');
    assert.strictEqual(capturedHeaders['HTTP-Referer'], undefined, 'Should omit HTTP-Referer to avoid Firefox header conflicts');

    // 7. Resilient Round-1 Fallback in huntAvailableDomains
    global.fetch = async () => {
      const err = new Error('NetworkError when attempting to fetch resource');
      err.name = 'TypeError';
      throw err;
    };

    const fallbackResult = await AiGenerator.huntAvailableDomains({
      prompt: 'dev platform',
      defaultTlds: ['com', 'io'],
      provider: 'openrouter',
      apiKey: 'test-key',
      targetAvailableCount: 3,
      domainCheckerInstance: {
        parseDomainPayload: (txt, tlds) => DomainChecker.parseDomainPayload(txt, tlds),
        checkDomains: async (txt, tlds) => {
          return [
            { domain: 'devsync.com', name: 'devsync', tld: 'com', isAvailable: true, isRegistered: false },
            { domain: 'devforge.io', name: 'devforge', tld: 'io', isAvailable: true, isRegistered: false },
            { domain: 'devcloud.com', name: 'devcloud', tld: 'com', isAvailable: true, isRegistered: false }
          ];
        }
      }
    });

    assert.strictEqual(fallbackResult.engine, 'smart_brain', 'Should fallback to smart_brain');
    assert.ok(fallbackResult.fallbackWarning, 'Should have fallbackWarning populated');
    assert.ok(fallbackResult.fallbackWarning.includes('OpenRouter error'), 'Warning should mention OpenRouter error');
    assert.ok(fallbackResult.availableDomains.length > 0, 'Should produce available domains');

  } finally {
    global.fetch = originalFetch;
  }
  console.log('✓ Passed OpenRouter Response Extraction & Error Handling tests');
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

// Test 14: Reasoning Output Immunity & Conversational Prose Filtering
console.log('\nTest 14: Reasoning Output Immunity & Conversational Prose Filtering');
function testReasoningImmunity() {
  // Test sentence fragments reject
  assert.strictEqual(DomainChecker.cleanDomainInput('First, the user wants a plain numbered list of 15 domain name ideas.'), '');
  assert.strictEqual(DomainChecker.cleanDomainInput('and brandable names.'), '');
  assert.strictEqual(DomainChecker.cleanDomainInput('The concept is a "product hunt alternative".'), '');
  assert.strictEqual(DomainChecker.cleanDomainInput('so this alternative should be similar but distinct.'), '');
  assert.strictEqual(DomainChecker.cleanDomainInput('Ideas:'), '');
  assert.strictEqual(DomainChecker.cleanDomainInput('Requirements: Short (4-12 characters), memorable, brandable.'), '');

  // Exact user reasoning trace from dots-studio/dots-3-note-preview
  const userReasoningTrace = `First, the user wants a plain numbered list of 15 domain name ideas. No explanations, no filler, just the list.

The concept is a "product hunt alternative". Product Hunt is a platform for discovering new products, so this alternative should be similar but distinct. I need to think of creative, modern, short, and brandable names.

Requirements: Short (4-12 characters), memorable, brandable. So, I should aim for names that are catchy, easy to remember, and sound like a brand.

Domain names should be .com or similar, but since it's just the domain name, I'll assume they're available or creative ideas. I don't need to check availability, just generate ideas.

Brainstorming keywords related to product hunt: discover, find, hunt, product, new, launch, tech, startup, etc. But I need to make it alternative, so maybe synonyms or twists.

Think of words like: find, seek, hunt, discover, explore, launch, reveal, spark, ignite, etc.

Combine with product-related terms: prod, item, thing, gadget, etc.

But keep it short and brandable. Maybe use made-up words or clever combinations.

List out some ideas:

1. FindHunt – but might be too similar to Product Hunt.

2. DiscoverAlt – but might not be brandable.

I need 15 unique ideas.

Consider modern, techy names: often use -ly, -io, -er, or short punchy words.

Examples: Product Hunt is two words, but domain might be like producthunt.com. For alternative, maybe something like:

- ProdSeek

- HuntAlt

But need to be creative.

Think of verbs: Seek, Find, Hunt, Explore, Discover.

Nouns: Product, Item, Launch, Spark.

Combine: SeekProd, FindLaunch, etc.

But ensure it's short: 4-12 characters. So, names like "Seekr" or "Huntlr" might work.

Brandable: should sound like a company name, e.g., Google, Apple, etc. So, perhaps use invented words.

Ideas:

1. Prodhunt – but too close to Product Hunt.

2. AltHunt – similar.

Maybe avoid direct references.

Use abstract terms: Nova, Spark, Ignite, etc.

For example:

- NovaFind

- SparkSeek

But keep it short.

Aim for 4-12 characters. So, single words or two short words.

Domain names often are one word or hyphenated, but for brandable, better without hyphens if possible.

List potential names:

1. Seekr – sounds like seeker, for finding products.

2. Huntlr – like hunter, but for products.

3. Prodify – product + ify, but might not fit.

4. DiscoverX – discover with X, modern.

5. AltProd – alternative product.

6. NewHunt – new product hunt.

7. LaunchPad – but might be taken, and longer.

8. SparkFind – spark + find.

9. IgniteHunt – ignite + hunt.

10. ExploreAlt – explore alternative.

11. Findr – similar to finder.

12. Seekr – again.

13. ProdSeek – product seek.

14. HuntAlt – hunt alternative.

15. NovaLaunch – nova + launch.

But need to check character count.

Character count: each name should be between 4 and 12 characters.

For example, "Seekr" is 5 characters, good.

"Huntlr" is 6, good.

"Prodify" is 7, good.

"DiscoverX" is 9, good.

"AltProd" is 7, good.

"NewHunt" is 7, good.

"LaunchPad" is 9, but might be two words, but as domain, it's fine.

I need 15.

Brainstorm more:

- Findly – find + ly, like friendly.

- Seeko – seek + o, short.

- Prodio – product + io, modern.

- Huntio – hunt + io.

- Altio – alternative + io.

- NovaFind – but 8 characters.

- Sparkr – spark + r.

- Ignitr – ignite + r, but might be misspelled.

- ExploreX – explore + X.

- Discoverr – discover + r.

- Prodhunt – but 7 characters, similar to product hunt.

To avoid similarity, use different roots.

Think of words like: reveal, expose, unveil, but for products.

- Revealr

- Unveilr

But might not be brandable.

Use techy suffixes: -ly, -io, -er, -r.

For example: Findio, Seekio, Hunt`;

  const parsed = DomainChecker.parseDomainPayload(userReasoningTrace, ['com']);
  const parsedNames = parsed.map(p => p.name);

  // Assert genuine ideas are extracted
  assert.ok(parsedNames.includes('seekr'));
  assert.ok(parsedNames.includes('huntlr'));
  assert.ok(parsedNames.includes('prodify'));
  assert.ok(parsedNames.includes('discoverx'));
  assert.ok(parsedNames.includes('altprod'));
  assert.ok(parsedNames.includes('newhunt'));
  assert.ok(parsedNames.includes('launchpad'));
  assert.ok(parsedNames.includes('sparkfind'));
  assert.ok(parsedNames.includes('ignitehunt'));
  assert.ok(parsedNames.includes('explorealt'));
  assert.ok(parsedNames.includes('findr'));
  assert.ok(parsedNames.includes('prodseek'));
  assert.ok(parsedNames.includes('huntalt'));
  assert.ok(parsedNames.includes('novalaunch'));

  // CRITICAL: Assert NO conversational sentence names or concatenated sentences are present
  const badSentences = parsedNames.filter(name => 
    name.includes('theuser') ||
    name.includes('plainnumbered') ||
    name.includes('theconcept') ||
    name.includes('sothisalternative') ||
    name.includes('andbrandable') ||
    name.includes('producthuntisaplatform') ||
    name.includes('requirements') ||
    name.includes('brainstorming') ||
    name.length > 25
  );

  assert.strictEqual(
    badSentences.length,
    0,
    `Found invalid prose domain names in parsed output: ${badSentences.join(', ')}`
  );

  console.log('✓ Passed Reasoning Output Immunity & Conversational Prose Filtering tests');
}
testReasoningImmunity();

// Test 15: Cancellation Handling in huntAvailableDomains
async function testCancellation() {
  console.log('\nTest 15: Cancellation Handling in huntAvailableDomains');
  
  let cancelled = false;
  const mockChecker = {
    parseDomainPayload: (txt, tlds) => [{ name: 'testcandidate', tlds: ['com'] }],
    checkDomains: async () => {
      cancelled = true; // flag cancelled after first check
      return [{ name: 'testcandidate', tld: 'com', domain: 'testcandidate.com', isAvailable: false, isRegistered: true }];
    }
  };

  const result = await AiGenerator.huntAvailableDomains({
    prompt: 'Product Hunt alternative for indie hackers',
    defaultTlds: ['com'],
    provider: 'smart_brain',
    targetAvailableCount: 10,
    maxRounds: 3,
    domainCheckerInstance: mockChecker,
    isCancelled: () => cancelled
  });

  assert.ok(result.rounds <= 2, `Expected rounds <= 2 due to cancellation, got ${result.rounds}`);
  console.log('✓ Passed Cancellation Handling tests');
}

// Test 16: Background Worker State Management & Result Clearing
async function testBackgroundWorkerAndResultClearing() {
  console.log('\nTest 16: Background Worker & Search Clearing Logic');

  const mockStorage = {};
  const mockSentMessages = [];

  global.chrome = {
    storage: {
      local: {
        get: (keys, cb) => {
          const out = {};
          if (Array.isArray(keys)) {
            keys.forEach(k => { if (k in mockStorage) out[k] = mockStorage[k]; });
          }
          cb(out);
        },
        set: (obj, cb) => {
          Object.assign(mockStorage, obj);
          if (cb) cb();
        }
      }
    },
    runtime: {
      sendMessage: (msg) => {
        mockSentMessages.push(msg);
        return Promise.resolve();
      },
      onMessage: {
        addListener: () => {}
      }
    }
  };

  // Mock global.DomainChecker and global.AiGenerator for background.js
  global.DomainChecker = DomainChecker;
  global.AiGenerator = AiGenerator;

  const BackgroundWorker = require('./src/background.js');

  // 1. Start background hunt with mock checker
  const originalCheckDomains = DomainChecker.checkDomains;
  let checkCallCount = 0;
  try {
    DomainChecker.checkDomains = async (text, tlds) => {
      checkCallCount++;
      return [{ name: 'domainhunt', tld: 'com', domain: 'domainhunt.com', isAvailable: true, isRegistered: false }];
    };

    await BackgroundWorker.startAiHuntBackground({
      prompt: 'Indie maker tools',
      defaultTlds: ['com'],
      provider: 'smart_brain',
      targetAvailableCount: 1,
      maxRounds: 1
    }, 'test_search_1');

    assert.strictEqual(mockStorage.searchState.status, 'completed');
    assert.strictEqual(mockStorage.lastResults.length, 1);
    assert.strictEqual(mockStorage.lastResults[0].domain, 'domainhunt.com');
    assert.strictEqual(mockStorage.lastResults[0].isAvailable, true);
    assert.ok(mockStorage.lastAiMeta);
    assert.strictEqual(mockStorage.lastAiMeta.availableCount, 1);

    // 2. Test Cancellation
    await BackgroundWorker.cancelActiveSearch();
    assert.strictEqual(mockStorage.searchState.status, 'idle');
  } finally {
    DomainChecker.checkDomains = originalCheckDomains;
  }

  console.log('✓ Passed Background Worker & Result Clearing tests');
}

// Test 17: Live InstantDomainSearch Availability Validation
async function testInstantDomainSearchLiveApi() {
  console.log('\nTest 17: Live InstantDomainSearch API Availability Verification');
  const unregisteredDomain = `ds-unreg-${Date.now()}-${Math.floor(Math.random() * 100000)}.com`;
  const inputText = `google.com\napple.com\n${unregisteredDomain}`;

  const results = await DomainChecker.checkDomains(inputText, ['com']);
  assert.ok(Array.isArray(results), 'Expected results array from checkDomains');
  assert.strictEqual(results.length, 3, 'Expected 3 domain results');

  const google = results.find(r => r.domain === 'google.com');
  const apple = results.find(r => r.domain === 'apple.com');
  const unreg = results.find(r => r.domain === unregisteredDomain);

  assert.ok(google, 'google.com should be in results');
  assert.strictEqual(google.isRegistered, true, 'google.com should be marked isRegistered: true');
  assert.strictEqual(google.isAvailable, false, 'google.com should NOT be marked available');

  assert.ok(apple, 'apple.com should be in results');
  assert.strictEqual(apple.isRegistered, true, 'apple.com should be marked isRegistered: true');
  assert.strictEqual(apple.isAvailable, false, 'apple.com should NOT be marked available');

  assert.ok(unreg, `${unregisteredDomain} should be in results`);
  assert.strictEqual(unreg.isRegistered, false, `${unregisteredDomain} should be marked isRegistered: false`);
  assert.strictEqual(unreg.isAvailable, true, `${unregisteredDomain} should be marked isAvailable: true`);

  console.log('✓ Passed Live InstantDomainSearch API Availability Verification (Registered domains correctly identified as unavailable, unregistered domain correctly identified as available)');
}

async function runAllAsyncTests() {
  await testReiterationLoop();
  await testOpenRouterParsing();
  await testCancellation();
  await testBackgroundWorkerAndResultClearing();
  await testInstantDomainSearchLiveApi();
  console.log('\n🎉 ALL 17 TEST SUITES PASSED SUCCESSFULLY!');
}

runAllAsyncTests().catch(err => {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
});



