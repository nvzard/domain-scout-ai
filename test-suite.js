const assert = require('assert');

// Load implementation
const DomainChecker = require('./src/domain-checker.js');

console.log('Running Domain Scout ChatGPT Parsing Test Suite...\n');

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

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
