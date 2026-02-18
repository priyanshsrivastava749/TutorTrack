# TutorTrack - Student & Teacher Portal

TutorTrack is a full-stack platform designed to streamline the management of assignments, resources, and submissions between tuition teachers and students.

**Built with:**
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Django Rest Framework (Python)
- **Database:** PostgreSQL
- **Infrastructure:** Docker, Nginx

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.
- Git.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd tutortrack
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory. You can copy the example below:

```bash
# .env
DEBUG=1
SECRET_KEY=dev-secret-key
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 backend [::1]

# Database Config
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=tutortrack
SQL_USER=tutortrack
SQL_PASSWORD=tutortrack_password
SQL_HOST=db
SQL_PORT=5432
```

### 3. Run with Docker Compose
Build and start the services. This will set up the Backend (Django), Frontend (React), Database (Postgres), and a Proxy (Nginx).

```bash
docker-compose up --build
```

- **Frontend:** Open [http://localhost](http://localhost)
- **Backend API:** Accessible internally via Nginx at `http://localhost/api/`

---

## ☁️ Production Deployment (AWS EC2 / VPS)

These steps apply to any VPS provider (AWS EC2, DigitalOcean, Linode, etc.) running Ubuntu/Linux.

### 1. Provision Server & Install Docker
SSH into your server:
```bash
ssh -i key.pem ubuntu@your-server-ip
```

Update system and install Docker & Docker Compose:
```bash
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
# (Log out and log back in for group changes to take effect)
```

### 2. Deploy Code
Clone your repository to the server:
```bash
git clone <your-repo-url>
cd tutortrack
```

### 3. Production Configuration
Create a production `.env` file. **Important:** Change passwords and keys for security.

```bash
nano .env
```

Paste the following (update values as needed):
```bash
# .env
DEBUG=0
SECRET_KEY=change_this_to_a_random_string_in_production
# Add your server's Public IP or Domain Name here
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 backend [::1] <YOUR_PUBLIC_IP> <YOUR_DOMAIN.COM>

SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=tutortrack_prod
SQL_USER=tutortrack_admin
SQL_PASSWORD=secure_db_password
SQL_HOST=db
SQL_PORT=5432
```

Update `docker-compose.yml` database environment variables to match your `.env` if you hardcoded them there (though reading from `.env` is preferred).

### 4. Build and Run
```bash
docker-compose up -d --build
```

### 5. Verify Deployment
Navigate to `http://<YOUR_SERVER_IP>` in your browser.

---

## 📂 Project Structure

```
tutortrack/
├── backend/                # Django Backend
│   ├── api/                # API App (Models, Views, Serializers)
│   ├── tutortrack/         # Project Settings
│   ├── Dockerfile          # Backend Docker config
│   ├── entrypoint.sh       # Startup script
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/               # React Frontend
│   ├── src/                # React Source Code
│   ├── public/             # Static Assets
│   ├── Dockerfile          # Frontend Docker config
│   ├── package.json
│   └── vite.config.ts
│
├── nginx/                  # Nginx Configuration
│   └── default.conf        # Proxy settings
│
├── docker-compose.yml      # Orchestration
└── README.md
```

## 🛠 Troubleshooting

**1. Database connection failed?**
Ensure the `db` service in `docker-compose.yml` is healthy.
```bash
docker-compose logs db
```

**2. Static files missing in Admin panel?**
If CSS is missing in the Django Admin (`/admin`), run:
```bash
docker-compose exec backend python manage.py collectstatic --no-input
```

**3. Permission errors on Linux?**
If Docker complains about permissions, ensure your user is in the `docker` group or run commands with `sudo`.

**4. 502 Bad Gateway?**
This usually means the backend container isn't running or hasn't finished starting up yet. Check logs:
```bash
docker-compose logs backend
```
