# What Data is Saved to Firestore?

## Complete List of Saved Data

When an admin updates the match, **EVERYTHING** in the match state is saved to Firestore. Here's what gets stored:

### Core Match Information
```json
{
  "matchId": "PS1K2M",           // Unique match identifier
  "team1": "India",              // Team 1 name
  "team2": "Pakistan",           // Team 2 name
  "battingTeam": 1,              // Which team is batting (1 or 2)
  "totalOvers": 20,              // Total overs in the match
}
```

### Live Score Data
```json
{
  "runs": 145,                   // Total runs scored by batting team
  "wickets": 3,                  // Total wickets lost
  "ballsInCurrentOver": 2,       // Balls bowled in current over (0-5)
  "completedOvers": 12,          // Number of completed overs
}
```

### Match Progress
```json
{
  "history": [                   // Complete ball-by-ball history
    {
      "type": "legal",           // "legal", "wide", or "noball"
      "runs": 1,                 // Runs scored on this ball
      "isWicket": false,         // Was it a wicket?
      "wicketType": "Bowled"     // Type of wicket (if applicable)
    },
    {
      "type": "legal",
      "runs": 4,
      "isWicket": false
    },
    // ... more balls ...
  ],
  "overHistory": [               // Balls in current over
    {
      "type": "legal",
      "runs": 0,
      "isWicket": false
    }
  ],
}
```

### Innings & Target Information
```json
{
  "innings": 1,                  // Current innings (1 or 2)
  "target": 150,                 // Target for 2nd innings (if applicable)
  "firstInningsData": {          // 1st innings score (when 2nd innings starts)
    "runs": 145,
    "wickets": 7,
    "overs": "20.0"
  },
}
```

### Game Status
```json
{
  "isGameOver": false,           // Is the match finished?
  "isTimerRunning": true,        // Is the match timer running?
  "timerSeconds": 1245,          // Total seconds elapsed
  "seriesScore": {               // Series score (for multiple matches)
    "team1": 1,
    "team2": 0
  },
}
```

### Toss Information
```json
{
  "toss": {
    "winner": "India",           // Toss winner
    "decision": "bat"            // "bat" or "bowl"
  },
}
```

### Admin Information
```json
{
  "permission": "editable",      // "editable" or "view-only"
  "role": "admin",               // "admin", "spectator", or "player"
  "view": "scoring",             // Current screen view
}
```

### Metadata
```json
{
  "lastUpdated": 1707500000000,  // Timestamp of last update (milliseconds)
  "syncStatus": "synced",        // "syncing" or "synced" (not saved to DB)
}
```

---

## Complete Example Document

Here's what a real document in Firestore looks like after a few overs:

```json
{
  "matchId": "PS1K2M",
  "team1": "India",
  "team2": "Pakistan",
  "battingTeam": 1,
  "totalOvers": 20,
  "runs": 47,
  "wickets": 2,
  "ballsInCurrentOver": 3,
  "completedOvers": 5,
  "permission": "editable",
  "role": "admin",
  "view": "scoring",
  "innings": 1,
  "target": null,
  "firstInningsData": null,
  "isGameOver": false,
  "isTimerRunning": true,
  "timerSeconds": 1823,
  "seriesScore": {
    "team1": 0,
    "team2": 0
  },
  "toss": {
    "winner": "India",
    "decision": "bat"
  },
  "history": [
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 4, "isWicket": false },
    { "type": "wide", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": true, "wicketType": "Caught" },
    { "type": "legal", "runs": 2, "isWicket": false },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 4, "isWicket": false },
    { "type": "legal", "runs": 3, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": true, "wicketType": "Run Out" },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 2, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 3, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 2, "isWicket": false }
  ],
  "overHistory": [
    { "type": "legal", "runs": 0, "isWicket": false },
    { "type": "legal", "runs": 1, "isWicket": false },
    { "type": "legal", "runs": 0, "isWicket": false }
  ],
  "lastUpdated": 1707501823000
}
```

---

## How Frequently is Data Saved?

### Code (App.tsx):
```typescript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
  
  if (match.role === 'admin' && match.view === 'scoring' && match.matchId) {
    const now = Date.now();
    // Only push to Firestore every 500ms to avoid quota limits
    if (now - lastCloudSyncRef.current > 500) {
      pushToFirestore(match);
      lastCloudSyncRef.current = now;
    }
  }
}, [match]); // Re-run whenever ANY match state changes
```

### Summary:
- **Local Storage**: Saved on EVERY change (instant)
- **Firestore**: Saved every 500ms (throttled to avoid quota overages)
- **Viewers**: See updates in real-time via `onSnapshot()` listener

---

## Data Persistence

### Three Levels of Backup:

1. **Firestore (Cloud)** ☁️
   - Permanent storage
   - Accessible from anywhere
   - Real-time sync across devices

2. **Local Storage (Browser)** 💾
   - Instant backup
   - Survives page refresh
   - Available offline

3. **Browser History** 🔄
   - Undo/redo stack maintained
   - Up to 20 previous states

---

## When Scores are Lost

Scores are lost if:
- ❌ Firestore Rules block writes (most common issue)
- ❌ Browser local storage is cleared
- ❌ No internet connection AND browser cache cleared

Scores are preserved if:
- ✅ Firestore Rules allow write access
- ✅ Browser local storage is intact
- ✅ Refresh the page (local storage restores it)

---

## Verification Checklist

To verify all data is being saved:

1. **Create a match as admin**
2. **Add some runs and wickets**
3. **Open Firebase Console**
4. **Go to Firestore Database**
5. **Look in `matches` collection**
6. **Find your match document (e.g., PS1K2M)**
7. **Verify all fields are there:**
   - ✅ `runs` value matches what you entered
   - ✅ `wickets` value is correct
   - ✅ `history` array has all the balls
   - ✅ `lastUpdated` is recent timestamp
   - ✅ `completedOvers` and `ballsInCurrentOver` match

If any of these are missing, check:
- Firestore Rules allow write access
- Admin is actively updating the match
- No errors in browser console
