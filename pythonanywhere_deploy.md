# PythonAnywhere Deployment Guide for TutorTrack Backend

1. **Create an Account**: Sign up at [PythonAnywhere](https://www.pythonanywhere.com/). Note your username (e.g., `yourusername`).
2. **Open a Bash Console**: On your PythonAnywhere Dashboard, go to "Consoles" and start a new Bash console.
5. **Clone Your Code**:
   ```bash
   git clone <your-github-repo-url>
   cd TutorTrack/backend
   git checkout PythonAnywhere-version
   ```
6. **Create a Virtual Environment**:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 tutortrack-venv
   pip install -r requirements.txt
   ```
7. **Set up the Web App**:
   * Go to the **Web** tab on the PythonAnywhere dashboard.
   * Click **Add a new web app**.
   * Skip the domain selection (it will default to `yourusername.pythonanywhere.com`).
   * Select **Manual Configuration** (not Django) and choose **Python 3.10**.
8. **Configure the Virtual Environment**:
   * On the Web tab, under the **Virtualenv** section, enter the path to the virtual environment you created: `/home/yourusername/.virtualenvs/tutortrack-venv`.
9. **Configure the WSGI File**:
   * Under the **Code** section on the Web tab, click the link to edit the WSGI configuration file (it will be something like `/var/www/yourusername_pythonanywhere_com_wsgi.py`).
   * Replace its contents with the following:
   ```python
   import os
   import sys
   
   # Assuming your project is cloned into /home/yourusername/TutorTrack/backend
   path = '/home/yourusername/TutorTrack/backend'
   if path not in sys.path:
       sys.path.insert(0, path)
   
   # Provide a secure default or use your .env for the secret key
   os.environ['SECRET_KEY'] = 'your-secure-secret-key-goes-here'
   os.environ['DEBUG'] = 'False'
   
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tutortrack.settings')
   
   from django.core.wsgi import get_wsgi_application
   application = get_wsgi_application()
   ```
   * Save the file.
10. **Environment Variables**:
    * If you use a `.env` file, make sure to add it using a tool like `python-dotenv`, or load the variables inside your WSGI file (like `SECRET_KEY` shown above).
11. **Update Settings**:
    * Make sure you update `frontend/src/services/api.ts`, `frontend/.env.example`, and `backend/tutortrack/settings.py` to replace `yourusername` with your *actual* PythonAnywhere username before deploying.
12. **Database Setup**:
    * Since you are now using SQLite on this branch, you MUST run migrations to initialize the database:
    ```bash
    cd /home/yourusername/TutorTrack/backend
    python manage.py makemigrations
    python manage.py migrate
    ```
13. **Static Files**:
    * Run `python manage.py collectstatic`.
    * On the Web tab, under **Static Files**, set up:
        * URL: `/django_static/`
        * Directory: `/home/yourusername/TutorTrack/backend/staticfiles`
14. **Reload**: Click the green **Reload** button at the top of the Web tab. Your API should now be live at `https://yourusername.pythonanywhere.com`.
