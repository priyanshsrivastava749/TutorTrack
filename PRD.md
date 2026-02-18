# Production Readiness Document (PRD)

**Status:** DRAFT
**Phase:** 4 - Production Readiness

This document outlines the strict roadmap to take "TutorTrack" from its current prototype state to a production-ready application.

## 🔴 Critical Blockers (Must Fix Immediately)

1.  **[INFRA] Create Frontend Dockerfile**
    *   **Issue:** The `frontend/` directory is missing a `Dockerfile`, but `docker-compose.yml` references it. The build will fail.
    *   **Action:** Create a multi-stage Dockerfile in `frontend/` (Node.js build -> Nginx runtime).

2.  **[INFRA] Fix Docker Compose Paths**
    *   **Issue:** Roots have changed. Ensure `docker-compose.yml` uses relative paths correctly after the cleanup.
    *   **Action:** Verify and test `docker-compose build` after adding the Dockerfile.

## 🟡 Backend Optimization

3.  **[BACKEND] Verify Gunicorn Configuration**
    *   **Current State:** `entrypoint.sh` already uses Gunicorn.
    *   **Action:** Ensure worker count is configurable via env vars (e.g., `GUNICORN_WORKERS`).
    *   **Action:** Verify `SECRET_KEY` and `DEBUG` settings are strictly enforced from environment variables (no hardcoded fallbacks in prod).

## 🟢 Frontend & Routing

4.  **[FRONTEND] Nginx React Routing**
    *   **Current State:** `nginx/default.conf` correctly includes `try_files $uri $uri/ /index.html;`.
    *   **Action:** Verify that the Nginx container correctly mounts and serves the minimal build artifacts from the builder stage.

## 🔒 Security

5.  **[SECURITY] Environment Validation**
    *   **Issue:** `settings.py` has unsafe defaults (e.g., `django-insecure...`).
    *   **Action:** Implement strict environment variable validation. The app should *crash* if `SECRET_KEY` or `DB_PASSWORD` is missing in production.

## 📋 Ralph Loop Checklist

- [x] Create `frontend/Dockerfile`
- [x] Test `docker-compose up --build` (Build Passed)
- [x] Remove hardcoded secrets from `settings.py`
## 📋 Ralph Loop Checklist

- [x] Create `frontend/Dockerfile`
- [x] Test `docker-compose up --build` (Build Passed)
- [x] Remove hardcoded secrets from `settings.py`
- [x] Document all required Environment Variables in `.env.example`
- [x] Fix Server Error on Signup (Missing WSGI/Init files)
