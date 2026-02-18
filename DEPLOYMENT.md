# Deployment Guide for TutorTrack

This guide covers how to deploy the TutorTrack application using Docker Compose on a Virtual Private Server (VPS) like AWS EC2, DigitalOcean, or Linode.

## Prerequisites

1. **A VPS (Linux Server)**
   - Ubuntu 20.04 or 22.04 LTS recommended.
   - At least 1GB RAM (2GB recommended).
2. **Domain Name** (Optional, but recommended for production).

---

## Step 1: Prepare the Server

Connect to your server via SSH:
```bash
ssh root@your_server_ip
```

### Install Docker & Docker Compose
Run the following commands to install Docker:

```bash
# Update repositories
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Set up the repository
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y
```

---

## Step 2: Deploy the Application

### 1. Clone the Repository
```bash
git clone <YOUR_GITHUB_REPO_URL>
cd tutortrack
```

### 2. Set Production Environment Variables
Create a `.env` file in the root directory:

```bash
nano .env
```

Paste the following configuration (Modify the passwords and secret key):

```env
# Backend Settings
DEBUG=0
SECRET_KEY=change_this_to_a_complex_random_string_xyz123
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 backend [::1] <YOUR_SERVER_IP> <YOUR_DOMAIN.COM>

# Database Settings
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=tutortrack_prod
SQL_USER=tutortrack_user
SQL_PASSWORD=strong_db_password_here
SQL_HOST=db
SQL_PORT=5432

# Postgres Container Settings (Must match SQL_ variables above)
POSTGRES_DB=tutortrack_prod
POSTGRES_USER=tutortrack_user
POSTGRES_PASSWORD=strong_db_password_here
```

### 3. Build and Run
Run the application in detached mode (background):

```bash
docker compose up -d --build
```

This will:
1. Build the Django Backend.
2. Build the React Frontend (using Vite).
3. Start the PostgreSQL Database.
4. Set up Nginx as the web server and reverse proxy.

---

## Step 3: Verification

1. **Check Status**: Ensure all containers are running.
   ```bash
   docker compose ps
   ```

2. **Access the App**:
   Open your browser and visit `http://<YOUR_SERVER_IP>`.
   
   - You should see the TutorTrack login page.
   - If you try to log in, it will communicate with the backend via `/api/`.

---

## Step 4: Maintenance Tasks

### Create a Superuser
To access the Django Admin panel at `http://<YOUR_SERVER_IP>/admin/`, you need a superuser account.

```bash
docker compose exec backend python manage.py createsuperuser
```
Follow the prompts to set a username and password.

### Viewing Logs
If something goes wrong, check the logs:

```bash
# View all logs
docker compose logs -f

# View specific container logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Updating the App
When you push changes to Git, update the server:

```bash
git pull
docker compose up -d --build
```

---

## Cleaning Up Root Directory (Optional)
If you have moved files to `frontend/` but still see duplicates in the root folder, you can delete the React files from the root to keep things clean.

**Safe to delete from ROOT (only if they exist inside `frontend/`):**
- `src/`
- `public/`
- `index.html`
- `vite.config.ts`
- `tsconfig.json`
- `tailwind.config.js` (if exists)
- `postcss.config.js` (if exists)

**DO NOT DELETE:**
- `backend/`
- `frontend/`
- `docker-compose.yml`
- `.env`
