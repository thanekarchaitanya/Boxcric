# BoxCricLive Database Structure

## Overview

The app uses **Firestore** (Firebase's NoSQL database) to store and sync match data in real-time across multiple users.

---

## Database Structure

### Collection: `matches`

```
firestore
└── matches (collection)
    ├── PS1K2M (document) - First match
    ├── PS5D9P (document) - Second match
    └── PS7Q3X (document) - Third match
```

Each document ID is a **unique match ID** generated when an admin creates a new match.

---

## Match ID Format

**Format:** `PS` + 4 random characters

**Example:** `PS1K2M`, `PS5D9P`, `PS7Q3X`

**Generation Code:**
```typescript
const generateMatchId = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = 'PS';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
```

---

## Document Structure

### Example Match Document: `matches/PS1K2M`

```json
{
  "matchId": "PS1K2M",
  "team1": "Team Alpha",
  "team2": "Team Bravo",
  "battingTeam": 1,
  "totalOvers": 20,
  "runs": 45,
  "wickets": 3,
  "ballsInCurrentOver": 2,
  "completedOvers": 5,
  "permission": "editable",
  "role": "admin",
  "view": "scoring",
  "innings": 1,
  "target": null,
  "firstInningsData": null,
  "isGameOver": false,
  "isTimerRunning": true,
  "timerSeconds": 1245,
  "seriesScore": {
    "team1": 0,
    "team2": 0
  },
  "toss": {
    "winner": "Team Alpha",
    "decision": "bat"
  },
  "history": [
    {
      "type": "legal",
      "runs": 1,
      "isWicket": false
    },
    {
      "type": "legal",
      "runs": 4,
      "isWicket": false
    },
    // ... more balls
  ],
  "overHistory": [
    {
      "type": "legal",
      "runs": 2,
      "isWicket": false
    }
    // ... balls in current over
  ],
  "lastUpdated": 1707500000000,
  "syncStatus": "synced"
}
```

---

## How a New Match is Created

### Step-by-Step Flow:

#### 1. **Admin Creates a Match** (SetupScreen)
```
User fills in:
  - Team 1 Name: "India"
  - Team 2 Name: "Pakistan"
  - Total Overs: 20
  - Permission: "editable"
  
Clicks "Create Match"
```

#### 2. **Match ID is Generated** (App.tsx - `generateMatchId()`)
```typescript
const newId = generateMatchId(); // Returns something like "PS1K2M"
```

#### 3. **Initial Match State is Created** (App.tsx - `initSetup()`)
```typescript
const newState: MatchState = {
  ...initialState,
  matchId: "PS1K2M",        // ← Generated match ID
  team1: "India",
  team2: "Pakistan",
  totalOvers: 20,
  permission: "editable",
  view: "toss",             // or "scoring" if skipToss=true
  role: "admin",
  isTimerRunning: false,
  lastUpdated: Date.now()
};

setMatch(newState);
```

#### 4. **Document is Created in Firestore** (App.tsx - `pushToFirestore()`)
```typescript
const pushToFirestore = async (state: MatchState) => {
  if (state.role !== 'admin' || !state.matchId) return;
  
  try {
    // Create reference to: matches/PS1K2M
    const matchDocRef = doc(db, "matches", state.matchId);
    
    // Write the entire state to Firestore
    await setDoc(matchDocRef, payload, { merge: true });
  } catch (e) {
    console.error("Firestore Push Error:", e);
  }
};
```

#### 5. **Document Appears in Firestore Console**
```
Firebase Console
└── boxcriclive (project)
    └── Firestore Database
        └── matches (collection)
            └── PS1K2M (new document!)
                ├── matchId: "PS1K2M"
                ├── team1: "India"
                ├── team2: "Pakistan"
                ├── runs: 0
                ├── wickets: 0
                └── ... all other fields
```

---

## How Updates are Synced

### When Admin Updates the Match:

1. **Admin adds a run** → Match state updates locally
2. **Every 500ms** → `pushToFirestore()` is called
3. **Firestore document is updated** → `setDoc()` with `merge: true`
4. **Viewers/Players receive real-time updates** → Via `onSnapshot()` listener

### Code Flow:
```typescript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
  
  if (match.role === 'admin' && match.view === 'scoring' && match.matchId) {
    const now = Date.now();
    if (now - lastCloudSyncRef.current > 500) {
      pushToFirestore(match);
      lastCloudSyncRef.current = now;
    }
  }
}, [match]); // Re-run whenever match state changes
```

---

## How Viewers/Players See Updates

### When a Spectator Joins:

1. **Spectator enters match ID** → "PS1K2M"
2. **Selects "Viewer"**
3. **App creates Firestore listener** (App.tsx - `setupRealtimeListener()`)
```typescript
const unsubscribe = onSnapshot(
  doc(db, "matches", "PS1K2M"),
  (docSnapshot) => {
    if (docSnapshot.exists()) {
      const firebaseMatch = docSnapshot.data();
      setMatch(firebaseMatch);
    }
  }
);
```

4. **Real-time updates flow in** → Whenever admin updates, viewers see it instantly

---

## Summary

| Event | Action | Result |
|-------|--------|--------|
| Admin creates match | `initSetup()` generates ID | Document created: `matches/PS1K2M` |
| Admin adds run | State updates | `pushToFirestore()` writes to Firestore |
| Update sent to DB | Firestore listener | All viewers notified via `onSnapshot()` |
| Viewer/Player joins | Match ID validated | Real-time listener attached |
| Admin updates again | State changes | Firestore updates every 500ms |
| Viewers update instantly | `onSnapshot()` fires | UI updates in real-time |

---

## Troubleshooting

### Collection `matches` doesn't appear
- ✅ Check that Firestore Rules allow `write` access
- ✅ Check that you're creating matches (clicking "Create Match" button)
- ✅ Check browser console for errors

### Documents show but don't update
- ✅ Check Rules allow `read` and `write`
- ✅ Verify admin is actually adding runs
- ✅ Check Firestore Rules: `allow read, write: if true;`

### Can't join as viewer
- ✅ Make sure match ID is correct (e.g., "PS1K2M")
- ✅ Check Rules allow `read` access
- ✅ Verify the match was created by admin first
