---
status: DRAFT
created: 2026-05-21
---

# SPEC.md — Project Specification

## Vision

TutorTrack is a specialized platform designed to streamline the interaction between tutors and students. It provides role-based dashboards to manage assignments, resources, and queries, ensuring a focused and organized educational environment.

---

## Goals

1.  **Role-Based Access**
    Distinct dashboards for Teachers and Students with verified permissions.

2.  **Assignment Management**
    Teachers can assign tasks; Students can view and submit work.

3.  **Resource Sharing**
    Streamlined sharing of educational materials and links.

---

## Users

**Primary User:** Teachers
- Assign work, track submissions, and manage student queries.

**Secondary User:** Students
- View assignments, submit work, and access resources.

---

## Technical Constraints

- **Frontend**: React + Vite + TailwindCSS.
- **Backend**: Django + Django REST Framework.
- **Database**: SQLite (Development) / PostgreSQL (Production ready).
- **Authentication**: Token-based (DRF).

---

## Success Criteria

- [ ] Clean separation of Frontend/Backend code.
- [ ] Functional Login flows for both roles.
- [ ] Successful CRUD operations for Assignments.
