# PythonAnywhere Deployment Guide for TutorTrack Backend

1. **Create an Account**: Sign up at [PythonAnywhere](https://www.pythonanywhere.com/). Note your username (e.g., `yourusername`).
2. **Open a Bash Console**: On your PythonAnywhere Dashboard, go to "Consoles" and start a new Bash console.
3. **Clone Your Code**:
   ```bash
   git clone <your-github-repo-url>
   cd TutorTrack/backend
   ```
4. **Create a Virtual Environment**:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 tutortrack-venv
   pip install -r requirements.txt
   ```
5. **Set up the Web App**:
   * Go to the **Web** tab on the PythonAnywhere dashboard.
   * Click **Add a new web app**.
   * Skip the domain selection (it will default to `yourusername.pythonanywhere.com`).
   * Select **Manual Configuration** (not Django) and choose **Python 3.10**.
6. **Configure the Virtual Environment**:
   * On the Web tab, under the **Virtualenv** section, enter the path to the virtual environment you created: `/home/yourusername/.virtualenvs/tutortrack-venv`.
7. **Configure the WSGI File**:
   * Under the **Code** section on the Web tab, click the link to edit the WSGI configuration file (it will be something like `/var/www/yourusername_pythonanywhere_com_wsgi.py`).
   * Replace its contents with the following:
     ```python
     import os
     import sys
     
     # Assuming your project is cloned into /home/yourusername/TutorTrack/backend
     path = '/home/yourusername/TutorTrack/backend'
     if path not in sys.path:
         sys.path.insert(0, path)
     
     # Add your external PostgreSQL database URL here:
     # REPLACE with your ACTUAL PostgreSQL connection string
     os.environ['DATABASE_URL'] = 'postgres://user:password@host:port/dbname'
     
     os.environ['DJANGO_SETTINGS_MODULE'] = 'tutortrack.settings'
     
     from django.core.wsgi import get_wsgi_application
     application = get_wsgi_application()
     ```
   * Save the file.
8. **Set Environment Variables**:
   * If you have a `.env` file, make sure it's uploaded or created in `/home/yourusername/TutorTrack/backend`. PythonAnywhere free tier doesn't auto-load `.env` perfectly by default unless you use a package like `python-dotenv`.
   * *Alternatively*, temporarily hardcode essential values like `SECRET_KEY` in `settings.py` or export them in your virtualenv postactivate script.
9. **Update Settings**:
   * Make sure you update `frontend/src/services/api.ts`, `frontend/.env.example`, and `backend/tutortrack/settings.py` to replace `yourusername` with your *actual* PythonAnywhere username before deploying.
10. **Database Setup**:
    * Since you already have a Postgres Database running, you don't *need* to run `migrate` on PythonAnywhere unless you've added new models recently. Your app will automatically connect once `DATABASE_URL` is set in the WSGI file.
11. **Static Files**:
    * Run `python manage.py collectstatic`.
    * On the Web tab, under **Static Files**, set up:
        * URL: `/django_static/`
        * Directory: `/home/yourusername/TutorTrack/backend/staticfiles`
12. **Reload**: Click the green **Reload** button at the top of the Web tab. Your API should now be live at `https://yourusername.pythonanywhere.com`.
