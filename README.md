# 🚀 Pair-Prep PWA - Quick Start Guide

A Progressive Web App for tracking daily prep goals with your study partner in real-time.

## Features

✅ Works offline - all goals stored locally  
✅ Real-time sync - see friend's progress instantly  
✅ Install to home screen - looks like a native app  
✅ Push notifications - Android full support, iOS limited  
✅ 100% free - Vercel + Firebase free tiers  
✅ No app store needed - share a link, they install from browser  

## Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Real-time DB:** Firebase Realtime Database
- **Auth:** Firebase Auth (Google Sign-In)
- **Notifications:** Firebase Cloud Messaging
- **Hosting:** Vercel
- **Offline:** Service Worker + IndexedDB

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Firebase Project
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create new project (any name, any region)
3. Go to Project Settings → Copy all config values
4. Enable Google Sign-In (Authentication → Sign-in method)
5. Create Realtime Database (test mode for now)

### 3. Set Environment Variables
```bash
cp .env.example .env.local
# Edit .env.local with your Firebase config
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:5173` and test signing in

### 5. Check PWA Works
1. Open DevTools (F12) → Application → Service Workers
2. Should show `Active and running`
3. Try offline mode: DevTools → Network → Offline
4. Goals should still load from cache ✓

### 6. Build for Production
```bash
npm run build
npm run preview
```

## Deployment to Vercel

### Setup (3 minutes)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repo
4. Add environment variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - ... (all config from Firebase)
5. Click Deploy

### Test on Mobile
1. Open the Vercel URL on phone
2. Chrome (Android): Should see "Install" prompt
3. Safari (iOS): Tap Share → Add to Home Screen
4. App installs and opens full-screen

## Project Structure

```
pair-prep/
├── src/
│   ├── lib/
│   │   ├── firebase.ts        # Firebase config
│   │   ├── auth.ts            # Auth helpers
│   │   ├── indexeddb.ts       # Offline storage
│   │   └── notifications.ts   # Push notifications
│   ├── pages/
│   │   ├── LoginPage.tsx      # Sign-in screen
│   │   └── DashboardPage.tsx  # Goals dashboard
│   ├── App.tsx                # Main app
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind styles
├── public/                    # Icons go here
├── index.html                 # PWA config
├── vite.config.ts             # Vite + PWA plugin
└── package.json
```

## Next Features to Build

- [ ] **Friend connection** - Share user ID to invite friend
- [ ] **Real-time friend progress** - See friend's goals live
- [ ] **Streaks** - Track consecutive days completed
- [ ] **Weekly summary** - End-of-week stats
- [ ] **Emoji reactions** - Quick feedback to friend
- [ ] **App icons** - Generate PNG icons from logo
- [ ] **Firebase rules** - Secure data access

## Troubleshooting

### Service Worker not installing
- Make sure you're on HTTPS (localhost works in dev)
- Check DevTools → Application → Service Workers
- Try hard refresh (Ctrl+Shift+R)

### Can't sign in with Google
- Verify OAuth settings in Firebase console
- Check domain is added to authorized redirect URIs
- Make sure Google Sign-In is enabled

### Goals not syncing
- Check Firebase Realtime Database rules
- Verify user is authenticated
- Check browser console for errors

### PWA won't install on iOS
- Requires iOS 16.4+
- Must add to home screen manually (Share → Add to Home Screen)
- Doesn't show install prompt like Android

## Firebase Rules (Copy to Realtime Database)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth.uid == $uid || exists(root.child('users').child(auth.uid).child('friendId').val()) && root.child('users').child(auth.uid).child('friendId').val() == $uid",
        ".write": "auth.uid == $uid"
      }
    },
    "goals": {
      "$uid": {
        ".read": "auth.uid == $uid || exists(root.child('users').child(auth.uid).child('friendId').val()) && root.child('users').child(auth.uid).child('friendId').val() == $uid",
        ".write": "auth.uid == $uid"
      }
    }
  }
}
```

## Deployment Checklist

- [ ] Firebase project created and config in .env.local
- [ ] Google Sign-In enabled in Firebase
- [ ] App works locally with `npm run dev`
- [ ] PWA detected in DevTools (Service Worker active)
- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables added to Vercel
- [ ] Deployment successful
- [ ] Tested on real phone

## Learn More

- [PWA Docs](https://web.dev/progressive-web-apps/)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Ready to code?** Start with `npm run dev` 🚀
