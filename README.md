# Trackr-API

This is the backend of the Trackr app. It uses Firebase for authentication.
To function properly it needs the following modifications:

- `.env`: root of the project
  - `MONGO_URL`: your mongodb url
  - `PORT`
  - `JWT_SECRET`: secret key
  - `JWT_EXPIRE`
  - `FIREBASE_DB_URL`: your firebase db url
- `serviceAccountKey.json`: in the firebase folder
