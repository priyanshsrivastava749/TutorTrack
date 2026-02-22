# TutorTrack

TutorTrack is a full-stack web application designed to bridge the structural gap between teachers and students by providing a centralized, streamlined platform for assignment tracking, resource sharing, and structured academic queries.

## 🚀 Features

### For Teachers
*   **Student Management**: Connect with students dynamically using their unique IDs.
*   **Assignment Setup & Tracking**: Create and assign homework to your students, complete with detailed instruction links and firm due dates.
*   **Assessment & Feedback**: Seamlessly review submitted student work and send back checked links for detailed feedback.
*   **Resource Handling**: Address direct resource queries raised by students across different subjects and topics to keep them unblocked.

### For Students
*   **Centralized Dashboard**: Easily view all your assigned tasks, impending deadlines, and completion statuses (pending vs. submitted) in real-time.
*   **Fluid Submissions**: Submit your work to specific assignments directly via hosted links.
*   **Direct Resource Queries**: Submit personalized requests indicating specific subjects and topics to get extra or clarifying materials from your teachers.

## �️ Technology Stack

*   **Frontend**: React (v18), Vite, TypeScript, Tailwind CSS, Lucide React (for stunning iconography).
*   **Backend**: Django, Django Rest Framework (DRF).
*   **Deployment & Config**: Docker, Docker Compose, Nginx.

## 📂 Project Structure

*   **/frontend**: Contains the fast React application powered by Vite.
*   **/backend**: Contains the robust Django server and API endpoints (via DRF).
*   **/nginx**: Includes Nginx configuration files crucial for acting as a reverse proxy in production/deployment environments.

## � Local Setup

### 1. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## � Docker Deployment
You can use the included `docker-compose.yml` file for a fast, hassle-free containerized deployment.

```bash
docker-compose up --build -d
```