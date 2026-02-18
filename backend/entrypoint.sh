#!/bin/sh

if [ "$SQL_DATABASE" = "tutortrack" ]
then
    echo "Waiting for postgres..."

    while ! nc -z $SQL_HOST $SQL_PORT; do
      sleep 0.1
    done

    echo "PostgreSQL started"
fi

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --no-input --clear

# Start Gunicorn
exec gunicorn tutortrack.wsgi:application --bind 0.0.0.0:8000
