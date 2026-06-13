// ============================================
// FIREBASE SETUP
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyApfMg-55DRSjQcWtq4Ml2B1yGh3MvZ_TM",
  authDomain: "worldcup2026-a5bd7.firebaseapp.com",
  projectId: "worldcup2026-a5bd7",
  storageBucket: "worldcup2026-a5bd7.firebasestorage.app",
  messagingSenderId: "358912564554",
  appId: "1:358912564554:web:5ae46c7c186a4918f2b5b3"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// ============================================
// GROUPS & TEAMS
// ============================================
const groups = {
  'A': ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  'B': ['Canada', 'Bosnia & Herzegovina', 'Qatar', 'Switzerland'],
  'C': ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  'D': ['USA', 'Paraguay', 'Australia', 'Türkiye'],
  'E': ['Germany', 'Curaçao', 'Ivory Coast', 'Ecuador'],
  'F': ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  'G': ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  'H': ['Spain', 'Cape Verde', 'Saudi Arabia', 'Uruguay'],
  'I': ['France', 'Senegal', 'Iraq', 'Norway'],
  'J': ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  'K': ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  'L': ['England', 'Croatia', 'Ghana', 'Panama'],
};

const allTeams = Object.values(groups).flat();

const teamFlags = {
  'Mexico':'🇲🇽','South Africa':'🇿🇦','South Korea':'🇰🇷','Czechia':'🇨🇿',
  'Canada':'🇨🇦','Bosnia & Herzegovina':'🇧🇦','Qatar':'🇶🇦','Switzerland':'🇨🇭',
  'Brazil':'🇧🇷','Morocco':'🇲🇦','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'USA':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Türkiye':'🇹🇷',
  'Germany':'🇩🇪','Curaçao':'🇨🇼','Ivory Coast':'🇨🇮','Ecuador':'🇪🇨',
  'Netherlands':'🇳🇱','Japan':'🇯🇵','Sweden':'🇸🇪','Tunisia':'🇹🇳',
  'Belgium':'🇧🇪','Egypt':'🇪🇬','Iran':'🇮🇷','New Zealand':'🇳🇿',
  'Spain':'🇪🇸','Cape Verde':'🇨🇻','Saudi Arabia':'🇸🇦','Uruguay':'🇺🇾',
  'France':'🇫🇷','Senegal':'🇸🇳','Iraq':'🇮🇶','Norway':'🇳🇴',
  'Argentina':'🇦🇷','Algeria':'🇩🇿','Austria':'🇦🇹','Jordan':'🇯🇴',
  'Portugal':'🇵🇹','DR Congo':'🇨🇩','Uzbekistan':'🇺🇿','Colombia':'🇨🇴',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croatia':'🇭🇷','Ghana':'🇬🇭','Panama':'🇵🇦',
};

// ============================================
// MATCH SCHEDULE (UTC times, SAST = UTC+2)
// ============================================
const matches = [
  { id:'A1', group:'A', home:'Mexico',               away:'South Africa',        utc:'2026-06-11T19:00Z', venue:'Estadio Azteca, Mexico City' },
  { id:'A2', group:'A', home:'South Korea',           away:'Czechia',             utc:'2026-06-12T02:00Z', venue:'Estadio Akron, Guadalajara' },
  { id:'B1', group:'B', home:'Canada',                away:'Bosnia & Herzegovina',utc:'2026-06-12T19:00Z', venue:'BMO Field, Toronto' },
  { id:'D1', group:'D', home:'USA',                   away:'Paraguay',            utc:'2026-06-13T01:00Z', venue:'SoFi Stadium, Inglewood' },
  { id:'B2', group:'B', home:'Qatar',                 away:'Switzerland',         utc:'2026-06-13T19:00Z', venue:"Levi's Stadium, Santa Clara" },
  { id:'C1', group:'C', home:'Brazil',                away:'Morocco',             utc:'2026-06-13T22:00Z', venue:'MetLife Stadium, East Rutherford' },
  { id:'C2', group:'C', home:'Haiti',                 away:'Scotland',            utc:'2026-06-14T01:00Z', venue:'Gillette Stadium, Foxborough' },
  { id:'D2', group:'D', home:'Australia',             away:'Türkiye',             utc:'2026-06-14T04:00Z', venue:'BC Place, Vancouver' },
  { id:'E1', group:'E', home:'Germany',               away:'Curaçao',             utc:'2026-06-14T17:00Z', venue:'NRG Stadium, Houston' },
  { id:'F1', group:'F', home:'Netherlands',           away:'Japan',               utc:'2026-06-14T20:00Z', venue:"AT&T Stadium, Arlington" },
  { id:'E2', group:'E', home:'Ivory Coast',           away:'Ecuador',             utc:'2026-06-14T23:00Z', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'F2', group:'F', home:'Sweden',                away:'Tunisia',             utc:'2026-06-15T02:00Z', venue:'Estadio BBVA, Monterrey' },
  { id:'H1', group:'H', home:'Spain',                 away:'Cape Verde',          utc:'2026-06-15T16:00Z', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'G1', group:'G', home:'Belgium',               away:'Egypt',               utc:'2026-06-15T19:00Z', venue:'Lumen Field, Seattle' },
  { id:'H2', group:'H', home:'Saudi Arabia',          away:'Uruguay',             utc:'2026-06-15T22:00Z', venue:'Hard Rock Stadium, Miami Gardens' },
  { id:'G2', group:'G', home:'Iran',                  away:'New Zealand',         utc:'2026-06-16T01:00Z', venue:'SoFi Stadium, Inglewood' },
  { id:'I1', group:'I', home:'France',                away:'Senegal',             utc:'2026-06-16T19:00Z', venue:'MetLife Stadium, East Rutherford' },
  { id:'I2', group:'I', home:'Iraq',                  away:'Norway',              utc:'2026-06-16T22:00Z', venue:'Gillette Stadium, Foxborough' },
  { id:'J1', group:'J', home:'Argentina',             away:'Algeria',             utc:'2026-06-17T01:00Z', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J2', group:'J', home:'Austria',               away:'Jordan',              utc:'2026-06-17T04:00Z', venue:"Levi's Stadium, Santa Clara" },
  { id:'K1', group:'K', home:'Portugal',              away:'DR Congo',            utc:'2026-06-17T17:00Z', venue:'NRG Stadium, Houston' },
  { id:'L1', group:'L', home:'England',               away:'Croatia',             utc:'2026-06-17T20:00Z', venue:"AT&T Stadium, Arlington" },
  { id:'L2', group:'L', home:'Ghana',                 away:'Panama',              utc:'2026-06-17T23:00Z', venue:'BMO Field, Toronto' },
  { id:'K2', group:'K', home:'Uzbekistan',            away:'Colombia',            utc:'2026-06-18T02:00Z', venue:'Estadio Azteca, Mexico City' },
  { id:'A3', group:'A', home:'Czechia',               away:'South Africa',        utc:'2026-06-18T16:00Z', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'B3', group:'B', home:'Switzerland',           away:'Bosnia & Herzegovina',utc:'2026-06-18T19:00Z', venue:'SoFi Stadium, Inglewood' },
  { id:'B4', group:'B', home:'Canada',                away:'Qatar',               utc:'2026-06-18T22:00Z', venue:'BC Place, Vancouver' },
  { id:'A4', group:'A', home:'Mexico',                away:'South Korea',         utc:'2026-06-19T01:00Z', venue:'Estadio Akron, Guadalajara' },
  { id:'D3', group:'D', home:'USA',                   away:'Australia',           utc:'2026-06-19T19:00Z', venue:'Lumen Field, Seattle' },
  { id:'C3', group:'C', home:'Scotland',              away:'Morocco',             utc:'2026-06-19T22:00Z', venue:'Gillette Stadium, Foxborough' },
  { id:'C4', group:'C', home:'Brazil',                away:'Haiti',               utc:'2026-06-20T00:30Z', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'D4', group:'D', home:'Türkiye',               away:'Paraguay',            utc:'2026-06-20T03:00Z', venue:"Levi's Stadium, Santa Clara" },
  { id:'F3', group:'F', home:'Netherlands',           away:'Sweden',              utc:'2026-06-20T17:00Z', venue:'NRG Stadium, Houston' },
  { id:'E3', group:'E', home:'Germany',               away:'Ivory Coast',         utc:'2026-06-20T20:00Z', venue:'BMO Field, Toronto' },
  { id:'E4', group:'E', home:'Ecuador',               away:'Curaçao',             utc:'2026-06-21T00:00Z', venue:'Arrowhead Stadium, Kansas City' },
  { id:'F4', group:'F', home:'Tunisia',               away:'Japan',               utc:'2026-06-21T04:00Z', venue:'Estadio BBVA, Monterrey' },
  { id:'H3', group:'H', home:'Spain',                 away:'Saudi Arabia',        utc:'2026-06-21T16:00Z', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'G3', group:'G', home:'Belgium',               away:'Iran',                utc:'2026-06-21T19:00Z', venue:'SoFi Stadium, Inglewood' },
  { id:'H4', group:'H', home:'Uruguay',               away:'Cape Verde',          utc:'2026-06-21T22:00Z', venue:'Hard Rock Stadium, Miami Gardens' },
  { id:'G4', group:'G', home:'New Zealand',           away:'Egypt',               utc:'2026-06-22T01:00Z', venue:'BC Place, Vancouver' },
  { id:'J3', group:'J', home:'Argentina',             away:'Austria',             utc:'2026-06-22T17:00Z', venue:"AT&T Stadium, Arlington" },
  { id:'I3', group:'I', home:'France',                away:'Iraq',                utc:'2026-06-22T21:00Z', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'I4', group:'I', home:'Norway',                away:'Senegal',             utc:'2026-06-23T00:00Z', venue:'MetLife Stadium, East Rutherford' },
  { id:'J4', group:'J', home:'Jordan',                away:'Algeria',             utc:'2026-06-23T03:00Z', venue:"Levi's Stadium, Santa Globe" },
  { id:'K3', group:'K', home:'Portugal',              away:'Uzbekistan',          utc:'2026-06-23T17:00Z', venue:'NRG Stadium, Houston' },
  { id:'L3', group:'L', home:'England',               away:'Ghana',               utc:'2026-06-23T20:00Z', venue:'Gillette Stadium, Foxborough' },
  { id:'L4', group:'L', home:'Panama',                away:'Croatia',             utc:'2026-06-23T23:00Z', venue:'BMO Field, Toronto' },
  { id:'K4', group:'K', home:'Colombia',              away:'DR Congo',            utc:'2026-06-24T02:00Z', venue:'Estadio Akron, Guadalajara' },
  { id:'B5', group:'B', home:'Switzerland',           away:'Canada',              utc:'2026-06-24T19:00Z', venue:'BC Place, Vancouver' },
  { id:'B6', group:'B', home:'Bosnia & Herzegovina',  away:'Qatar',               utc:'2026-06-24T19:00Z', venue:'Lumen Field, Seattle' },
  { id:'C5', group:'C', home:'Scotland',              away:'Brazil',              utc:'2026-06-24T22:00Z', venue:'Hard Rock Stadium, Miami Gardens' },
  { id:'C6', group:'C', home:'Morocco',               away:'Haiti',               utc:'2026-06-24T22:00Z', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'A5', group:'A', home:'Czechia',               away:'Mexico',              utc:'2026-06-25T01:00Z', venue:'Estadio Azteca, Mexico City' },
  { id:'A6', group:'A', home:'South Africa',          away:'South Korea',         utc:'2026-06-25T01:00Z', venue:'Estadio BBVA, Monterrey' },
  { id:'E5', group:'E', home:'Curaçao',               away:'Ivory Coast',         utc:'2026-06-25T20:00Z', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'E6', group:'E', home:'Ecuador',               away:'Germany',             utc:'2026-06-25T20:00Z', venue:'MetLife Stadium, East Rutherford' },
  { id:'F5', group:'F', home:'Japan',                 away:'Sweden',              utc:'2026-06-25T23:00Z', venue:"AT&T Stadium, Arlington" },
  { id:'F6', group:'F', home:'Tunisia',               away:'Netherlands',         utc:'2026-06-25T23:00Z', venue:'Arrowhead Stadium, Kansas City' },
  { id:'D5', group:'D', home:'Türkiye',               away:'USA',                 utc:'2026-06-26T02:00Z', venue:'SoFi Stadium, Inglewood' },
  { id:'D6', group:'D', home:'Paraguay',              away:'Australia',           utc:'2026-06-26T02:00Z', venue:"Levi's Stadium, Santa Clara" },
  { id:'I5', group:'I', home:'Norway',                away:'France',              utc:'2026-06-26T19:00Z', venue:'Gillette Stadium, Foxborough' },
  { id:'I6', group:'I', home:'Senegal',               away:'Iraq',                utc:'2026-06-26T19:00Z', venue:'BMO Field, Toronto' },
  { id:'H5', group:'H', home:'Cape Verde',            away:'Saudi Arabia',        utc:'2026-06-27T00:00Z', venue:'NRG Stadium, Houston' },
  { id:'H6', group:'H', home:'Uruguay',               away:'Spain',               utc:'2026-06-27T00:00Z', venue:'Estadio Akron, Guadalajara' },
  { id:'G5', group:'G', home:'Egypt',                 away:'Iran',                utc:'2026-06-27T03:00Z', venue:'Lumen Field, Seattle' },
  { id:'G6', group:'G', home:'New Zealand',           away:'Belgium',             utc:'2026-06-27T03:00Z', venue:'BC Place, Vancouver' },
  { id:'L5', group:'L', home:'Panama',                away:'England',             utc:'2026-06-27T21:00Z', venue:'MetLife Stadium, East Rutherford' },
  { id:'L6', group:'L', home:'Croatia',               away:'Ghana',               utc:'2026-06-27T21:00Z', venue:'Lincoln Financial Field, Philadelphia' },
  { id:'K5', group:'K', home:'Colombia',              away:'Portugal',            utc:'2026-06-27T23:30Z', venue:'Hard Rock Stadium, Miami Gardens' },
  { id:'K6', group:'K', home:'DR Congo',              away:'Uzbekistan',          utc:'2026-06-27T23:30Z', venue:'Mercedes-Benz Stadium, Atlanta' },
  { id:'J5', group:'J', home:'Algeria',               away:'Austria',             utc:'2026-06-28T02:00Z', venue:'Arrowhead Stadium, Kansas City' },
  { id:'J6', group:'J', home:'Jordan',                away:'Argentina',           utc:'2026-06-28T02:00Z', venue:"AT&T Stadium, Arlington" },
];

// ============================================
// AI GROUP PREDICTIONS
// ============================================
const claudeGroupPredictions = {
  'A': ['Mexico', 'South Korea', 'South Africa', 'Czechia'],
  'B': ['Canada', 'Switzerland', 'Bosnia & Herzegovina', 'Qatar'],
  'C': ['Brazil', 'Morocco', 'Scotland', 'Haiti'],
  'D': ['USA', 'Turkey', 'Australia', 'Paraguay'],
  'E': ['Germany', 'Ecuador', 'Ivory Coast', 'Curaçao'],
  'F': ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  'G': ['Belgium', 'Eygpt', 'Iran', 'New Zealand'],
  'H': ['Uruguay', 'Spain', 'Saudi Arabia', 'Cape Verde'],
  'I': ['France', 'Senegal', 'Norway', 'Iraq'],
  'J': ['Argentina', 'Austria', 'Algeria', 'Jordan'],
  'K': ['Portugal', 'Colombia', 'DR Congo', 'Uzbekistan'],
  'L': ['England', 'Croatia', 'Ghana', 'Panama'],
};

const chatgptGroupPredictions = {
  'A': ['Mexico', 'South Korea', 'South Africa', 'Czechia'],
  'B': ['Switzerland', 'Canada', 'Bosnia & Herzegovina', 'Qatar'],
  'C': ['Brazil', 'Morocco', 'Scotland', 'Haiti'],
  'D': ['USA', 'Türkiye', 'Paraguay', 'Australia'],
  'E': ['Germany', 'Ivory Coast', 'Ecuador', 'Curaçao'],
  'F': ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  'G': ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  'H': ['Spain', 'Uruguay', 'Saudi Arabia', 'Cape Verde'],
  'I': ['France', 'Norway', 'Senegal', 'Iraq'],
  'J': ['Argentina', 'Austria', 'Algeria', 'Jordan'],
  'K': ['Portugal', 'Colombia', 'Uzbekistan', 'DR Congo'],
  'L': ['England', 'Croatia', 'Ghana', 'Panama'],
};

// ============================================
// PLAYERS CONFIG
// ============================================
const PLAYERS = [
  { name: 'Micole',   icon: '🐻', type: 'Human', isAI: false },
  { name: 'Mom',      icon: '🦒', type: 'Human', isAI: false },
  { name: 'Zac',      icon: '🦥', type: 'Human', isAI: false },
  { name: 'Sean',     icon: '🦅', type: 'Human', isAI: false },
  { name: 'Patricia', icon: '🦩', type: 'Human', isAI: false },
  { name: 'Claude',   icon: '🤖', type: 'AI',    isAI: true  },
  { name: 'ChatGPT',  icon: '🦾', type: 'AI',    isAI: true  },
];

// ============================================
// BETTING CONSTANTS
// ============================================
const BETTING_STARTING_POINTS = 50;  // every player starts with 50 betting points
const EXACT_BET_MAX           = 10;  // max bet for exact score bet
const EXACT_BET_WIN_MULTIPLIER  = 10;   // win 3× the bet amount
const EXACT_BET_LOSE_MULTIPLIER = 1;  // lose 3× the bet amount
const WINNER_BET_STAKE        = 0;   // fixed stake for winner bet
const WINNER_BET_WIN          = 5;   // gain if winner bet correct
const WINNER_BET_LOSE         = 0;   // lose if winner bet wrong

// ============================================
// APP STATE
// ============================================
let currentUser = null;
let state = {
  predictions: {},
  lockedPredictions: {},
  scorePredictions: {},
  lockedScorePreds: {},
  tournamentWinners: {},
  actualScores: {},
  claudeScorePreds: {},
  chatgptScorePreds: {},
  finalStandings: {},
  // NEW: betting state
  // bets[username][matchId] = { betType: 'exact'|'winner', betAmount, dateKey, resolved, pointsDelta }
  bets: {},
  // bettingPoints[username] = current betting pool total (starts at 50)
  bettingPoints: {},
  rescuedPlayers: {},  // tracks who has already received their one-time rescue
};

let activeScoresFilter   = 'all';
let activeClaudeFilter   = 'all';
let activeChatgptFilter  = 'all';
let activeDateFilter     = 'all';
let activeResultsDate    = 'all';
let unsubscribe = null;

// ============================================
// FIREBASE HELPERS
// ============================================
async function saveToFirebase(docName, data) {
  try {
    await setDoc(doc(db, 'worldcup2026', docName), data, { merge: true });
  } catch (e) {
    showToast('Save failed — check connection', 'error');
  }
}

async function loadFromFirebase(docName) {
  try {
    const snap = await getDoc(doc(db, 'worldcup2026', docName));
    return snap.exists() ? snap.data() : {};
  } catch (e) { return {}; }
}

function startLiveListener() {
  if (unsubscribe) unsubscribe();
  unsubscribe = onSnapshot(doc(db, 'worldcup2026', 'shared'), (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      state.actualScores      = data.actualScores      || {};
      state.claudeScorePreds  = data.claudeScorePreds  || {};
      state.chatgptScorePreds = data.chatgptScorePreds || {};
      state.finalStandings    = data.finalStandings    || {};
      // NEW: sync betting data from shared doc
      state.bets              = data.bets              || {};
      state.bettingPoints     = data.bettingPoints     || {};
      renderLeaderboard();
      updateHeaderPoints();
      if (!document.getElementById('scores').classList.contains('hidden')) renderActualScores();
      if (!document.getElementById('claude-picks').classList.contains('hidden')) renderClaudeScores();
      if (!document.getElementById('chatgpt-picks').classList.contains('hidden')) renderChatgptScores();
      if (!document.getElementById('match-predictions').classList.contains('hidden')) renderMatchPredictions();
      if (!document.getElementById('compare').classList.contains('hidden')) renderCompare();
      if (!document.getElementById('score-compare').classList.contains('hidden')) renderScoreCompare();
    }
  });
}

// ============================================
// TIME HELPERS (SAST = UTC+2)
// ============================================
function toSAST(utcString) {
  const d = new Date(utcString);
  d.setHours(d.getHours() + 2);
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const day    = days[d.getUTCDay()];
  const date   = d.getUTCDate();
  const month  = months[d.getUTCMonth()];
  const hh     = String(d.getUTCHours()).padStart(2,'0');
  const mm     = String(d.getUTCMinutes()).padStart(2,'0');
  return {
    display: `${day} ${date} ${month} · ${hh}:${mm} SAST`,
    dateKey: `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`,
    time: `${hh}:${mm}`
  };
}

function getUniqueDates() {
  const seen = new Set();
  const dates = [];
  matches.forEach(m => {
    const { dateKey } = toSAST(m.utc);
    if (!seen.has(dateKey)) {
      seen.add(dateKey);
      const d = new Date(m.utc);
      d.setHours(d.getHours()+2);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];
      dates.push({ key: dateKey, label: `${d.getUTCDate()} ${months[d.getUTCMonth()]}` });
    }
  });
  return dates;
}

// ============================================
// DATE FILTER BUILDER (reusable)
// ============================================
function buildDateFilter(containerId, activeKey, onChange) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-btn' + (activeKey === 'all' ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.onclick = () => {
    container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    allBtn.classList.add('active');
    onChange('all');
  };
  container.appendChild(allBtn);

  getUniqueDates().forEach(({ key, label }) => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (activeKey === key ? ' active' : '');
    btn.textContent = label;
    btn.onclick = () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onChange(key);
    };
    container.appendChild(btn);
  });
}

// ============================================
// BETTING HELPERS
// ============================================

// Get a player's current betting points (default 50 if never set)
function getBettingPoints(username) {
  return state.bettingPoints[username] ?? BETTING_STARTING_POINTS;
}

// Get the matchId this user has already bet on for a given dateKey (or null)
function getBetForDay(username, dateKey) {
  const userBets = state.bets[username] || {};
  const entry = Object.entries(userBets).find(([, bet]) => bet.dateKey === dateKey);
  return entry ? entry[0] : null; // returns matchId or null
}

// Get the bet placed on a specific match by a user (or null)
function getBetForMatch(username, matchId) {
  return (state.bets[username] || {})[matchId] || null;
}

// Resolve bets for a given match when the actual score is entered.
// Called by saveActualScore. Updates bettingPoints and marks bets resolved.
async function resolveBetsForMatch(matchId, actualScore) {
  const actual = actualScore;
  let changed = false;

  PLAYERS.forEach(player => {
    const bet = getBetForMatch(player.name, matchId);
    if (!bet || bet.resolved) return; // no bet or already resolved

    const currentPoints = getBettingPoints(player.name);
    let delta = 0;

    if (bet.betType === 'exact') {
      // Find the player's score prediction for this match
      const pred = player.isAI
        ? (player.name === 'Claude' ? state.claudeScorePreds[matchId] : state.chatgptScorePreds[matchId])
        : (state.scorePredictions[player.name] || {})[matchId];

       if (pred && pred.home === actual.home && pred.away === actual.away) {
        delta = bet.betAmount * EXACT_BET_WIN_MULTIPLIER;
      } else {
        delta = -bet.betAmount;
      }
    } else if (bet.betType === 'winner') {
      // Find the player's score prediction
      const pred = player.isAI
        ? (player.name === 'Claude' ? state.claudeScorePreds[matchId] : state.chatgptScorePreds[matchId])
        : (state.scorePredictions[player.name] || {})[matchId];

      if (pred) {
        const predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D';
        const actResult  = actual.home > actual.away ? 'H' : actual.home < actual.away ? 'A' : 'D';
        delta = predResult === actResult ? WINNER_BET_WIN : 0;
      }
    }

    // Points can never go below 0
    // Points can never go below 0 — one-time secret 10pt rescue if they hit 0
    const newPoints = Math.max(0, currentPoints + delta);
    if (newPoints === 0 && !state.rescuedPlayers[player.name]) {
      state.bettingPoints[player.name] = 10;
      state.rescuedPlayers[player.name] = true;
    } else {
      state.bettingPoints[player.name] = newPoints;
    }

    // Mark bet as resolved and store the delta for display
    if (!state.bets[player.name]) state.bets[player.name] = {};
    state.bets[player.name][matchId] = { ...bet, resolved: true, pointsDelta: delta };
    changed = true;
  });

  await saveToFirebase('shared', {
      bets: state.bets,
      bettingPoints: state.bettingPoints,
      rescuedPlayers: state.rescuedPlayers,
    });
    updateHeaderPoints();
}

// Save a bet placed by the current user (or admin on behalf of AI)
async function saveBet(matchId, betType, betAmount, dateKey, forUser = null) {
  const username = forUser || currentUser;

  if (!state.bets[username]) state.bets[username] = {};
  state.bets[username][matchId] = {
    betType,
    betAmount: betType === 'winner' ? WINNER_BET_STAKE : betAmount,
    dateKey,
    resolved: false,
    pointsDelta: null,
  };

  await saveToFirebase('shared', { bets: state.bets });
  showToast(`Bet locked in! 🎲`, 'success');
  renderMatchPredictions();
  renderLeaderboard();
  updateHeaderPoints();
}
window.saveBet = saveBet;

// Remove a bet (only before the match result is in)
async function removeBet(matchId, forUser = null) {
  const username = forUser || currentUser;
  if (state.bets[username]) {
    delete state.bets[username][matchId];
    await saveToFirebase('shared', { bets: state.bets });
    showToast('Bet removed.', '');
    renderMatchPredictions();
  }
}
window.removeBet = removeBet;

// Update the header welcome text to show current betting points
function updateHeaderPoints() {
  const el = document.getElementById('welcome-msg');
  if (!el || !currentUser) return;
  const isAI = currentUser === 'Claude' || currentUser === 'ChatGPT';
  const pts  = getBettingPoints(currentUser);
  el.textContent = `${currentUser} · 🎲 ${pts} pts`;
}

// ============================================
// LOGIN / LOGOUT
// ============================================
async function login(name) {
  showLoading(true);
  const userData = await loadFromFirebase('users');
  const shared   = await loadFromFirebase('shared');

  state.predictions       = userData.predictions       || {};
  state.lockedPredictions = userData.lockedPredictions || {};
  state.scorePredictions  = userData.scorePredictions  || {};
  state.lockedScorePreds  = userData.lockedScorePreds  || {};
  state.tournamentWinners = userData.tournamentWinners || {};
  state.actualScores      = shared.actualScores        || {};
  state.claudeScorePreds  = shared.claudeScorePreds    || {};
  state.chatgptScorePreds = shared.chatgptScorePreds   || {};
  state.finalStandings    = shared.finalStandings      || {};
  // Load saved AI group predictions if they exist
  if (shared.claudeGroupPreds) Object.assign(claudeGroupPredictions, shared.claudeGroupPreds);
  if (shared.chatgptGroupPreds) Object.assign(chatgptGroupPredictions, shared.chatgptGroupPreds);
  // NEW: load betting data
  state.bets              = shared.bets               || {};
  state.bettingPoints     = shared.bettingPoints      || {};
  state.rescuedPlayers    = shared.rescuedPlayers     || {};

  currentUser = name;

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');

  updateHeaderPoints(); // show betting points in header

  const isAdmin = name === 'Micole';
  const isAI    = name === 'Claude' || name === 'ChatGPT';

  document.getElementById('nav-scores').classList.toggle('hidden', !isAdmin);
document.getElementById('nav-claude').classList.toggle('hidden', !isAdmin);
document.getElementById('nav-chatgpt').classList.toggle('hidden', !isAdmin);
  document.getElementById('nav-claude-winner').classList.toggle('hidden', !isAdmin);
document.getElementById('nav-chatgpt-winner').classList.toggle('hidden', !isAdmin);

document.getElementById('reset-btn').classList.toggle('hidden', !isAdmin);

  document.getElementById('nav-winner').classList.toggle('hidden', isAI);
  document.getElementById('nav-rankings').classList.toggle('hidden', false); // visible for everyone
  document.getElementById('nav-predictions').classList.toggle('hidden', false);

  buildDateFilter('date-filter', activeDateFilter, (key) => {
    activeDateFilter = key;
    renderMatchPredictions();
  });
  buildDateFilter('scores-date-filter', activeResultsDate, (key) => {
    activeResultsDate = key;
    renderActualScores();
  });
  buildDateFilter('claude-date-filter', activeClaudeFilter, (key) => {
    activeClaudeFilter = key;
    renderClaudeScores();
  });
  buildDateFilter('chatgpt-date-filter', activeChatgptFilter, (key) => {
    activeChatgptFilter = key;
    renderChatgptScores();
  });

  renderWinnerPicker();
  renderGroups();
  renderAIWinnerPicker('claude-winner-container', 'Claude');
  renderAIWinnerPicker('chatgpt-winner-container', 'ChatGPT');
  
  renderMatchPredictions();
  renderActualScores();
  renderClaudeScores();
  renderChatgptScores();
  renderCompare();
    renderScoreCompare();
  renderLeaderboard();
  renderRules();

  showSection('rules', { target: document.getElementById('nav-rules') });

  startLiveListener();
  showLoading(false);
}

function logout() {
  if (unsubscribe) unsubscribe();
  currentUser = null;
  document.getElementById('app').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}
window.login  = login;
window.logout = logout;

// ============================================
// NAVIGATION
// ============================================
function showSection(id, e) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (e && e.target) e.target.classList.add('active');
}
window.showSection = showSection;

// ============================================
// TOURNAMENT WINNER PICKER
// Click-to-select design with search — no drag-and-drop needed
// ============================================
let winnerPickerSelected = null; // tracks currently highlighted team before locking

function renderWinnerPicker() {
  const container = document.getElementById('winner-container');
  if (!container) return;
  container.innerHTML = '';

  // --- Everyone's picks summary ---
  const summaryDiv = document.createElement('div');
  summaryDiv.className = 'winner-summary';
  const hasAnyPicks = PLAYERS.some(p => state.tournamentWinners[p.name]);
  if (hasAnyPicks) {
    summaryDiv.innerHTML = '<h3 class="winner-summary-title">🏆 Everyone\'s Pick</h3>';
    const grid = document.createElement('div');
    grid.className = 'winner-picks-grid';
    PLAYERS.forEach(p => {
      const pick = state.tournamentWinners[p.name];
      if (!pick) return;
      const card = document.createElement('div');
      card.className = 'winner-pick-card';
      card.innerHTML = `
        <div class="wpc-icon">${p.icon}</div>
        <div class="wpc-name">${p.name}</div>
        <div class="wpc-pick">${teamFlags[pick] || ''} ${pick}</div>
      `;
      grid.appendChild(card);
    });
    summaryDiv.appendChild(grid);
  }
  container.appendChild(summaryDiv);

  const myPick = state.tournamentWinners[currentUser];

  // --- Already locked ---
  if (myPick) {
    const lockedDiv = document.createElement('div');
    lockedDiv.className = 'winner-locked';
    lockedDiv.innerHTML = `
      <div class="winner-locked-icon">🔒</div>
      <div class="winner-locked-text">Your pick is locked in!</div>
      <div class="winner-locked-pick">${teamFlags[myPick] || ''} ${myPick}</div>
    `;
    container.appendChild(lockedDiv);
    return;
  }

  // --- Selection UI ---
  // Selected team preview bar (sticky at top of picker)
  const previewBar = document.createElement('div');
  previewBar.id = 'winner-preview-bar';
  previewBar.className = 'winner-preview-bar';
  previewBar.innerHTML = `<span class="winner-preview-hint">👇 Tap a team to select them</span>`;

  // Lock button (hidden until a team is selected)
  const lockBtn = document.createElement('button');
  lockBtn.id = 'winner-lock-btn';
  lockBtn.className = 'cta-btn winner-lock-btn';
  lockBtn.textContent = 'Lock My Pick 🔒';
  lockBtn.style.display = 'none';
  lockBtn.onclick = lockWinnerPick;

  // Search input
  const searchWrap = document.createElement('div');
  searchWrap.className = 'winner-search-wrap';
  searchWrap.innerHTML = `<input type="text" id="winner-search" class="winner-search" placeholder="🔍 Search a team..."/>`;

  // Teams grid — all 48 teams as clickable chips, grouped by group
  const teamsWrap = document.createElement('div');
  teamsWrap.id = 'winner-teams-wrap';
  teamsWrap.className = 'winner-teams-wrap';

  function buildTeamsGrid(filter = '') {
    teamsWrap.innerHTML = '';
    const q = filter.toLowerCase().trim();
    Object.entries(groups).forEach(([g, teams]) => {
      const filtered = q ? teams.filter(t => t.toLowerCase().includes(q)) : teams;
      if (filtered.length === 0) return;

      if (!q) {
        const groupLabel = document.createElement('div');
        groupLabel.className = 'winner-group-label';
        groupLabel.textContent = `Group ${g}`;
        teamsWrap.appendChild(groupLabel);
      }

      filtered.forEach(team => {
        const chip = document.createElement('button');
        chip.className = 'winner-chip' + (winnerPickerSelected === team ? ' selected' : '');
        chip.innerHTML = `<span class="wc-flag">${teamFlags[team] || ''}</span><span class="wc-name">${team}</span>`;
        chip.onclick = () => {
          winnerPickerSelected = team;
          // Update preview bar
          previewBar.innerHTML = `
            <span class="winner-preview-team">${teamFlags[team] || ''} ${team}</span>
            <span class="winner-preview-label">selected</span>
          `;
          lockBtn.style.display = 'block';
          // Re-highlight chips
          teamsWrap.querySelectorAll('.winner-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
        };
        teamsWrap.appendChild(chip);
      });
    });
  }

  buildTeamsGrid();

  // Wire up search
  searchWrap.querySelector('#winner-search').addEventListener('input', e => {
    buildTeamsGrid(e.target.value);
  });

  container.appendChild(previewBar);
  container.appendChild(lockBtn);
  container.appendChild(searchWrap);
  container.appendChild(teamsWrap);
}
// ============================================
// AI WINNER PICKER (admin)
// ============================================
function renderAIWinnerPicker(containerId, aiName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const icon    = aiName === 'Claude' ? '🤖' : '🦾';
  const myPick  = state.tournamentWinners[aiName];

  // Show current pick if already set
  if (myPick) {
    const lockedDiv = document.createElement('div');
    lockedDiv.className = 'winner-locked';
    lockedDiv.innerHTML = `
      <div class="winner-locked-icon">🔒</div>
      <div class="winner-locked-text">${icon} ${aiName}'s pick is locked in!</div>
      <div class="winner-locked-pick">${teamFlags[myPick] || ''} ${myPick}</div>
    `;
    // Admin can clear and re-pick
    const clearBtn = document.createElement('button');
    clearBtn.className = 'cta-btn';
    clearBtn.style.cssText = 'margin:16px auto;display:block;background:var(--red);box-shadow:none;';
    clearBtn.textContent = 'Change Pick';
    clearBtn.onclick = async () => {
      if (!confirm(`Clear ${aiName}'s winner pick?`)) return;
      delete state.tournamentWinners[aiName];
      await saveToFirebase('users', { tournamentWinners: state.tournamentWinners });
      renderAIWinnerPicker(containerId, aiName);
      renderWinnerPicker();
    };
    container.appendChild(lockedDiv);
    container.appendChild(clearBtn);
    return;
  }

  // Search input
  const searchWrap = document.createElement('div');
  searchWrap.className = 'winner-search-wrap';
  searchWrap.innerHTML = `<input type="text" id="${aiName}-winner-search" class="winner-search" placeholder="🔍 Search a team..."/>`;

  // Preview bar
  const previewBar = document.createElement('div');
  previewBar.className = 'winner-preview-bar';
  previewBar.innerHTML = `<span class="winner-preview-hint">👇 Tap a team to select</span>`;

  // Lock button
  const lockBtn = document.createElement('button');
  lockBtn.className = 'cta-btn winner-lock-btn';
  lockBtn.textContent = `Lock ${icon} ${aiName}'s Pick 🔒`;
  lockBtn.style.display = 'none';
  lockBtn.style.cssText += 'margin:12px auto;display:none;';

  let selected = null;

  // Teams grid
  const teamsWrap = document.createElement('div');
  teamsWrap.className = 'winner-teams-wrap';

  function buildGrid(filter = '') {
    teamsWrap.innerHTML = '';
    const q = filter.toLowerCase().trim();
    Object.entries(groups).forEach(([g, teams]) => {
      const filtered = q ? teams.filter(t => t.toLowerCase().includes(q)) : teams;
      if (filtered.length === 0) return;
      if (!q) {
        const label = document.createElement('div');
        label.className = 'winner-group-label';
        label.textContent = `Group ${g}`;
        teamsWrap.appendChild(label);
      }
      filtered.forEach(team => {
        const chip = document.createElement('button');
        chip.className = 'winner-chip' + (selected === team ? ' selected' : '');
        chip.innerHTML = `<span class="wc-flag">${teamFlags[team] || ''}</span><span class="wc-name">${team}</span>`;
        chip.onclick = () => {
          selected = team;
          previewBar.innerHTML = `
            <span class="winner-preview-team">${teamFlags[team] || ''} ${team}</span>
            <span class="winner-preview-label">selected</span>
          `;
          lockBtn.style.display = 'block';
          teamsWrap.querySelectorAll('.winner-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
        };
        teamsWrap.appendChild(chip);
      });
    });
  }

  buildGrid();

  searchWrap.querySelector(`#${aiName}-winner-search`).addEventListener('input', e => {
    buildGrid(e.target.value);
  });

  lockBtn.onclick = async () => {
    if (!selected) { showToast('Select a team first!', 'error'); return; }
    if (!confirm(`Lock in ${selected} as ${aiName}'s winner? Cannot be changed without admin override!`)) return;
    state.tournamentWinners[aiName] = selected;
    await saveToFirebase('users', { tournamentWinners: state.tournamentWinners });
    showToast(`${aiName}'s winner locked! 🏆`, 'success');
    renderAIWinnerPicker(containerId, aiName);
    renderWinnerPicker();
  };

  container.appendChild(previewBar);
  container.appendChild(lockBtn);
  container.appendChild(searchWrap);
  container.appendChild(teamsWrap);
}

async function lockWinnerPick() {
  const team = winnerPickerSelected;
  if (!team) { showToast('Tap a team first!', 'error'); return; }
  if (!confirm(`Lock in ${team} as your World Cup winner? This cannot be changed! 🔒`)) return;
  state.tournamentWinners[currentUser] = team;
  winnerPickerSelected = null;
  await saveToFirebase('users', { tournamentWinners: state.tournamentWinners });
  showToast(`${team} locked as your winner! 🏆`, 'success');
  renderWinnerPicker();
}
window.lockWinnerPick = lockWinnerPick;

// ============================================
// RENDER GROUP RANKINGS
// Drag-to-rank for humans; view-only for AI profiles
// AI predictions are hardcoded in claudeGroupPredictions / chatgptGroupPredictions
// ============================================
// ============================================
// RENDER AI GROUP RANKINGS (admin editable)
// ============================================
function renderAIGroupRankings(containerId, aiName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const preds = aiName === 'Claude' ? claudeGroupPredictions : chatgptGroupPredictions;
  const icon  = aiName === 'Claude' ? '🤖' : '🦾';

  // In-memory draft for this AI
  const draftKey = `_${aiName.toLowerCase()}RankingDraft`;
  if (!window[draftKey]) {
    window[draftKey] = {};
    Object.entries(groups).forEach(([g, teams]) => {
      window[draftKey][g] = preds[g] ? [...preds[g]] : [...teams];
    });
  }

  const grid = document.createElement('div');
  grid.className = 'groups-grid';

  function buildCard(groupName) {
    const orderedTeams = window[draftKey][groupName];
    const card = document.createElement('div');
    card.className = 'group-card';
    card.dataset.aiGroupCard = `${aiName}-${groupName}`;
    card.innerHTML = `<h3>Group ${groupName}</h3>`;

    orderedTeams.forEach((team, index) => {
      const item = document.createElement('div');
      item.className = 'team-item';
      item.dataset.team = team;
      const rankClass = index === 0 ? 'r1' : index === 1 ? 'r2' : index === 2 ? 'r3' : '';
      const upDisabled   = index === 0 ? 'disabled' : '';
      const downDisabled = index === orderedTeams.length - 1 ? 'disabled' : '';
      item.innerHTML = `
        <div class="rank-badge ${rankClass}">${index+1}</div>
        <span class="team-flag">${teamFlags[team]||'🏳️'}</span>
        <span class="team-name">${team}</span>
        <div class="rank-arrows">
          <button class="rank-arrow-btn" data-dir="up" data-group="${groupName}" data-index="${index}" ${upDisabled}>▲</button>
          <button class="rank-arrow-btn" data-dir="down" data-group="${groupName}" data-index="${index}" ${downDisabled}>▼</button>
        </div>
      `;
      card.appendChild(item);
    });
    return card;
  }

  Object.keys(groups).forEach(g => grid.appendChild(buildCard(g)));
  container.appendChild(grid);

  // Arrow click handler
  container.addEventListener('click', e => {
    const btn = e.target.closest('.rank-arrow-btn');
    if (!btn || btn.disabled) return;
    const g        = btn.dataset.group;
    const idx      = parseInt(btn.dataset.index);
    const dir      = btn.dataset.dir;
    const arr      = window[draftKey][g];
    const swapWith = dir === 'up' ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= arr.length) return;
    [arr[idx], arr[swapWith]] = [arr[swapWith], arr[idx]];
    const oldCard = grid.querySelector(`[data-group-card="${g}"]`);
    const newCard = buildGroupCard(g);
    grid.replaceChild(newCard, oldCard);
  });
  // Save button
  const saveBtn = document.createElement('button');
  saveBtn.className = 'cta-btn';
  saveBtn.style.cssText = 'margin:24px auto;display:block;';
  saveBtn.textContent = `Save ${icon} ${aiName}'s Rankings 🔒`;
  saveBtn.onclick = async () => {
    if (!confirm(`Save ${aiName}'s group rankings? This will update their predictions!`)) return;
    Object.keys(groups).forEach(g => {
      if (window[draftKey]?.[g]) {
        (aiName === 'Claude' ? claudeGroupPredictions : chatgptGroupPredictions)[g] = [...window[draftKey][g]];
      }
    });
    // Persist to Firebase shared doc
    const key = aiName === 'Claude' ? 'claudeGroupPreds' : 'chatgptGroupPreds';
    await saveToFirebase('shared', { [key]: window[draftKey] });
    showToast(`${aiName}'s rankings saved! 🔒`, 'success');
    renderLeaderboard();
  };
  container.appendChild(saveBtn);
}
window.renderAIGroupRankings = renderAIGroupRankings;
function renderGroups() {
  const container = document.getElementById('groups-container');
  if (!container) return;
  container.innerHTML = '';

  const isAI    = currentUser === 'Claude' || currentUser === 'ChatGPT';
  const isAdmin = currentUser === 'Micole';

  // AI profiles: show their hardcoded group predictions read-only
  if (isAI) {
    const preds = currentUser === 'Claude' ? claudeGroupPredictions : chatgptGroupPredictions;
    const banner = document.createElement('div');
    banner.className = 'ai-view-banner';
   banner.innerHTML = `<span>${currentUser === 'Claude' ? '🤖' : '🦾'} ${currentUser}'s group stage predictions - entered by Micole on their behalf</span>`;
    container.appendChild(banner);

    const grid = document.createElement('div');
    grid.className = 'groups-grid';
    Object.entries(preds).forEach(([groupName, teams]) => {
      const card = document.createElement('div');
      card.className = 'group-card';
      card.innerHTML = `<h3>Group ${groupName}</h3>`;
      teams.forEach((team, index) => {
        const item = document.createElement('div');
        item.className = 'team-item locked';
        const rankClass = index === 0 ? 'r1' : index === 1 ? 'r2' : index === 2 ? 'r3' : '';
        item.innerHTML = `<div class="rank-badge ${rankClass}">${index+1}</div><span class="team-flag">${teamFlags[team]||'🏳️'}</span><span class="team-name">${team}</span>`;
        card.appendChild(item);
      });
      grid.appendChild(card);
    });
    container.appendChild(grid);
    return;
  }

  // Human profiles
  const isLocked = state.lockedPredictions[currentUser] === true;

  // Keep an in-memory draft so arrow taps persist across card re-renders
 // Always reset draft for current user
  window._rankingDraft = {};
  window._rankingDraftUser = currentUser;
  Object.entries(groups).forEach(([g, teams]) => {
    window._rankingDraft[g] = state.predictions[currentUser]?.[g]
      ? [...state.predictions[currentUser][g]]
      : [...teams];
  });

  document.getElementById('rankings-subtext').textContent = isLocked
    ? '🔒 Your group rankings are locked in — good luck!'
    : 'Use the arrows to rank teams 1st–4th in each group, then lock in before the tournament starts!';

  const saveBar = document.getElementById('save-rankings-bar');
  if (saveBar) saveBar.style.display = isLocked ? 'none' : 'flex';

  const grid = document.createElement('div');
  grid.className = 'groups-grid';

  function buildGroupCard(groupName) {
    const orderedTeams = window._rankingDraft[groupName];
    const card = document.createElement('div');
    card.className = 'group-card';
    card.dataset.groupCard = groupName;
    card.innerHTML = `<h3>Group ${groupName}</h3>`;

    orderedTeams.forEach((team, index) => {
      const item = document.createElement('div');
      item.className = 'team-item' + (isLocked ? ' locked' : '');
      item.dataset.team = team;
      const rankClass = index === 0 ? 'r1' : index === 1 ? 'r2' : index === 2 ? 'r3' : '';
      if (isLocked) {
        item.innerHTML = `
          <div class="rank-badge ${rankClass}">${index+1}</div>
          <span class="team-flag">${teamFlags[team]||'🏳️'}</span>
          <span class="team-name">${team}</span>
        `;
      } else {
        const upDisabled   = index === 0 ? 'disabled' : '';
        const downDisabled = index === orderedTeams.length - 1 ? 'disabled' : '';
        item.innerHTML = `
          <div class="rank-badge ${rankClass}">${index+1}</div>
          <span class="team-flag">${teamFlags[team]||'🏳️'}</span>
          <span class="team-name">${team}</span>
          <div class="rank-arrows">
            <button class="rank-arrow-btn" data-dir="up" data-group="${groupName}" data-index="${index}" ${upDisabled}>▲</button>
            <button class="rank-arrow-btn" data-dir="down" data-group="${groupName}" data-index="${index}" ${downDisabled}>▼</button>
          </div>
        `;
      }
      card.appendChild(item);
    });

    if (isLocked) {
      const badge = document.createElement('div');
      badge.className = 'locked-badge';
      badge.innerHTML = '🔒 Rankings locked';
      card.appendChild(badge);
    }
    return card;
  }

  Object.keys(groups).forEach(g => grid.appendChild(buildGroupCard(g)));
  container.appendChild(grid);

  if (!isLocked) {
    container.onclick = e => {
      const btn = e.target.closest('.rank-arrow-btn');
      if (!btn || btn.disabled) return;
      const g        = btn.dataset.group;
      const idx      = parseInt(btn.dataset.index);
      const dir      = btn.dataset.dir;
      const arr      = window._rankingDraft[g];
      const swapWith = dir === 'up' ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= arr.length) return;
      [arr[idx], arr[swapWith]] = [arr[swapWith], arr[idx]];
      const oldCard = grid.querySelector(`[data-group-card="${g}"]`);
      const newCard = buildGroupCard(g);
      grid.replaceChild(newCard, oldCard);
    };
  } else {
    container.onclick = null;
  }
}
async function savePredictions() {
  if (!confirm('Lock your group rankings? This cannot be undone! 🔒')) return;
  if (!state.predictions[currentUser]) state.predictions[currentUser] = {};
  Object.keys(groups).forEach(g => {
    if (window._rankingDraft?.[g]) {
      state.predictions[currentUser][g] = [...window._rankingDraft[g]];
    }
  });
  state.lockedPredictions[currentUser] = true;
  window._rankingDraft = null;
  window._rankingDraftUser = null;
  await saveToFirebase('users', { predictions: state.predictions, lockedPredictions: state.lockedPredictions });
  showToast('Group rankings locked! 🔒', 'success');
  renderGroups();
  renderLeaderboard();
}
window.savePredictions = savePredictions;

// Includes betting UI for human players.
// AI profiles: view-only of that AI's picks + admin can enter AI bets.
// ============================================
function renderMatchPredictions() {
  const container = document.getElementById('match-predictions-container');
  if (!container) return;
  container.innerHTML = '';

  const isAI    = currentUser === 'Claude' || currentUser === 'ChatGPT';
  const isAdmin = currentUser === 'Micole';

  const scorePreds = isAI
    ? (currentUser === 'Claude' ? state.claudeScorePreds : state.chatgptScorePreds)
    : (state.scorePredictions[currentUser] || {});

  const filtered = activeDateFilter === 'all'
    ? matches
    : matches.filter(m => toSAST(m.utc).dateKey === activeDateFilter);

  const byDate = {};
  filtered.forEach(m => {
    const { dateKey, display } = toSAST(m.utc);
    if (!byDate[dateKey]) byDate[dateKey] = { display, matches: [] };
    byDate[dateKey].matches.push(m);
  });

  // AI view-only banner
  if (isAI) {
    const banner = document.createElement('div');
    banner.className = 'ai-view-banner';
    const aiIcon = currentUser === 'Claude' ? '🤖' : '🦾';
    const enteredCount = Object.keys(scorePreds).length;
    banner.innerHTML = `
      <span>${aiIcon} ${currentUser}'s predictions - entered by Micole on their behalf</span>
      <span class="ai-count">${enteredCount} / ${matches.length} entered</span>
    `;
    container.appendChild(banner);
  }

  Object.entries(byDate).forEach(([dateKey, { display, matches: dayMatches }]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = display.split('·')[0].trim();
    container.appendChild(dateHeader);

    // Winner bets limited to once per day — exact bets still unlimited
    const userBets = state.bets[currentUser] || {};
    const dailyWinnerBetMatchId = Object.entries(userBets).find(([id, bet]) => 
      bet.betType === 'winner' && bet.dateKey === dateKey
    )?.[0] || null;

    const grid = document.createElement('div');
    grid.className = 'matches-grid';

    dayMatches.forEach(match => {
      const sast   = toSAST(match.utc);
      const saved  = scorePreds[match.id] || {};
      const locked = isAI
        ? (saved.home !== undefined)
        : (state.lockedScorePreds[currentUser]?.[match.id] === true);

      const existingBet     = getBetForMatch(currentUser, match.id);
      const resultIn        = state.actualScores[match.id] !== undefined;
      // Has this user already used their daily winner bet on a different match?
      const dayBetElsewhere = dailyWinnerBetMatchId && dailyWinnerBetMatchId !== match.id;

      const card = document.createElement('div');
      card.className = 'match-card';

      // --- Score prediction HTML (unchanged logic) ---
      let predictionHTML;
      if (isAI) {
        if (saved.home !== undefined) {
          predictionHTML = `<div class="match-locked">${currentUser === 'Claude' ? '🤖' : '🦾'} ${match.home} ${saved.home} – ${saved.away} ${match.away}</div>`;
        } else {
          predictionHTML = `<div class="match-locked" style="opacity:0.4;font-style:italic">Not entered yet</div>`;
        }
      } else if (locked) {
        predictionHTML = `<div class="match-locked">🔒 ${match.home} ${saved.home} – ${saved.away} ${match.away}</div>`;
      } else {
        predictionHTML = `
          <div class="score-inputs">
            <input type="number" min="0" max="20" id="pred-home-${match.id}" value="${saved.home??''}" placeholder="0"/>
            <span class="score-sep">–</span>
            <input type="number" min="0" max="20" id="pred-away-${match.id}" value="${saved.away??''}" placeholder="0"/>
          </div>
          <button class="lock-btn" onclick="saveMatchPrediction('${match.id}')">Lock Score🔒</button>
        `;
      }

      // --- BETTING UI HTML ---
      // Priority order:
      // 1. AI profile view → always show their bet read-only (or nothing if no bet)
      // 2. User already has a bet on THIS match → show it (resolved or pending)
      // 3. User already bet on a DIFFERENT match today → show disabled notice
      // 4. Result is already in AND no bet placed → betting window closed, show notice
      // 5. Free to bet → show the bet form
      let bettingHTML = '';

      if (isAI) {
        // AI profile (Claude/ChatGPT login): read-only view of that AI's bet
        bettingHTML = buildBetDisplayHTML(existingBet, match, resultIn, currentUser);
      } else if (existingBet) {
        // This user already has a bet on this match — show result/pending
        bettingHTML = buildBetDisplayHTML(existingBet, match, resultIn, currentUser);
    } else if (resultIn) {
        // Match is over, no bet was placed — betting window has passed
        bettingHTML = `<div class="bet-disabled">⏰ Betting window closed</div>`;
      } else {
        // All clear — show the bet form
        bettingHTML = buildBetFormHTML(match.id, dateKey, currentUser, dailyWinnerBetMatchId !== null && dailyWinnerBetMatchId !== match.id);
      }
      
      // Admin: also show betting input fields for AI players on AI admin pages
      // (handled in renderAIPicks for Claude/ChatGPT admin tabs)

      card.innerHTML = `
        <div class="match-meta">
          <span class="match-group-tag">Group ${match.group}</span>
          <span class="match-time">🕐 ${sast.time} SAST</span>
        </div>
        <div class="match-teams">
          <div class="match-team">${teamFlags[match.home]||''} ${match.home}</div>
          <div class="match-vs">VS</div>
          <div class="match-team">${match.away} ${teamFlags[match.away]||''}</div>
        </div>
        <div class="match-venue">📍 ${match.venue}</div>
        ${predictionHTML}
        ${bettingHTML}
      `;

      // Wire up radio button interactivity after inserting into DOM
      grid.appendChild(card);
    });

    container.appendChild(grid);
  });

  if (Object.keys(byDate).length === 0) {
    container.innerHTML += '<p style="color:var(--text2);text-align:center;padding:40px">No matches on this date.</p>';
  }

  // Attach bet form event listeners after all cards are rendered
  attachBetFormListeners();
}

// Build the HTML for a bet that has already been placed (read-only display)
function buildBetDisplayHTML(bet, match, resultIn, username) {
  if (!bet) return '';

  const betLabel = bet.betType === 'exact'
    ? `Exact Score Bet · ${bet.betAmount} pts at stake`
    : `Winner Bet · ${WINNER_BET_STAKE} pts at stake`;

  let resultHTML = '';
  if (bet.resolved && bet.pointsDelta !== null) {
    const sign   = bet.pointsDelta >= 0 ? '+' : '';
    const cls    = bet.pointsDelta >= 0 ? 'bet-win' : 'bet-lose';
    const emoji  = bet.pointsDelta >= 0 ? '🟢' : '🔴';
    resultHTML = `<div class="bet-result ${cls}">${emoji} ${sign}${bet.pointsDelta} betting pts</div>`;
  } else if (resultIn) {
    resultHTML = `<div class="bet-result bet-pending">⏳ Resolving…</div>`;
  }

  return `
    <div class="bet-placed">
      <div class="bet-placed-label">🎲 ${betLabel}</div>
      ${resultHTML}
    </div>
  `;
}

function buildBetFormHTML(matchId, dateKey, username) {
  const currentPts = getBettingPoints(username);
  const maxExact   = Math.min(EXACT_BET_MAX, currentPts);
  return `
    <div class="bet-form" data-match-id="${matchId}" data-date-key="${dateKey}" data-username="${username}">
      <div class="bet-form-title">🎲 Place a bet? <span class="bet-balance">${currentPts} pts available</span></div>
      <div class="bet-options">
        <label class="bet-radio-label">
          <input type="radio" name="bet-${matchId}" value="none" checked class="bet-radio"
            onchange="document.getElementById('exact-label-${matchId}').style.display='none';document.getElementById('bet-btn-${matchId}').style.display='none';"/>
          No Bet
        </label>
        <label class="bet-radio-label">
          <input type="radio" name="bet-${matchId}" value="exact" class="bet-radio"
            onchange="document.getElementById('exact-label-${matchId}').style.display='flex';document.getElementById('bet-btn-${matchId}').style.display='block';document.getElementById('bet-btn-${matchId}').dataset.betType='exact';"/>
          Exact Score <span class="bet-note">(win 10× / lose your stake)</span>
        </label>
        <label class="bet-radio-label bet-exact-amount-label" id="exact-label-${matchId}" style="display:none">
          Bet amount:
          <input type="number" min="1" max="${maxExact}" value="1"
  id="bet-amount-${matchId}" class="bet-amount-input" placeholder="1–${maxExact}"
  oninput="document.getElementById('bet-btn-${matchId}').dataset.betAmount=this.value;"/>
          <span class="bet-note">pts (max ${maxExact})</span>
        </label>
        <label class="bet-radio-label">
          <input type="radio" name="bet-${matchId}" value="winner" class="bet-radio"
            onchange="document.getElementById('exact-label-${matchId}').style.display='none';document.getElementById('bet-btn-${matchId}').style.display='block';"/>
          Winner Bet <span class="bet-note">(free · win +${WINNER_BET_WIN} pts / lose nothing)</span>
        </label>
      </div>
      <button class="bet-confirm-btn" id="bet-btn-${matchId}"
        onclick="confirmBet('${matchId}','${dateKey}','${username}')" style="display:none">
        Lock Bet 🎲
      </button>
    </div>
  `;
}

function attachBetFormListeners() {
  document.querySelectorAll('.bet-form').forEach(form => {
    const matchId = form.dataset.matchId;
    const radios  = form.querySelectorAll('.bet-radio');
    radios.forEach(radio => {
      radio.onchange = () => {
        const val        = form.querySelector(`input[name="bet-${matchId}"]:checked`)?.value;
        const exactLabel = form.querySelector(`#exact-label-${matchId}`);
        const confirmBtn = form.querySelector(`#bet-btn-${matchId}`);
        if (exactLabel) exactLabel.style.display = val === 'exact' ? 'flex' : 'none';
        if (confirmBtn) confirmBtn.style.display  = val && val !== 'none' ? 'block' : 'none';
      };
    });
  });
}

// Called when user clicks "Lock Bet" on a match card
window.confirmBet = async function(matchId, dateKey, username) {
  const betTypeEl = document.querySelector(`input[name="bet-${matchId}"]:checked`);
  if (!betTypeEl || betTypeEl.value === 'none') return;

  // Winner bet is limited to once per day
  if (betType === 'winner') {
    const userBets = state.bets[username] || {};
    const alreadyWinnerToday = Object.entries(userBets).some(([id, bet]) => 
      bet.betType === 'winner' && bet.dateKey === dateKey && id !== matchId
    );
    if (alreadyWinnerToday) {
      showToast('You can only place one winner bet per day!', 'error');
      return;
    }
  }

  if (betType === 'exact') {
    const betForm = document.querySelector(`.bet-form[data-match-id="${matchId}"]`);
    const btn = document.getElementById(`bet-btn-${matchId}`);
    betAmount = parseInt(btn?.dataset?.betAmount || document.getElementById(`bet-amount-${matchId}`)?.value);
    const maxExact = Math.min(EXACT_BET_MAX, getBettingPoints(username));
    if (isNaN(betAmount) || betAmount < 1 || betAmount > maxExact) {
      showToast(`Enter a bet between 1 and ${maxExact} pts`, 'error');
      return;
    }
  } else {
    betAmount = WINNER_BET_STAKE;
    // Check they have enough points for winner bet
    if (getBettingPoints(username) < WINNER_BET_STAKE) {
      showToast(`Not enough betting points!`, 'error');
      return;
    }
  }

  

  const match = matches.find(m => m.id === matchId);
  const betLabel = betType === 'exact'
    ? `Exact Score Bet (${betAmount} pts)`
    : `Winner Bet (${WINNER_BET_STAKE} pts)`;

  if (!confirm(`Lock in a ${betLabel} on ${match?.home} vs ${match?.away}? Cannot be changed!`)) return;

  await saveBet(matchId, betType, betAmount, dateKey, username);
};

async function saveMatchPrediction(matchId) {
  const home = parseInt(document.getElementById(`pred-home-${matchId}`)?.value);
  const away = parseInt(document.getElementById(`pred-away-${matchId}`)?.value);
  if (isNaN(home)||isNaN(away)) { showToast('Enter both scores!','error'); return; }
  if (!confirm('Lock this prediction? Cannot be changed! 🔒')) return;

  if (!state.scorePredictions[currentUser]) state.scorePredictions[currentUser] = {};
  if (!state.lockedScorePreds[currentUser]) state.lockedScorePreds[currentUser] = {};
  state.scorePredictions[currentUser][matchId] = { home, away };
  state.lockedScorePreds[currentUser][matchId] = true;

  await saveToFirebase('users', { scorePredictions: state.scorePredictions, lockedScorePreds: state.lockedScorePreds });
  showToast('Prediction locked! 🔒','success');
  renderMatchPredictions();
  renderLeaderboard();
}
window.saveMatchPrediction = saveMatchPrediction;

// ============================================
// RENDER ACTUAL SCORES (admin) — date-sorted
// ============================================
function renderActualScores() {
  const container = document.getElementById('scores-container');
  if (!container) return;
  container.innerHTML = '';

  const filtered = activeResultsDate === 'all'
    ? matches
    : matches.filter(m => toSAST(m.utc).dateKey === activeResultsDate);

  const byDate = {};
  filtered.forEach(m => {
    const { dateKey, display } = toSAST(m.utc);
    if (!byDate[dateKey]) byDate[dateKey] = { display, matches: [] };
    byDate[dateKey].matches.push(m);
  });

  Object.entries(byDate).forEach(([dateKey, { display, matches: dayMatches }]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = display.split('·')[0].trim();
    container.appendChild(dateHeader);

    const grid = document.createElement('div');
    grid.className = 'matches-grid';

    dayMatches.forEach(match => {
      const sast  = toSAST(match.utc);
      const saved = state.actualScores[match.id] || {};
      const card  = document.createElement('div');
      card.className = 'match-card';
      card.innerHTML = `
        <div class="match-meta">
          <span class="match-group-tag">Group ${match.group}</span>
          <span class="match-time">🕐 ${sast.time} SAST</span>
        </div>
        <div class="match-teams">
          <div class="match-team">${teamFlags[match.home]||''} ${match.home}</div>
          <div class="match-vs">VS</div>
          <div class="match-team">${match.away} ${teamFlags[match.away]||''}</div>
        </div>
        <div class="match-venue">📍 ${match.venue}</div>
        <div class="score-inputs">
          <input type="number" min="0" max="20" id="actual-home-${match.id}" value="${saved.home??''}" placeholder="0"/>
          <span class="score-sep">–</span>
          <input type="number" min="0" max="20" id="actual-away-${match.id}" value="${saved.away??''}" placeholder="0"/>
        </div>
        <button class="save-result-btn" onclick="saveActualScore('${match.id}')">Save Result ✅</button>
        ${saved.home!==undefined ? `<div class="match-result-display">✅ ${match.home} ${saved.home} – ${saved.away} ${match.away}</div>` : ''}
      `;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  });
}

// MODIFIED: saveActualScore now also triggers bet resolution
async function saveActualScore(matchId) {
  const home = parseInt(document.getElementById(`actual-home-${matchId}`)?.value);
  const away = parseInt(document.getElementById(`actual-away-${matchId}`)?.value);
  if (isNaN(home)||isNaN(away)) { showToast('Enter both scores!','error'); return; }

  state.actualScores[matchId] = { home, away };
  await saveToFirebase('shared', { actualScores: state.actualScores });

  // NEW: resolve any bets placed on this match
  await resolveBetsForMatch(matchId, { home, away });

  showToast('Result saved! ✅','success');
  renderActualScores();
  renderLeaderboard();
  renderMatchPredictions();
}
window.saveActualScore = saveActualScore;

// ============================================
// RENDER CLAUDE & CHATGPT PICKS (admin) — date-sorted
// Admin can also enter AI bets from these tabs
// ============================================
function renderAIPicks(containerId, predStore, saveKey, getFilter, btnLabel, btnClass, aiName) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  const currentFilter = getFilter();
  const filtered = currentFilter === 'all'
    ? matches
    : matches.filter(m => toSAST(m.utc).dateKey === currentFilter);

  const byDate = {};
  filtered.forEach(m => {
    const { dateKey, display } = toSAST(m.utc);
    if (!byDate[dateKey]) byDate[dateKey] = { display, matches: [] };
    byDate[dateKey].matches.push(m);
  });

  Object.entries(byDate).forEach(([dateKey, { display, matches: dayMatches }]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = display.split('·')[0].trim();
    container.appendChild(dateHeader);

    // NEW: check if this AI already has a bet today
   const dailyBetMatchId = null; // betting now allowed on every match

    const grid = document.createElement('div');
    grid.className = 'matches-grid';

    dayMatches.forEach(match => {
      const sast       = toSAST(match.utc);
      const saved      = predStore[match.id] || {};
      const existingBet = getBetForMatch(aiName, match.id);
      const resultIn   = state.actualScores[match.id] !== undefined;
      const dayBetElsewhere = dailyBetMatchId && dailyBetMatchId !== match.id;

      const card = document.createElement('div');
      card.className = 'match-card';

      // NEW: bet UI for AI on admin tabs
      let aiBetHTML = '';
      if (existingBet) {
        aiBetHTML = buildBetDisplayHTML(existingBet, match, resultIn, aiName);
      } else if (!resultIn && !dayBetElsewhere) {
        aiBetHTML = buildBetFormHTML(match.id, dateKey, aiName);
      } else if (dayBetElsewhere) {
        aiBetHTML = `<div class="bet-disabled">🎲 Daily bet used on another match</div>`;
      }

      card.innerHTML = `
        <div class="match-meta">
          <span class="match-group-tag">Group ${match.group}</span>
          <span class="match-time">🕐 ${sast.time} SAST</span>
        </div>
        <div class="match-teams">
          <div class="match-team">${teamFlags[match.home]||''} ${match.home}</div>
          <div class="match-vs">VS</div>
          <div class="match-team">${match.away} ${teamFlags[match.away]||''}</div>
        </div>
        <div class="match-venue">📍 ${match.venue}</div>
        <div class="score-inputs">
          <input type="number" min="0" max="20" id="${saveKey}-home-${match.id}" value="${saved.home??''}" placeholder="0"/>
          <span class="score-sep">–</span>
          <input type="number" min="0" max="20" id="${saveKey}-away-${match.id}" value="${saved.away??''}" placeholder="0"/>
        </div>
        <button class="save-result-btn ${btnClass}" onclick="saveAIScore('${match.id}','${saveKey}')">Save ${btnLabel}</button>
        ${saved.home!==undefined ? `<div class="match-result-display">${btnLabel}: ${match.home} ${saved.home} – ${saved.away} ${match.away}</div>` : ''}
        ${aiBetHTML}
      `;
      grid.appendChild(card);
    });
    container.appendChild(grid);
  });

  // Attach bet form listeners after rendering
  attachBetFormListeners();
}

function renderClaudeScores()  { renderAIPicks('claude-scores-container',  state.claudeScorePreds,  'claude',  () => activeClaudeFilter,  '🤖 Claude',  'claude-btn',  'Claude'); }
function renderChatgptScores() { renderAIPicks('chatgpt-scores-container', state.chatgptScorePreds, 'chatgpt', () => activeChatgptFilter, '🦾 ChatGPT', 'chatgpt-btn', 'ChatGPT'); }

async function saveAIScore(matchId, aiKey) {
  const home = parseInt(document.getElementById(`${aiKey}-home-${matchId}`)?.value);
  const away = parseInt(document.getElementById(`${aiKey}-away-${matchId}`)?.value);
  if (isNaN(home)||isNaN(away)) { showToast('Enter both scores!','error'); return; }
  const storeKey = aiKey === 'claude' ? 'claudeScorePreds' : 'chatgptScorePreds';
  state[storeKey][matchId] = { home, away };
  await saveToFirebase('shared', { [storeKey]: state[storeKey] });
  showToast(`${aiKey === 'claude' ? 'Claude' : 'ChatGPT'} pick saved!`, 'success');
  aiKey === 'claude' ? renderClaudeScores() : renderChatgptScores();
  renderLeaderboard();
}
window.saveAIScore = saveAIScore;

// ============================================
// SCORING — +3 exact, +1 correct winner, 0 otherwise
// ============================================
function scoreMatch(predicted, actual) {
  if (!actual || actual.home === undefined || !predicted || predicted.home === undefined) return 0;
  if (predicted.home === actual.home && predicted.away === actual.away) return 3;
  const predResult = predicted.home > predicted.away ? 'H' : predicted.home < predicted.away ? 'A' : 'D';
  const actResult  = actual.home  > actual.away  ? 'H' : actual.home  < actual.away  ? 'A' : 'D';
  if (predResult === actResult) return 1;
  return 0;
}

function scoreGroupRankings(predicted, actual) {
  if (!actual || actual.length === 0) return 0;
  let pts = 0;
  predicted.forEach((team, i) => {
    const ai = actual.indexOf(team);
    if (ai === i) pts += 3;
    else if (Math.abs(ai - i) === 1) pts += 1;
  });
  return pts;
}

// ============================================
// ACTUAL STANDINGS
// ============================================
function calculateActualStandings() {
  const standings = {};
  Object.entries(groups).forEach(([g, teams]) => {
    standings[g] = {};
    teams.forEach(t => standings[g][t] = { pts:0, gf:0, ga:0 });
  });
  matches.forEach(match => {
    const score = state.actualScores[match.id];
    if (!score || score.home === undefined) return;
    const { home:h, away:a, group:g } = match;
    const hs = score.home, as_ = score.away;
    standings[g][h].gf += hs; standings[g][h].ga += as_;
    standings[g][a].gf += as_; standings[g][a].ga += hs;
    if (hs > as_)        standings[g][h].pts += 3;
    else if (hs === as_) { standings[g][h].pts += 1; standings[g][a].pts += 1; }
    else                 standings[g][a].pts += 3;
  });
  const ranked = {};
  Object.entries(standings).forEach(([g, teams]) => {
    ranked[g] = Object.entries(teams)
      .sort((a,b) => b[1].pts !== a[1].pts ? b[1].pts - a[1].pts : (b[1].gf - b[1].ga) - (a[1].gf - a[1].ga))
      .map(([team]) => team);
  });
  return ranked;
}

function getOfficialStandings() {
  const auto = calculateActualStandings();
  const official = {};
  Object.keys(groups).forEach(g => {
    official[g] = state.finalStandings[g]?.length === 4 ? state.finalStandings[g] : auto[g];
  });
  return official;
}

function allGroupMatchesDone() {
  return matches.every(m => state.actualScores[m.id] !== undefined);
}

// ============================================
// LEADERBOARD — two separate tables:
//   1. Predictions (match +3/+1/0 & group rankings)
//   2. Betting Pool (everyone starts at 50, goes up/down)
// ============================================
// ============================================
// COMPARE PREDICTIONS — side by side view
// ============================================
// ============================================
// SCORE COMPARE — see everyone's predictions
// Only visible after YOU have locked your score
// ============================================
function renderScoreCompare() {
  const container = document.getElementById('score-compare-container');
  if (!container) return;
  container.innerHTML = '';

  const isAI    = currentUser === 'Claude' || currentUser === 'ChatGPT';

  const allPlayers = [
    { name:'Micole',   icon:'🐻', isAI: false },
    { name:'Mom',      icon:'🦒', isAI: false },
    { name:'Zac',      icon:'🦥', isAI: false },
    { name:'Sean',     icon:'🦅', isAI: false },
    { name:'Patricia', icon:'🦩', isAI: false },
    { name:'Claude',   icon:'🤖', isAI: true  },
    { name:'ChatGPT',  icon:'🦾', isAI: true  },
  ];

  // Group matches by date
  const byDate = {};
  matches.forEach(m => {
    const { dateKey, display } = toSAST(m.utc);
    if (!byDate[dateKey]) byDate[dateKey] = { display, matches: [] };
    byDate[dateKey].matches.push(m);
  });

  Object.entries(byDate).forEach(([dateKey, { display, matches: dayMatches }]) => {
    const dateHeader = document.createElement('div');
    dateHeader.className = 'date-header';
    dateHeader.textContent = display.split('·')[0].trim();
    container.appendChild(dateHeader);

    dayMatches.forEach(match => {
      // Check if current user has locked their prediction for this match
      const currentUserLocked = isAI
        ? true
        : state.lockedScorePreds[currentUser]?.[match.id] === true;

      // Match header
      const matchHeader = document.createElement('div');
      matchHeader.className = 'sc-match-header';
      matchHeader.innerHTML = `
        <span class="sc-match-teams">${teamFlags[match.home]||''} ${match.home} vs ${match.away} ${teamFlags[match.away]||''}</span>
        <span class="sc-match-time">🕐 ${toSAST(match.utc).time} SAST</span>
      `;
      container.appendChild(matchHeader);

      // If current user hasn't locked yet — show blocker row
      if (!currentUserLocked) {
        const blocker = document.createElement('div');
        blocker.className = 'sc-blocker';
        blocker.innerHTML = `🔒 Lock your prediction first to see everyone's picks`;
        container.appendChild(blocker);
        return;
      }

      // Row of 5 player cards
      // Two rows — humans on top, AIs below
      const humans = allPlayers.filter(p => !p.isAI);
      const ais    = allPlayers.filter(p => p.isAI);

      const humanRow = document.createElement('div');
      humanRow.className = 'sc-row';
      const aiRow = document.createElement('div');
      aiRow.className = 'sc-row sc-row-ai';

      [...humans, ...ais].forEach((player, idx) => {
        const row = idx < humans.length ? humanRow : aiRow;
        const card = document.createElement('div');
        card.className = 'sc-card';

        // Get this player's prediction
        const pred = player.isAI
          ? (player.name === 'Claude' ? state.claudeScorePreds[match.id] : state.chatgptScorePreds[match.id])
          : (state.scorePredictions[player.name] || {})[match.id];

        const playerLocked = player.isAI
          ? pred !== undefined
          : state.lockedScorePreds[player.name]?.[match.id] === true;

        // Get this player's bet for this match
        const bet = getBetForMatch(player.name, match.id);

        // Highlight if correct (result is in)
        const actualScore = state.actualScores[match.id];
        let scoreClass = '';
        if (pred && actualScore) {
          if (pred.home === actualScore.home && pred.away === actualScore.away) {
            scoreClass = 'sc-exact';
          } else {
            const predResult = pred.home > pred.away ? 'H' : pred.home < pred.away ? 'A' : 'D';
            const actResult  = actualScore.home > actualScore.away ? 'H' : actualScore.home < actualScore.away ? 'A' : 'D';
            scoreClass = predResult === actResult ? 'sc-winner' : 'sc-wrong';
          }
        }

        let betHTML = '';
        if (bet) {
          const betLabel = bet.betType === 'exact' ? `🎲 Exact ${bet.betAmount}pts` : `🎲 Winner 5pts`;
          const betResult = bet.resolved
            ? (bet.pointsDelta >= 0 ? `<span class="sc-bet-win">+${bet.pointsDelta}</span>` : `<span class="sc-bet-lose">${bet.pointsDelta}</span>`)
            : '';
          betHTML = `<div class="sc-bet">${betLabel} ${betResult}</div>`;
        }

        card.innerHTML = `
          <div class="sc-player-header">
            <span class="sc-icon">${player.icon}</span>
            <span class="sc-name">${player.name}</span>
          </div>
          ${playerLocked && pred
            ? `<div class="sc-score ${scoreClass}">${pred.home} – ${pred.away}</div>${betHTML}`
            : `<div class="sc-not-yet">Not yet</div>`
          }
        `;

        row.appendChild(card);
      });

      container.appendChild(humanRow);
      container.appendChild(aiRow);
    });
  });
}
window.renderScoreCompare = renderScoreCompare;

function renderCompare() {
  const container = document.getElementById('compare-container');
  if (!container) return;
  container.innerHTML = '';

  const allPlayers = [
    { name:'Micole',   icon:'🐻', preds: state.predictions['Micole'],   isAI: false },
    { name:'Mom',      icon:'🦒', preds: state.predictions['Mom'],      isAI: false },
    { name:'Zac',      icon:'🦥', preds: state.predictions['Zac'],      isAI: false },
    { name:'Sean',     icon:'🦅', preds: state.predictions['Sean'],     isAI: false },
    { name:'Patricia', icon:'🦩', preds: state.predictions['Patricia'], isAI: false },
    { name:'Claude',   icon:'🤖', preds: claudeGroupPredictions,        isAI: true  },
    { name:'ChatGPT',  icon:'🦾', preds: chatgptGroupPredictions,       isAI: true  },
  ];

  Object.entries(groups).forEach(([groupName, teams]) => {
    // Group header
    const groupHeader = document.createElement('div');
    groupHeader.className = 'compare-group-header';
    groupHeader.textContent = `Group ${groupName}`;
    container.appendChild(groupHeader);

    // Two rows — humans on top, AIs below
    const humans = allPlayers.filter(p => !p.isAI);
    const ais    = allPlayers.filter(p => p.isAI);

    const humanRow = document.createElement('div');
    humanRow.className = 'compare-row';
    const aiRow = document.createElement('div');
    aiRow.className = 'compare-row compare-row-ai';

    [...humans, ...ais].forEach((player, idx) => {
      const row = idx < humans.length ? humanRow : aiRow;
      const card = document.createElement('div');
      card.className = 'compare-card';

      const isLocked = player.isAI
        ? true
        : state.lockedPredictions[player.name] === true;

      const playerPreds = player.preds?.[groupName];

      if (!isLocked || !playerPreds) {
        card.innerHTML = `
          <div class="compare-card-header">
            <span class="compare-icon">${player.icon}</span>
            <span class="compare-name">${player.name}</span>
          </div>
          <div class="compare-not-yet">Not submitted yet</div>
        `;
      } else {
        const teamsHTML = playerPreds.map((team, i) => {
          const rankClass = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : '';
          return `
            <div class="compare-team-row">
              <div class="rank-badge ${rankClass}">${i+1}</div>
              <span class="compare-flag">${teamFlags[team]||'🏳️'}</span>
              <span class="compare-team">${team}</span>
            </div>
          `;
        }).join('');

        card.innerHTML = `
          <div class="compare-card-header">
            <span class="compare-icon">${player.icon}</span>
            <span class="compare-name">${player.name}</span>
          </div>
          ${teamsHTML}
        `;
      }

      row.appendChild(card);
    });

    container.appendChild(humanRow);
    container.appendChild(aiRow);
  });
}
window.renderCompare = renderCompare;

function renderLeaderboard() {
  const container = document.getElementById('leaderboard-container');
  if (!container) return;
  container.innerHTML = '';

  const actual     = calculateActualStandings();
  const hasResults = Object.keys(state.actualScores).length > 0;

  const playerData = [
    { name:'Micole',   icon:'🐻', type:'Human', groupPreds:state.predictions['Micole'],   scorePreds:state.scorePredictions['Micole'] },
    { name:'Mom',      icon:'🦒', type:'Human', groupPreds:state.predictions['Mom'],      scorePreds:state.scorePredictions['Mom'] },
    { name:'Zac',      icon:'🦥', type:'Human', groupPreds:state.predictions['Zac'],      scorePreds:state.scorePredictions['Zac'] },
    { name:'Sean',     icon:'🦅', type:'Human', groupPreds:state.predictions['Sean'],     scorePreds:state.scorePredictions['Sean'] },
    { name:'Patricia', icon:'🦩', type:'Human', groupPreds:state.predictions['Patricia'], scorePreds:state.scorePredictions['Patricia'] },
    { name:'Claude',   icon:'🤖', type:'AI',    groupPreds:claudeGroupPredictions,        scorePreds:state.claudeScorePreds },
    { name:'ChatGPT',  icon:'🦾', type:'AI',    groupPreds:chatgptGroupPredictions,       scorePreds:state.chatgptScorePreds },
  ];
  
  // --- Compute prediction scores ---
  const predScored = playerData.map(player => {
    let matchPts = 0, groupPts = 0;
    
    if (player.scorePreds) {
      matches.forEach(match => {
        const pred = player.scorePreds[match.id];
        const act  = state.actualScores[match.id];
        if (pred && act) matchPts += scoreMatch(pred, act);
      });
    }
    return { ...player, matchPts, groupPts: 0, points: matchPts };
  });
  predScored.sort((a,b) => b.points - a.points);

  // --- Compute betting scores ---
  const betScored = playerData.map(player => ({
    ...player,
    bettingPts: getBettingPoints(player.name),
  }));
  betScored.sort((a,b) => b.bettingPts - a.bettingPts);

  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣'];
  const classes = ['first','second','third','','','',''];

  // ── TABLE 1: Predictions ──
  const predTitle = document.createElement('div');
  predTitle.className = 'lb-section-title';
  predTitle.innerHTML = '⚽ Predictions Leaderboard';
  container.appendChild(predTitle);

  predScored.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i] || ''}`;
    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name} ${state.rescuedPlayers[player.name] ? '🆘 rescued' : ''}</div>
        <div class="lb-type">${player.type}</div>
        ${hasResults
         ? `<div class="lb-breakdown">Match predictions: +${player.matchPts}pts</div>`
          : `<div class="lb-breakdown" style="color:var(--text3);font-style:italic">Waiting for results…</div>`}
      </div>
      <div>
        <div class="lb-points">+${player.points}</div>
        <div class="lb-pts-label">PTS</div>
      </div>
    `;
    container.appendChild(row);
  });

  if (!hasResults) {
    const empty = document.createElement('div');
    empty.className = 'leaderboard-empty';
    empty.innerHTML = `⚽ Activates once match results are entered.<br><span style="font-size:0.8rem;color:var(--text3)">Lock in your predictions while you wait.</span>`;
    container.appendChild(empty);
  }

  // ── TABLE 2: Betting Pool ──
  const betDivider = document.createElement('div');
  betDivider.className = 'lb-section-divider';
  container.appendChild(betDivider);

  const betTitle = document.createElement('div');
  betTitle.className = 'lb-section-title';
  betTitle.innerHTML = '🎲 Betting Pool';
  container.appendChild(betTitle);

  const betSubtitle = document.createElement('div');
  betSubtitle.className = 'lb-section-subtitle';
  betSubtitle.textContent = 'Everyone starts with 50 pts — goes up or down based on bets only';
  container.appendChild(betSubtitle);

  betScored.forEach((player, i) => {
    const startPts   = BETTING_STARTING_POINTS;
    const delta      = player.bettingPts - startPts;
    const deltaStr   = delta === 0 ? '±0' : delta > 0 ? `+${delta}` : `${delta}`;
    const deltaClass = delta > 0 ? 'bet-delta-win' : delta < 0 ? 'bet-delta-lose' : 'bet-delta-neutral';

    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i] || ''}`;
    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name}</div>
        <div class="lb-type">${player.type}</div>
        <div class="lb-breakdown">Started with ${startPts} &nbsp;|&nbsp; <span class="${deltaClass}">${deltaStr} from bets</span></div>
      </div>
      <div>
        <div class="lb-points" style="color:var(--bet)">${player.bettingPts}</div>
        <div class="lb-pts-label">POOL</div>
      </div>
    `;
    container.appendChild(row);
  });

  renderStandingsAccuracy();
}

// ============================================
// STANDINGS ACCURACY
// ============================================
function calcAccuracy(playerGroupPreds, officialStandings) {
  let exact = 0, partial = 0, total = 0;
  Object.keys(groups).forEach(g => {
    const predicted = playerGroupPreds?.[g];
    const actual    = officialStandings[g];
    if (!predicted || !actual || actual.length === 0) return;
    predicted.forEach((team, i) => {
      const ai = actual.indexOf(team);
      if (ai === i) exact++;
      else if (Math.abs(ai - i) === 1) partial++;
      total++;
    });
  });
  if (total === 0) return { pct:0, exact, partial, total };
  return { pct: Math.round(((exact + partial * 0.5) / total) * 100), exact, partial, total };
}

function renderStandingsAccuracy() {
  const section = document.getElementById('standings-accuracy-section');
  if (!section) return;

  if (!allGroupMatchesDone()) {
    section.classList.add('hidden');
    document.getElementById('standings-coming-soon').classList.remove('hidden');
    return;
  }

  section.classList.remove('hidden');
  document.getElementById('standings-coming-soon').classList.add('hidden');

  const official = getOfficialStandings();
  const playerData = [
    { name:'Micole',  icon:'🐻', preds:state.predictions['Micole'] },
    { name:'Mom',     icon:'🦒', preds:state.predictions['Mom'] },
    { name:'Zac',     icon:'🦥', preds:state.predictions['Zac'] },
    { name:'Claude',  icon:'🤖', preds:claudeGroupPredictions },
    { name:'ChatGPT', icon:'🦾', preds:chatgptGroupPredictions },
  ];

  const scored = playerData.map(p => ({ ...p, ...calcAccuracy(p.preds, official) })).sort((a,b) => b.pct - a.pct);
  const medals  = ['🥇','🥈','🥉','4️⃣','5️⃣'];
  const classes = ['first','second','third','',''];

  const accContainer = document.getElementById('standings-accuracy-container');
  accContainer.innerHTML = '';
  scored.forEach((player, i) => {
    const row = document.createElement('div');
    row.className = `leaderboard-row ${classes[i] || ''}`;
    row.innerHTML = `
      <div class="lb-position">${medals[i]}</div>
      <div class="lb-info">
        <div class="lb-name">${player.icon} ${player.name}</div>
        <div class="lb-breakdown">✅ ${player.exact} exact &nbsp;|&nbsp; 〰️ ${player.partial} one-off &nbsp;|&nbsp; of ${player.total}</div>
      </div>
      <div>
        <div class="lb-points">${player.pct}%</div>
        <div class="lb-pts-label">ACCURACY</div>
      </div>
    `;
    accContainer.appendChild(row);
  });

  const bdContainer = document.getElementById('standings-breakdown-container');
  bdContainer.innerHTML = '';
  Object.keys(groups).forEach(g => {
    const card = document.createElement('div');
    card.className = 'standings-card';
    const actual = official[g] || [];
    const rows = actual.map((team, i) => {
      const cols = ['Micole','Mom','Zac','Claude','ChatGPT'].map(name => {
        const preds = name==='Claude' ? claudeGroupPredictions : name==='ChatGPT' ? chatgptGroupPredictions : state.predictions[name];
        const pos = preds?.[g]?.indexOf(team) ?? -1;
        const icon = pos === i ? '✅' : Math.abs(pos - i) === 1 ? '〰️' : '❌';
        return `<td class="sbd-cell">${icon}</td>`;
      }).join('');
      return `<tr><td class="sbd-pos">${i+1}</td><td class="sbd-team">${teamFlags[team]||''} ${team}</td>${cols}</tr>`;
    }).join('');
    card.innerHTML = `
      <h4>Group ${g}</h4>
      <table class="standings-breakdown-table">
        <thead><tr><th></th><th>Actual</th><th>🐻</th><th>🦒</th><th>🦥</th><th>🤖</th><th>🦾</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>`;
    bdContainer.appendChild(card);
  });

  if (currentUser === 'Micole') renderStandingsOverride(official);
}

function renderStandingsOverride(official) {
  const container = document.getElementById('standings-override-container');
  if (!container) return;
  container.innerHTML = '';
  const intro = document.createElement('p');
  intro.className = 'override-intro';
  intro.textContent = "⚙️ If FIFA's tiebreakers changed any group order, drag to correct it below then save.";
  container.appendChild(intro);
  const grid = document.createElement('div');
  grid.className = 'groups-grid';

  Object.keys(groups).forEach(g => {
    const order = official[g] || [...groups[g]];
    const card  = document.createElement('div');
    card.className = 'group-card';
    card.innerHTML = `<h3>Group ${g}</h3>`;
    const list = document.createElement('div');
    list.dataset.overrideGroup = g;
    order.forEach((team, index) => {
      const item = document.createElement('div');
      item.className = 'team-item';
      item.dataset.team = team;
      item.draggable = true;
      const rc = index===0?'r1':index===1?'r2':index===2?'r3':'';
      item.innerHTML = `<div class="rank-badge ${rc}">${index+1}</div><span class="team-flag">${teamFlags[team]||'🏳️'}</span><span class="team-name">${team}</span>`;
      item.addEventListener('dragstart', () => item.classList.add('dragging'));
      item.addEventListener('dragend',   () => { item.classList.remove('dragging'); updateRankBadges(list); });
      list.appendChild(item);
    });
    list.addEventListener('dragover', e => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      if (!dragging) return;
      const siblings = [...list.querySelectorAll('.team-item:not(.dragging)')];
      const next = siblings.find(s => e.clientY <= s.getBoundingClientRect().top + s.offsetHeight/2);
      list.insertBefore(dragging, next || null);
    });
    card.appendChild(list);
    grid.appendChild(card);
  });

  container.appendChild(grid);
  const btn = document.createElement('button');
  btn.className = 'cta-btn';
  btn.style.cssText = 'margin:20px auto;display:block;';
  btn.textContent = 'Save Official Standings ✅';
  btn.onclick = saveFinalStandings;
  container.appendChild(btn);
}

function updateRankBadges(list) {
  list.querySelectorAll('.team-item').forEach((item, index) => {
    const badge = item.querySelector('.rank-badge');
    badge.textContent = index + 1;
    badge.className = 'rank-badge ' + (index===0?'r1':index===1?'r2':index===2?'r3':'');
  });
}

async function saveFinalStandings() {
  const newStandings = {};
  Object.keys(groups).forEach(g => {
    const list = document.querySelector(`[data-override-group="${g}"]`);
    if (list) newStandings[g] = [...list.querySelectorAll('.team-item')].map(i => i.dataset.team);
  });
  state.finalStandings = newStandings;
  await saveToFirebase('shared', { finalStandings: newStandings });
  showToast('Official standings saved! ✅','success');
  renderStandingsAccuracy();
}
window.saveFinalStandings = saveFinalStandings;

// ============================================
// RULES PAGE
// ============================================

function renderRules() {
  const container = document.getElementById('rules-container');
  if (!container) return;
  container.innerHTML = `
    <div class="rules-block" style="border:2px solid var(--red);background:rgba(255,71,87,.12);animation:pulse 2s infinite;text-align:center;max-width:600px;margin:0 auto 14px;position:relative;z-index:1">
      <h3 style="color:var(--red);font-size:1.6rem">🚨 RULE UPDATE! READ THIS FIRST 🚨</h3>
      <p style="color:var(--text);font-size:.95rem;font-weight:600">The winner bet has been updated mid-tournament to make it more balanced. Previously losing cost you your full stake which was the same risk as an exact bet but far less reward.</p>
     <p style="color:var(--text);margin-top:8px">The winner bet is now <strong>completely free</strong> — no stake, no risk! Pick one match per day where you're confident on the winner. Get it right → +3pts. Wrong → nothing lost. Exact bets are unchanged and can be placed on every match.</p>
      
    <div class="rules-block">
      <h3>Before the Tournament — Your To-Do List</h3>
      <p>Before the first match kicks off, make sure you've done all three of these:</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">1</span> Pick your tournament winner on the Winner tab</div>
        <div class="rules-score-row"><span class="score-badge gold">2</span> Lock in your group stage rankings on the Rankings tab</div>
        <div class="rules-score-row"><span class="score-badge gold">3</span> Start predicting match scores on the Predictions tab</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>Pick Your Champion</h3>
      <p>Select one team into the winner slot and lock it in. You can't change it.</p>
    </div>
    <div class="rules-block">
      <h3>Group Stage Rankings</h3>
      <p>Before the tournament starts, drag each team into the order you think they'll finish in their group (1st to 4th) and lock in all 12 groups.</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">✅</span> Exact position = full point</div>
        <div class="rules-score-row"><span class="score-badge silver">〰️</span> One spot off = half point</div>
        <div class="rules-score-row"><span class="score-badge neutral">❌</span> More than one off = nothing</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>Score Predictions</h3>
      <p>Pick the exact final score for each match before it starts. Once you tap Lock, that's it. How it scores:</p>
      <div class="rules-scoring">
        <div class="rules-score-row"><span class="score-badge gold">+3</span> You nailed the exact score</div>
        <div class="rules-score-row"><span class="score-badge silver">+1</span> Right winner, wrong score</div>
        <div class="rules-score-row"><span class="score-badge neutral">0</span> Wrong winner</div>
      </div>
    </div>
    <div class="rules-block">
      <h3>Betting Pool</h3>
      <p>Everyone starts with <strong>50 betting points</strong>. Two ways to bet:</p>
      <div class="rules-scoring">
         <div class="rules-score-row"><span class="score-badge gold">Exact</span> Bet up to 10 points. Nail the exact score → Win 10× your bet. Get it wrong → lose your stake.</div>
        <div class="rules-score-row"><span class="score-badge silver">Winner</span> Completely free — no stake! Pick one match per day. Get the winner right → +3 points. Wrong → nothing lost.</div>
      </div>
      <p style="margin-top:10px">Your betting points can never go below zero. You can bet on as many matches as you like!</p>
    </div>
    <div class="rules-block">
      <h3>The AI Competitors</h3>
      <p>Claude and ChatGPT are honorary family members. Their group stage rankings are already locked in. You can view them on the Rankings tab. Every morning, Micole will ask each AI for their score prediction and bet, then enter it on their behalf. Same rules, same scoring.</p>
    </div>
    <div class="rules-block">
      <h3>Admin Stuff (Micole)</h3>
      <p>Micole gets extra tabs in her profile to enter real match results and the AI score picks and bets. Please don't mess with her tab, it will mess with the data</p>
    </div>
  `;
}

// ============================================
// LOADING, TOAST, RESET
// ============================================
function showLoading(show) {
  let overlay = document.getElementById('loading-overlay');
  if (show && !overlay) {
    overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.className = 'loading-overlay';
    overlay.innerHTML = `<div class="loading-spinner"></div><div class="loading-text">Loading...</div>`;
    document.body.appendChild(overlay);
  } else if (!show && overlay) {
    overlay.remove();
  }
}

function showToast(msg, type='') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 2500);
}

// MODIFIED: reset now also clears betting data
async function resetEverything() {
  if (!confirm('⚠️ RESET ALL DATA? Wipes every prediction, score, result and bet. Cannot be undone!')) return;
  if (!confirm('100% sure? This is the real reset.')) return;
  showLoading(true);
  await setDoc(doc(db,'worldcup2026','users'), {
    predictions:{}, lockedPredictions:{}, scorePredictions:{}, lockedScorePreds:{}, tournamentWinners:{}
  });
  await setDoc(doc(db,'worldcup2026','shared'), {
   actualScores:{}, claudeScorePreds:{}, chatgptScorePreds:{}, finalStandings:{},
    bets:{}, bettingPoints:{}, rescuedPlayers:{}
  });
  state = {
    predictions:{}, lockedPredictions:{}, scorePredictions:{}, lockedScorePreds:{},
    tournamentWinners:{}, actualScores:{}, claudeScorePreds:{}, chatgptScorePreds:{},
    finalStandings:{}, bets:{}, bettingPoints:{}, rescuedPlayers:{}
  };
  showLoading(false);
  showToast('🗑️ All data reset!','success');
  renderWinnerPicker();
  renderGroups();
  renderAIGroupRankings('claude-rankings-container', 'Claude');
  renderAIGroupRankings('chatgpt-rankings-container', 'ChatGPT');
  renderMatchPredictions();
  renderActualScores();
  renderClaudeScores();
  renderChatgptScores();
  renderLeaderboard();
  updateHeaderPoints();
}
window.resetEverything = resetEverything;
