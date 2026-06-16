---
apply: always
---

# Flat orchestration

Optimize for **reading top-to-bottom in one file**. A developer should understand a flow without opening context methods, repositories, or helpers.

## Prefer flat over clever

- Use linear steps with early `return` — not nested `try/catch/finally`.
- One `try/catch` per logical block (create campaign, create chapter, activate, reload list, start session).
- Declare result variables before each block: `let campaign: Campaign;` then assign inside `try`.
- On failure in a block: stop loading, show `Alert`, `return`. Repeat per block instead of sharing a `finally`.
- Duplication is fine. Clarity beats DRY.

## Inline logic; do not hide behind wrappers

When editing a flow (e.g. `handleStartNew`):

- **Do** call `worklet.openCampaign`, `worklet.put`, `worklet.get`, etc. directly in the handler.
- **Do** call React setters directly: `setError(null)`, `setActiveCampaign(...)`, `setCampaigns(...)`.
- **Do not** add or use context helpers like `createCampaign`, `clearError`, `applyActiveCampaign`, `refreshCampaigns` for that flow.
- **Unpack** repository/context methods into explicit steps when the user asks to flatten a flow.

Context should expose **primitives** (`worklet`, `setError`, `setActiveCampaign`, `setCampaigns`, …), not named wrappers for multi-step flows.

## Comments

Separate the handler into numbered logical blocks:

```typescript
// --- 1. Create campaign ---
// --- 2. Create first chapter ---
// --- 3. Activate chapter ---
// --- 4. Reload campaign list for the selection screen ---
// --- 5. Start master session ---
// --- 6. Open the session screen ---
```

Add a short comment **above every `worklet.` call** explaining what that call does (open DB, save record, read index, close DB, start swarm, etc.).

## Handler shape (template)

```typescript
const handleStartNew = async () => {
  // --- Prepare UI ---
  setIsSubmitting(true);
  setError(null);

  // --- 1. Step name ---
  let campaign: Campaign;
  try {
    campaign = createEntity<Campaign>({ ... });
    // Open a dedicated P2P database for this campaign.
    await worklet.openCampaign(campaign.id);
    // Save the new campaign record.
    await worklet.put(dbKeys.campaign(campaign.id), campaign);
  } catch (error) {
    setIsSubmitting(false);
    Alert.alert('Unable to start campaign', error instanceof Error ? error.message : 'Something went wrong.');
    return;
  }

  // --- 2. Next step ---
  // ...
};
```

## Anti-patterns

```typescript
// ❌ Hidden flow — reader must jump to context/repository
const campaign = await createCampaign(name);
await refreshCampaigns();

// ❌ Wrapper instead of explicit setter
clearError();
applyActiveCampaign(campaign, chapter);

// ❌ Deep nesting — hard to see what runs on success vs failure
try {
  setIsSubmitting(true);
  const x = await foo();
  if (!x) return;
  await bar();
} catch { ... } finally { setIsSubmitting(false); }
```

## When to relax

- Keep abstractions in **screens**, **repositories**, and **shared utilities** when the user is not flattening that path.
- Player join, bootstrap, and unrelated routes do not need inlining unless requested.
