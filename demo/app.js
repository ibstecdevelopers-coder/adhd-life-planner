/* World Trade Net · Bloom ADHD Life Planner — core */
const MODE = window.BLOOM_MODE || 'full';
const DEMO = MODE === 'demo';
const KEY = DEMO ? 'wtn-bloom-demo-v1' : 'wtn-bloom-v1';
const SHOP = window.BLOOM_SHOP || 'https://www.etsy.com/shop/worldtradenet';
const store = (() => { try { const s = DEMO ? sessionStorage : localStorage; s.setItem('_t', '1'); s.removeItem('_t'); return s; } catch (e) { const m = {}; return { getItem: k => m[k] ?? null, setItem: (k, v) => m[k] = v, removeItem: k => delete m[k] }; } })();

const $ = s => document.querySelector(s);
const uid = () => Math.random().toString(36).slice(2, 9);
const pad = n => String(n).padStart(2, '0');
const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const TODAY = () => iso(new Date());
const D = s => new Date(s + 'T12:00:00');
const addDays = (s, n) => { const d = D(s); d.setDate(d.getDate() + n); return iso(d); };
const diffDays = (a, b) => Math.round((D(a) - D(b)) / 864e5);
const fmt = (s, o) => D(s).toLocaleDateString(undefined, o || { weekday: 'short', month: 'short', day: 'numeric' });
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ym = s => s.slice(0, 7);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
const sum = a => a.reduce((x, y) => x + (+y || 0), 0);
function weekStart(s) { const d = D(s); const ws = S.settings.weekStart ?? 1; const off = (d.getDay() - ws + 7) % 7; d.setDate(d.getDate() - off); return iso(d); }
function weekDays(s) { const a = weekStart(s); return [0, 1, 2, 3, 4, 5, 6].map(i => addDays(a, i)); }
function money(n, dec) { try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: S.settings.currency || 'USD', maximumFractionDigits: dec === 0 ? 0 : 2 }).format(+n || 0); } catch (e) { return '$' + (+n || 0).toFixed(2); } }
function greet() { const h = new Date().getHours(); return h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 22 ? 'Good evening' : 'Good night'; }

const I = {
 sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
 home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 cloud: '<path d="M17.5 19H7a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 11 4 4 0 0 1 17.5 19z"/>',
 brain: '<path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.3A3 3 0 0 0 4.5 9a3 3 0 0 0 .4 4.9A3 3 0 0 0 7.5 19 2.5 2.5 0 0 0 12 20V4.5A2.5 2.5 0 0 0 9.5 2zM14.5 2A2.5 2.5 0 0 1 17 4.5v.3A3 3 0 0 1 19.5 9a3 3 0 0 1-.4 4.9 3 3 0 0 1-2.6 5.1A2.5 2.5 0 0 1 12 20"/>',
 list: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.5 6 1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
 cal: '<rect x="3" y="4.5" width="18" height="16.5" rx="3"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
 spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
 target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
 heart: '<path d="M19.5 13.6 12 21l-7.5-7.4A5 5 0 0 1 12 6.6a5 5 0 0 1 7.5 7z"/>',
 wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v3h-4a2 2 0 0 0 0 4h4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5"/>',
 timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9.5 2h5"/>',
 smile: '<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
 fork: '<path d="M4 3v7a3 3 0 0 0 3 3v8M7 3v6M10 3v7a3 3 0 0 1-3 3M17 21V3c-2.2 1.2-3 4-3 7v4h3"/>',
 flower: '<ellipse cx="12" cy="6.3" rx="2.9" ry="3.7" transform="rotate(0 12 12)"/><ellipse cx="12" cy="6.3" rx="2.9" ry="3.7" transform="rotate(72 12 12)"/><ellipse cx="12" cy="6.3" rx="2.9" ry="3.7" transform="rotate(144 12 12)"/><ellipse cx="12" cy="6.3" rx="2.9" ry="3.7" transform="rotate(216 12 12)"/><ellipse cx="12" cy="6.3" rx="2.9" ry="3.7" transform="rotate(288 12 12)"/><circle cx="12" cy="12" r="2.2"/>',
 folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
 gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20"/>',
 candy: '<circle cx="12" cy="12" r="4.5"/><path d="M8.8 8.8 5 5l-2 1 1-3M15.2 15.2 19 19l2-1-1 3M5 5l-1 3M19 19l1-3"/>',
 review: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
 plus: '<path d="M12 5v14M5 12h14"/>', check: '<path d="m5 12.5 4.5 4.5L19 7"/>', x: '<path d="M6 6l12 12M18 6 6 18"/>',
 edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 left: '<path d="m15 18-6-6 6-6"/>', right: '<path d="m9 18 6-6-6-6"/>', menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
 play: '<path d="M7 4.5v15l12-7.5z"/>', pause: '<path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z"/>', reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
 down: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>', up: '<path d="M12 20V8M7 13l5-5 5 5M5 4h14"/>', db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
 drop: '<path d="M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z"/>', bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
 trend: '<path d="m3 17 6-6 4 4 8-8M15 7h6v6"/>', flag: '<path d="M5 21V4h11l-2 4 2 4H5"/>', dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01"/>',
 bed: '<path d="M3 18V7M3 13h18v5M21 13a3 3 0 0 0-3-3h-7v3"/><circle cx="7" cy="10.5" r="1.6"/>', shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/>',
 search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
};
const ic = (n, cls) => `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${I[n] || ''}</svg>`;

const COLORS = { rose: '#E36A9A', lav: '#9A6FD3', mint: '#3F9A72', peach: '#E07F4F', sky: '#4E86C9', gold: '#C99A2E', berry: '#B83A6E', sage: '#7FA37F' };
const AREAS = ['Home', 'Work', 'Self', 'Errands', 'Family', 'Health', 'Money'];
const MOODS = [{ v: 5, e: '🌸', n: 'Radiant', d: 'Light & uplifted' }, { v: 4, e: '🌷', n: 'Good', d: 'Content & steady' }, { v: 3, e: '🌿', n: 'Balanced', d: 'Calm & present' }, { v: 2, e: '☁️', n: 'Low', d: 'Tired or quiet' }, { v: 1, e: '🌧️', n: 'Fragile', d: 'Needs extra care' }];
const FEELS = ['Grateful', 'Peaceful', 'Hopeful', 'Inspired', 'Loved', 'Calm', 'Proud', 'Overwhelmed', 'Anxious', 'Tired', 'Restless', 'Scattered', 'Lonely', 'Motivated'];
const ENERGY = [{ k: 'low', n: 'Low energy', d: 'Gentle pace' }, { k: 'med', n: 'Medium energy', d: 'Steady rhythm' }, { k: 'high', n: 'High energy', d: 'Deeper focus' }];
const SC_CATS = { move: ['Gentle movement', 'rose'], mind: ['Mindfulness & stillness', 'lav'], rest: ['Rest & sanctuary', 'sky'], play: ['Creativity & play', 'gold'], connect: ['Connection', 'mint'], body: ['Body care', 'peach'] };
const ADMIN_CATS = { health: ['Personal & health', 'rose'], renew: ['Renewals & licenses', 'sky'], subs: ['Subscriptions', 'lav'], home: ['Home & car', 'peach'], tax: ['Work & taxes', 'gold'], family: ['Family & pets', 'mint'] };
const EXP_CATS = { food: ['Groceries & dining', 'mint'], home: ['Home & living', 'peach'], bills: ['Bills & utilities', 'sky'], fun: ['Entertainment & fun', 'lav'], self: ['Self-care & beauty', 'rose'], transport: ['Transport', 'gold'], other: ['Other', 'sage'] };
const GROC_CATS = ['Produce', 'Protein', 'Dairy & eggs', 'Pantry', 'Frozen', 'Household', 'Other'];
const PROMPTS = ['What made you smile today?', 'What is one thing you can let go of?', 'What would make tomorrow 1% easier?', 'Who are you grateful for this week?', 'What did your body need today?', 'What is a small win you almost missed?', 'What drained you, and what refilled you?', 'Describe a moment of calm from today.', 'What are you looking forward to?', 'What would you tell a friend who had your day?'];

let S;
function blank() {
 return { v: 1, settings: { name: '', theme: 'blush', currency: 'USD', weekStart: 1, water: 8, onboarded: false, focus: 'Gentle focus for today.' },
  energy: {}, tasks: [], dumps: [], events: [], habits: [], routines: [], goals: [], focus: [], moods: {}, selfcare: [], journal: {},
  dopa: { starters: [], mains: [], sides: [], desserts: [] }, rooms: [], meals: { plan: {}, recipes: [], grocery: [] },
  money: { budget: 0, tx: [], bills: [] }, admin: [], reviews: {}, water: {}, start: {} };
}
function load() {
 try { const r = JSON.parse(store.getItem(KEY)); if (r && r.v) { S = Object.assign(blank(), r); S.settings = Object.assign(blank().settings, r.settings); return; } } catch (e) { }
 S = blank();
 if (DEMO) { seed(); S.settings.onboarded = true; }
}
let _sv;
function save() { clearTimeout(_sv); _sv = setTimeout(() => { try { store.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save — storage is full or blocked'); } }, 120); }

function starters() {
 S.routines = [
  { id: uid(), name: 'A gentle morning', slot: 'morning', note: 'A small beginning, at your pace.', steps: [{ id: uid(), t: 'Drink a glass of water', m: 2 }, { id: uid(), t: 'Open the curtains', m: 1 }, { id: uid(), t: 'Take my vitamins', m: 1 }, { id: uid(), t: 'Choose one small next step', m: 3 }], log: {} },
  { id: uid(), name: 'Midday reset', slot: 'midday', note: 'A pause between the busy parts.', steps: [{ id: uid(), t: 'Eat a real lunch', m: 20 }, { id: uid(), t: 'Stretch for two minutes', m: 2 }, { id: uid(), t: 'Check tomorrow’s calendar', m: 2 }], log: {} },
  { id: uid(), name: 'A softer landing', slot: 'evening', note: 'A five-minute reset before resting.', steps: [{ id: uid(), t: 'Leave tomorrow’s bag by the door', m: 2 }, { id: uid(), t: 'Phone on the charger, away from bed', m: 1 }, { id: uid(), t: 'Write one thing I’m grateful for', m: 2 }], log: {} }];
 S.dopa = { starters: ['Dance to one song', 'Step outside for 5 minutes', 'Make a cosy drink', 'Text a friend'], mains: ['Go for a walk in nature', 'Bake something new', 'Paint or draw', 'Yoga class'],
  sides: ['Podcast while cleaning', 'Candle while working', 'Fun playlist for chores', 'Body-double video call'], desserts: ['One episode of a show', '10 minutes of scrolling', 'A sweet treat', 'Online window shopping'] };
 S.rooms = [{ id: uid(), name: 'Kitchen', icon: '🍽️', color: 'mint', steps: [{ id: uid(), t: 'Clear the counter', done: false }, { id: uid(), t: 'Load the dishwasher', done: false }, { id: uid(), t: 'Wipe the sink', done: false }] },
  { id: uid(), name: 'Bedroom', icon: '🛏️', color: 'rose', steps: [{ id: uid(), t: 'Make the bed', done: false }, { id: uid(), t: 'Clothes in the basket', done: false }] },
  { id: uid(), name: 'Bathroom', icon: '🛁', color: 'sky', steps: [{ id: uid(), t: 'Fresh towels', done: false }, { id: uid(), t: 'Wipe the mirror', done: false }] }];
}

function seed() {
 const t = TODAY(), A = n => addDays(t, n);
 Object.assign(S, blank());
 S.settings = Object.assign(S.settings, { name: 'Sophie', onboarded: true, theme: S.settings.theme || 'blush' });
 starters();
 S.energy[t] = 'med';
 const T = (title, date, o) => ({ id: uid(), title, date, done: false, prio: 'med', energy: 'med', est: 15, area: 'Self', notes: '', created: A(-3), ...o });
 S.tasks = [T('Reply to Emma’s email', t, { done: true, doneAt: t, energy: 'low', est: 10, area: 'Work' }), T('Book the dentist appointment', t, { done: true, doneAt: t, energy: 'low', est: 5, area: 'Health' }),
  T('Finish the client proposal', t, { prio: 'high', energy: 'high', est: 60, area: 'Work' }), T('Tidy the desk for 10 minutes', t, { energy: 'low', est: 10, area: 'Home' }),
  T('Order birthday gift for Mum', t, { prio: 'high', est: 15, area: 'Family' }), T('Water the plants', t, { energy: 'low', est: 5, area: 'Home' }),
  T('Plan meals for the week', A(1), { area: 'Home' }), T('Call the insurance company', A(2), { prio: 'high', area: 'Money' }), T('Return library books', A(3), { energy: 'low', area: 'Errands' }),
  T('Sort the photo folders', '', { energy: 'low', area: 'Self' }), T('Research new yoga studio', '', { area: 'Self' })];
 for (let i = 1; i <= 6; i++) { const n = [2, 1, 3, 1, 2, 4][i - 1]; for (let k = 0; k < n; k++) S.tasks.push(T(['Laundry', 'Groceries', 'Emails', 'Gym', 'Read 20 pages', 'Budget check', 'Call Grandma'][(i + k) % 7], A(-i), { done: true, doneAt: A(-i) })); }
 S.dumps = [{ id: uid(), text: 'Ask Sarah about the weekend trip', tag: 'reminder', created: t }, { id: uid(), text: 'Idea: a cosy reading corner by the window', tag: 'idea', created: A(-1) },
  { id: uid(), text: 'Car service is due soon?', tag: 'todo', created: A(-1) }, { id: uid(), text: 'Feeling behind on emails — schedule a 25 min block', tag: 'worry', created: A(-2) }, { id: uid(), text: 'Gift idea for Mum: a silk scarf', tag: 'idea', created: A(-3) }];
 S.events = [{ id: uid(), title: 'Yoga class', date: t, time: '18:30', color: 'lav' }, { id: uid(), title: 'Coffee with Mia', date: A(1), time: '10:00', color: 'rose' }, { id: uid(), title: 'Team meeting', date: A(2), time: '09:30', color: 'sky' },
  { id: uid(), title: 'Dentist', date: A(5), time: '15:00', color: 'peach' }, { id: uid(), title: 'Mum’s birthday', date: A(8), time: '', color: 'gold' }, { id: uid(), title: 'Book club', date: A(-4), time: '19:00', color: 'mint' }, { id: uid(), title: 'Farmers market', date: A(12), time: '09:00', color: 'mint' }];
 const H = (name, emoji, color, freq, p) => { const h = { id: uid(), name, emoji, color, freq, log: {}, created: A(-40) }; for (let i = 1; i < 40; i++) if (((i * 7 + name.length * 3) % 10) / 10 < p) h.log[A(-i)] = 1; return h; };
 S.habits = [H('A glass of water', '💧', 'sky', 'daily', .85), H('A gentle stretch', '🧘', 'lav', 'weekdays', .7), H('A few pages', '📖', 'rose', 'daily', .6), H('An evening without rushing', '🌙', 'peach', 'daily', .55), H('A little time outdoors', '🌿', 'mint', 'daily', .65)];
 S.habits[0].log[t] = 1; S.habits[2].log[t] = 1;
 S.routines[0].log[t] = [S.routines[0].steps[0].id, S.routines[0].steps[1].id];
 S.goals = [{ id: uid(), title: 'Create a cosy reading corner', area: 'Home', due: A(21), color: 'rose', steps: [{ id: uid(), t: 'Pick the spot', done: true }, { id: uid(), t: 'Find a comfy chair', done: true }, { id: uid(), t: 'Buy a warm lamp', done: false }, { id: uid(), t: 'Add a small shelf', done: false }] },
  { id: uid(), title: 'Run a 5K by spring', area: 'Health', due: A(90), color: 'mint', steps: [{ id: uid(), t: 'Buy running shoes', done: true }, { id: uid(), t: 'Couch-to-5K week 1', done: true }, { id: uid(), t: 'Week 2', done: true }, { id: uid(), t: 'Week 3', done: false }, { id: uid(), t: 'Sign up for a race', done: false }] },
  { id: uid(), title: 'Save for a weekend away', area: 'Money', due: A(60), color: 'lav', steps: [{ id: uid(), t: 'Choose the place', done: true }, { id: uid(), t: 'Set up a savings pot', done: false }, { id: uid(), t: 'Book the stay', done: false }] }];
 S.focus = [[0, 25, 'Finish the client proposal'], [0, 25, 'Finish the client proposal'], [-1, 45, 'Emails'], [-2, 25, 'Budget check'], [-3, 15, 'Tidy the desk'], [-5, 25, 'Reading'], [-6, 45, 'Proposal outline']].map(([d, m, l]) => ({ id: uid(), date: A(d), mins: m, label: l, at: '10:00' }));
 const mv = [4, 3, 4, 5, 3, 2, 4, 4, 3, 4, 5, 4, 3, 4], en = ['med', 'low', 'med', 'high', 'med', 'low', 'med'];
 for (let i = 13; i >= 1; i--) S.moods[A(-i)] = { mood: mv[i], energy: en[i % 7], tags: [FEELS[(i * 3) % FEELS.length], FEELS[(i * 5 + 1) % FEELS.length]], note: '', sleep: 6.5 + (i % 4) * .5 };
 S.moods[t] = { mood: 4, energy: 'med', tags: ['Grateful', 'Calm'], note: 'Slow morning, but I got the hard email done.', sleep: 7.5 };
 for (let i = 0; i < 8; i++) S.water[A(-i)] = [5, 8, 6, 7, 8, 4, 6, 7][i];
 S.selfcare = [{ id: uid(), title: 'Slow stretch', cat: 'move', date: t, time: '09:00', mins: 15, done: true }, { id: uid(), title: 'A few quiet lines', cat: 'mind', date: t, time: '21:00', mins: 10, done: false },
  { id: uid(), title: 'Quiet tea by the window', cat: 'rest', date: A(-1), time: '20:00', mins: 10, done: true }, { id: uid(), title: 'Sketch for pleasure', cat: 'play', date: A(-2), time: '', mins: 20, done: true }, { id: uid(), title: 'Face mask & bath', cat: 'body', date: A(-3), time: '', mins: 25, done: true }, { id: uid(), title: 'Call a friend', cat: 'connect', date: A(1), time: '19:00', mins: 20, done: false }];
 S.journal[t] = { grateful: ['Sunshine on my walk', 'A kind message from Emma', 'Warm cinnamon toast'], text: 'Started slow, but I got the hard email done before lunch. Taking the evening easy.', prompt: 0 };
 S.journal[A(-1)] = { grateful: ['Yoga class', 'Clean sheets'], text: 'Felt scattered in the morning. The brain dump helped a lot.', prompt: 1 };
 S.meals.recipes = [{ id: uid(), name: 'Berry overnight oats', type: 'Breakfast', ing: ['Oats', 'Greek yogurt', 'Berries', 'Honey'] }, { id: uid(), name: 'Easy tomato toast', type: 'Lunch', ing: ['Sourdough', 'Tomatoes', 'Basil', 'Olive oil'] },
  { id: uid(), name: 'Lemon chickpea bowl', type: 'Dinner', ing: ['Chickpeas', 'Lemon', 'Spinach', 'Rice', 'Feta'] }, { id: uid(), name: 'Creamy tomato soup', type: 'Dinner', ing: ['Tomatoes', 'Onion', 'Cream', 'Garlic'] }];
 const wd = weekDays(t), R = S.meals.recipes;
 const plan = [['b', 0, R[0]], ['l', 0, R[1]], ['d', 0, R[2]], ['b', 1, 'Avocado toast'], ['d', 1, R[3]], ['l', 2, R[2]], ['d', 2, 'Pasta night'], ['b', 3, R[0]], ['s', 3, 'Apple & almond butter'], ['d', 4, 'Pizza with friends'], ['b', 5, 'Pancakes'], ['d', 5, R[3]], ['l', 6, 'Picnic lunch'], ['s', 1, 'Hummus & carrots']];
 for (const [k, i, r] of plan) { const day = S.meals.plan[wd[i]] = S.meals.plan[wd[i]] || {}; day[k] = typeof r === 'string' ? { text: r } : { rid: r.id, text: r.name }; }
 S.meals.grocery = [['Berries', 'Produce', 1], ['Spinach', 'Produce', 0], ['Tomatoes', 'Produce', 0], ['Lemon', 'Produce', 1], ['Chickpeas', 'Pantry', 0], ['Oats', 'Pantry', 1], ['Greek yogurt', 'Dairy & eggs', 0], ['Feta', 'Dairy & eggs', 0], ['Paper towels', 'Household', 0]].map(([text, cat, done]) => ({ id: uid(), text, cat, done: !!done }));
 const M = ym(t);
 S.money.budget = 1800;
 const tx = (type, amt, cat, d, note) => ({ id: uid(), type, amt, cat, date: d, note });
 const td = +t.slice(8), dd = n => `${M}-${pad(td >= 14 ? clamp(n, 1, td) : Math.max(1, td - (n % td)))}`;
 S.money.tx = [tx('in', 2400, 'salary', dd(1), 'Salary'), tx('in', 180, 'side', dd(10), 'Etsy sales'), tx('out', 64.2, 'food', dd(2), 'Groceries for the week'), tx('out', 38, 'food', dd(6), 'Brunch with Mia'), tx('out', 89.99, 'bills', dd(3), 'Electricity'),
  tx('out', 42, 'home', dd(5), 'Storage baskets'), tx('out', 15.99, 'fun', dd(7), 'Streaming'), tx('out', 55, 'self', dd(8), 'Haircut'), tx('out', 36.5, 'transport', dd(9), 'Fuel'), tx('out', 71.3, 'food', dd(12), 'Groceries'), tx('out', 24, 'fun', dd(13), 'Cinema'), tx('out', 18.4, 'home', dd(4), 'Candles & plants')];
 S.money.bills = [{ id: uid(), name: 'Rent', amt: 950, day: 1, paid: { [M]: 1 } }, { id: uid(), name: 'Phone', amt: 25, day: 12, paid: { [M]: 1 } }, { id: uid(), name: 'Internet', amt: 40, day: 18, paid: {} }, { id: uid(), name: 'Gym membership', amt: 32, day: 24, paid: {} }];
 S.admin = [{ id: uid(), title: 'Renew passport', cat: 'renew', due: A(20), status: 'doing', prio: 'high', notes: 'Photos first; form can be a separate step.' }, { id: uid(), title: 'Place a library hold', cat: 'health', due: A(1), status: 'todo', prio: 'low', notes: '' },
  { id: uid(), title: 'Check the reading subscription', cat: 'subs', due: A(-2), status: 'done', prio: 'med', notes: 'Kept it after checking the price.' }, { id: uid(), title: 'Car insurance renewal', cat: 'home', due: A(9), status: 'todo', prio: 'high', notes: '' }, { id: uid(), title: 'Vet check-up for Luna', cat: 'family', due: A(15), status: 'todo', prio: 'med', notes: '' }];
 S.rooms[0].steps[0].done = true; S.rooms[0].steps[1].done = true; S.rooms[1].steps[0].done = true;
 S.rooms.push({ id: uid(), name: 'Creative corner', icon: '🎨', color: 'lav', steps: [{ id: uid(), t: 'Put pens back in the jar', done: true }, { id: uid(), t: 'Stack the sketchbooks', done: true }, { id: uid(), t: 'Clear the desk surface', done: true }, { id: uid(), t: 'Empty the bin', done: false }] });
 S.reviews[weekStart(A(-7))] = { wins: 'Finished the proposal draft. Walked 4 times.', hard: 'Late nights midweek.', lessons: 'Brain dump first thing helps.', next: 'Protect two focus blocks.', rate: 7 };
}
/* views */
const NAV = [
 ['Plan', [['today', 'Today', 'sun'], ['dump', 'Brain Dump', 'cloud'], ['tasks', 'Tasks', 'list'], ['calendar', 'Calendar', 'cal'], ['routines', 'Gentle Routines', 'flower'], ['habits', 'Habit Tracker', 'spark']]],
 ['Grow', [['goals', 'Goals & Projects', 'target'], ['focus', 'Focus Space', 'timer'], ['mood', 'Mood & Energy', 'smile'], ['selfcare', 'Self-Care', 'heart'], ['journal', 'Journal', 'book'], ['dopamine', 'Dopamine Menu', 'candy']]],
 ['Home & Life', [['home', 'Home Reset', 'home'], ['meals', 'Meals & Groceries', 'fork'], ['money', 'Budget & Money', 'wallet'], ['admin', 'Life Admin', 'folder'], ['review', 'Weekly Review', 'review'], ['settings', 'Settings', 'gear']]]];
const TITLES = { today: ['Dashboard', 'Today'], dump: ['Brain Dump', 'Unload'], tasks: ['Tasks', 'All tasks'], calendar: ['Calendar', 'Schedule'], routines: ['Gentle Routines', 'Rhythms'], habits: ['Habit Tracker', 'Rituals'],
 goals: ['Goals & Projects', 'Step by step'], focus: ['Focus Space', 'Deep flow'], mood: ['Mood & Energy', 'Wellness'], selfcare: ['Self-Care', 'Recharge'], journal: ['Journal & Gratitude', 'Reflect'], dopamine: ['Dopamine Menu', 'Feel-good'],
 home: ['Home Reset', 'Spaces'], meals: ['Meals & Groceries', 'Nourish'], money: ['Budget & Money', 'Finance'], admin: ['Life Admin', 'Organizer'], review: ['Weekly Review', 'Reset'], settings: ['Settings', 'Personalize'] };
const UI = { view: 'today', cal: TODAY().slice(0, 7), calSel: TODAY(), taskTab: 'today', dumpTag: 'all', goalTab: 'active', mealTab: 'plan', mealWeek: TODAY(), moneyMonth: TODAY().slice(0, 7), moneyTab: 'out', adminTab: 'all', moodDay: TODAY(), moodRange: 7, routineTab: 'all', habitDay: TODAY() };

/* charts */
function bars(vals, labels, color = 'var(--pri)', h = 90, hi = -1) {
 const mx = Math.max(1, ...vals), w = 100 / vals.length;
 return `<svg class="svgc" viewBox="0 0 100 ${h / 3 + 8}" preserveAspectRatio="none" style="height:${h}px">${vals.map((v, i) => { const bh = v / mx * (h / 3 - 2); return `<rect x="${i * w + w * .22}" y="${h / 3 - bh}" width="${w * .56}" height="${Math.max(bh, .8)}" rx="1.6" fill="${color}" opacity="${i === hi ? 1 : .55}"/>`; }).join('')}</svg>
 <div class="row" style="justify-content:space-around">${labels.map(l => `<span class="tiny muted">${l}</span>`).join('')}</div>`;
}
function line(vals, labels, h = 120) {
 const n = vals.length, pts = vals.map((v, i) => v == null ? null : [i / (n - 1) * 100, 38 - (v - 1) / 4 * 32]);
 const seg = pts.filter(Boolean).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
 return `<svg class="svgc" viewBox="0 0 100 42" preserveAspectRatio="none" style="height:${h}px"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--pri)" stop-opacity=".35"/><stop offset="1" stop-color="var(--pri)" stop-opacity="0"/></linearGradient></defs>
 ${[6, 14, 22, 30, 38].map(y => `<line x1="0" x2="100" y1="${y}" y2="${y}" stroke="var(--line)" stroke-width=".3"/>`).join('')}
 ${seg ? `<path d="${seg} L100 42 L0 42Z" fill="url(#lg)" opacity=".7"/><path d="${seg}" fill="none" stroke="var(--pri)" stroke-width="1.2" vector-effect="non-scaling-stroke" style="stroke-width:2.5px"/>` : ''}
 ${pts.map(p => p ? `<circle cx="${p[0]}" cy="${p[1]}" r="1.3" fill="var(--pri)"/>` : '').join('')}</svg>
 <div class="row" style="justify-content:space-between">${labels.map(l => `<span class="tiny muted">${l}</span>`).join('')}</div>`;
}
function donut(parts, size = 150) {
 const tot = sum(parts.map(p => p[1])) || 1; let a = -Math.PI / 2, out = '';
 for (const [c, v] of parts) { const b = a + v / tot * Math.PI * 2, r = 40, x1 = 50 + r * Math.cos(a), y1 = 50 + r * Math.sin(a), x2 = 50 + r * Math.cos(b), y2 = 50 + r * Math.sin(b);
  if (v > 0) out += `<path d="M${x1} ${y1} A${r} ${r} 0 ${b - a > Math.PI ? 1 : 0} 1 ${x2} ${y2}" stroke="${c}" stroke-width="14" fill="none"/>`; a = b; }
 return `<svg viewBox="0 0 100 100" style="width:${size}px;height:${size}px">${out || '<circle cx="50" cy="50" r="40" stroke="var(--line)" stroke-width="14" fill="none"/>'}</svg>`;
}
const progRing = (p, txt, c = 'var(--lav)') => `<div style="position:relative;width:54px;height:54px"><svg viewBox="0 0 36 36" style="transform:rotate(-90deg)"><circle cx="18" cy="18" r="15" fill="none" stroke="var(--line)" stroke-width="3.2"/><circle cx="18" cy="18" r="15" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="${p * .942} 100"/></svg><b style="position:absolute;inset:0;display:grid;place-items:center;font-size:12px">${txt}</b></div>`;
const empty = (e, t) => `<div class="empty"><div class="e">${e}</div>${t}</div>`;
const ck = (on, a, id, extra = '', round) => `<button class="ck ${round ? 'round' : ''} ${on ? 'on' : ''}" data-a="${a}" data-id="${id}" ${extra} aria-label="toggle">${ic('check')}</button>`;
const acts = (edit, del, id) => `<div class="acts">${edit ? `<button class="icon-btn" data-a="${edit}" data-id="${id}" title="Edit">${ic('edit')}</button>` : ''}${del ? `<button class="icon-btn" data-a="${del}" data-id="${id}" title="Delete">${ic('trash')}</button>` : ''}</div>`;
const col = c => COLORS[c] || c || COLORS.rose;
const soft = c => `color-mix(in srgb, ${col(c)} 16%, transparent)`;

/* derived */
const todayTasks = () => S.tasks.filter(t => t.date && t.date <= TODAY() && (!t.done || t.doneAt === TODAY()));
const doneOn = d => S.tasks.filter(t => t.done && t.doneAt === d).length;
function habitDue(h, d) { const wd = D(d).getDay(); return h.freq === 'weekdays' ? wd > 0 && wd < 6 : h.freq === 'weekends' ? wd === 0 || wd === 6 : true; }
function habitStats(h) {
 let due = 0, hit = 0; for (let i = 0; i < 7; i++) { const d = addDays(TODAY(), -i); if (habitDue(h, d)) { due++; if (h.log[d]) hit++; } }
 let st = 0, d = TODAY(); if (!h.log[d]) d = addDays(d, -1); while (st < 999) { if (habitDue(h, d)) { if (h.log[d]) st++; else break; } d = addDays(d, -1); }
 return { rate: pct(hit, due), streak: st };
}
function habitConsistency() { const hs = S.habits; return hs.length ? Math.round(sum(hs.map(h => habitStats(h).rate)) / hs.length) : 0; }
function goalProg(g) { return pct(g.steps.filter(s => s.done).length, g.steps.length); }
const focusMins = d => sum(S.focus.filter(f => f.date === d).map(f => f.mins));
function scWeekMins() { const ws = addDays(TODAY(), -6); return S.selfcare.filter(s => s.done && s.date >= ws && s.date <= TODAY()); }
function upcoming(days = 7) {
 const t = TODAY(), end = addDays(t, days), out = [];
 S.events.filter(e => e.date >= t && e.date <= end).forEach(e => out.push({ d: e.date, t: e.title, s: e.time || 'All day', c: e.color, k: 'Event' }));
 S.admin.filter(a => a.status !== 'done' && a.due && a.due <= end).forEach(a => out.push({ d: a.due, t: a.title, s: a.due < t ? 'Overdue' : 'Life admin', c: ADMIN_CATS[a.cat]?.[1], k: 'Admin' }));
 const M = ym(t); S.money.bills.filter(b => !b.paid[M]).forEach(b => { const d = `${M}-${pad(clamp(b.day, 1, 28))}`; if (d <= end) out.push({ d, t: b.name + ' · ' + money(b.amt), s: d < t ? 'Bill overdue' : 'Bill due', c: 'gold', k: 'Bill' }); });
 return out.sort((a, b) => a.d.localeCompare(b.d));
}
function nextStep() {
 const en = S.energy[TODAY()] || 'med', open = todayTasks().filter(t => !t.done);
 const ok = t => en === 'low' ? (t.energy === 'low' || t.est <= 15) : en === 'high' ? true : t.energy !== 'high' || t.prio === 'high';
 const rank = t => (t.prio === 'high' ? 0 : t.prio === 'med' ? 1 : 2) + (en === 'high' && t.energy === 'high' ? -1 : 0);
 return open.filter(ok).sort((a, b) => rank(a) - rank(b))[0] || open[0];
}
function badge(v) { const m = { dump: S.dumps.length, tasks: S.tasks.filter(t => !t.done).length, calendar: S.events.filter(e => e.date >= TODAY() && e.date <= addDays(TODAY(), 7)).length, habits: S.habits.length, routines: S.routines.length, goals: S.goals.filter(g => !g.archived).length, home: S.rooms.length, meals: S.meals.grocery.filter(g => !g.done).length, admin: S.admin.filter(a => a.status !== 'done').length, today: todayTasks().filter(t => !t.done).length };
 if (v === 'mood') return S.moods[TODAY()] ? '<span class="cnt" style="background:var(--mintSoft);color:var(--mint)">Done</span>' : '<span class="cnt">Check-in</span>';
 return m[v] ? `<span class="cnt">${m[v]}</span>` : ''; }


function shell(body) {
 const [title, chip] = TITLES[UI.view]; const rem = todayTasks().filter(t => !t.done).length;
 return `${DEMO ? `<div class="banner">🌸 You're exploring the free demo with sample data — changes reset when you close the tab. <a href="https://www.etsy.com/listing/4609011775/adhd-life-planner-app-all-in-one-digital" target="_blank" rel="noopener">Get the full planner →</a></div>` : ''}
 <div class="app"><aside class="side" id="side">
  <div class="brand"><div class="logo">${ic('flower')}</div><div><b>World Trade Net</b><small>Bloom · Life Planner</small></div></div>
  <div class="focuscard"><div class="k">${ic('spark', '').replace('<svg', '<svg width="12" height="12"')} Daily focus <span class="chip" style="padding:1px 7px;font-size:9.5px">${rem} remaining</span></div><div class="v">${esc(S.settings.focus || 'Gentle focus for today.')}</div></div>
  ${NAV.map(([g, items]) => `<div class="navlbl">${g}</div><nav class="nav">${items.map(([k, n, i]) => `<a href="#${k}" class="${UI.view === k ? 'on' : ''}">${ic(i)}${n}${badge(k)}</a>`).join('')}</nav>`).join('')}
  <div class="sidefoot"><button class="btn sm" data-a="quick">${ic('plus')}Quick capture</button>
   <div class="me"><div class="av">${esc((S.settings.name || 'You')[0].toUpperCase())}</div><div style="flex:1"><b>${esc(S.settings.name || 'Explorer')}</b><small>${S.settings.theme === 'moonlight' ? 'Moonlight mode' : 'Soft bloom pace'}</small></div>
   <button class="icon-btn" data-a="theme" title="Switch theme">${ic(S.settings.theme === 'moonlight' ? 'sun' : 'moon')}</button></div></div>
 </aside>
 <main class="main"><div class="top"><button class="icon-btn ham" data-a="menu">${ic('menu')}</button><h1>${title}</h1><span class="chip hide-m">${chip}</span><span class="muted small hide-m">${fmt(TODAY(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span><span class="sp"></span>
  <button class="btn sm hide-m" data-a="backup">${ic('db')}Backup</button><button class="btn pri sm" data-a="addtask">${ic('plus')}Add task</button></div>
  <div id="view">${body}</div></main></div>
 <button class="fab" data-a="quick">${ic('plus')}</button>`;
}

/* TODAY */
function taskRow(t, opt = {}) {
 const en = { low: ['Low', 'mint'], med: ['Med', 'gold'], high: ['High', 'rose'] }[t.energy] || ['Med', 'gold'];
 return `<div class="item ${t.done ? 'done' : ''}">${ck(t.done, 'task', t.id)}<div class="t"><b>${esc(t.title)}</b><small>${opt.date && t.date ? fmt(t.date) + ' · ' : ''}${esc(t.area || '')}${t.est ? ' · ' + t.est + ' min' : ''}${t.prio === 'high' ? ' · <span style="color:var(--pri);font-weight:700">Priority</span>' : ''}</small></div>
 <span class="pill"><span class="dot" style="background:var(--${en[1]})"></span>${en[0]}</span>${acts('edittask', 'deltask', t.id)}</div>`;
}
function vToday() {
 const t = TODAY(), tt = todayTasks(), done = tt.filter(x => x.done).length, en = S.energy[t] || '', ns = nextStep();
 const wk = [...Array(7)].map((_, i) => addDays(t, i - 6)), wkDone = wk.map(doneOn), fm = wk.map(focusMins);
 const sc = scWeekMins(), hc = habitConsistency(), goals = S.goals.filter(g => !g.archived), gm = goals.length ? Math.round(sum(goals.map(goalProg)) / goals.length) : 0;
 const water = S.water[t] || 0, wg = S.settings.water || 8, mood = S.moods[t];
 const hDue = S.habits.filter(h => habitDue(h, t)), hDone = hDue.filter(h => h.log[t]).length;
 const up = upcoming(7).slice(0, 6);
 const start = !DEMO && !S.start.hide ? startHere() : '';
 return `${start}<div class="hero"><div class="grid" style="grid-template-columns:1.4fr 1fr;align-items:center;gap:20px">
  <div><span class="chip">${ic('sun', '').replace('<svg', '<svg width="12" height="12"')} Today · ${fmt(t, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
   <h2><span class="script">${greet()},</span> ${esc(S.settings.name || 'friend')}</h2>
   <p>${done} of ${tt.length} tasks completed today. Honour your natural pace.</p>
   <div class="row" style="margin-top:14px"><button class="btn pri" data-a="addtask">${ic('plus')}Add task for today</button><button class="btn" data-a="go" data-id="dump">${ic('cloud')}Brain dump</button></div></div>
  <div><div class="row" style="justify-content:space-between;margin-bottom:6px"><span class="small" style="font-weight:700">Daily energy rhythm</span><span class="tiny muted">Choose your pace</span></div>
   <div class="energy">${ENERGY.map(e => `<button class="${en === e.k ? 'on' : ''}" data-a="energy" data-id="${e.k}">${ic('bolt', '').replace('<svg', '<svg width="13" height="13"')}<b>${e.n}</b><small>${e.d}</small></button>`).join('')}</div></div></div></div>
 <div class="card tint" style="margin-top:16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap"><div class="emo" style="width:44px;height:44px;font-size:22px">🌱</div>
  <div style="flex:1;min-width:200px"><div class="eyebrow">Your one next step${en ? ' · matched to ' + ENERGY.find(e => e.k === en).n.toLowerCase() : ''}</div><div style="font:600 18px Playfair;margin-top:2px">${ns ? esc(ns.title) : 'Nothing waiting — enjoy the space ✨'}</div>${ns ? `<div class="small muted">${ns.est || 15} minutes is enough to start. You can stop after that.</div>` : ''}</div>
  ${ns ? `<button class="btn" data-a="focusTask" data-id="${ns.id}">${ic('timer')}Focus on it</button><button class="btn pri" data-a="task" data-id="${ns.id}">${ic('check')}Done</button>` : ''}</div>
 <div class="grid g4" style="margin-top:16px">
  ${statCard("Today's tasks", tt.length, 'tasks scheduled', 'lav', 'list', 'Scheduled for today')}
  ${statCard('Completed today', done, pct(done, tt.length) + '% done', 'mint', 'check', `<div class="bar mint" style="margin-top:6px"><i style="width:${pct(done, tt.length)}%"></i></div>`)}
  ${statCard('Remaining', tt.length - done, 'tasks left', 'peach', 'clock', 'Gentle focus items left')}
  ${statCard('Focus today', focusMins(t), 'min', 'sky', 'timer', S.focus.filter(f => f.date === t).length + ' sessions recorded')}</div>
 <div class="grid" style="grid-template-columns:1.35fr 1fr;margin-top:16px">
  <div class="col" style="gap:16px">
   <div class="card"><div class="ch"><h3>Today's tasks</h3><span class="chip grey">${done}/${tt.length}</span><span class="sp"></span><button class="btn sm ghost" data-a="go" data-id="tasks">All tasks ${ic('arrow')}</button></div>
    <form class="qa" data-form="qtask" style="margin-bottom:10px"><input class="in" name="t" placeholder="Add a gentle task for today…" autocomplete="off"><button class="btn pri">${ic('plus')}</button></form>
    <div class="list">${tt.length ? tt.sort((a, b) => a.done - b.done).map(x => taskRow(x)).join('') : empty('🌷', 'No tasks yet. Add one tiny thing.')}</div></div>
   <div class="grid g3">
    <div class="card"><div class="ch"><h3>Weekly momentum</h3><span class="sp"></span>${ic('trend', '').replace('<svg', '<svg width="16" height="16" style="color:var(--pri)"')}</div><div class="stat"><span class="n">${sum(wkDone)}</span><span class="l">tasks completed · last 7 days</span></div>${bars(wkDone, wk.map(d => fmt(d, { weekday: 'narrow' })), 'var(--pri)', 70, 6)}</div>
    <div class="card"><div class="ch"><h3>Focus rhythm</h3><span class="sp"></span>${ic('timer', '').replace('<svg', '<svg width="16" height="16" style="color:var(--sky)"')}</div><div class="stat"><span class="n">${sum(fm)} <span class="small muted">min</span></span><span class="l">${S.focus.filter(f => wk.includes(f.date)).length} sessions recorded</span></div>
     <div class="row" style="margin-top:12px;justify-content:space-between"><div class="small"><b>Days with focus</b><br><span class="muted tiny">${fm.filter(Boolean).length} of 7 days</span></div>${progRing(pct(fm.filter(Boolean).length, 7), fm.filter(Boolean).length + '/7')}</div></div>
    <div class="card mint"><div class="ch"><h3>Calm progress</h3><span class="sp"></span>${ic('heart', '').replace('<svg', '<svg width="16" height="16" style="color:var(--mint)"')}</div><div class="stat"><span class="n">${sum(sc.map(s => s.mins))} <span class="small muted">min</span></span><span class="l">of self-care · ${sc.length} sessions</span></div>
     <div class="row small" style="justify-content:space-between;margin-top:14px"><span>Weekly goal</span><b>${pct(sum(sc.map(s => s.mins)), 120)}%</b></div><div class="bar mint"><i style="width:${clamp(pct(sum(sc.map(s => s.mins)), 120), 0, 100)}%"></i></div></div></div>
   <div class="grid g2"><div class="card lav"><div class="ch"><h3>Habit consistency</h3><span class="sp"></span><b style="font:600 20px Playfair">${hc}%</b></div><div class="small muted">${hDone} of ${hDue.length} habits checked in today</div><div class="bar lav" style="margin-top:10px"><i style="width:${hc}%"></i></div></div>
    <div class="card peach"><div class="ch"><h3>Goal momentum</h3><span class="sp"></span><b style="font:600 20px Playfair">${gm}%</b></div><div class="small muted">${sum(goals.map(g => g.steps.filter(s => s.done).length))} of ${sum(goals.map(g => g.steps.length))} milestones complete</div><div class="bar peach" style="margin-top:10px"><i style="width:${gm}%"></i></div></div></div>
  </div>
  <div class="col" style="gap:16px">
   <div class="card"><div class="ch"><h3>How are you feeling?</h3><span class="sp"></span>${mood ? '<span class="chip mint">Checked in</span>' : ''}</div>
    <div class="moods">${MOODS.map(m => `<button class="${mood && mood.mood === m.v ? 'on' : ''}" data-a="quickmood" data-id="${m.v}"><span class="m">${m.e}</span><b>${m.n}</b></button>`).join('')}</div></div>
   <div class="card"><div class="ch"><h3>Today's habits</h3><span class="sp"></span><button class="btn sm ghost" data-a="go" data-id="habits">Open ${ic('arrow')}</button></div><div class="list">${hDue.length ? hDue.map(h => `<div class="item ${h.log[t] ? 'done' : ''}"><span class="emo">${h.emoji}</span><div class="t"><b>${esc(h.name)}</b><small>🔥 ${habitStats(h).streak} day streak</small></div>${ck(h.log[t], 'habit', h.id, `data-d="${t}"`, 1)}</div>`).join('') : empty('✨', 'Add a habit to see it here')}</div></div>
   <div class="card sky"><div class="ch"><h3>Water</h3><span class="sub">${water} of ${wg} glasses</span><span class="sp"></span></div><div class="row wrap" style="gap:6px">${[...Array(wg)].map((_, i) => `<button class="hcell ${i < water ? 'on' : ''}" style="${i < water ? 'background:var(--sky)' : ''}" data-a="water" data-id="${i + 1}">${ic('drop')}</button>`).join('')}</div></div>
   <div class="card"><div class="ch"><h3>Coming up</h3><span class="sub">next 7 days</span><span class="sp"></span><button class="btn sm ghost" data-a="go" data-id="calendar">${ic('cal')}</button></div><div class="list">${up.length ? up.map(u => `<div class="item"><span class="dot" style="background:${col(u.c)}"></span><div class="t"><b>${esc(u.t)}</b><small>${u.d === t ? 'Today' : fmt(u.d)} · ${u.s}</small></div></div>`).join('') : empty('🗓️', 'A quiet week ahead')}</div></div>
   ${routineMini()}
  </div></div>`;
}
function statCard(k, n, unit, c, icon, foot) { return `<div class="card ${c}"><div class="ch" style="margin-bottom:6px"><span class="small" style="font-weight:700">${k}</span><span class="sp"></span><span class="icon-btn" style="background:var(--glass)">${ic(icon)}</span></div><div class="stat"><span class="n">${n} <span class="small muted" style="font-family:Jakarta">${unit}</span></span><span class="l">${foot}</span></div></div>`; }
function routineMini() { const t = TODAY(); const rs = S.routines; if (!rs.length) return ''; return `<div class="card"><div class="ch"><h3>Routines today</h3><span class="sp"></span><button class="btn sm ghost" data-a="go" data-id="routines">Open ${ic('arrow')}</button></div><div class="col">${rs.map(r => { const d = (r.log[t] || []).length; return `<div><div class="row small" style="justify-content:space-between"><b>${esc(r.name)}</b><span class="muted">${d}/${r.steps.length}</span></div><div class="bar" style="margin-top:4px"><i style="width:${pct(d, r.steps.length)}%"></i></div></div>`; }).join('')}</div></div>`; }
function startHere() {
 const s = [['name', 'Add your name', !!S.settings.name, 'settings'], ['task', 'Add 3 tasks for today', todayTasks().length >= 3, 'tasks'], ['habit', 'Create your first habit', S.habits.length > 0, 'habits'], ['mood', 'Do a mood check-in', Object.keys(S.moods).length > 0, 'mood'], ['money', 'Set a monthly budget', S.money.budget > 0, 'money'], ['backup', 'Download a backup', !!S.start.backup, 'settings']];
 const d = s.filter(x => x[2]).length;
 return `<div class="card tint" style="margin-bottom:16px"><div class="ch"><div class="eyebrow">${ic('flag', '').replace('<svg', '<svg width="12" height="12"')} Start here</div><span class="chip">${d} of ${s.length} done</span><span class="sp"></span><button class="btn sm" data-a="loadsample">Explore with sample data</button><button class="icon-btn" data-a="hidestart" title="Hide">${ic('x')}</button></div>
 <div class="grid g3" style="gap:8px">${s.map(x => `<a href="#${x[3]}" class="item ${x[2] ? 'done' : ''}" style="text-decoration:none;color:inherit"><span class="ck ${x[2] ? 'on' : ''}">${ic('check')}</span><div class="t"><b>${x[1]}</b></div></a>`).join('')}</div></div>`;
}

/* BRAIN DUMP */
const DTAGS = { idea: ['💡 Idea', 'gold'], todo: ['✅ To-do', 'mint'], reminder: ['🔔 Reminder', 'sky'], worry: ['☁️ Worry', 'lav'], note: ['📝 Note', 'rose'] };
function vDump() {
 const ds = S.dumps.filter(d => UI.dumpTag === 'all' || d.tag === UI.dumpTag);
 return `<div class="hero"><div class="eyebrow">${ic('cloud', '').replace('<svg', '<svg width="13" height="13"')} Empty your mind</div><h2>Let it all <span class="script">out</span></h2><p>Write down every thought, worry and idea — one per line. Sort it later, or never. Your brain can rest now.</p>
 <form data-form="dump" style="margin-top:14px"><textarea class="in" name="t" placeholder="Call the vet… buy birthday card… idea for the living room… worried about the deadline…" style="min-height:110px;background:var(--glass)"></textarea>
 <div class="row wrap" style="margin-top:10px"><select class="in" name="tag" style="width:auto">${Object.entries(DTAGS).map(([k, v]) => `<option value="${k}">${v[0]}</option>`).join('')}</select><span class="small muted">Tip: each new line becomes its own note</span><span class="sp" style="flex:1"></span><button class="btn pri">${ic('plus')}Unload</button></div></form></div>
 <div class="row wrap" style="margin:16px 0 12px"><div class="seg">${[['all', 'All']].concat(Object.entries(DTAGS).map(([k, v]) => [k, v[0]])).map(([k, n]) => `<button class="${UI.dumpTag === k ? 'on' : ''}" data-a="dumptag" data-id="${k}">${n}</button>`).join('')}</div><span class="sp" style="flex:1"></span><span class="small muted">${S.dumps.length} thoughts captured</span></div>
 <div class="grid g3">${ds.length ? ds.map(d => { const tg = DTAGS[d.tag] || DTAGS.note; return `<div class="card" style="background:linear-gradient(160deg,${soft(tg[1])},var(--glass));padding:14px"><div class="row"><span class="chip" style="background:var(--glass);color:${col(tg[1])}">${tg[0]}</span><span class="sp" style="flex:1"></span><span class="tiny muted">${fmt(d.created, { month: 'short', day: 'numeric' })}</span></div>
  <div style="margin:10px 0 12px;font-size:14.5px">${esc(d.text)}</div><div class="row wrap" style="gap:6px"><button class="btn sm" data-a="dump2task" data-id="${d.id}">${ic('list')}Make task</button><button class="btn sm" data-a="dump2goal" data-id="${d.id}">${ic('target')}Goal</button><span class="sp" style="flex:1"></span>${acts('editdump', 'deldump', d.id)}</div></div>`; }).join('') : `<div class="card" style="grid-column:1/-1">${empty('☁️', 'Your mind is clear. Nothing captured here yet.')}</div>`}</div>`;
}

/* TASKS */
function vTasks() {
 const t = TODAY(); const tabs = { today: ['Today', S.tasks.filter(x => !x.done && x.date && x.date <= t)], up: ['Upcoming', S.tasks.filter(x => !x.done && x.date > t)], some: ['Someday', S.tasks.filter(x => !x.done && !x.date)], done: ['Done', S.tasks.filter(x => x.done)] };
 const [, list] = tabs[UI.taskTab]; const sorted = list.slice().sort((a, b) => (a.date || '9').localeCompare(b.date || '9') || (a.prio === 'high' ? -1 : 1));
 const groups = {}; sorted.forEach(x => { const k = UI.taskTab === 'done' ? (x.doneAt || '') : x.date ? (x.date < t ? 'Overdue' : x.date) : 'Someday'; (groups[k] = groups[k] || []).push(x); });
 return `<div class="row wrap" style="margin-bottom:14px"><div class="seg">${Object.entries(tabs).map(([k, [n, l]]) => `<button class="${UI.taskTab === k ? 'on' : ''}" data-a="tasktab" data-id="${k}">${n} <span class="muted">${l.length}</span></button>`).join('')}</div><span style="flex:1"></span><button class="btn pri" data-a="addtask">${ic('plus')}New task</button></div>
 <div class="grid" style="grid-template-columns:1.6fr 1fr"><div class="card"><form class="qa" data-form="qtask2" style="margin-bottom:14px"><input class="in" name="t" placeholder="Quick add — press Enter" autocomplete="off"><select class="in" name="w" style="width:auto"><option value="today">Today</option><option value="tomorrow">Tomorrow</option><option value="some">Someday</option></select><button class="btn pri">${ic('plus')}</button></form>
 ${Object.keys(groups).length ? Object.entries(groups).map(([k, l]) => `<div class="small" style="font-weight:700;margin:12px 0 6px;color:${k === 'Overdue' ? 'var(--pri)' : 'var(--sub)'}">${k === 'Overdue' || k === 'Someday' ? k : k ? (k === t ? 'Today' : fmt(k, { weekday: 'long', month: 'short', day: 'numeric' })) : ''}</div><div class="list">${l.map(x => taskRow(x)).join('')}</div>`).join('') : empty('🌸', 'Nothing here. Breathe.')}</div>
 <div class="col" style="gap:16px"><div class="card lav"><div class="ch"><h3>By life area</h3></div>${AREAS.map(a => { const all = S.tasks.filter(x => x.area === a), d = all.filter(x => x.done).length; return all.length ? `<div style="margin-bottom:9px"><div class="row small" style="justify-content:space-between"><b>${a}</b><span class="muted">${d}/${all.length}</span></div><div class="bar lav"><i style="width:${pct(d, all.length)}%"></i></div></div>` : ''; }).join('') || empty('📂', 'Areas appear as you add tasks')}</div>
 <div class="card"><div class="ch"><h3>ADHD-friendly tips</h3></div><div class="col small"><div>🌱 Keep today's list to 3–5 things. Everything else can live in Upcoming or Someday.</div><div>⏱️ Add an estimate. Small numbers make starting easier.</div><div>⚡ Tag energy so the Today page can suggest the right next step.</div></div></div></div></div>`;
}

/* CALENDAR */
function itemsOn(d) {
 const out = S.events.filter(e => e.date === d).map(e => ({ t: (e.time ? e.time + ' ' : '') + e.title, c: e.color, k: 'ev', id: e.id }));
 S.tasks.filter(x => x.date === d).forEach(x => out.push({ t: x.title, c: x.done ? 'sage' : 'rose', k: 'task', id: x.id, done: x.done }));
 S.admin.filter(a => a.due === d && a.status !== 'done').forEach(a => out.push({ t: a.title, c: 'peach', k: 'admin', id: a.id }));
 S.money.bills.forEach(b => { if (`${ym(d)}-${pad(clamp(b.day, 1, 28))}` === d) out.push({ t: b.name + ' bill', c: 'gold', k: 'bill', id: b.id }); });
 return out;
}
function vCalendar() {
 const [y, m] = UI.cal.split('-').map(Number), first = new Date(y, m - 1, 1), ws = S.settings.weekStart ?? 1, off = (first.getDay() - ws + 7) % 7;
 const start = addDays(iso(first), -off), cells = [...Array(42)].map((_, i) => addDays(start, i)), t = TODAY(), sel = UI.calSel;
 const dn = [...Array(7)].map((_, i) => fmt(addDays(start, i), { weekday: 'short' }));
 const items = itemsOn(sel);
 return `<div class="grid" style="grid-template-columns:2.1fr 1fr"><div class="card"><div class="ch"><button class="icon-btn" data-a="calnav" data-id="-1">${ic('left')}</button><h3 style="font:600 20px Playfair;min-width:170px;text-align:center">${first.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3><button class="icon-btn" data-a="calnav" data-id="1">${ic('right')}</button><span class="sp"></span><button class="btn sm" data-a="caltoday">Today</button><button class="btn sm pri" data-a="addevent">${ic('plus')}Event</button></div>
 <div class="cal">${dn.map(d => `<div class="dn">${d}</div>`).join('')}${cells.map(d => { const its = itemsOn(d); return `<div class="d ${ym(d) !== UI.cal ? 'o' : ''} ${d === t ? 'today' : ''} ${d === sel ? 'sel' : ''}" data-a="calsel" data-id="${d}"><span class="num">${+d.slice(8)}</span>${its.slice(0, 3).map(i => `<span class="ev" style="background:${soft(i.c)};color:${col(i.c)};${i.done ? 'text-decoration:line-through;opacity:.6' : ''}">${esc(i.t)}</span>`).join('')}${its.length > 3 ? `<span class="tiny muted ev more">+${its.length - 3} more</span>` : ''}<span class="dots">${its.slice(0, 4).map(i => `<span class="dot" style="background:${col(i.c)};width:6px;height:6px"></span>`).join('')}</span></div>`; }).join('')}</div>
 <div class="row wrap small muted" style="margin-top:12px;gap:14px">${[['rose', 'Tasks'], ['lav', 'Events'], ['peach', 'Life admin'], ['gold', 'Bills']].map(([c, n]) => `<span class="row" style="gap:5px"><span class="dot" style="background:${col(c)}"></span>${n}</span>`).join('')}</div></div>
 <div class="col" style="gap:16px"><div class="card tint"><div class="eyebrow">Daily agenda</div><div style="font:600 22px Playfair;margin:4px 0 12px">${fmt(sel, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
  <div class="list">${items.length ? items.map(i => `<div class="item ${i.done ? 'done' : ''}"><span class="dot" style="background:${col(i.c)}"></span><div class="t"><b>${esc(i.t)}</b><small>${{ ev: 'Event', task: 'Task', admin: 'Life admin', bill: 'Bill' }[i.k]}</small></div>${i.k === 'ev' ? acts('editevent', 'delevent', i.id) : ''}</div>`).join('') : empty('🌙', 'Nothing planned — a gentle day')}</div>
  <div class="row" style="margin-top:12px;gap:8px"><button class="btn sm pri" data-a="addevent" data-d="${sel}">${ic('plus')}Event</button><button class="btn sm" data-a="addtask" data-d="${sel}">${ic('plus')}Task</button></div></div>
 <div class="card"><div class="ch"><h3>Next 14 days</h3></div><div class="list">${S.events.filter(e => e.date >= t && e.date <= addDays(t, 14)).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)).slice(0, 7).map(e => `<div class="item"><span class="dot" style="background:${col(e.color)}"></span><div class="t"><b>${esc(e.title)}</b><small>${fmt(e.date)}${e.time ? ' · ' + e.time : ''}</small></div></div>`).join('') || empty('🗓️', 'No events yet')}</div></div></div></div>`;
}

/* ROUTINES */
function vRoutines() {
 const t = TODAY(), rs = S.routines.filter(r => UI.routineTab === 'all' || r.slot === UI.routineTab);
 const tot = sum(S.routines.map(r => r.steps.length)), dn = sum(S.routines.map(r => (r.log[t] || []).length));
 const SL = { morning: ['Morning', 'gold', '☀️'], midday: ['Midday', 'mint', '🌤️'], evening: ['Evening', 'lav', '🌙'] };
 return `<div class="hero"><div class="row wrap" style="gap:16px"><div style="flex:1;min-width:240px"><div class="eyebrow">Guilt-free flow</div><h2>Gentle <span class="script">routines</span></h2><p>Soothing daily rhythms. No broken streaks — each day is a clean, fresh start.</p></div><button class="btn pri" data-a="addroutine">${ic('plus')}Create routine</button></div>
  <div class="card" style="margin-top:14px;padding:12px 16px"><div class="row small" style="justify-content:space-between"><span>🌸 Today's gentle momentum · ${fmt(t, { weekday: 'long', month: 'long', day: 'numeric' })}</span><b>${dn} of ${tot} steps (${pct(dn, tot)}%)</b></div><div class="bar mint" style="margin-top:8px"><i style="width:${pct(dn, tot)}%"></i></div><div class="tiny muted" style="margin-top:6px;font-style:italic">“Zero guilt. No backlog. Even one tiny step is showing up for yourself.”</div></div></div>
 <div class="row" style="margin:16px 0 12px"><div class="seg">${[['all', 'All']].concat(Object.entries(SL).map(([k, v]) => [k, v[2] + ' ' + v[0]])).map(([k, n]) => `<button class="${UI.routineTab === k ? 'on' : ''}" data-a="rtab" data-id="${k}">${n}</button>`).join('')}</div></div>
 <div class="grid g2">${rs.map(r => { const lg = r.log[t] || [], sl = SL[r.slot] || SL.morning; return `<div class="card" style="background:linear-gradient(160deg,${soft(sl[1])},var(--glass) 55%)"><div class="ch"><div><h3 style="font:600 18px Playfair">${esc(r.name)} <span class="chip" style="background:var(--glass);color:${col(sl[1])}">${sl[0].toUpperCase()}</span></h3><div class="small muted">${esc(r.note || '')}</div></div><span class="sp"></span><span class="pill">${ic('clock', '').replace('<svg', '<svg width="11" height="11"')} ~${sum(r.steps.map(s => s.m))}m</span>${acts('editroutine', 'delroutine', r.id)}</div>
  <div class="tiny muted" style="margin-bottom:8px">${lg.length} of ${r.steps.length} steps checked today</div>
  <div class="list">${r.steps.map(s => `<div class="item ${lg.includes(s.id) ? 'done' : ''}">${ck(lg.includes(s.id), 'rstep', r.id, `data-s="${s.id}"`, 1)}<div class="t"><b>${esc(s.t)}</b><small>${s.m || 1}m</small></div><button class="btn sm ghost" data-a="step2task" data-id="${r.id}" data-s="${s.id}">Make task ${ic('arrow')}</button><button class="icon-btn" data-a="delrstep" data-id="${r.id}" data-s="${s.id}">${ic('x')}</button></div>`).join('')}</div>
  <form class="qa" data-form="rstep" data-id="${r.id}" style="margin-top:10px"><input class="in" name="t" placeholder="+ Add step to ${esc(r.name)}"><input class="in" name="m" type="number" min="1" placeholder="min" style="width:70px"><button class="btn sm">${ic('plus')}</button></form></div>`; }).join('') || `<div class="card">${empty('🌙', 'No routines yet')}</div>`}</div>`;
}

/* HABITS */
function vHabits() {
 const t = TODAY(), wd = [...Array(7)].map((_, i) => addDays(UI.habitDay, i - 6)), due = S.habits.filter(h => habitDue(h, t)), dn = due.filter(h => h.log[t]).length, total = sum(S.habits.map(h => Object.keys(h.log).length));
 return `<div class="hero"><div class="row wrap"><div style="flex:1"><div class="eyebrow">Small steps, real progress</div><h2>Gentle <span class="script">habit</span> tracker</h2><p>Consistent rituals designed for peaceful momentum. No shame, no pressure — just gentle care.</p></div><button class="btn pri" data-a="addhabit">${ic('plus')}New habit</button></div>
 <div class="grid g3" style="margin-top:14px">${statCard("Today's completion", `${dn}/${due.length}`, 'scheduled', '', 'check', `<div class="bar mint" style="margin-top:6px"><i style="width:${pct(dn, due.length)}%"></i></div>`)}${statCard('Active habits', S.habits.length, '', '', 'spark', 'Consistency ' + habitConsistency() + '% this week')}${statCard('Completion history', total, 'check-ins', '', 'star', 'Every tick counts')}</div></div>
 <div class="card" style="margin-top:16px"><div class="ch"><h3>🔥 7-day consistency grid</h3><span class="sp"></span><button class="icon-btn" data-a="hweek" data-id="-7">${ic('left')}</button><span class="small" style="font-weight:600">${fmt(wd[0], { month: 'short', day: 'numeric' })} – ${fmt(wd[6], { month: 'short', day: 'numeric' })}</span><button class="icon-btn" data-a="hweek" data-id="7">${ic('right')}</button></div>
 <div style="overflow-x:auto"><table class="hgrid"><tr><th style="text-align:left">Habit</th>${wd.map(d => `<th style="${d === t ? 'color:var(--pri)' : ''}">${fmt(d, { weekday: 'short' })}<br><span style="font-weight:500">${+d.slice(8)}</span></th>`).join('')}<th>Consistency</th><th>Streak</th><th></th></tr>
 ${S.habits.map(h => { const st = habitStats(h); return `<tr><td><div class="row"><span class="emo">${h.emoji}</span><div><b class="small">${esc(h.name)}</b><div class="tiny muted">${{ daily: 'Daily', weekdays: 'Weekdays', weekends: 'Weekends' }[h.freq] || 'Daily'}</div></div></div></td>
  ${wd.map(d => habitDue(h, d) ? `<td><button class="hcell ${h.log[d] ? 'on' : ''}" style="${h.log[d] ? 'background:' + col(h.color) : ''}" data-a="habit" data-id="${h.id}" data-d="${d}" ${d > t ? 'disabled style="opacity:.35"' : ''}>${h.log[d] ? ic('check') : ''}</button></td>` : '<td class="muted">–</td>').join('')}
  <td><span class="chip mint">${st.rate}%</span></td><td><b class="small">🔥 ${st.streak}d</b></td><td>${acts('edithabit', 'delhabit', h.id)}</td></tr>`; }).join('')}</table></div>${S.habits.length ? '' : empty('🌿', 'Create your first tiny habit — like “a glass of water”.')}</div>`;
}

/* GOALS */
function vGoals() {
 const gs = S.goals.filter(g => UI.goalTab === 'active' ? !g.archived && goalProg(g) < 100 : UI.goalTab === 'done' ? goalProg(g) === 100 || g.archived : true);
 return `<div class="row wrap" style="margin-bottom:14px"><div class="seg">${[['active', 'Active'], ['done', 'Completed'], ['all', 'All']].map(([k, n]) => `<button class="${UI.goalTab === k ? 'on' : ''}" data-a="goaltab" data-id="${k}">${n}</button>`).join('')}</div><span style="flex:1"></span><button class="btn pri" data-a="addgoal">${ic('plus')}New goal</button></div>
 <div class="grid g3">${gs.map(g => { const p = goalProg(g); return `<div class="card" style="background:linear-gradient(160deg,${soft(g.color)},var(--glass) 60%)"><div class="ch"><span class="chip" style="background:var(--glass);color:${col(g.color)}">${esc(g.area || 'Life')}</span><span class="sp"></span>${acts('editgoal', 'delgoal', g.id)}</div>
  <div style="font:600 19px Playfair;margin-bottom:4px">${esc(g.title)}</div><div class="small muted">${g.due ? 'Target ' + fmt(g.due, { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + (diffDays(g.due, TODAY()) >= 0 ? diffDays(g.due, TODAY()) + ' days left' : 'past target') : 'No deadline'}</div>
  <div class="row" style="margin:12px 0 8px"><div class="bar" style="flex:1"><i style="width:${p}%;background:${col(g.color)}"></i></div><b class="small">${p}%</b></div>
  <div class="list">${g.steps.map(s => `<div class="item ${s.done ? 'done' : ''}" style="padding:7px 10px">${ck(s.done, 'gstep', g.id, `data-s="${s.id}"`, 1)}<div class="t"><b style="font-size:12.5px">${esc(s.t)}</b></div><button class="icon-btn" data-a="delgstep" data-id="${g.id}" data-s="${s.id}">${ic('x')}</button></div>`).join('')}</div>
  <form class="qa" data-form="gstep" data-id="${g.id}" style="margin-top:10px"><input class="in" name="t" placeholder="+ Next tiny step"><button class="btn sm">${ic('plus')}</button></form></div>`; }).join('') || `<div class="card" style="grid-column:1/-1">${empty('🎯', 'Turn a big dream into tiny, doable steps.')}</div>`}</div>`;
}

/* FOCUS */
const FT = { len: 25 * 60, left: 25 * 60, run: false, end: 0, label: '', taskId: '' };
function vFocus() {
 const t = TODAY(), fs = S.focus.filter(f => f.date === t), wins = S.tasks.filter(x => x.done && x.doneAt === t).length;
 const p = 1 - FT.left / FT.len, C = 2 * Math.PI * 100;
 return `<div class="grid g3" style="margin-bottom:16px">${statCard('Today', focusMins(t) + 'm', '', 'lav', 'clock', 'Focus minutes')}${statCard('Sessions', fs.length, 'completed', 'tint', 'timer', 'Today')}${statCard('Wins', wins, 'tasks conquered', 'mint', 'check', 'Today')}</div>
 <div class="grid" style="grid-template-columns:1.3fr 1fr"><div class="card" style="text-align:center"><div class="row" style="justify-content:center;gap:6px;flex-wrap:wrap">${[[15, '15m Quick'], [25, '25m Pomodoro'], [45, '45m Deep'], [60, '60m Flow']].map(([m, n]) => `<button class="btn sm ${FT.len === m * 60 ? 'pri' : ''}" data-a="fpreset" data-id="${m}">${n}</button>`).join('')}<input class="in" type="number" min="1" max="180" placeholder="custom" data-a2="fcustom" style="width:86px;padding:5px 9px"></div>
 <div class="ring"><svg viewBox="0 0 230 230"><circle cx="115" cy="115" r="100" fill="none" stroke="var(--priSoft)" stroke-width="12"/><circle id="fring" cx="115" cy="115" r="100" fill="none" stroke="url(#fg)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - p)}"/><defs><linearGradient id="fg"><stop offset="0" stop-color="var(--pri)"/><stop offset="1" stop-color="var(--lav)"/></linearGradient></defs></svg>
 <div class="c"><div><b id="ftime">${pad(Math.floor(FT.left / 60))}:${pad(FT.left % 60)}</b><span class="tiny muted" style="letter-spacing:1.5px;font-weight:700">${FT.run ? 'IN THE FLOW' : 'READY WHEN YOU ARE'}</span></div></div></div>
 <div class="row" style="justify-content:center"><button class="btn pri" data-a="fstart" style="padding:10px 26px">${ic(FT.run ? 'pause' : 'play')}${FT.run ? 'Pause' : 'Start focus'}</button><button class="icon-btn" data-a="freset" title="Reset" style="border:1px solid var(--line)">${ic('reset')}</button></div>
 <div class="f" style="max-width:380px;margin:18px auto 0;text-align:left"><label>Focus on an existing task <span style="float:right;font-weight:500">optional</span></label><select class="in" data-a2="ftask"><option value="">No task selected (pure open focus)</option>${S.tasks.filter(x => !x.done).map(x => `<option value="${x.id}" ${FT.taskId === x.id ? 'selected' : ''}>${esc(x.title)}</option>`).join('')}</select></div></div>
 <div class="col" style="gap:16px"><div class="card"><div class="ch"><h3>Recent focus sessions</h3><span class="sp"></span><span class="tiny muted">${S.focus.length} total logged</span></div><div class="list">${S.focus.slice().reverse().slice(0, 7).map(f => `<div class="item"><span class="emo">⏱️</span><div class="t"><b>${esc(f.label || 'Pure focus session')}</b><small>${f.date === t ? 'Today' : fmt(f.date)}</small></div><b class="small">${f.mins} min</b></div>`).join('') || empty('⏳', 'Your sessions will appear here')}</div></div>
 <div class="card lav"><div class="ch"><h3>Focus · last 7 days</h3></div>${(() => { const w = [...Array(7)].map((_, i) => addDays(t, i - 6)); return bars(w.map(focusMins), w.map(d => fmt(d, { weekday: 'narrow' })), 'var(--lav)', 80, 6); })()}</div></div></div>`;
}

/* MOOD */
function vMood() {
 const d = UI.moodDay, m = S.moods[d] || {}, n = UI.moodRange, days = [...Array(n)].map((_, i) => addDays(TODAY(), i - n + 1)), vals = days.map(x => S.moods[x]?.mood ?? null), got = vals.filter(v => v != null);
 const avg = got.length ? (sum(got) / got.length).toFixed(1) : '–';
 const hi = days.filter(x => S.moods[x]?.energy === 'high').map(x => S.moods[x].mood), lo = days.filter(x => S.moods[x]?.energy === 'low').map(x => S.moods[x].mood);
 const tagc = {}; days.forEach(x => (S.moods[x]?.tags || []).forEach(g => tagc[g] = (tagc[g] || 0) + 1)); const top = Object.entries(tagc).sort((a, b) => b[1] - a[1]).slice(0, 5);
 return `<div class="card tint"><div class="ch"><div><div class="eyebrow">${ic('heart', '').replace('<svg', '<svg width="12" height="12"')} Emotional wellness haven</div><div style="font:600 24px Playfair">Mood & energy</div><div class="small muted">Reflective daily check-ins, linked to your daily energy.</div></div><span class="sp"></span>
  <button class="icon-btn" data-a="moodday" data-id="-1">${ic('left')}</button><span class="chip grey">${ic('cal', '').replace('<svg', '<svg width="12" height="12"')} ${fmt(d, { weekday: 'long', month: 'short', day: 'numeric' })}${d === TODAY() ? ' · today' : ''}</span><button class="icon-btn" data-a="moodday" data-id="1" ${d >= TODAY() ? 'disabled' : ''}>${ic('right')}</button></div>
 <form data-form="mood"><div class="small" style="font-weight:700;margin:6px 0 8px">1. Select your mood</div><div class="moods">${MOODS.map(x => `<button type="button" class="${m.mood === x.v ? 'on' : ''}" data-a="pickmood" data-id="${x.v}"><span class="m">${x.e}</span><b>${x.n}</b><small>${x.d}</small></button>`).join('')}</div>
 <div class="small" style="font-weight:700;margin:16px 0 8px">2. Daily physical energy <span class="muted" style="font-weight:500">(shared with Today)</span></div><div class="energy">${ENERGY.map(e => `<button type="button" class="${(m.energy || S.energy[d]) === e.k ? 'on' : ''}" data-a="pickenergy" data-id="${e.k}"><b>${e.n}</b><small>${e.d}</small></button>`).join('')}</div>
 <div class="small" style="font-weight:700;margin:16px 0 8px">3. Emotion notes & flavours <span class="muted" style="font-weight:500">(optional)</span></div><div class="row wrap" style="gap:6px">${FEELS.map(f => `<button type="button" class="tag ${(m.tags || []).includes(f) ? 'on' : ''}" data-a="picktag" data-id="${f}">${f}</button>`).join('')}</div>
 <div class="frow" style="margin-top:16px"><div class="f"><label>Sleep last night (hours)</label><input class="in" name="sleep" type="number" step=".5" min="0" max="16" value="${m.sleep ?? ''}"></div><div class="f"><label>Water (glasses)</label><input class="in" name="water" type="number" min="0" max="20" value="${S.water[d] ?? ''}"></div></div>
 <div class="f"><label>4. Personal reflection & gratitude (optional)</label><textarea class="in" name="note" placeholder="What is bringing comfort, peace, or gently weighing on your heart today?">${esc(m.note || '')}</textarea></div>
 <div class="row"><span style="flex:1"></span><button class="btn pri">${ic('check')}Save check-in</button></div></form></div>
 <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:16px"><div class="card"><div class="ch">${ic('trend', '').replace('<svg', '<svg width="16" height="16" style="color:var(--pri)"')}<h3>Mood trends</h3><span class="sp"></span><div class="seg"><button class="${n === 7 ? 'on' : ''}" data-a="mrange" data-id="7">7 days</button><button class="${n === 30 ? 'on' : ''}" data-a="mrange" data-id="30">30 days</button></div></div>
  <div class="row small" style="justify-content:space-between;margin-bottom:8px"><span>Average score: <b>${avg} / 5</b></span><span class="muted">Recorded days: ${got.length} of ${n}</span></div>${line(vals, n === 7 ? days.map(x => fmt(x, { weekday: 'short' })) : days.filter((_, i) => i % 5 === 0).map(x => fmt(x, { month: 'short', day: 'numeric' })))}</div>
 <div class="card lav"><div class="ch">${ic('spark', '').replace('<svg', '<svg width="16" height="16" style="color:var(--lav)"')}<h3>Gentle reflection</h3></div><div class="small" style="font-weight:700">Energy & emotional harmony</div><div class="small muted" style="margin:4px 0 12px">${hi.length && lo.length ? `Your mood averages ${(sum(hi) / hi.length).toFixed(1)} on high-energy days compared to ${(sum(lo) / lo.length).toFixed(1)} on low-energy days.` : 'Log a few check-ins to see how energy and mood connect.'}</div>
  <div class="small" style="font-weight:700;margin-bottom:6px">Feelings you named most</div><div class="row wrap" style="gap:6px">${top.map(([g, c]) => `<span class="tag on">${g} · ${c}</span>`).join('') || '<span class="small muted">—</span>'}</div></div></div>`;
}

/* SELF-CARE */
function vSelfcare() {
 const wk = scWeekMins(), tot = sum(wk.map(s => s.mins)), by = {}; wk.forEach(s => by[s.cat] = (by[s.cat] || 0) + s.mins);
 const list = S.selfcare.slice().sort((a, b) => b.date.localeCompare(a.date));
 const ideas = [['Slow stretch', 'move', 10], ['Breathing break', 'mind', 5], ['Nap or rest', 'rest', 20], ['Doodle', 'play', 15], ['Message a friend', 'connect', 10], ['Skincare', 'body', 10], ['Walk outside', 'move', 20], ['Read for joy', 'rest', 20]];
 return `<div class="card tint"><div class="ch"><div><div class="eyebrow">${ic('heart', '').replace('<svg', '<svg width="12" height="12"')} Your gentle recharge space</div><div style="font:600 24px Playfair">Self-care sanctuary</div><div class="small muted">Nourishing moments of rest, movement, mindfulness and gentle restoration.</div></div><span class="sp"></span><button class="btn pri" data-a="addsc">${ic('plus')}Schedule session</button></div>
 <div class="card" style="padding:14px"><div class="tiny muted" style="font-weight:700;letter-spacing:1px">YOUR RECHARGE THIS WEEK (LAST 7 DAYS)</div><div style="margin:4px 0 8px"><b style="font:600 24px Playfair">${tot}</b> minutes dedicated to your wellbeing (${wk.length} sessions)</div>
 <div class="row" style="height:10px;border-radius:99px;overflow:hidden;gap:2px">${Object.entries(by).map(([c, m]) => `<span style="flex:${m};height:100%;background:${col(SC_CATS[c]?.[1])}"></span>`).join('') || '<span style="flex:1;height:100%;background:var(--line)"></span>'}</div>
 <div class="row wrap" style="gap:6px;margin-top:10px">${Object.entries(by).map(([c, m]) => `<span class="chip" style="background:${soft(SC_CATS[c][1])};color:${col(SC_CATS[c][1])}">${SC_CATS[c][0]}: ${m}m</span>`).join('')}</div></div></div>
 <div class="card" style="margin-top:16px"><div class="ch"><h3>Quick recharge ideas</h3><span class="sub">tap to add to today</span></div><div class="row wrap" style="gap:8px">${ideas.map(([n, c, m]) => `<button class="tag" data-a="scidea" data-id="${n}|${c}|${m}">${n} · ${m}m</button>`).join('')}</div></div>
 <div class="grid g2" style="margin-top:16px">${list.map(s => { const c = SC_CATS[s.cat] || SC_CATS.rest; return `<div class="item" style="background:linear-gradient(120deg,${soft(c[1])},var(--glass2));padding:14px">${ck(s.done, 'sc', s.id)}<div class="t"><b>${esc(s.title)}</b><small>${s.date === TODAY() ? 'Today' : fmt(s.date)}${s.time ? ' · ' + s.time : ''} · ${s.mins} mins</small><div style="margin-top:4px"><span class="chip" style="background:var(--glass);color:${col(c[1])};font-size:10px">${c[0]}</span></div></div>${acts('editsc', 'delsc', s.id)}</div>`; }).join('') || `<div class="card">${empty('🛁', 'Schedule a little moment for yourself')}</div>`}</div>`;
}

/* JOURNAL */
function vJournal() {
 const t = TODAY(), j = S.journal[t] || { grateful: [], text: '' }, pi = (D(t).getDate()) % PROMPTS.length;
 const past = Object.entries(S.journal).filter(([d]) => d !== t).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 10);
 const streak = (() => { let n = 0, d = t; if (!S.journal[d]) d = addDays(d, -1); while (S.journal[d]) { n++; d = addDays(d, -1); } return n; })();
 return `<div class="grid" style="grid-template-columns:1.5fr 1fr"><form class="card tint" data-form="journal"><div class="eyebrow">${ic('book', '').replace('<svg', '<svg width="12" height="12"')} ${fmt(t, { weekday: 'long', month: 'long', day: 'numeric' })}</div><div style="font:600 24px Playfair;margin:2px 0 14px">Today's <span style="font:400 40px Allura;color:var(--pri)">pages</span></div>
 <div class="f"><label>Three good things</label>${[0, 1, 2].map(i => `<input class="in" name="g${i}" value="${esc(j.grateful[i] || '')}" placeholder="${['Something that made me smile…', 'Someone I’m thankful for…', 'A tiny win…'][i]}" style="margin-bottom:6px">`).join('')}</div>
 <div class="f"><label>Prompt · ${esc(PROMPTS[pi])}</label><textarea class="in" name="text" style="min-height:170px" placeholder="Write freely. No one is grading this.">${esc(j.text || '')}</textarea></div>
 <div class="row"><span class="small muted">Saved only on your device</span><span style="flex:1"></span><button class="btn pri">${ic('check')}Save entry</button></div></form>
 <div class="col" style="gap:16px"><div class="grid g2">${statCard('Entries', Object.keys(S.journal).length, 'total', 'lav', 'book', 'All time')}${statCard('Streak', streak, 'days', 'peach', 'spark', 'Keep it gentle')}</div>
 <div class="card"><div class="ch"><h3>Past entries</h3></div><div class="col" style="gap:12px">${past.map(([d, e]) => `<div class="jentry"><div class="tiny muted" style="font-weight:700">${fmt(d, { weekday: 'long', month: 'short', day: 'numeric' })}</div><div class="small">${esc((e.text || '').slice(0, 140))}${(e.text || '').length > 140 ? '…' : ''}</div>${(e.grateful || []).filter(Boolean).length ? `<div class="tiny" style="color:var(--pri);margin-top:3px">♡ ${e.grateful.filter(Boolean).map(esc).join(' · ')}</div>` : ''}</div>`).join('') || empty('📖', 'Your past entries will gather here')}</div></div></div></div>`;
}

/* DOPAMINE */
function vDopamine() {
 const SEC = [['starters', 'Starters', '5–10 min quick boosts', 'peach', '🍓'], ['mains', 'Mains', 'Bigger, deeply satisfying', 'rose', '🍝'], ['sides', 'Sides', 'Pair with boring tasks', 'mint', '🥗'], ['desserts', 'Desserts', 'Lovely in small portions', 'lav', '🧁']];
 return `<div class="hero"><div class="row wrap"><div style="flex:1;min-width:240px"><div class="eyebrow">ADHD feel-good toolkit</div><h2>Your dopamine <span class="script">menu</span></h2><p>When you feel stuck or under-stimulated, order from your own menu instead of doom-scrolling.</p></div><button class="btn pri" data-a="dopapick">${ic('dice')}Pick something for me</button></div></div>
 <div class="menu4" style="margin-top:16px">${SEC.map(([k, n, d, c, e]) => `<div class="card" style="background:linear-gradient(170deg,${soft(c)},var(--glass) 50%)"><div style="font-size:26px">${e}</div><div style="font:600 20px Playfair">${n}</div><div class="small muted" style="margin-bottom:10px">${d}</div>
 <div class="list">${S.dopa[k].map((x, i) => `<div class="item" style="padding:8px 10px"><div class="t"><b style="font-size:12.5px">${esc(x)}</b></div><button class="icon-btn" data-a="deldopa" data-id="${k}" data-s="${i}">${ic('x')}</button></div>`).join('')}</div>
 <form class="qa" data-form="dopa" data-id="${k}" style="margin-top:10px"><input class="in" name="t" placeholder="+ Add"><button class="btn sm">${ic('plus')}</button></form></div>`).join('')}</div>`;
}

/* HOME */
function vHome() {
 const tot = sum(S.rooms.map(r => r.steps.length)), dn = sum(S.rooms.map(r => r.steps.filter(s => s.done).length)), linked = S.tasks.filter(t => t.area === 'Home' && !t.done).length;
 return `<div class="hero"><div class="grid" style="grid-template-columns:1.3fr 1fr;align-items:center"><div><span class="chip">🏡 Room sanctuary · reset at your rhythm</span><h2>Home reset <span class="script">sanctuary</span></h2><p>Curate and organize your spaces one room at a time. Tap any step to tick it off.</p></div>
 <div class="row wrap" style="justify-content:flex-end;gap:10px"><div class="card" style="padding:10px 14px"><div class="tiny muted" style="font-weight:700">TOTAL SPACES</div><b style="font:600 20px Playfair">${S.rooms.length} spaces</b></div><div class="card" style="padding:10px 14px"><div class="tiny muted" style="font-weight:700">STEPS DONE</div><b style="font:600 20px Playfair">${dn}/${tot}</b></div><div class="card" style="padding:10px 14px"><div class="tiny muted" style="font-weight:700">HOME TASKS</div><b style="font:600 20px Playfair">${linked}</b></div></div></div>
 <div class="row" style="margin-top:12px;gap:8px"><button class="btn pri" data-a="addroom">${ic('plus')}Add room</button><button class="btn" data-a="resetrooms">${ic('reset')}New week — reset all checks</button><button class="btn" data-a="quickreset">${ic('timer')}15-minute reset</button></div></div>
 <div class="grid g3" style="margin-top:16px">${S.rooms.map(r => { const d = r.steps.filter(s => s.done).length, p = pct(d, r.steps.length); return `<div class="room" style="background:linear-gradient(165deg,${soft(r.color)},var(--glass) 55%)"><div class="row"><div class="ic" style="background:var(--glass)">${r.icon}</div><span class="sp" style="flex:1"></span>${acts('editroom', 'delroom', r.id)}</div>
 <div style="font:600 20px Playfair;margin:10px 0 2px">${esc(r.name)}</div><div class="row small" style="justify-content:space-between"><span class="muted">${d} of ${r.steps.length} done</span><b>${p}%</b></div><div class="bar" style="margin:6px 0 10px"><i style="width:${p}%;background:${col(r.color)}"></i></div>
 <div class="list">${r.steps.map(s => `<div class="item ${s.done ? 'done' : ''}" style="padding:7px 10px">${ck(s.done, 'rmstep', r.id, `data-s="${s.id}"`, 1)}<div class="t"><b style="font-size:12.5px">${esc(s.t)}</b></div><button class="icon-btn" data-a="delrmstep" data-id="${r.id}" data-s="${s.id}">${ic('x')}</button></div>`).join('')}</div>
 <form class="qa" data-form="rmstep" data-id="${r.id}" style="margin-top:10px"><input class="in" name="t" placeholder="+ Micro-step"><button class="btn sm">${ic('plus')}</button></form></div>`; }).join('') || `<div class="card">${empty('🏡', 'Add your first room')}</div>`}</div>`;
}

/* MEALS */
const MEALK = [['b', 'Breakfast', 'gold'], ['l', 'Lunch', 'mint'], ['d', 'Dinner', 'rose'], ['s', 'Snacks', 'lav']];
function vMeals() {
 const wd = weekDays(UI.mealWeek), t = TODAY(), n = sum(wd.map(d => Object.values(S.meals.plan[d] || {}).filter(x => x && x.text).length));
 const tabs = `<div class="seg"><button class="${UI.mealTab === 'plan' ? 'on' : ''}" data-a="mealtab" data-id="plan">${ic('cal', '').replace('<svg', '<svg width="12" height="12"')} Weekly planner</button><button class="${UI.mealTab === 'rec' ? 'on' : ''}" data-a="mealtab" data-id="rec">♡ My recipes (${S.meals.recipes.length})</button><button class="${UI.mealTab === 'gro' ? 'on' : ''}" data-a="mealtab" data-id="gro">🛒 Grocery list (${S.meals.grocery.filter(g => !g.done).length})</button></div>`;
 let body = '';
 if (UI.mealTab === 'plan') body = `<div class="card"><div class="ch"><button class="icon-btn" data-a="mealweek" data-id="-7">${ic('left')}</button><button class="btn sm" data-a="mealweek" data-id="0">This week</button><button class="icon-btn" data-a="mealweek" data-id="7">${ic('right')}</button><div class="small"><b>${fmt(wd[0], { weekday: 'long', month: 'short', day: 'numeric' })} – ${fmt(wd[6], { weekday: 'long', month: 'short', day: 'numeric' })}</b><br><span class="muted tiny">${n} meals scheduled</span></div><span class="sp"></span><button class="btn sm" style="color:var(--mint)" data-a="gengroc">${ic('spark')}Generate groceries for week</button></div>
 <div class="week">${wd.map(d => `<div class="dayc ${d === t ? 'today' : ''}"><h4>${fmt(d, { weekday: 'short' }).toUpperCase()} ${d === t ? '<span class="chip" style="font-size:9px;padding:0 6px">Today</span>' : ''}</h4><span class="tiny muted">${fmt(d, { month: 'short', day: 'numeric' })}</span>
 ${MEALK.map(([k, nm, c]) => { const m = (S.meals.plan[d] || {})[k]; return `<div class="meal ${m ? 'has' : ''}" style="${m ? `background:${soft(c)};border-color:${soft(c)}` : ''}" data-a="setmeal" data-id="${d}" data-s="${k}"><small style="color:${col(c)}">${nm}</small>${m ? esc(m.text) + (m.rid ? '<div class="tiny" style="color:' + col(c) + '">From recipe</div>' : '') : '<span class="tiny muted">+ Plan meal</span>'}</div>`; }).join('')}</div>`).join('')}</div></div>`;
 else if (UI.mealTab === 'rec') body = `<div class="row" style="margin-bottom:12px"><span style="flex:1"></span><button class="btn pri" data-a="addrecipe">${ic('plus')}New recipe</button></div><div class="grid g3">${S.meals.recipes.map(r => `<div class="card"><div class="ch"><span class="chip">${esc(r.type || 'Any')}</span><span class="sp"></span>${acts('editrecipe', 'delrecipe', r.id)}</div><div style="font:600 18px Playfair">${esc(r.name)}</div><div class="small muted" style="margin:4px 0 10px">${r.ing.length} ingredients</div><div class="row wrap" style="gap:5px">${r.ing.map(i => `<span class="pill">${esc(i)}</span>`).join('')}</div>${r.notes ? `<div class="small" style="margin-top:8px">${esc(r.notes)}</div>` : ''}</div>`).join('') || `<div class="card">${empty('🍲', 'Save the meals you love')}</div>`}</div>`;
 else { const by = {}; S.meals.grocery.forEach(g => (by[g.cat] = by[g.cat] || []).push(g));
  body = `<div class="card"><form class="qa" data-form="groc" style="margin-bottom:14px"><input class="in" name="t" placeholder="Add an item…"><select class="in" name="c" style="width:auto">${GROC_CATS.map(c => `<option>${c}</option>`).join('')}</select><button class="btn pri">${ic('plus')}</button></form>
  <div class="row" style="margin-bottom:10px"><span class="small muted">${S.meals.grocery.filter(g => g.done).length} of ${S.meals.grocery.length} in the basket</span><span style="flex:1"></span><button class="btn sm" data-a="clearbought">Clear bought items</button></div>
  <div class="grid g3">${GROC_CATS.filter(c => by[c]).map(c => `<div><div class="small" style="font-weight:700;margin-bottom:6px">${c}</div><div class="list">${by[c].map(g => `<div class="item ${g.done ? 'done' : ''}" style="padding:7px 10px">${ck(g.done, 'groc', g.id)}<div class="t"><b style="font-size:12.5px">${esc(g.text)}</b></div><button class="icon-btn" data-a="delgroc" data-id="${g.id}">${ic('x')}</button></div>`).join('')}</div></div>`).join('') || empty('🛒', 'Your list is empty')}</div></div>`; }
 return `<div class="card tint" style="margin-bottom:16px"><div class="ch"><div><div class="eyebrow">🍴 Nourishment & table</div><div style="font:600 24px Playfair">Meals & groceries</div><div class="small muted">Weekly table rhythms, a personal recipe book and a smart grocery list.</div></div><span class="sp"></span>${tabs}</div></div>${body}`;
}

/* MONEY */
function vMoney() {
 const M = UI.moneyMonth, tx = S.money.tx.filter(x => ym(x.date) === M), inc = sum(tx.filter(x => x.type === 'in').map(x => x.amt)), out = sum(tx.filter(x => x.type === 'out').map(x => x.amt)), bud = +S.money.budget || 0;
 const by = {}; tx.filter(x => x.type === 'out').forEach(x => by[x.cat] = (by[x.cat] || 0) + x.amt); const cats = Object.entries(by).sort((a, b) => b[1] - a[1]);
 const billsDue = S.money.bills.filter(b => !b.paid[M]).length, mlabel = D(M + '-15').toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
 const list = UI.moneyTab === 'bills' ? '' : tx.filter(x => x.type === UI.moneyTab).sort((a, b) => b.date.localeCompare(a.date));
 return `<div class="card tint"><div class="ch"><div><div class="eyebrow">💰 Financial sanctuary</div><div style="font:600 24px Playfair">Budget & money</div><div class="small muted">Gentle financial flow. Less overwhelm, clear awareness.</div></div><span class="sp"></span><button class="icon-btn" data-a="mmonth" data-id="-1">${ic('left')}</button><span class="chip grey" style="font-size:12px">${mlabel}</span><button class="icon-btn" data-a="mmonth" data-id="1">${ic('right')}</button></div></div>
 <div class="grid g4" style="margin-top:16px">${statCard('Income', money(inc, 0), '', 'mint', 'trend', tx.filter(x => x.type === 'in').length + ' entries this month')}${statCard('Expenses', money(out, 0), '', 'peach', 'wallet', tx.filter(x => x.type === 'out').length + ' entries this month')}
 <div class="card lav"><div class="ch" style="margin-bottom:6px"><span class="small" style="font-weight:700">Remaining</span><span class="sp"></span><button class="btn sm ghost" data-a="setbudget">Edit</button></div><div class="stat"><span class="n">${money(bud - out, 0)}</span><span class="l">of ${money(bud, 0)} budget</span></div></div>
 ${statCard('Net flow', (inc - out >= 0 ? '+' : '') + money(inc - out, 0), '', 'sky', 'arrow', inc - out >= 0 ? 'Surplus · income minus expenses' : 'Deficit this month')}</div>
 <div class="grid" style="grid-template-columns:1.6fr 1fr;margin-top:16px"><div class="col" style="gap:16px"><div class="card"><div class="ch"><h3>Monthly spending progress</h3><span class="sub">${money(out, 0)} spent of ${money(bud, 0)} limit</span><span class="sp"></span><span class="chip">${pct(out, bud)}%</span></div><div class="bar" style="height:12px"><i style="width:${clamp(pct(out, bud), 0, 100)}%;background:linear-gradient(90deg,var(--mint),var(--pri))"></i></div>
 <div class="tiny muted" style="font-weight:700;letter-spacing:1px;margin:14px 0 8px">SPENDING BREAKDOWN BY CATEGORY</div><div class="grid g4" style="gap:8px">${cats.map(([c, v]) => `<div class="item" style="flex-direction:column;align-items:flex-start;gap:2px"><b class="small" style="color:${col(EXP_CATS[c]?.[1])}">${EXP_CATS[c]?.[0] || c}</b><span class="tiny muted">${tx.filter(x => x.cat === c).length} txns · ${pct(v, out)}%</span><b>${money(v, 0)}</b></div>`).join('') || '<span class="small muted">No spending yet this month</span>'}</div></div>
 <div class="card"><div class="ch"><div class="seg"><button class="${UI.moneyTab === 'out' ? 'on' : ''}" data-a="mtab" data-id="out">Expenses (${tx.filter(x => x.type === 'out').length})</button><button class="${UI.moneyTab === 'in' ? 'on' : ''}" data-a="mtab" data-id="in">Income (${tx.filter(x => x.type === 'in').length})</button><button class="${UI.moneyTab === 'bills' ? 'on' : ''}" data-a="mtab" data-id="bills">Bills (${S.money.bills.length}) ${billsDue ? `<span class="chip" style="padding:0 6px;font-size:9.5px">${billsDue} due</span>` : ''}</button></div><span class="sp"></span><button class="btn pri sm" data-a="${UI.moneyTab === 'bills' ? 'addbill' : 'addtx'}">${ic('plus')}${UI.moneyTab === 'bills' ? 'Add bill' : UI.moneyTab === 'in' ? 'Add income' : 'Add expense'}</button></div>
 <div class="list">${UI.moneyTab === 'bills' ? S.money.bills.map(b => `<div class="item ${b.paid[M] ? 'done' : ''}">${ck(b.paid[M], 'bill', b.id)}<div class="t"><b>${esc(b.name)}</b><small>Due on day ${b.day} each month · ${b.paid[M] ? 'Paid' : 'Not paid yet'}</small></div><b>${money(b.amt)}</b>${acts('editbill', 'delbill', b.id)}</div>`).join('') || empty('🧾', 'Add recurring bills once — they repeat every month')
  : list.map(x => { const c = EXP_CATS[x.cat] || ['Income', 'mint']; return `<div class="item"><span class="emo" style="background:${soft(c[1])};color:${col(c[1])}">${x.type === 'in' ? '💗' : '🏷️'}</span><div class="t"><b>${esc(x.note || c[0])}</b><small>${x.type === 'in' ? 'Income' : c[0]} · ${x.date}</small></div><b style="color:${x.type === 'in' ? 'var(--mint)' : 'var(--ink)'}">${x.type === 'in' ? '+' : '-'}${money(x.amt)}</b>${acts('edittx', 'deltx', x.id)}</div>`; }).join('') || empty('🌸', 'Nothing logged yet')}</div></div></div>
 <div class="col" style="gap:16px"><div class="card" style="text-align:center"><div class="ch"><h3>Where it went</h3></div>${donut(cats.map(([c, v]) => [col(EXP_CATS[c]?.[1]), v]), 170)}<div class="col small" style="margin-top:10px;text-align:left">${cats.map(([c, v]) => `<div class="row"><span class="dot" style="background:${col(EXP_CATS[c]?.[1])}"></span>${EXP_CATS[c]?.[0] || c}<span style="flex:1"></span><b>${money(v, 0)}</b></div>`).join('')}</div></div>
 <div class="card mint"><div class="ch"><h3>Can I afford it?</h3></div><form class="qa" data-form="afford"><input class="in" name="a" type="number" step=".01" placeholder="Price"><button class="btn sm pri">Check</button></form><div id="affordout" class="small" style="margin-top:8px">Left this month: <b>${money(bud - out)}</b></div></div></div></div>`;
}

/* ADMIN */
function vAdmin() {
 const t = TODAY(), a = S.admin, up = a.filter(x => x.status !== 'done' && x.due >= t).length, od = a.filter(x => x.status !== 'done' && x.due && x.due < t).length, dn = a.filter(x => x.status === 'done').length;
 const f = { all: a, todo: a.filter(x => x.status === 'todo'), doing: a.filter(x => x.status === 'doing'), over: a.filter(x => x.status !== 'done' && x.due < t), done: a.filter(x => x.status === 'done') }[UI.adminTab].slice().sort((x, y) => (x.due || '9').localeCompare(y.due || '9'));
 const st = { todo: 'To do', doing: 'In progress', done: 'Done' };
 return `<div class="card tint"><div class="ch"><div><div class="eyebrow">📁 Life administration haven</div><div style="font:600 24px Playfair">Life admin</div><div class="small muted">Personal paperwork, renewals, subscriptions and deadlines in soft, gentle order.</div></div><span class="sp"></span><button class="btn pri" data-a="addadmin">${ic('plus')}Add admin item</button></div></div>
 <div class="grid g4" style="margin-top:16px">${statCard('Upcoming', up, '', 'sky', 'cal', 'Deadlines on horizon')}${statCard('Overdue', od, '', 'tint', 'clock', 'Past target date')}${statCard('Completed', dn, '', 'mint', 'check', 'Handled with care')}${statCard('Total logged', a.length, '', 'lav', 'folder', 'Canonical admin items')}</div>
 <div class="row" style="margin:16px 0 12px"><div class="seg">${[['all', 'All items'], ['todo', 'To do'], ['doing', 'In progress'], ['over', 'Overdue'], ['done', 'Completed']].map(([k, n]) => `<button class="${UI.adminTab === k ? 'on' : ''}" data-a="admintab" data-id="${k}">${n}</button>`).join('')}</div></div>
 <div class="grid g2">${f.map(x => { const c = ADMIN_CATS[x.cat] || ADMIN_CATS.health, dd = x.due ? diffDays(x.due, t) : null; return `<div class="card" style="padding:14px"><div class="row"><span class="chip" style="background:${soft(c[1])};color:${col(c[1])}">${c[0].toUpperCase()}</span><span style="flex:1"></span><span class="pill">${x.status === 'done' ? 'Done' : dd == null ? 'No date' : dd < 0 ? `${-dd} days overdue` : dd === 0 ? 'Today' : `In ${dd} day${dd > 1 ? 's' : ''}`}</span></div>
 <div class="row" style="margin:10px 0 4px">${ck(x.status === 'done', 'admindone', x.id, '', 1)}<b style="font-size:14.5px;${x.status === 'done' ? 'text-decoration:line-through;color:var(--mute)' : ''}">${esc(x.title)}</b></div>${x.notes ? `<div class="small muted" style="margin-left:32px">${esc(x.notes)}</div>` : ''}
 <div class="row" style="margin-top:10px"><span class="tiny muted">${{ low: 'Low', med: 'Medium', high: 'High' }[x.prio]} priority ·</span><button class="pill" style="cursor:pointer" data-a="adminstatus" data-id="${x.id}">${st[x.status]} ↻</button><span style="flex:1"></span>${acts('editadmin', 'deladmin', x.id)}</div></div>`; }).join('') || `<div class="card" style="grid-column:1/-1">${empty('📂', 'Nothing here')}</div>`}</div>`;
}

/* REVIEW */
function vReview() {
 const ws = weekStart(TODAY()), days = weekDays(TODAY()), r = S.reviews[ws] || {};
 const tdone = sum(days.map(doneOn)), fm = sum(days.map(focusMins)), mv = days.map(d => S.moods[d]?.mood).filter(Boolean), sc = sum(S.selfcare.filter(s => s.done && days.includes(s.date)).map(s => s.mins)), sp = sum(S.money.tx.filter(x => x.type === 'out' && days.includes(x.date)).map(x => x.amt));
 const past = Object.entries(S.reviews).filter(([k]) => k !== ws).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 6);
 return `<div class="hero"><div class="eyebrow">Week of ${fmt(days[0], { month: 'long', day: 'numeric' })}</div><h2>Weekly <span class="script">reset</span></h2><p>Ten calm minutes to look back, let go and choose what matters next week.</p>
 <div class="grid g4" style="margin-top:14px;gap:10px">${[['Tasks done', tdone, 'check'], ['Focus', fm + 'm', 'timer'], ['Habits', habitConsistency() + '%', 'spark'], ['Mood avg', mv.length ? (sum(mv) / mv.length).toFixed(1) : '–', 'smile'], ['Self-care', sc + 'm', 'heart'], ['Spent', money(sp, 0), 'wallet'], ['Journal', days.filter(d => S.journal[d]).length + ' days', 'book'], ['Water avg', (sum(days.map(d => S.water[d] || 0)) / 7).toFixed(1), 'drop']].map(([k, v, i]) => `<div class="card" style="padding:12px"><div class="row small muted">${ic(i, '').replace('<svg', '<svg width="13" height="13"')}${k}</div><b style="font:600 20px Playfair">${v}</b></div>`).join('')}</div></div>
 <form class="card" data-form="review" style="margin-top:16px"><div class="grid g2" style="gap:12px"><div class="f"><label>🌟 Wins this week</label><textarea class="in" name="wins">${esc(r.wins || '')}</textarea></div><div class="f"><label>🌧️ What felt hard</label><textarea class="in" name="hard">${esc(r.hard || '')}</textarea></div>
 <div class="f"><label>🌱 Lessons & what helped</label><textarea class="in" name="lessons">${esc(r.lessons || '')}</textarea></div><div class="f"><label>🎯 Focus for next week</label><textarea class="in" name="next">${esc(r.next || '')}</textarea></div></div>
 <div class="f"><label>Rate the week</label><div class="row wrap" style="gap:6px">${[...Array(10)].map((_, i) => `<label style="cursor:pointer"><input type="radio" name="rate" value="${i + 1}" ${+r.rate === i + 1 ? 'checked' : ''} style="display:none"><span class="hcell ${+r.rate === i + 1 ? 'on' : ''}" style="width:34px;height:34px;${+r.rate === i + 1 ? 'background:var(--pri)' : ''}">${i + 1}</span></label>`).join('')}</div></div>
 <div class="row"><span style="flex:1"></span><button class="btn pri">${ic('check')}Save review</button></div></form>
 ${past.length ? `<div class="card" style="margin-top:16px"><div class="ch"><h3>Past reviews</h3></div><div class="col" style="gap:10px">${past.map(([k, v]) => `<div class="jentry"><div class="tiny muted" style="font-weight:700">Week of ${fmt(k, { month: 'short', day: 'numeric' })} · ${v.rate || '–'}/10</div><div class="small">${esc(v.wins || '')}</div></div>`).join('')}</div></div>` : ''}`;
}

/* SETTINGS */
function vSettings() {
 const th = [['blush', 'Blush Bloom', 'Soft · bright · gentle', 'linear-gradient(120deg,#FFE3EE,#F3E6FF)'], ['lavender', 'Lavender Dream', 'Airy · calm · dreamy', 'linear-gradient(120deg,#EFE6FD,#DCEBFF)'], ['moonlight', 'Moonlight', 'Cozy · calm · focused', 'linear-gradient(120deg,#2A1D30,#4A2B49)']];
 const cur = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'NZD', 'INR', 'PKR', 'AED', 'SGD', 'ZAR', 'JPY', 'MXN', 'PHP', 'NGN'];
 return `<div class="grid g2"><div class="col" style="gap:16px"><form class="card" data-form="settings"><div class="ch"><h3>Your planner</h3></div><div class="f"><label>Your name</label><input class="in" name="name" value="${esc(S.settings.name)}" placeholder="What should we call you?"></div>
 <div class="f"><label>Daily focus line (sidebar)</label><input class="in" name="focus" value="${esc(S.settings.focus)}"></div>
 <div class="frow"><div class="f"><label>Currency</label><select class="in" name="currency">${cur.map(c => `<option ${S.settings.currency === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div><div class="f"><label>Week starts on</label><select class="in" name="weekStart"><option value="1" ${S.settings.weekStart == 1 ? 'selected' : ''}>Monday</option><option value="0" ${S.settings.weekStart == 0 ? 'selected' : ''}>Sunday</option></select></div></div>
 <div class="f"><label>Daily water goal (glasses)</label><input class="in" name="water" type="number" min="1" max="16" value="${S.settings.water}"></div><div class="row"><span style="flex:1"></span><button class="btn pri">Save</button></div></form>
 <div class="card"><div class="ch"><h3>Themes</h3><span class="sub">make your space match your mood</span></div><div class="col">${th.map(([k, n, d, g]) => `<button class="item" data-a="settheme" data-id="${k}" style="cursor:pointer;text-align:left;${S.settings.theme === k ? 'border-color:var(--pri);box-shadow:0 0 0 3px var(--ring)' : ''}"><span style="width:64px;height:40px;border-radius:12px;background:${g};border:1px solid var(--line)"></span><div class="t"><b>${n}</b><small>${d}</small></div>${S.settings.theme === k ? '<span class="chip">Active</span>' : ''}</button>`).join('')}</div></div></div>
 <div class="col" style="gap:16px"><div class="card tint"><div class="ch"><span class="emo">🗄️</span><div><h3>Data & backup haven</h3><div class="small muted">Customer data protection, export and restoration</div></div></div>
 <div class="card" style="padding:14px"><div class="small" style="font-weight:700;color:var(--mint)">${ic('shield', '').replace('<svg', '<svg width="13" height="13"')} Full workspace export</div><div class="small muted" style="margin:4px 0 10px">Exports every module: tasks, habits, routines, goals, focus sessions, moods, self-care, journal, rooms, meals, budget and life admin.</div>
 <div class="row wrap" style="gap:6px">${[[S.tasks.length, 'tasks'], [S.habits.length, 'habits'], [S.events.length, 'events'], [Object.keys(S.moods).length, 'mood check-ins'], [S.meals.recipes.length, 'recipes'], [S.admin.length, 'admin items']].map(([n, l]) => `<span class="pill">${n} ${l}</span>`).join('')}</div></div>
 <div class="col" style="margin-top:12px"><button class="btn pri" data-a="backup">${ic('down')}Download backup (.json)</button><label class="btn" style="justify-content:center">${ic('up')}Restore backup<input type="file" accept=".json,application/json" data-a2="restore" style="display:none"></label>
 <div class="row" style="gap:8px"><button class="btn" style="flex:1;justify-content:center" data-a="loadsample">${ic('spark')}Load sample data</button><button class="btn danger" style="flex:1;justify-content:center" data-a="clearall">${ic('trash')}Clear all data</button></div></div>
 <div class="small muted" style="margin-top:12px">⚠️ Your data is saved in this browser on this device. Before switching browsers, changing devices or clearing browser data, download a backup first.</div></div>
 <div class="card"><div class="ch"><h3>Install like an app</h3></div><div class="col small"><div><b>iPhone / iPad:</b> open in Safari → Share → <i>Add to Home Screen</i>.</div><div><b>Android:</b> Chrome menu ⋮ → <i>Install app</i>.</div><div><b>Computer:</b> Chrome or Edge → install icon in the address bar.</div><div class="muted">Once opened online, it keeps working offline.</div></div></div>
 <div class="card"><div class="ch"><h3>About</h3></div><div class="small muted">World Trade Net · Bloom Life Planner v1.0 · ${DEMO ? 'Demo mode' : 'Full version'}<br>An organizational tool — not medical, financial or legal advice.<br>Support: message us on Etsy · <a href="${SHOP}" target="_blank" rel="noopener">worldtradenet</a></div></div></div></div>`;
}
const VIEWS = { today: vToday, dump: vDump, tasks: vTasks, calendar: vCalendar, routines: vRoutines, habits: vHabits, goals: vGoals, focus: vFocus, mood: vMood, selfcare: vSelfcare, journal: vJournal, dopamine: vDopamine, home: vHome, meals: vMeals, money: vMoney, admin: vAdmin, review: vReview, settings: vSettings };
/* events, forms, init */
function render() {
 document.documentElement.dataset.theme = S.settings.theme || 'blush';
 const y = window.scrollY; $('#root').innerHTML = shell(VIEWS[UI.view] ? VIEWS[UI.view]() : vToday());
 window.scrollTo(0, y);
}
function rerender() { save(); render(); }
function toast(m) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); }
const find = (arr, id) => arr.find(x => x.id === id);
const opts = (o, v) => o.map(x => Array.isArray(x) ? x : [x, x]).map(([k, n]) => `<option value="${esc(k)}" ${String(v) === String(k) ? 'selected' : ''}>${esc(n)}</option>`).join('');
function field(f) {
 const v = f.v ?? '', base = `class="in" name="${f.k}" ${f.req ? 'required' : ''} placeholder="${esc(f.ph || '')}"`;
 const inp = f.t === 'textarea' ? `<textarea ${base}>${esc(v)}</textarea>` : f.t === 'select' ? `<select ${base}>${opts(f.o, v)}</select>`
  : f.t === 'color' ? `<div class="row wrap" style="gap:6px">${Object.entries(COLORS).map(([k, c]) => `<label style="cursor:pointer"><input type="radio" name="${f.k}" value="${k}" ${v === k ? 'checked' : ''} style="display:none"><span class="hcell" data-col="${k}" style="background:${c};border-color:${v === k ? 'var(--ink)' : 'transparent'}"></span></label>`).join('')}</div>`
  : `<input ${base} type="${f.t || 'text'}" value="${esc(v)}" ${f.step ? `step="${f.step}"` : ''}>`;
 return `<div class="f" ${f.half ? 'data-half' : ''}><label>${f.l}</label>${inp}</div>`;
}
function form(o) {
 closeModal();
 const fs = []; for (let i = 0; i < o.fields.length; i++) { const f = o.fields[i]; if (f.half && o.fields[i + 1]?.half) { fs.push(`<div class="frow">${field(f)}${field(o.fields[i + 1])}</div>`); i++; } else fs.push(field(f)); }
 document.body.insertAdjacentHTML('beforeend', `<div class="mask" id="mask"><form class="modal" id="mform"><div class="mh"><div style="flex:1"><h3>${o.title}</h3>${o.sub ? `<div class="small muted">${o.sub}</div>` : ''}</div><button type="button" class="icon-btn" data-a="close">${ic('x')}</button></div>${fs.join('')}
 <div class="mf">${o.onDel ? `<button type="button" class="btn danger" id="mdel" style="margin-right:auto">${ic('trash')}Delete</button>` : ''}<button type="button" class="btn" data-a="close">Cancel</button><button class="btn pri">${o.submit || 'Save'}</button></div></form></div>`);
 const fm = $('#mform');
 fm.querySelectorAll('input[type=radio]').forEach(r => r.addEventListener('change', () => fm.querySelectorAll(`input[name=${r.name}]+.hcell`).forEach(s => s.style.borderColor = s.previousElementSibling.checked ? 'var(--ink)' : 'transparent')));
 fm.addEventListener('submit', e => { e.preventDefault(); const v = Object.fromEntries(new FormData(fm)); if (o.onSave(v) !== false) { closeModal(); rerender(); } });
 if (o.onDel) $('#mdel').onclick = () => { if (confirm('Delete this item?')) { o.onDel(); closeModal(); rerender(); } };
 $('#mask').addEventListener('mousedown', e => { if (e.target.id === 'mask') closeModal(); });
 setTimeout(() => fm.querySelector('.in')?.focus(), 30);
}
function closeModal() { $('#mask')?.remove(); }

/* entity forms */
function taskForm(t, date) {
 const n = !t; t = t || { title: '', date: date || TODAY(), prio: 'med', energy: 'med', est: 15, area: 'Self', notes: '' };
 form({ title: n ? 'Add a gentle task' : 'Edit task', sub: 'Small and specific works best.', fields: [{ k: 'title', l: 'Task', v: t.title, req: 1, ph: 'e.g. Reply to Emma' }, { k: 'date', l: 'Date (leave empty for Someday)', t: 'date', v: t.date, half: 1 }, { k: 'est', l: 'Minutes', t: 'number', v: t.est, half: 1 },
  { k: 'prio', l: 'Priority', t: 'select', o: [['low', 'Low'], ['med', 'Medium'], ['high', 'High']], v: t.prio, half: 1 }, { k: 'energy', l: 'Energy needed', t: 'select', o: [['low', 'Low'], ['med', 'Medium'], ['high', 'High']], v: t.energy, half: 1 },
  { k: 'area', l: 'Life area', t: 'select', o: AREAS, v: t.area }, { k: 'notes', l: 'Notes', t: 'textarea', v: t.notes }],
  onSave: v => { v.est = +v.est || 0; if (n) S.tasks.push({ id: uid(), done: false, created: TODAY(), ...v }); else Object.assign(t, v); toast(n ? 'Task added 🌸' : 'Saved'); }, onDel: n ? null : () => S.tasks = S.tasks.filter(x => x !== t) });
}
function eventForm(e, date) {
 const n = !e; e = e || { title: '', date: date || TODAY(), time: '', color: 'lav', notes: '' };
 form({ title: n ? 'New event' : 'Edit event', fields: [{ k: 'title', l: 'Title', v: e.title, req: 1 }, { k: 'date', l: 'Date', t: 'date', v: e.date, req: 1, half: 1 }, { k: 'time', l: 'Time (optional)', t: 'time', v: e.time, half: 1 }, { k: 'color', l: 'Colour', t: 'color', v: e.color }, { k: 'notes', l: 'Notes', t: 'textarea', v: e.notes || '' }],
  onSave: v => { n ? S.events.push({ id: uid(), ...v }) : Object.assign(e, v); }, onDel: n ? null : () => S.events = S.events.filter(x => x !== e) });
}
function habitForm(h) {
 const n = !h; h = h || { name: '', emoji: '🌿', color: 'rose', freq: 'daily' };
 form({ title: n ? 'New habit' : 'Edit habit', sub: 'Make it so small it feels almost silly.', fields: [{ k: 'name', l: 'Habit', v: h.name, req: 1, ph: 'A glass of water' }, { k: 'emoji', l: 'Emoji', v: h.emoji, half: 1 }, { k: 'freq', l: 'How often', t: 'select', o: [['daily', 'Every day'], ['weekdays', 'Weekdays'], ['weekends', 'Weekends']], v: h.freq, half: 1 }, { k: 'color', l: 'Colour', t: 'color', v: h.color }],
  onSave: v => { n ? S.habits.push({ id: uid(), log: {}, created: TODAY(), ...v }) : Object.assign(h, v); }, onDel: n ? null : () => S.habits = S.habits.filter(x => x !== h) });
}
function routineForm(r) {
 const n = !r; r = r || { name: '', slot: 'morning', note: '' };
 form({ title: n ? 'Create routine' : 'Edit routine', fields: [{ k: 'name', l: 'Name', v: r.name, req: 1, ph: 'A gentle morning' }, { k: 'slot', l: 'Time of day', t: 'select', o: [['morning', 'Morning'], ['midday', 'Midday'], ['evening', 'Evening']], v: r.slot }, { k: 'note', l: 'Short intention', v: r.note }],
  onSave: v => { n ? S.routines.push({ id: uid(), steps: [], log: {}, ...v }) : Object.assign(r, v); }, onDel: n ? null : () => S.routines = S.routines.filter(x => x !== r) });
}
function goalForm(g, title) {
 const n = !g; g = g || { title: title || '', area: 'Self', due: '', color: 'rose', steps: '' };
 form({ title: n ? 'New goal or project' : 'Edit goal', fields: [{ k: 'title', l: 'Goal', v: g.title, req: 1 }, { k: 'area', l: 'Area', t: 'select', o: AREAS.concat(['Learning', 'Creative']), v: g.area, half: 1 }, { k: 'due', l: 'Target date', t: 'date', v: g.due, half: 1 }, { k: 'color', l: 'Colour', t: 'color', v: g.color },
  ...(n ? [{ k: 'steps', l: 'First steps (one per line)', t: 'textarea', ph: 'Pick the spot\nFind a comfy chair' }] : [])],
  onSave: v => { if (n) S.goals.push({ id: uid(), title: v.title, area: v.area, due: v.due, color: v.color, steps: (v.steps || '').split('\n').map(s => s.trim()).filter(Boolean).map(t => ({ id: uid(), t, done: false })) }); else Object.assign(g, { title: v.title, area: v.area, due: v.due, color: v.color }); }, onDel: n ? null : () => S.goals = S.goals.filter(x => x !== g) });
}
function scForm(s) {
 const n = !s; s = s || { title: '', cat: 'rest', date: TODAY(), time: '', mins: 15, done: false };
 form({ title: n ? 'Schedule a recharge' : 'Edit session', fields: [{ k: 'title', l: 'What will you do?', v: s.title, req: 1 }, { k: 'cat', l: 'Type', t: 'select', o: Object.entries(SC_CATS).map(([k, v]) => [k, v[0]]), v: s.cat }, { k: 'date', l: 'Date', t: 'date', v: s.date, half: 1 }, { k: 'time', l: 'Time', t: 'time', v: s.time, half: 1 }, { k: 'mins', l: 'Minutes', t: 'number', v: s.mins }],
  onSave: v => { v.mins = +v.mins || 0; n ? S.selfcare.push({ id: uid(), done: false, ...v }) : Object.assign(s, v); }, onDel: n ? null : () => S.selfcare = S.selfcare.filter(x => x !== s) });
}
function roomForm(r) {
 const n = !r; r = r || { name: '', icon: '🪴', color: 'rose' };
 form({ title: n ? 'Add a room' : 'Edit room', fields: [{ k: 'name', l: 'Room or space', v: r.name, req: 1, ph: 'Living room' }, { k: 'icon', l: 'Emoji', v: r.icon }, { k: 'color', l: 'Colour', t: 'color', v: r.color }],
  onSave: v => { n ? S.rooms.push({ id: uid(), steps: [], ...v }) : Object.assign(r, v); }, onDel: n ? null : () => S.rooms = S.rooms.filter(x => x !== r) });
}
function recipeForm(r) {
 const n = !r; r = r || { name: '', type: 'Dinner', ing: [], notes: '' };
 form({ title: n ? 'New recipe' : 'Edit recipe', fields: [{ k: 'name', l: 'Recipe', v: r.name, req: 1 }, { k: 'type', l: 'Meal type', t: 'select', o: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Any'], v: r.type }, { k: 'ing', l: 'Ingredients (one per line)', t: 'textarea', v: r.ing.join('\n') }, { k: 'notes', l: 'Notes', t: 'textarea', v: r.notes || '' }],
  onSave: v => { v.ing = v.ing.split('\n').map(s => s.trim()).filter(Boolean); n ? S.meals.recipes.push({ id: uid(), ...v }) : Object.assign(r, v); }, onDel: n ? null : () => S.meals.recipes = S.meals.recipes.filter(x => x !== r) });
}
function txForm(x, type) {
 const n = !x; x = x || { type: type || 'out', amt: '', cat: type === 'in' ? 'salary' : 'food', date: TODAY(), note: '' };
 const cats = x.type === 'in' ? [['salary', 'Salary'], ['side', 'Side income'], ['gift', 'Gift'], ['other', 'Other']] : Object.entries(EXP_CATS).map(([k, v]) => [k, v[0]]);
 form({ title: n ? (x.type === 'in' ? 'Add income' : 'Add expense') : 'Edit entry', fields: [{ k: 'amt', l: 'Amount', t: 'number', step: '.01', v: x.amt, req: 1, half: 1 }, { k: 'date', l: 'Date', t: 'date', v: x.date, half: 1 }, { k: 'cat', l: 'Category', t: 'select', o: cats, v: x.cat }, { k: 'note', l: 'Description', v: x.note, ph: 'Groceries for the week' }],
  onSave: v => { v.amt = +v.amt || 0; n ? S.money.tx.push({ id: uid(), type: x.type, ...v }) : Object.assign(x, v); toast('Saved 💗'); }, onDel: n ? null : () => S.money.tx = S.money.tx.filter(y => y !== x) });
}
function billForm(b) {
 const n = !b; b = b || { name: '', amt: '', day: 1 };
 form({ title: n ? 'Add a monthly bill' : 'Edit bill', sub: 'Repeats every month — tick it when paid.', fields: [{ k: 'name', l: 'Bill', v: b.name, req: 1 }, { k: 'amt', l: 'Amount', t: 'number', step: '.01', v: b.amt, half: 1 }, { k: 'day', l: 'Due day of month', t: 'number', v: b.day, half: 1 }],
  onSave: v => { v.amt = +v.amt || 0; v.day = clamp(+v.day || 1, 1, 31); n ? S.money.bills.push({ id: uid(), paid: {}, ...v }) : Object.assign(b, v); }, onDel: n ? null : () => S.money.bills = S.money.bills.filter(y => y !== b) });
}
function adminForm(a) {
 const n = !a; a = a || { title: '', cat: 'renew', due: '', prio: 'med', status: 'todo', notes: '' };
 form({ title: n ? 'Add admin item' : 'Edit admin item', fields: [{ k: 'title', l: 'What needs doing?', v: a.title, req: 1 }, { k: 'cat', l: 'Category', t: 'select', o: Object.entries(ADMIN_CATS).map(([k, v]) => [k, v[0]]), v: a.cat }, { k: 'due', l: 'Deadline', t: 'date', v: a.due, half: 1 }, { k: 'prio', l: 'Priority', t: 'select', o: [['low', 'Low'], ['med', 'Medium'], ['high', 'High']], v: a.prio, half: 1 },
  { k: 'status', l: 'Status', t: 'select', o: [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Done']], v: a.status }, { k: 'notes', l: 'Notes', t: 'textarea', v: a.notes }],
  onSave: v => { n ? S.admin.push({ id: uid(), ...v }) : Object.assign(a, v); }, onDel: n ? null : () => S.admin = S.admin.filter(y => y !== a) });
}
function quickForm() {
 form({ title: 'Quick capture', sub: 'Catch it before it floats away.', submit: 'Capture', fields: [{ k: 'type', l: 'What is it?', t: 'select', o: [['task', '✅ Task for today'], ['dump', '☁️ Thought for the brain dump'], ['event', '🗓️ Event'], ['out', '💸 Expense'], ['admin', '📁 Life admin']] }, { k: 'text', l: 'Text', req: 1 }, { k: 'date', l: 'Date', t: 'date', v: TODAY(), half: 1 }, { k: 'amt', l: 'Amount (expenses)', t: 'number', step: '.01', half: 1 }],
  onSave: v => { const d = v.date || TODAY();
   if (v.type === 'task') S.tasks.push({ id: uid(), title: v.text, date: d, done: false, prio: 'med', energy: 'med', est: 15, area: 'Self', created: TODAY() });
   if (v.type === 'dump') S.dumps.unshift({ id: uid(), text: v.text, tag: 'note', created: TODAY() });
   if (v.type === 'event') S.events.push({ id: uid(), title: v.text, date: d, time: '', color: 'lav' });
   if (v.type === 'out') S.money.tx.push({ id: uid(), type: 'out', amt: +v.amt || 0, cat: 'other', date: d, note: v.text });
   if (v.type === 'admin') S.admin.push({ id: uid(), title: v.text, cat: 'health', due: d, prio: 'med', status: 'todo', notes: '' });
   toast('Captured ✨'); } });
}
function mealForm(d, k) {
 const cur = (S.meals.plan[d] || {})[k] || {}, nm = MEALK.find(m => m[0] === k)[1];
 form({ title: `${nm} · ${fmt(d, { weekday: 'long', month: 'short', day: 'numeric' })}`, fields: [{ k: 'rid', l: 'From a recipe', t: 'select', o: [['', '— none —']].concat(S.meals.recipes.map(r => [r.id, r.name])), v: cur.rid || '' }, { k: 'text', l: 'Or type a meal', v: cur.rid ? '' : cur.text || '', ph: 'Leftover pasta' }],
  onSave: v => { const day = S.meals.plan[d] = S.meals.plan[d] || {}; const r = S.meals.recipes.find(x => x.id === v.rid); if (r) day[k] = { rid: r.id, text: r.name }; else if (v.text.trim()) day[k] = { text: v.text.trim() }; else delete day[k]; },
  onDel: cur.text ? () => { delete S.meals.plan[d][k]; } : null });
}
function welcome() {
 document.body.insertAdjacentHTML('beforeend', `<div class="mask" id="mask"><form class="modal" id="wform" style="text-align:center"><div class="logo" style="margin:0 auto 10px;width:56px;height:56px;border-radius:18px">${ic('flower')}</div>
 <div style="font:400 44px Allura;color:var(--pri);line-height:1">Welcome</div><h3>to your Bloom life planner</h3><p class="small muted">A calmer way to organize everyday life. Everything is saved privately on this device.</p>
 <div class="f" style="text-align:left"><label>What should we call you?</label><input class="in" name="name" placeholder="Your first name"></div>
 <div class="f" style="text-align:left"><label>Pick a theme</label><select class="in" name="theme"><option value="blush">Blush Bloom (soft pink)</option><option value="lavender">Lavender Dream</option><option value="moonlight">Moonlight (dark)</option></select></div>
 <div class="col"><button class="btn pri" name="m" value="fresh" style="justify-content:center">${ic('spark')}Start my planner</button><button class="btn" name="m" value="sample" style="justify-content:center">Explore with sample data first</button></div></form></div>`);
 const f = $('#wform'); f.addEventListener('submit', e => { e.preventDefault(); const v = Object.fromEntries(new FormData(f)); const m = e.submitter?.value || 'fresh';
  if (m === 'sample') seed(); else starters(); S.settings.name = v.name || (m === 'sample' ? 'Sophie' : ''); S.settings.theme = v.theme; S.settings.onboarded = true; closeModal(); rerender(); });
}

/* actions */
const A = {
 menu: () => $('#side').classList.toggle('open'), close: closeModal, quick: quickForm, go: el => location.hash = el.dataset.id,
 theme: () => { const o = ['blush', 'lavender', 'moonlight']; S.settings.theme = o[(o.indexOf(S.settings.theme) + 1) % 3]; rerender(); },
 settheme: el => { S.settings.theme = el.dataset.id; rerender(); },
 addtask: el => taskForm(null, el.dataset.d), edittask: el => taskForm(find(S.tasks, el.dataset.id)), deltask: el => { S.tasks = S.tasks.filter(x => x.id !== el.dataset.id); rerender(); },
 task: el => { const t = find(S.tasks, el.dataset.id); t.done = !t.done; t.doneAt = t.done ? TODAY() : null; if (t.done) { if (!t.date) t.date = TODAY(); toast(['Nice work 🌸', 'Done! One less thing ✨', 'You did it 💗', 'Gentle progress 🌿'][Math.floor(Math.random() * 4)]); } rerender(); },
 energy: el => { S.energy[TODAY()] = el.dataset.id; (S.moods[TODAY()] = S.moods[TODAY()] || {}).energy = el.dataset.id; if (!S.moods[TODAY()].mood) delete S.moods[TODAY()].mood; rerender(); },
 tasktab: el => { UI.taskTab = el.dataset.id; render(); },
 focusTask: el => { FT.taskId = el.dataset.id; FT.label = find(S.tasks, el.dataset.id)?.title || ''; location.hash = 'focus'; },
 quickmood: el => { const d = TODAY(); S.moods[d] = Object.assign(S.moods[d] || { tags: [] }, { mood: +el.dataset.id, energy: S.energy[d] || S.moods[d]?.energy || 'med' }); toast('Check-in saved 🌷'); rerender(); },
 water: el => { const n = +el.dataset.id, t = TODAY(); S.water[t] = S.water[t] === n ? n - 1 : n; rerender(); },
 habit: el => { const h = find(S.habits, el.dataset.id), d = el.dataset.d; if (h.log[d]) delete h.log[d]; else { h.log[d] = 1; toast('Habit checked ✨'); } rerender(); },
 addhabit: () => habitForm(), edithabit: el => habitForm(find(S.habits, el.dataset.id)), delhabit: el => { if (confirm('Delete this habit and its history?')) { S.habits = S.habits.filter(x => x.id !== el.dataset.id); rerender(); } },
 hweek: el => { UI.habitDay = addDays(UI.habitDay, +el.dataset.id); if (UI.habitDay > TODAY()) UI.habitDay = TODAY(); render(); },
 dumptag: el => { UI.dumpTag = el.dataset.id; render(); }, deldump: el => { S.dumps = S.dumps.filter(x => x.id !== el.dataset.id); rerender(); },
 editdump: el => { const d = find(S.dumps, el.dataset.id); form({ title: 'Edit thought', fields: [{ k: 'text', l: 'Thought', t: 'textarea', v: d.text }, { k: 'tag', l: 'Type', t: 'select', o: Object.entries(DTAGS).map(([k, v]) => [k, v[0]]), v: d.tag }], onSave: v => Object.assign(d, v), onDel: () => S.dumps = S.dumps.filter(x => x !== d) }); },
 dump2task: el => { const d = find(S.dumps, el.dataset.id); S.tasks.push({ id: uid(), title: d.text, date: TODAY(), done: false, prio: 'med', energy: 'med', est: 15, area: 'Self', created: TODAY() }); S.dumps = S.dumps.filter(x => x !== d); toast('Moved to today’s tasks'); rerender(); },
 dump2goal: el => { const d = find(S.dumps, el.dataset.id); S.dumps = S.dumps.filter(x => x !== d); goalForm(null, d.text); },
 calnav: el => { const [y, m] = UI.cal.split('-').map(Number); const d = new Date(y, m - 1 + +el.dataset.id, 1); UI.cal = iso(d).slice(0, 7); render(); },
 caltoday: () => { UI.cal = TODAY().slice(0, 7); UI.calSel = TODAY(); render(); }, calsel: el => { UI.calSel = el.dataset.id; render(); },
 addevent: el => eventForm(null, el.dataset.d), editevent: el => eventForm(find(S.events, el.dataset.id)), delevent: el => { S.events = S.events.filter(x => x.id !== el.dataset.id); rerender(); },
 rtab: el => { UI.routineTab = el.dataset.id; render(); }, addroutine: () => routineForm(), editroutine: el => routineForm(find(S.routines, el.dataset.id)), delroutine: el => { if (confirm('Delete this routine?')) { S.routines = S.routines.filter(x => x.id !== el.dataset.id); rerender(); } },
 rstep: el => { const r = find(S.routines, el.dataset.id), t = TODAY(), l = r.log[t] = r.log[t] || [], i = l.indexOf(el.dataset.s); i >= 0 ? l.splice(i, 1) : l.push(el.dataset.s); if (l.length === r.steps.length) toast('Routine complete 🌸'); rerender(); },
 delrstep: el => { const r = find(S.routines, el.dataset.id); r.steps = r.steps.filter(s => s.id !== el.dataset.s); rerender(); },
 step2task: el => { const r = find(S.routines, el.dataset.id), s = r.steps.find(x => x.id === el.dataset.s); S.tasks.push({ id: uid(), title: s.t, date: TODAY(), done: false, prio: 'low', energy: 'low', est: s.m || 5, area: 'Self', created: TODAY() }); toast('Added to today'); rerender(); },
 goaltab: el => { UI.goalTab = el.dataset.id; render(); }, addgoal: () => goalForm(), editgoal: el => goalForm(find(S.goals, el.dataset.id)), delgoal: el => { if (confirm('Delete this goal?')) { S.goals = S.goals.filter(x => x.id !== el.dataset.id); rerender(); } },
 gstep: el => { const g = find(S.goals, el.dataset.id), s = g.steps.find(x => x.id === el.dataset.s); s.done = !s.done; if (goalProg(g) === 100) toast('Goal complete! 🎉'); rerender(); },
 delgstep: el => { const g = find(S.goals, el.dataset.id); g.steps = g.steps.filter(s => s.id !== el.dataset.s); rerender(); },
 fpreset: el => { if (FT.run) return toast('Pause the timer first'); FT.len = FT.left = +el.dataset.id * 60; render(); },
 fstart: () => { if (FT.run) { FT.run = false; FT.left = Math.max(0, Math.ceil((FT.end - Date.now()) / 1000)); } else { FT.run = true; FT.end = Date.now() + FT.left * 1000; } render(); },
 freset: () => { FT.run = false; FT.left = FT.len; document.title = 'Bloom Life Planner'; render(); },
 moodday: el => { UI.moodDay = addDays(UI.moodDay, +el.dataset.id); if (UI.moodDay > TODAY()) UI.moodDay = TODAY(); render(); }, mrange: el => { UI.moodRange = +el.dataset.id; render(); },
 pickmood: el => { el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); },
 pickenergy: el => { el.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === el)); }, picktag: el => el.classList.toggle('on'),
 addsc: () => scForm(), editsc: el => scForm(find(S.selfcare, el.dataset.id)), delsc: el => { S.selfcare = S.selfcare.filter(x => x.id !== el.dataset.id); rerender(); },
 sc: el => { const s = find(S.selfcare, el.dataset.id); s.done = !s.done; if (s.done) toast('Beautiful — you made time for you 💗'); rerender(); },
 scidea: el => { const [t, c, m] = el.dataset.id.split('|'); S.selfcare.push({ id: uid(), title: t, cat: c, mins: +m, date: TODAY(), time: '', done: false }); toast('Added to today'); rerender(); },
 dopapick: () => { const all = Object.entries(S.dopa).flatMap(([k, l]) => l.map(x => [k, x])); if (!all.length) return toast('Add a few items first'); const [k, x] = all[Math.floor(Math.random() * all.length)]; form({ title: '✨ ' + x, sub: `From your ${k}. Set a timer and enjoy it fully.`, submit: 'Lovely', fields: [], onSave: () => { } }); },
 deldopa: el => { S.dopa[el.dataset.id].splice(+el.dataset.s, 1); rerender(); },
 addroom: () => roomForm(), editroom: el => roomForm(find(S.rooms, el.dataset.id)), delroom: el => { if (confirm('Delete this room?')) { S.rooms = S.rooms.filter(x => x.id !== el.dataset.id); rerender(); } },
 rmstep: el => { const r = find(S.rooms, el.dataset.id), s = r.steps.find(x => x.id === el.dataset.s); s.done = !s.done; if (r.steps.every(x => x.done)) toast(r.name + ' is reset ✨'); rerender(); },
 delrmstep: el => { const r = find(S.rooms, el.dataset.id); r.steps = r.steps.filter(s => s.id !== el.dataset.s); rerender(); },
 resetrooms: () => { if (confirm('Untick every step for a fresh week?')) { S.rooms.forEach(r => r.steps.forEach(s => s.done = false)); rerender(); } },
 quickreset: () => { const open = S.rooms.flatMap(r => r.steps.filter(s => !s.done).map(s => r.name + ': ' + s.t)).slice(0, 4); FT.len = FT.left = 15 * 60; FT.label = '15-minute home reset'; toast('Timer set for 15 minutes'); form({ title: '15-minute reset', sub: 'Set the timer in Focus Space and do just these:', submit: 'Go to timer', fields: [{ k: 'x', l: 'Your mini list', t: 'textarea', v: open.join('\n') || 'Everything is already done 🎉' }], onSave: () => { location.hash = 'focus'; } }); },
 mealtab: el => { UI.mealTab = el.dataset.id; render(); }, mealweek: el => { UI.mealWeek = +el.dataset.id ? addDays(UI.mealWeek, +el.dataset.id) : TODAY(); render(); },
 setmeal: el => mealForm(el.dataset.id, el.dataset.s), addrecipe: () => recipeForm(), editrecipe: el => recipeForm(find(S.meals.recipes, el.dataset.id)), delrecipe: el => { S.meals.recipes = S.meals.recipes.filter(x => x.id !== el.dataset.id); rerender(); },
 gengroc: () => { const have = new Set(S.meals.grocery.map(g => g.text.toLowerCase())); let n = 0; weekDays(UI.mealWeek).forEach(d => Object.values(S.meals.plan[d] || {}).forEach(m => { const r = m.rid && S.meals.recipes.find(x => x.id === m.rid); (r ? r.ing : []).forEach(i => { if (!have.has(i.toLowerCase())) { have.add(i.toLowerCase()); S.meals.grocery.push({ id: uid(), text: i, cat: 'Other', done: false }); n++; } }); })); toast(n ? `${n} ingredients added to your list 🛒` : 'Your list already has everything'); UI.mealTab = 'gro'; rerender(); },
 groc: el => { const g = find(S.meals.grocery, el.dataset.id); g.done = !g.done; rerender(); }, delgroc: el => { S.meals.grocery = S.meals.grocery.filter(x => x.id !== el.dataset.id); rerender(); }, clearbought: () => { S.meals.grocery = S.meals.grocery.filter(g => !g.done); rerender(); },
 mmonth: el => { const d = D(UI.moneyMonth + '-15'); d.setMonth(d.getMonth() + +el.dataset.id); UI.moneyMonth = iso(d).slice(0, 7); render(); }, mtab: el => { UI.moneyTab = el.dataset.id; render(); },
 addtx: () => txForm(null, UI.moneyTab), edittx: el => txForm(find(S.money.tx, el.dataset.id)), deltx: el => { S.money.tx = S.money.tx.filter(x => x.id !== el.dataset.id); rerender(); },
 addbill: () => billForm(), editbill: el => billForm(find(S.money.bills, el.dataset.id)), delbill: el => { S.money.bills = S.money.bills.filter(x => x.id !== el.dataset.id); rerender(); },
 bill: el => { const b = find(S.money.bills, el.dataset.id), M = UI.moneyMonth; if (b.paid[M]) delete b.paid[M]; else { b.paid[M] = 1; toast(b.name + ' marked paid'); } rerender(); },
 setbudget: () => form({ title: 'Monthly spending budget', fields: [{ k: 'b', l: 'Budget amount', t: 'number', step: '.01', v: S.money.budget }], onSave: v => { S.money.budget = +v.b || 0; } }),
 admintab: el => { UI.adminTab = el.dataset.id; render(); }, addadmin: () => adminForm(), editadmin: el => adminForm(find(S.admin, el.dataset.id)), deladmin: el => { S.admin = S.admin.filter(x => x.id !== el.dataset.id); rerender(); },
 admindone: el => { const a = find(S.admin, el.dataset.id); a.status = a.status === 'done' ? 'todo' : 'done'; if (a.status === 'done') toast('Handled with care ✨'); rerender(); },
 adminstatus: el => { const a = find(S.admin, el.dataset.id); a.status = { todo: 'doing', doing: 'done', done: 'todo' }[a.status]; rerender(); },
 backup: () => { const blob = new Blob([JSON.stringify({ app: 'wtn-bloom-life-planner', version: 1, exported: new Date().toISOString(), data: S }, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `bloom-life-planner-backup-${TODAY()}.json`; a.click(); S.start.backup = 1; toast('Backup downloaded 💾'); rerender(); },
 loadsample: () => { if (S.tasks.length && !confirm('Replace your current data with sample data?')) return; const th = S.settings.theme; seed(); S.settings.theme = th; rerender(); toast('Sample data loaded 🌸'); },
 clearall: () => { if (confirm('Erase everything in this planner? Download a backup first if you might need it.')) { const th = S.settings.theme; S = blank(); starters(); S.settings.onboarded = true; S.settings.theme = th; rerender(); toast('Planner cleared'); } },
 hidestart: () => { S.start.hide = 1; rerender(); },
};
function onSubmit(e) {
 const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault(); const v = Object.fromEntries(new FormData(f)), k = f.dataset.form, id = f.dataset.id;
 const nt = (title, date) => S.tasks.push({ id: uid(), title, date, done: false, prio: 'med', energy: 'med', est: 15, area: 'Self', created: TODAY() });
 if (k === 'qtask' && v.t.trim()) { nt(v.t.trim(), TODAY()); toast('Added 🌸'); }
 if (k === 'qtask2' && v.t.trim()) nt(v.t.trim(), v.w === 'today' ? TODAY() : v.w === 'tomorrow' ? addDays(TODAY(), 1) : '');
 if (k === 'dump') { const lines = v.t.split('\n').map(s => s.trim()).filter(Boolean); lines.reverse().forEach(l => S.dumps.unshift({ id: uid(), text: l, tag: v.tag, created: TODAY() })); if (lines.length) toast(`${lines.length} thought${lines.length > 1 ? 's' : ''} unloaded ☁️`); }
 if (k === 'rstep' && v.t.trim()) find(S.routines, id).steps.push({ id: uid(), t: v.t.trim(), m: +v.m || 2 });
 if (k === 'gstep' && v.t.trim()) find(S.goals, id).steps.push({ id: uid(), t: v.t.trim(), done: false });
 if (k === 'rmstep' && v.t.trim()) find(S.rooms, id).steps.push({ id: uid(), t: v.t.trim(), done: false });
 if (k === 'dopa' && v.t.trim()) S.dopa[id].push(v.t.trim());
 if (k === 'groc' && v.t.trim()) S.meals.grocery.push({ id: uid(), text: v.t.trim(), cat: v.c, done: false });
 if (k === 'mood') { const mb = f.querySelector('.moods .on'), eb = f.querySelector('.energy .on'), d = UI.moodDay; if (!mb) return toast('Pick a mood first 🌷');
  S.moods[d] = { mood: +mb.dataset.id, energy: eb ? eb.dataset.id : 'med', tags: [...f.querySelectorAll('.tag.on')].map(x => x.dataset.id), note: v.note, sleep: v.sleep === '' ? null : +v.sleep };
  if (v.water !== '') S.water[d] = +v.water; S.energy[d] = S.moods[d].energy; toast('Check-in saved 🌷'); }
 if (k === 'journal') { S.journal[TODAY()] = { grateful: [v.g0, v.g1, v.g2], text: v.text }; toast('Entry saved 📖'); }
 if (k === 'review') { S.reviews[weekStart(TODAY())] = { wins: v.wins, hard: v.hard, lessons: v.lessons, next: v.next, rate: +v.rate || null }; toast('Weekly review saved 🌿'); }
 if (k === 'settings') { Object.assign(S.settings, { name: v.name, focus: v.focus, currency: v.currency, weekStart: +v.weekStart, water: clamp(+v.water || 8, 1, 16) }); toast('Settings saved'); }
 if (k === 'afford') { const a = +v.a, left = (+S.money.budget || 0) - sum(S.money.tx.filter(x => x.type === 'out' && ym(x.date) === ym(TODAY())).map(x => x.amt)); $('#affordout').innerHTML = !a ? 'Type a price first' : a <= left * .5 ? `✅ Yes — you'd still have <b>${money(left - a)}</b> left.` : a <= left ? `🌷 You can, but it leaves only <b>${money(left - a)}</b>. Sleep on it?` : `☁️ Not this month — it's <b>${money(a - left)}</b> over what's left.`; return; }
 rerender();
}
function tick() {
 if (!FT.run) return; FT.left = Math.max(0, Math.ceil((FT.end - Date.now()) / 1000));
 const tt = $('#ftime'), r = $('#fring'), C = 2 * Math.PI * 100; if (tt) tt.textContent = `${pad(Math.floor(FT.left / 60))}:${pad(FT.left % 60)}`; if (r) r.setAttribute('stroke-dashoffset', C * FT.left / FT.len);
 document.title = `${pad(Math.floor(FT.left / 60))}:${pad(FT.left % 60)} · Focus`;
 if (FT.left <= 0) { FT.run = false; const t = FT.taskId && find(S.tasks, FT.taskId); S.focus.push({ id: uid(), date: TODAY(), mins: Math.round(FT.len / 60), label: t ? t.title : FT.label || 'Pure focus session', at: new Date().toTimeString().slice(0, 5) }); FT.left = FT.len; document.title = 'Bloom Life Planner'; toast('Focus session complete 🌸 Take a breath.'); try { navigator.vibrate && navigator.vibrate(200); } catch (e) { } rerender(); }
}
function route() { const v = location.hash.slice(1) || 'today'; UI.view = VIEWS[v] ? v : 'today'; render(); window.scrollTo(0, 0); }
function init() {
 load(); window.addEventListener('hashchange', route);
 document.addEventListener('click', e => { const el = e.target.closest('[data-a]'); if (el && A[el.dataset.a]) { e.preventDefault(); A[el.dataset.a](el); } else if (e.target.closest('.nav a')) $('#side')?.classList.remove('open'); });
 document.addEventListener('submit', onSubmit);
 document.addEventListener('change', e => { const el = e.target;
  if (el.dataset.a2 === 'ftask') { FT.taskId = el.value; FT.label = el.value ? find(S.tasks, el.value)?.title : ''; }
  if (el.dataset.a2 === 'fcustom' && +el.value > 0 && !FT.run) { FT.len = FT.left = clamp(+el.value, 1, 180) * 60; render(); }
  if (el.name === 'rate') el.closest('form').querySelectorAll('input[name=rate]').forEach(r => { const s = r.nextElementSibling; s.classList.toggle('on', r.checked); s.style.background = r.checked ? 'var(--pri)' : ''; });
  if (el.dataset.a2 === 'restore' && el.files[0]) { const rd = new FileReader(); rd.onload = () => { try { const j = JSON.parse(rd.result), d = j.data || j; if (!d.v) throw 0; if (confirm('Replace everything in this planner with the backup?')) { S = Object.assign(blank(), d); rerender(); toast('Backup restored 💗'); } } catch (x) { toast('That file is not a Bloom backup'); } }; rd.readAsText(el.files[0]); } });
 document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
 setInterval(tick, 250); route();
 if (!S.settings.onboarded) welcome();
 if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !window.BLOOM_NOSW) navigator.serviceWorker.register('sw.js').catch(() => { });
}
document.addEventListener('DOMContentLoaded', init);
