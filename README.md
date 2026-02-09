<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1sps2egwldMnf_y-J5VWxhFacILmf_k5b

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`

2. Set up environment variables in `.env.local`:
   - Copy `.env.example` to `.env.local`
   - Add your Firebase Web SDK configuration (get these from Firebase Console > Project Settings)
   - Add your Gemini API key if needed

3. Run the app:
   `npm run dev`

## Firebase Configuration

The app uses Firebase Firestore for real-time match data synchronization. 

### Frontend (Web SDK)
- Uses the public Firebase Web SDK configuration
- Get these values from: Firebase Console > Project Settings > Your apps
- Store in `.env.local` file

### Backend (Private Key)
- The `boxcriclive-firebase-adminsdk-fbsvc-474b9cb005.json` service account file should ONLY be used on a secure backend server
- **NEVER** expose the private key in the frontend or commit it to git
- Use it for admin operations, scheduled tasks, or server-to-server communication
