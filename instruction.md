App overview
A live, shared web app where you and your friend can track daily preparation goals, see each other's progress in real time, and stay accountable together.

Core features
Goal tracking — Each user sets daily goals (e.g., "Solve 3 LeetCode problems", "Read 20 pages", "Complete 1 mock interview round"). Mark them done with a single tap.
Live sync — Both users see updates instantly without refreshing, using Firebase Realtime Database or Supabase (free tiers, perfect for this use case).
Friend's progress panel — A side-by-side or tabbed view showing your progress vs. your friend's in real time.
Daily streak counter — Tracks consecutive days both (or either) of you hit your goals. Great motivation.
Progress ring / percentage — Visual daily completion % for each person.
Chat / reaction panel — Quick emoji reactions or short messages ("🔥 Let's go!" / "Keep grinding!") to hype each other up.
Weekly summary — End-of-week breakdown: goals hit, streaks, best day, total problems solved, etc.

Tech stack (free deployment)
LayerChoiceWhyFrontendReact + ViteFast, easy to deployStylingTailwind CSSClean UI quicklyRealtime DBFirebase Realtime DBFree tier, instant syncAuthFirebase AuthGoogle login, no backend neededHostingVercel or NetlifyFree, CI/CD from GitHub
Everything runs serverless — zero cost for a two-person app.


Data model (Firebase)
/users/{userId}
  name, avatarUrl, friendId

/goals/{userId}/{date}/{goalId}
  text, done, createdAt

/streaks/{userId}
  current, longest, lastUpdated

/reactions/{roomId}/{messageId}
  from, emoji, text, timestamp

Phased build plan
Phase 1 — Core (week 1)
Set up Firebase + auth, build goal creation/checking, connect both users to a shared "room", deploy to Vercel.
Phase 2 — Live sync (week 1–2)
Add real-time listeners so both screens update instantly when the other person checks a goal.
Phase 3 — Polish (week 2)
Streaks, progress rings, weekly summary view, emoji reactions, mobile-responsive layout.
Phase 4 — Extras (ongoing)
Push notifications (Firebase Cloud Messaging), goal templates for MAANG prep (arrays, DP, system design), leaderboard view.

Deployment (free, no server)

Push code to GitHub
Connect repo to Vercel — auto-deploys on every push
Add Firebase config as environment variables in Vercel dashboard
Share the URL with your friend — done


Want me to start coding? I'd suggest beginning with Phase 1 — the React + Firebase scaffold with goal creation and the two-user room setup. Just say the word!can we make a mobile application for this , but for free if yes then which stack and how?