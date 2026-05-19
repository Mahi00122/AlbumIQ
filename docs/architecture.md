# Architecture Notes

## System Summary

The system helps photographers create wedding events and lets guests discover their photos with a selfie-based face search flow.

## Main Layers

- `frontend/`
  - React application for the admin dashboard and guest portal
  - Event code entry and QR-assisted guest access
  - Bulk photo upload and gallery result views

- `backend/`
  - Django REST APIs for authentication, events, photos, and search
  - Celery task hooks for asynchronous face extraction
  - Face-matching services based on Euclidean-distance comparison

- Data and processing
  - PostgreSQL is the intended production database
  - Redis is used for Celery broker and result handling
  - Local media is the default development storage
  - Cloudinary or S3 can replace local media in production

## Core Data Model

- `User`
  - Admin or photographer account

- `Event`
  - Event name, event code, date, QR URL, and creator reference

- `Photo`
  - Uploaded wedding image tied to an event
  - Tracks processing status for asynchronous face extraction

- `FaceEmbedding`
  - Stores detected face vectors and face location data per photo

- `GuestSearch`
  - Stores guest selfie upload history and matched result counts

## Main Flows

### Admin flow

1. Admin logs in.
2. Admin creates an event.
3. Backend generates a unique event code and QR asset.
4. Admin uploads wedding photos.
5. Celery workers process faces and store embeddings.

### Guest flow

1. Guest scans the QR or enters the event code.
2. Guest uploads a selfie.
3. Backend generates the selfie embedding.
4. Search compares the selfie vector with all event embeddings.
5. Matching wedding photos are returned with similarity scores.

## Production Upgrade Path

- Replace JSON embedding storage with `pgvector`
- Introduce FAISS for larger galleries
- Move media to Cloudinary or S3
- Add analytics APIs for search success and event activity
- Add signed URLs and rate limiting to guest-facing endpoints

