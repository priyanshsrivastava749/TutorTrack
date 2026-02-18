from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (('teacher', 'Teacher'), ('student', 'Student'))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    unique_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    unique_id = models.CharField(max_length=20, unique=True, null=True, blank=True)
    teachers = models.ManyToManyField('self', symmetrical=False, related_name='students', blank=True)
    resources_link = models.URLField(max_length=500, blank=True, null=True)
    submission_folder_link = models.URLField(max_length=500, blank=True, null=True)
    resource_upload_link = models.URLField(max_length=500, blank=True, null=True)

    # Make email unique and required
    email = models.EmailField(unique=True)

class Assignment(models.Model):
    student = models.ForeignKey(User, related_name='assignments', on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, related_name='given_assignments', on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    chapter = models.CharField(max_length=100)
    instruction_link = models.URLField(max_length=500, blank=True)
    submission_link = models.URLField(max_length=500, blank=True)
    student_work_link = models.URLField(max_length=500, blank=True, null=True)
    checked_link = models.URLField(max_length=500, blank=True, null=True)
    due_date = models.DateField()
    status = models.CharField(max_length=20, default='pending')
    assigned_date = models.DateField(auto_now_add=True)
    submitted_date = models.DateField(null=True, blank=True)

class ResourceQuery(models.Model):
    student = models.ForeignKey(User, related_name='queries', on_delete=models.CASCADE)
    teacher = models.ForeignKey(User, related_name='received_queries', on_delete=models.CASCADE)
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=100)
    file_link = models.URLField(max_length=500)
    status = models.CharField(max_length=20, default='pending')
    date = models.DateField(auto_now_add=True)
