<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"/>
<title>PrepPair — Daily Goal Tracker</title>
<meta name="theme-color" content="#0a0a0a"/>
<meta name="apple-mobile-web-app-capable" content="yes"/>
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
:root {
  --bg: #0a0a0a;
  --bg2: #111111;
  --bg3: #1a1a1a;
  --card: #141414;
  --border: rgba(255,255,255,0.07);
  --border2: rgba(255,255,255,0.12);
  --text: #f0f0f0;
  --muted: #888;
  --muted2: #555;
  --accent: #c8f135;
  --accent2: #a8d420;
  --accent-dim: rgba(200,241,53,0.12);
  --accent-glow: rgba(200,241,53,0.25);
  --friend: #35c8f1;
  --friend-dim: rgba(53,200,241,0.12);
  --danger: #f13535;
  --success: #35f177;
  --radius: 16px;
  --radius-sm: 10px;
  --font-head: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  height: 100%;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 15px;
  line-height: 1.5;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

/* ── Noise texture overlay ── */
body::before {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 0; opacity: 0.4;
}

/* ── App shell ── */
#app { min-height: 100vh; position: relative; z-index: 1; }

/* ── Screens ── */
.screen { display: none; min-height: 100vh; }
.screen.active { display: flex; flex-direction: column; }

/* ════════════════════════════════════
   LOGIN SCREEN
════════════════════════════════════ */
#screen-login {
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(200,241,53,0.08) 0%, transparent 70%);
}

.login-wrap {
  width: 100%; max-width: 380px;
  display: flex; flex-direction: column; align-items: center;
  gap: 2rem;
}

.logo-mark {
  width: 72px; height: 72px;
  background: var(--accent);
  border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head);
  font-size: 28px; font-weight: 800;
  color: #0a0a0a;
  box-shadow: 0 0 40px var(--accent-glow);
  animation: logoFloat 3s ease-in-out infinite;
}
@keyframes logoFloat {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.login-title {
  font-family: var(--font-head);
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-align: center;
  line-height: 1.1;
}
.login-title span { color: var(--accent); }

.login-sub {
  color: var(--muted);
  text-align: center;
  font-size: 0.9rem;
  margin-top: -1rem;
}

.login-form {
  width: 100%;
  display: flex; flex-direction: column; gap: 12px;
}

.input-group {
  display: flex; flex-direction: column; gap: 6px;
}
.input-group label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
.input-group input {
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  width: 100%;
}
.input-group input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.input-group input::placeholder { color: var(--muted2); }

.btn-primary {
  background: var(--accent);
  color: #0a0a0a;
  border: none;
  border-radius: var(--radius-sm);
  padding: 13px 20px;
  font-family: var(--font-head);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
  letter-spacing: 0.01em;
}
.btn-primary:hover {
  background: var(--accent2);
  box-shadow: 0 0 20px var(--accent-glow);
  transform: translateY(-1px);
}
.btn-primary:active { transform: scale(0.98); }

.login-divider {
  display: flex; align-items: center; gap: 12px;
  color: var(--muted2); font-size: 0.8rem;
}
.login-divider::before, .login-divider::after {
  content: ''; flex: 1;
  height: 1px; background: var(--border);
}

.btn-secondary {
  background: var(--bg3);
  color: var(--text);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 12px 20px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  text-align: center;
}
.btn-secondary:hover { background: var(--bg2); border-color: var(--border2); }

.room-info {
  background: var(--accent-dim);
  border: 1px solid rgba(200,241,53,0.2);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  font-size: 0.82rem;
  color: var(--accent2);
  text-align: center;
  line-height: 1.5;
}

/* ════════════════════════════════════
   MAIN APP SCREEN
════════════════════════════════════ */
#screen-app {
  background: var(--bg);
  flex-direction: column;
}

/* ── Top bar ── */
.topbar {
  padding: 16px 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  background: rgba(10,10,10,0.9);
  backdrop-filter: blur(12px);
  position: sticky; top: 0; z-index: 100;
}
.topbar-left {
  display: flex; align-items: center; gap: 10px;
}
.topbar-logo {
  width: 32px; height: 32px;
  background: var(--accent);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head);
  font-size: 13px; font-weight: 800;
  color: #0a0a0a;
}
.topbar-title {
  font-family: var(--font-head);
  font-size: 1rem; font-weight: 700;
  letter-spacing: -0.01em;
}
.topbar-date {
  font-size: 0.75rem;
  color: var(--muted);
  margin-top: 1px;
}
.topbar-right { display: flex; align-items: center; gap: 10px; }

.avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head);
  font-size: 13px; font-weight: 700;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}
.avatar.you { background: var(--accent); color: #0a0a0a; border-color: var(--accent); }
.avatar.friend { background: var(--friend); color: #0a0a0a; }

.live-dot {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.72rem; color: var(--success);
  font-weight: 500;
}
.live-dot::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--success);
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

/* ── Tab bar ── */
.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  padding: 0 20px;
}
.tab {
  flex: 1;
  padding: 12px 8px;
  text-align: center;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s, border-color 0.2s;
  position: relative;
}
.tab.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab .tab-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px;
  border-radius: 50%;
  background: var(--accent);
  color: #0a0a0a;
  font-size: 0.65rem; font-weight: 700;
  margin-left: 5px;
  vertical-align: middle;
}

/* ── Content area ── */
.content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Tab panels ── */
.tab-panel { display: none; flex-direction: column; gap: 16px; }
.tab-panel.active { display: flex; }

/* ── Progress ring card ── */
.progress-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.progress-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s;
}
.progress-card.you-card { border-color: rgba(200,241,53,0.2); }
.progress-card.friend-card { border-color: rgba(53,200,241,0.15); }

.ring-wrap {
  position: relative;
  width: 80px; height: 80px;
}
.ring-svg { transform: rotate(-90deg); }
.ring-track { fill: none; stroke: var(--bg3); stroke-width: 6; }
.ring-progress {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1);
}
.ring-progress.you { stroke: var(--accent); }
.ring-progress.friend { stroke: var(--friend); }
.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-head);
  font-size: 1.1rem;
  font-weight: 800;
}
.pc-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.pc-stats {
  font-size: 0.72rem;
  color: var(--muted2);
}
.pc-streak {
  font-size: 0.75rem;
  font-weight: 600;
  display: flex; align-items: center; gap: 4px;
}
.pc-streak.you { color: var(--accent); }
.pc-streak.friend { color: var(--friend); }

/* ── Section headers ── */
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}
.section-title {
  font-family: var(--font-head);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── Add goal bar ── */
.add-goal-bar {
  display: flex;
  gap: 8px;
  align-items: center;
}
.add-goal-input {
  flex: 1;
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 11px 14px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.add-goal-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}
.add-goal-input::placeholder { color: var(--muted2); }
.btn-add {
  width: 40px; height: 40px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  border: none;
  color: #0a0a0a;
  font-size: 1.4rem;
  font-weight: 300;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.15s;
}
.btn-add:hover { background: var(--accent2); transform: scale(1.05); }
.btn-add:active { transform: scale(0.95); }

/* ── Category pills ── */
.cat-pills {
  display: flex; gap: 6px; flex-wrap: wrap;
}
.cat-pill {
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border2);
  background: var(--bg3);
  color: var(--muted);
  transition: all 0.15s;
}
.cat-pill.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

/* ── Goal items ── */
.goals-list {
  display: flex; flex-direction: column; gap: 8px;
}
.goal-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 13px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.2s, background 0.2s;
  animation: slideIn 0.25s ease;
  cursor: default;
}
@keyframes slideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
.goal-item.done {
  background: rgba(53,241,119,0.04);
  border-color: rgba(53,241,119,0.12);
}
.goal-item.done .goal-text {
  text-decoration: line-through;
  color: var(--muted2);
}

.goal-check {
  width: 24px; height: 24px;
  border-radius: 50%;
  border: 2px solid var(--border2);
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s;
  color: transparent;
  font-size: 12px;
}
.goal-check:hover { border-color: var(--accent); }
.goal-item.done .goal-check {
  background: var(--success);
  border-color: var(--success);
  color: #0a0a0a;
}

.goal-text {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 400;
  transition: color 0.2s;
}
.goal-cat-tag {
  font-size: 0.68rem;
  padding: 2px 8px;
  border-radius: 100px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  flex-shrink: 0;
}
.goal-delete {
  width: 22px; height: 22px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: var(--muted2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.goal-delete:hover { color: var(--danger); background: rgba(241,53,53,0.1); }

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--muted2);
  font-size: 0.85rem;
}
.empty-state .empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.empty-state p { line-height: 1.6; }

/* Category tag colors */
.tag-dsa { background: rgba(200,241,53,0.12); color: var(--accent); }
.tag-system { background: rgba(53,200,241,0.12); color: var(--friend); }
.tag-mock { background: rgba(241,53,241,0.12); color: #f135f1; }
.tag-revision { background: rgba(241,165,53,0.12); color: #f1a535; }
.tag-other { background: rgba(255,255,255,0.06); color: var(--muted); }

/* ── Friend tab ── */
.friend-header-card {
  background: var(--friend-dim);
  border: 1px solid rgba(53,200,241,0.15);
  border-radius: var(--radius);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}
.friend-avatar-lg {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--friend);
  color: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-head);
  font-size: 18px; font-weight: 800;
  flex-shrink: 0;
}
.friend-info h3 {
  font-family: var(--font-head);
  font-size: 1rem;
  font-weight: 700;
}
.friend-info p {
  font-size: 0.78rem;
  color: var(--muted);
  margin-top: 2px;
}
.friend-progress-bar-wrap { margin-top: 8px; }
.friend-progress-label {
  display: flex; justify-content: space-between;
  font-size: 0.75rem;
  color: var(--muted);
  margin-bottom: 5px;
}
.friend-progress-bar {
  height: 5px;
  background: var(--bg3);
  border-radius: 10px;
  overflow: hidden;
}
.friend-progress-fill {
  height: 100%;
  background: var(--friend);
  border-radius: 10px;
  transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
}

.friend-goal-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.friend-goal-item.done .friend-goal-text {
  text-decoration: line-through;
  color: var(--muted2);
}
.friend-goal-check {
  width: 22px; height: 22px;
  border-radius: 50%;
  border: 2px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  flex-shrink: 0;
}
.friend-goal-item.done .friend-goal-check {
  background: var(--friend);
  border-color: var(--friend);
  color: #0a0a0a;
}
.friend-goal-text { flex: 1; font-size: 0.88rem; color: var(--text); }

/* ── Reactions / chat tab ── */
.reaction-stream {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.reaction-msg {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  animation: slideIn 0.2s ease;
}
.reaction-msg.mine { flex-direction: row-reverse; }
.rm-avatar {
  width: 30px; height: 30px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
  flex-shrink: 0;
}
.rm-avatar.you { background: var(--accent); color: #0a0a0a; }
.rm-avatar.friend { background: var(--friend); color: #0a0a0a; }
.rm-bubble {
  background: var(--bg3);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 9px 13px;
  font-size: 0.88rem;
  max-width: 80%;
  line-height: 1.4;
}
.reaction-msg.mine .rm-bubble {
  background: var(--accent-dim);
  border-color: rgba(200,241,53,0.2);
}
.rm-time { font-size: 0.68rem; color: var(--muted2); margin-top: 3px; }

.quick-reacts {
  display: flex; gap: 8px; flex-wrap: wrap;
}
.quick-react-btn {
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: 100px;
  padding: 7px 14px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, transform 0.1s;
  color: var(--text);
}
.quick-react-btn:hover {
  background: var(--accent-dim);
  border-color: var(--accent);
  transform: scale(1.05);
}
.quick-react-btn:active { transform: scale(0.95); }

.chat-input-row {
  display: flex; gap: 8px;
  position: sticky; bottom: 0;
  background: var(--bg);
  padding-top: 12px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
}
.chat-input {
  flex: 1;
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: 100px;
  padding: 10px 16px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus { border-color: var(--accent); }
.chat-send {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  color: #0a0a0a;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s, transform 0.1s;
}
.chat-send:hover { background: var(--accent2); }
.chat-send:active { transform: scale(0.92); }

/* ── Stats tab ── */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
  display: flex; flex-direction: column; gap: 4px;
}
.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--muted);
}
.stat-value {
  font-family: var(--font-head);
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
}
.stat-value.accent { color: var(--accent); }
.stat-value.friend { color: var(--friend); }
.stat-sub {
  font-size: 0.72rem;
  color: var(--muted2);
}

.week-chart {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.week-bars {
  display: flex;
  gap: 6px;
  align-items: flex-end;
  height: 80px;
  margin-top: 12px;
}
.week-bar-wrap {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.week-bar-pair {
  flex: 1; width: 100%;
  display: flex; gap: 2px; align-items: flex-end;
}
.week-bar {
  flex: 1;
  border-radius: 3px 3px 0 0;
  min-height: 3px;
  transition: height 0.5s ease;
}
.week-bar.you { background: var(--accent); opacity: 0.85; }
.week-bar.friend { background: var(--friend); opacity: 0.75; }
.week-day {
  font-size: 0.65rem;
  color: var(--muted2);
  text-align: center;
}
.week-legend {
  display: flex; gap: 16px; margin-top: 12px;
}
.legend-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 0.75rem; color: var(--muted);
}
.legend-dot {
  width: 8px; height: 8px; border-radius: 50%;
}

/* ── Settings tab ── */
.settings-section { display: flex; flex-direction: column; gap: 8px; }
.settings-row {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.settings-row-left { display: flex; flex-direction: column; gap: 2px; }
.settings-row-label { font-size: 0.9rem; font-weight: 500; }
.settings-row-sub { font-size: 0.75rem; color: var(--muted); }
.toggle {
  width: 44px; height: 24px;
  border-radius: 100px;
  background: var(--bg3);
  border: 1px solid var(--border2);
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle.on { background: var(--accent); border-color: var(--accent); }
.toggle::after {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: white;
  top: 2px; left: 2px;
  transition: transform 0.2s;
}
.toggle.on::after { transform: translateX(20px); }

.room-code-box {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
.room-code-display {
  font-family: 'Courier New', monospace;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent);
  text-align: center;
  margin: 10px 0;
}
.btn-copy {
  width: 100%;
  background: var(--bg3);
  border: 1px solid var(--border2);
  border-radius: var(--radius-sm);
  padding: 10px;
  color: var(--text);
  font-family: var(--font-body);
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.btn-copy:hover { background: var(--bg2); }
.btn-logout {
  width: 100%;
  background: rgba(241,53,53,0.08);
  border: 1px solid rgba(241,53,53,0.2);
  border-radius: var(--radius-sm);
  padding: 12px;
  color: var(--danger);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-logout:hover { background: rgba(241,53,53,0.14); }

/* ── Toast ── */
.toast {
  position: fixed;
  bottom: 24px; left: 50%;
  transform: translateX(-50%) translateY(20px);
  background: var(--card);
  border: 1px solid var(--border2);
  border-radius: 100px;
  padding: 10px 20px;
  font-size: 0.85rem;
  font-weight: 500;
  opacity: 0;
  transition: all 0.3s;
  z-index: 999;
  white-space: nowrap;
  pointer-events: none;
}
.toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ── Bottom nav (mobile feel) ── */
.bottom-nav {
  display: none;
  position: fixed; bottom: 0; left: 0; right: 0;
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--border);
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 100;
}
@media (max-width: 600px) {
  .bottom-nav { display: flex; }
  .tab-bar { display: none; }
  .content { padding-bottom: 80px; }
}
.bnav-item {
  flex: 1;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.2s;
  color: var(--muted2);
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.bnav-item.active { color: var(--accent); }
.bnav-icon { font-size: 1.25rem; }

/* ── Responsive ── */
@media (max-width: 360px) {
  .progress-cards { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: 1fr; }
}

/* ── Animations ── */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.screen.active { animation: fadeIn 0.3s ease; }
</style>
</head>
<body>
<div id="app">

<!-- ══════════════════════════════════
     LOGIN SCREEN
══════════════════════════════════ -->
<div id="screen-login" class="screen active">
  <div class="login-wrap">
    <div class="logo-mark">PP</div>
    <div>
      <h1 class="login-title">Prep<span>Pair</span></h1>
      <p class="login-sub">Track goals. Stay accountable. Crush it together.</p>
    </div>
    <div class="login-form">
      <div class="input-group">
        <label>Your name</label>
        <input type="text" id="login-name" placeholder="e.g. Arjun" maxlength="20"/>
      </div>
      <div class="input-group">
        <label>Room code <span style="color:var(--muted2);font-size:0.72em">(share with friend)</span></label>
        <input type="text" id="login-room" placeholder="e.g. PREP2025" maxlength="12" style="text-transform:uppercase;letter-spacing:0.08em"/>
      </div>
      <div class="input-group">
        <label>Your role</label>
        <select id="login-role" style="background:var(--bg3);border:1px solid var(--border2);border-radius:10px;padding:12px 14px;color:var(--text);font-family:var(--font-body);font-size:0.95rem;outline:none;width:100%;appearance:none;">
          <option value="you">Player 1 (You)</option>
          <option value="friend">Player 2 (Friend)</option>
        </select>
      </div>
      <div class="room-info">
        💡 Both you and your friend open this app, enter the <strong>same room code</strong>, and choose different roles. That's it — you're paired!
      </div>
      <button class="btn-primary" onclick="doLogin()">Enter Room →</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════
     MAIN APP SCREEN
══════════════════════════════════ -->
<div id="screen-app" class="screen">

  <!-- Top bar -->
  <div class="topbar">
    <div class="topbar-left">
      <div class="topbar-logo">PP</div>
      <div>
        <div class="topbar-title" id="topbar-room">Room: —</div>
        <div class="topbar-date" id="topbar-date"></div>
      </div>
    </div>
    <div class="topbar-right">
      <div class="live-dot">Live</div>
      <div class="avatar you" id="topbar-avatar" title="You">Y</div>
    </div>
  </div>

  <!-- Tab bar (desktop) -->
  <div class="tab-bar">
    <div class="tab active" onclick="switchTab('goals')" id="tab-goals">My Goals</div>
    <div class="tab" onclick="switchTab('friend')" id="tab-friend">Friend <span class="tab-badge" id="friend-badge" style="display:none">0</span></div>
    <div class="tab" onclick="switchTab('chat')" id="tab-chat">Chat <span class="tab-badge" id="chat-badge" style="display:none">0</span></div>
    <div class="tab" onclick="switchTab('stats')" id="tab-stats">Stats</div>
    <div class="tab" onclick="switchTab('settings')" id="tab-settings">⚙</div>
  </div>

  <!-- Content -->
  <div class="content">

    <!-- ── MY GOALS TAB ── -->
    <div class="tab-panel active" id="panel-goals">

      <!-- Progress rings -->
      <div class="progress-cards">
        <div class="progress-card you-card">
          <div class="ring-wrap">
            <svg class="ring-svg" width="80" height="80" viewBox="0 0 80 80">
              <circle class="ring-track" cx="40" cy="40" r="35"/>
              <circle class="ring-progress you" id="ring-you" cx="40" cy="40" r="35"/>
            </svg>
            <div class="ring-label" id="ring-you-pct" style="color:var(--accent)">0%</div>
          </div>
          <div class="pc-name">You</div>
          <div class="pc-stats" id="you-stats">0 / 0 done</div>
          <div class="pc-streak you" id="you-streak">🔥 0 day streak</div>
        </div>
        <div class="progress-card friend-card">
          <div class="ring-wrap">
            <svg class="ring-svg" width="80" height="80" viewBox="0 0 80 80">
              <circle class="ring-track" cx="40" cy="40" r="35"/>
              <circle class="ring-progress friend" id="ring-friend" cx="40" cy="40" r="35"/>
            </svg>
            <div class="ring-label" id="ring-friend-pct" style="color:var(--friend)">0%</div>
          </div>
          <div class="pc-name" id="friend-name-ring">Friend</div>
          <div class="pc-stats" id="friend-stats">0 / 0 done</div>
          <div class="pc-streak friend" id="friend-streak">🔥 0 day streak</div>
        </div>
      </div>

      <!-- Add goal -->
      <div>
        <div class="section-head">
          <span class="section-title">Today's Goals</span>
        </div>
        <div style="margin:10px 0 8px">
          <div class="cat-pills" id="cat-pills">
            <div class="cat-pill active" onclick="selectCat('DSA',this)">DSA</div>
            <div class="cat-pill" onclick="selectCat('System Design',this)">System Design</div>
            <div class="cat-pill" onclick="selectCat('Mock Interview',this)">Mock</div>
            <div class="cat-pill" onclick="selectCat('Revision',this)">Revision</div>
            <div class="cat-pill" onclick="selectCat('Other',this)">Other</div>
          </div>
        </div>
        <div class="add-goal-bar">
          <input type="text" class="add-goal-input" id="goal-input"
            placeholder="Add a goal... e.g. Solve 3 DP problems"
            onkeydown="if(event.key==='Enter')addGoal()"/>
          <button class="btn-add" onclick="addGoal()">+</button>
        </div>
      </div>

      <!-- Goals list -->
      <div>
        <div id="goals-list" class="goals-list"></div>
      </div>
    </div>

    <!-- ── FRIEND TAB ── -->
    <div class="tab-panel" id="panel-friend">
      <div class="friend-header-card">
        <div class="friend-avatar-lg" id="friend-avatar-lg">?</div>
        <div class="friend-info" style="flex:1">
          <h3 id="friend-name-big">Waiting for friend…</h3>
          <p id="friend-status-text">They haven't joined yet</p>
          <div class="friend-progress-bar-wrap">
            <div class="friend-progress-label">
              <span>Progress today</span>
              <span id="friend-pct-label">0%</span>
            </div>
            <div class="friend-progress-bar">
              <div class="friend-progress-fill" id="friend-bar" style="width:0%"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="section-head">
        <span class="section-title">Their Goals</span>
      </div>
      <div id="friend-goals-list" class="goals-list"></div>
    </div>

    <!-- ── CHAT TAB ── -->
    <div class="tab-panel" id="panel-chat">
      <div class="section-head">
        <span class="section-title">Quick Reactions</span>
      </div>
      <div class="quick-reacts">
        <button class="quick-react-btn" onclick="sendQuickReact('🔥 Let\'s gooo!')">🔥 Let's go!</button>
        <button class="quick-react-btn" onclick="sendQuickReact('💪 Keep grinding!')">💪 Keep grinding!</button>
        <button class="quick-react-btn" onclick="sendQuickReact('✅ Crushed it today!')">✅ Crushed it!</button>
        <button class="quick-react-btn" onclick="sendQuickReact('😤 No slacking!')">😤 No slacking!</button>
        <button class="quick-react-btn" onclick="sendQuickReact('🎯 Focus mode on')">🎯 Focus mode</button>
        <button class="quick-react-btn" onclick="sendQuickReact('🧠 Big brain time')">🧠 Big brain</button>
      </div>

      <div class="section-head" style="margin-top:8px">
        <span class="section-title">Messages</span>
      </div>
      <div id="chat-stream" class="reaction-stream"></div>

      <div class="chat-input-row">
        <input type="text" class="chat-input" id="chat-input"
          placeholder="Type a message…"
          onkeydown="if(event.key==='Enter')sendChat()"/>
        <button class="chat-send" onclick="sendChat()">↑</button>
      </div>
    </div>

    <!-- ── STATS TAB ── -->
    <div class="tab-panel" id="panel-stats">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Your streak</div>
          <div class="stat-value accent" id="stat-your-streak">0</div>
          <div class="stat-sub">days in a row</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Friend streak</div>
          <div class="stat-value friend" id="stat-friend-streak">0</div>
          <div class="stat-sub">days in a row</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Goals done</div>
          <div class="stat-value accent" id="stat-you-total">0</div>
          <div class="stat-sub">total yours</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Friend done</div>
          <div class="stat-value friend" id="stat-friend-total">0</div>
          <div class="stat-sub">total friend</div>
        </div>
      </div>

      <div class="week-chart">
        <div class="section-title">This week</div>
        <div class="week-bars" id="week-bars"></div>
        <div class="week-legend">
          <div class="legend-item"><div class="legend-dot" style="background:var(--accent)"></div>You</div>
          <div class="legend-item"><div class="legend-dot" style="background:var(--friend)"></div>Friend</div>
        </div>
      </div>

      <div class="stat-card" style="flex-direction:row;align-items:center;justify-content:space-between">
        <div>
          <div class="stat-label">Who's winning?</div>
          <div class="stat-value" id="stat-winner" style="font-size:1.2rem;margin-top:4px">—</div>
        </div>
        <div style="font-size:2rem" id="stat-trophy">🏆</div>
      </div>
    </div>

    <!-- ── SETTINGS TAB ── -->
    <div class="tab-panel" id="panel-settings">
      <div class="room-code-box">
        <div class="section-title">Your Room Code</div>
        <div class="room-code-display" id="settings-room-code">——</div>
        <button class="btn-copy" onclick="copyRoomCode()">📋 Copy & share with friend</button>
        <p style="font-size:0.75rem;color:var(--muted);margin-top:8px;text-align:center">
          Your friend opens this app and enters the same code
        </p>
      </div>

      <div class="settings-section">
        <div class="section-title" style="margin-bottom:4px">Preferences</div>
        <div class="settings-row">
          <div class="settings-row-left">
            <div class="settings-row-label">Push notifications</div>
            <div class="settings-row-sub">Get notified when friend updates</div>
          </div>
          <div class="toggle on" id="toggle-notif" onclick="toggleNotif(this)"></div>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <div class="settings-row-label">Daily reminder</div>
            <div class="settings-row-sub">Remind at 9:00 AM</div>
          </div>
          <div class="toggle" id="toggle-remind" onclick="toggleNotif(this)"></div>
        </div>
        <div class="settings-row">
          <div class="settings-row-left">
            <div class="settings-row-label">Sound effects</div>
            <div class="settings-row-sub">Ping when goal is completed</div>
          </div>
          <div class="toggle on" id="toggle-sound" onclick="toggleNotif(this)"></div>
        </div>
      </div>

      <div class="settings-section">
        <div class="section-title" style="margin-bottom:4px">Account</div>
        <div class="settings-row">
          <div class="settings-row-left">
            <div class="settings-row-label" id="settings-name-label">—</div>
            <div class="settings-row-sub">Logged in as</div>
          </div>
          <div class="avatar you" style="cursor:default" id="settings-avatar">—</div>
        </div>
      </div>

      <button class="btn-logout" onclick="doLogout()">Leave Room</button>
      <p style="text-align:center;font-size:0.72rem;color:var(--muted2)">PrepPair — Built for focused pair prep 🚀</p>
    </div>

  </div><!-- /content -->

  <!-- Bottom nav (mobile) -->
  <div class="bottom-nav">
    <div class="bnav-item active" onclick="switchTab('goals')" id="bnav-goals">
      <div class="bnav-icon">🎯</div>Goals
    </div>
    <div class="bnav-item" onclick="switchTab('friend')" id="bnav-friend">
      <div class="bnav-icon">👤</div>Friend
    </div>
    <div class="bnav-item" onclick="switchTab('chat')" id="bnav-chat">
      <div class="bnav-icon">💬</div>Chat
    </div>
    <div class="bnav-item" onclick="switchTab('stats')" id="bnav-stats">
      <div class="bnav-icon">📊</div>Stats
    </div>
    <div class="bnav-item" onclick="switchTab('settings')" id="bnav-settings">
      <div class="bnav-icon">⚙️</div>Setup
    </div>
  </div>

</div><!-- /screen-app -->

</div><!-- /app -->

<!-- Toast -->
<div class="toast" id="toast"></div>

<script>
// ════════════════════════════════════
// STATE  (localStorage = persistent demo storage)
// In production: replace with Firebase Realtime DB
// ════════════════════════════════════
const STORAGE_KEY = 'preppair_v1';
let state = {
  loggedIn: false,
  myName: '',
  myRole: 'you', // 'you' or 'friend'
  roomCode: '',
  selectedCat: 'DSA',
  myGoals: [],     // { id, text, cat, done, ts }
  myStreak: 3,
  myTotalDone: 0,
  chat: [],        // { id, from, name, text, ts }
  // Simulated friend data
  friendName: '',
  friendGoals: [],
  friendStreak: 2,
  friendTotalDone: 0,
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { state = { ...state, ...JSON.parse(raw) }; } catch(e) {}
  }
}

// ════════════════════════════════════
// SIMULATED FRIEND DATA (demo mode)
// Replace with Firebase listeners in production
// ════════════════════════════════════
function initDemoFriendData() {
  if (!state.friendName) {
    state.friendName = state.myRole === 'you' ? 'Rahul' : 'Ananya';
    state.friendGoals = [
      { id: 'f1', text: 'Solve 2 graph problems on LeetCode', cat: 'DSA', done: true, ts: Date.now() - 3600000 },
      { id: 'f2', text: 'Read system design chapter on load balancers', cat: 'System Design', done: true, ts: Date.now() - 7200000 },
      { id: 'f3', text: 'Complete 1 mock interview round (behavioral)', cat: 'Mock Interview', done: false, ts: Date.now() - 1800000 },
      { id: 'f4', text: 'Revise dynamic programming patterns', cat: 'Revision', done: false, ts: Date.now() - 900000 },
    ];
    state.friendTotalDone = 12;
    state.chat = [
      { id: 'c0', from: 'friend', name: state.friendName, text: "Hey! I'm in the room. Let's crush it today 💪", ts: Date.now() - 5400000 },
      { id: 'c1', from: 'you', name: state.myName, text: "Ready! I'm starting with DSA problems 🔥", ts: Date.now() - 5200000 },
    ];
    saveState();
  }
}

// Simulate friend live updates
let friendUpdateInterval;
function startFriendLiveUpdates() {
  friendUpdateInterval = setInterval(() => {
    // Randomly toggle a friend goal to simulate live updates
    if (state.friendGoals.length > 0 && Math.random() < 0.15) {
      const undone = state.friendGoals.filter(g => !g.done);
      if (undone.length > 0) {
        const g = undone[Math.floor(Math.random() * undone.length)];
        g.done = true;
        saveState();
        renderFriendGoals();
        updateProgress();
        showToast(`${state.friendName} just completed: ${g.text.substring(0,30)}… ✅`);
        updateFriendBadge();
      }
    }
  }, 18000); // every 18s for demo
}

// ════════════════════════════════════
// CATEGORY COLORS
// ════════════════════════════════════
const catMap = {
  'DSA': { cls: 'tag-dsa', label: 'DSA' },
  'System Design': { cls: 'tag-system', label: 'SysD' },
  'Mock Interview': { cls: 'tag-mock', label: 'Mock' },
  'Revision': { cls: 'tag-revision', label: 'Rev' },
  'Other': { cls: 'tag-other', label: 'Other' },
};

// ════════════════════════════════════
// LOGIN
// ════════════════════════════════════
function doLogin() {
  const name = document.getElementById('login-name').value.trim();
  const room = document.getElementById('login-room').value.trim().toUpperCase();
  const role = document.getElementById('login-role').value;

  if (!name) { showToast('Please enter your name'); return; }
  if (!room || room.length < 3) { showToast('Enter a room code (min 3 chars)'); return; }

  state.loggedIn = true;
  state.myName = name;
  state.myRole = role;
  state.roomCode = room;
  if (!state.myGoals) state.myGoals = [];
  saveState();
  initDemoFriendData();
  showApp();
}

function doLogout() {
  if (confirm('Leave the room?')) {
    clearInterval(friendUpdateInterval);
    state.loggedIn = false;
    saveState();
    showScreen('login');
  }
}

function showApp() {
  showScreen('app');
  // Update topbar
  document.getElementById('topbar-room').textContent = `Room: ${state.roomCode}`;
  document.getElementById('topbar-date').textContent = formatDate(new Date());
  document.getElementById('topbar-avatar').textContent = state.myName[0].toUpperCase();
  document.getElementById('settings-name-label').textContent = state.myName;
  document.getElementById('settings-avatar').textContent = state.myName[0].toUpperCase();
  document.getElementById('settings-room-code').textContent = state.roomCode;
  document.getElementById('friend-name-ring').textContent = state.friendName || 'Friend';
  document.getElementById('friend-name-big').textContent = state.friendName || 'Waiting…';
  document.getElementById('friend-avatar-lg').textContent = (state.friendName || 'F')[0].toUpperCase();
  document.getElementById('friend-status-text').textContent = 'Active today 🟢';

  renderGoals();
  renderFriendGoals();
  renderChat();
  renderStats();
  updateProgress();
  startFriendLiveUpdates();
}

function showScreen(name) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
}

// ════════════════════════════════════
// TABS
// ════════════════════════════════════
const TABS = ['goals','friend','chat','stats','settings'];
function switchTab(name) {
  TABS.forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === name);
    document.getElementById(`panel-${t}`)?.classList.toggle('active', t === name);
    document.getElementById(`bnav-${t}`)?.classList.toggle('active', t === name);
  });
  if (name === 'stats') renderStats();
  if (name === 'chat') {
    document.getElementById('chat-badge').style.display = 'none';
    renderChat();
  }
  if (name === 'friend') {
    document.getElementById('friend-badge').style.display = 'none';
  }
}

// ════════════════════════════════════
// GOALS
// ════════════════════════════════════
function selectCat(cat, el) {
  state.selectedCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
}

function addGoal() {
  const input = document.getElementById('goal-input');
  const text = input.value.trim();
  if (!text) { showToast('Enter a goal first!'); return; }

  const goal = {
    id: 'g' + Date.now(),
    text,
    cat: state.selectedCat,
    done: false,
    ts: Date.now()
  };
  state.myGoals.unshift(goal);
  input.value = '';
  saveState();
  renderGoals();
  updateProgress();
  showToast('Goal added! 🎯');
}

function toggleGoal(id) {
  const g = state.myGoals.find(g => g.id === id);
  if (!g) return;
  g.done = !g.done;
  if (g.done) state.myTotalDone++;
  saveState();
  renderGoals();
  updateProgress();
  if (g.done) {
    showToast('Goal completed! 🔥');
    // Simulate notifying friend
    const autoMsg = {
      id: 'auto_' + Date.now(),
      from: 'you',
      name: state.myName,
      text: `✅ Just completed: "${g.text.substring(0,40)}"`,
      ts: Date.now()
    };
    state.chat.push(autoMsg);
    saveState();
  }
}

function deleteGoal(id) {
  state.myGoals = state.myGoals.filter(g => g.id !== id);
  saveState();
  renderGoals();
  updateProgress();
}

function renderGoals() {
  const list = document.getElementById('goals-list');
  if (!state.myGoals || state.myGoals.length === 0) {
    list.innerHTML = `<div class="empty-state">
      <div class="empty-icon">🎯</div>
      <p>No goals yet.<br>Add your first goal above!</p>
    </div>`;
    return;
  }

  list.innerHTML = state.myGoals.map(g => {
    const tag = catMap[g.cat] || catMap['Other'];
    return `<div class="goal-item ${g.done ? 'done' : ''}" id="gi-${g.id}">
      <div class="goal-check" onclick="toggleGoal('${g.id}')">${g.done ? '✓' : ''}</div>
      <div class="goal-text">${escHtml(g.text)}</div>
      <span class="goal-cat-tag ${tag.cls}">${tag.label}</span>
      <button class="goal-delete" onclick="deleteGoal('${g.id}')">×</button>
    </div>`;
  }).join('');
}

function renderFriendGoals() {
  const list = document.getElementById('friend-goals-list');
  const goals = state.friendGoals || [];

  if (goals.length === 0) {
    list.innerHTML = `<div class="empty-state"><p>Friend hasn't added goals yet</p></div>`;
    return;
  }

  list.innerHTML = goals.map(g => {
    const tag = catMap[g.cat] || catMap['Other'];
    return `<div class="friend-goal-item ${g.done ? 'done' : ''}">
      <div class="friend-goal-check">${g.done ? '✓' : ''}</div>
      <div class="friend-goal-text">${escHtml(g.text)}</div>
      <span class="goal-cat-tag ${tag.cls}">${tag.label}</span>
    </div>`;
  }).join('');

  // Update friend header
  const done = goals.filter(g => g.done).length;
  const pct = goals.length > 0 ? Math.round((done / goals.length) * 100) : 0;
  document.getElementById('friend-pct-label').textContent = pct + '%';
  document.getElementById('friend-bar').style.width = pct + '%';
}

function updateFriendBadge() {
  const badge = document.getElementById('friend-badge');
  const activeTab = document.querySelector('.tab.active')?.id;
  if (activeTab !== 'tab-friend') {
    badge.style.display = 'inline-flex';
    badge.textContent = '!';
  }
}

// ════════════════════════════════════
// PROGRESS RINGS
// ════════════════════════════════════
function updateProgress() {
  // My progress
  const myGoals = state.myGoals || [];
  const myDone = myGoals.filter(g => g.done).length;
  const myTotal = myGoals.length;
  const myPct = myTotal > 0 ? Math.round((myDone / myTotal) * 100) : 0;
  setRing('ring-you', myPct);
  document.getElementById('ring-you-pct').textContent = myPct + '%';
  document.getElementById('you-stats').textContent = `${myDone} / ${myTotal} done`;
  document.getElementById('you-streak').textContent = `🔥 ${state.myStreak} day streak`;

  // Friend progress
  const fGoals = state.friendGoals || [];
  const fDone = fGoals.filter(g => g.done).length;
  const fTotal = fGoals.length;
  const fPct = fTotal > 0 ? Math.round((fDone / fTotal) * 100) : 0;
  setRing('ring-friend', fPct);
  document.getElementById('ring-friend-pct').textContent = fPct + '%';
  document.getElementById('friend-stats').textContent = `${fDone} / ${fTotal} done`;
  document.getElementById('friend-streak').textContent = `🔥 ${state.friendStreak} day streak`;
  document.getElementById('friend-name-ring').textContent = state.friendName || 'Friend';
}

function setRing(id, pct) {
  const circ = 2 * Math.PI * 35; // r=35
  const offset = circ - (pct / 100) * circ;
  const el = document.getElementById(id);
  if (el) {
    el.style.strokeDasharray = circ;
    el.style.strokeDashoffset = offset;
  }
}

// ════════════════════════════════════
// CHAT
// ════════════════════════════════════
function sendChat() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  addChatMsg(text);
  input.value = '';
}

function sendQuickReact(text) {
  addChatMsg(text);
}

function addChatMsg(text) {
  const msg = {
    id: 'm' + Date.now(),
    from: 'you',
    name: state.myName,
    text,
    ts: Date.now()
  };
  state.chat.push(msg);
  saveState();
  renderChat();

  // Simulate friend reply after delay (demo)
  if (Math.random() < 0.4) {
    setTimeout(() => {
      const replies = [
        "Let's go!! 💪",
        "Same energy here! 🔥",
        "On it! 🎯",
        "Haha yes, no excuses today 😤",
        "Counting every goal ✅",
      ];
      const reply = {
        id: 'm' + Date.now(),
        from: 'friend',
        name: state.friendName,
        text: replies[Math.floor(Math.random() * replies.length)],
        ts: Date.now()
      };
      state.chat.push(reply);
      saveState();
      renderChat();
      const activeTab = document.querySelector('.tab.active')?.id;
      if (activeTab !== 'tab-chat') {
        const badge = document.getElementById('chat-badge');
        badge.style.display = 'inline-flex';
        badge.textContent = '1';
      }
    }, 2000 + Math.random() * 3000);
  }
}

function renderChat() {
  const stream = document.getElementById('chat-stream');
  const msgs = state.chat || [];

  if (msgs.length === 0) {
    stream.innerHTML = `<div class="empty-state"><p>No messages yet.<br>Say hi to your prep partner! 👋</p></div>`;
    return;
  }

  stream.innerHTML = msgs.map(m => {
    const isMe = m.from === 'you';
    return `<div class="reaction-msg ${isMe ? 'mine' : ''}">
      <div class="rm-avatar ${m.from}">${m.name[0].toUpperCase()}</div>
      <div>
        <div class="rm-bubble">${escHtml(m.text)}</div>
        <div class="rm-time">${formatTime(m.ts)}</div>
      </div>
    </div>`;
  }).join('');

  stream.scrollTop = stream.scrollHeight;
}

// ════════════════════════════════════
// STATS
// ════════════════════════════════════
function renderStats() {
  document.getElementById('stat-your-streak').textContent = state.myStreak;
  document.getElementById('stat-friend-streak').textContent = state.friendStreak;
  document.getElementById('stat-you-total').textContent = state.myTotalDone + (state.myGoals || []).filter(g => g.done).length;
  document.getElementById('stat-friend-total').textContent = state.friendTotalDone + (state.friendGoals || []).filter(g => g.done).length;

  // Winner
  const youScore = state.myStreak * 2 + (state.myGoals || []).filter(g => g.done).length;
  const friendScore = state.friendStreak * 2 + (state.friendGoals || []).filter(g => g.done).length;
  const winner = document.getElementById('stat-winner');
  const trophy = document.getElementById('stat-trophy');
  if (youScore > friendScore) {
    winner.textContent = `${state.myName} is leading!`;
    winner.style.color = 'var(--accent)';
    trophy.textContent = '🏆';
  } else if (friendScore > youScore) {
    winner.textContent = `${state.friendName} is leading!`;
    winner.style.color = 'var(--friend)';
    trophy.textContent = '💪';
  } else {
    winner.textContent = "It's a tie! 🤝";
    winner.style.color = 'var(--muted)';
    trophy.textContent = '⚡';
  }

  renderWeekBars();
}

function renderWeekBars() {
  const days = ['M','T','W','T','F','S','S'];
  const youData = [60, 80, 100, 40, 70, 90, 50];
  const friendData = [70, 60, 80, 100, 50, 80, 40];
  const today = new Date().getDay(); // 0=Sun

  const bars = document.getElementById('week-bars');
  bars.innerHTML = days.map((d, i) => {
    const yH = Math.round((youData[i] / 100) * 68);
    const fH = Math.round((friendData[i] / 100) * 68);
    const isToday = (i === (today === 0 ? 6 : today - 1));
    return `<div class="week-bar-wrap">
      <div class="week-bar-pair">
        <div class="week-bar you" style="height:${yH}px${isToday ? ';opacity:1' : ''}"></div>
        <div class="week-bar friend" style="height:${fH}px${isToday ? ';opacity:1' : ''}"></div>
      </div>
      <div class="week-day" style="${isToday ? 'color:var(--accent);font-weight:600' : ''}">${d}</div>
    </div>`;
  }).join('');
}

// ════════════════════════════════════
// SETTINGS
// ════════════════════════════════════
function toggleNotif(el) {
  el.classList.toggle('on');
}

function copyRoomCode() {
  const code = state.roomCode;
  navigator.clipboard?.writeText(`Join my PrepPair room! Code: ${code} → Open the app and enter this code.`)
    .then(() => showToast('Room link copied! 📋'))
    .catch(() => showToast(`Room code: ${code}`));
}

// ════════════════════════════════════
// HELPERS
// ════════════════════════════════════
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatDate(d) {
  return d.toLocaleDateString('en-IN', { weekday:'long', month:'short', day:'numeric' });
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
}

function showToast(msg, duration=2800) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

// ════════════════════════════════════
// INIT
// ════════════════════════════════════
loadState();

// Pre-fill login if returning user
if (state.loggedIn && state.myName && state.roomCode) {
  initDemoFriendData();
  showApp();
} else {
  // Pre-fill demo values for easy testing
  document.getElementById('login-name').value = 'Arjun';
  document.getElementById('login-room').value = 'MAANG2025';
}

// Set date in topbar
document.getElementById('topbar-date').textContent = formatDate(new Date());

// Simulate friend activity notification after 8s
setTimeout(() => {
  if (state.loggedIn) {
    showToast(`${state.friendName} just joined the room! 👋`);
  }
}, 8000);
</script>
</body>
</html>