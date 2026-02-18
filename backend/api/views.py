from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import User, Assignment, ResourceQuery
from .serializers import UserSerializer, AssignmentSerializer, ResourceQuerySerializer
import random
from django.db import models

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        # We assume username is email for simplicity in this app structure or find user by email
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key, 'user': UserSerializer(user).data})
        except User.DoesNotExist:
            pass
        return Response({'message': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def register(self, request):
        data = request.data
        if User.objects.filter(email=data.get('email')).exists():
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(
            username=data.get('email'), # Use email as username
            email=data.get('email'),
            password=data.get('password'),
            first_name=data.get('name', ''),
            role=data.get('role', 'student')
        )
        
        if user.role == 'student':
            user.unique_id = f"STU-{random.randint(1000, 9999)}"
            user.save()
            
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            # Teachers see themselves and linked students
            return User.objects.filter(models.Q(id=user.id) | models.Q(teachers=user)).distinct()
        return User.objects.filter(id=user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        return Response(UserSerializer(request.user).data)

    @action(detail=False, methods=['post'])
    def link_student(self, request):
        teacher = request.user
        student_code = request.data.get('student_code') # Corrected parameter name
        
        if not student_code:
             return Response({'message': 'Student code is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            student = User.objects.get(unique_id=student_code, role='student')
            student.teachers.add(teacher) # M2M relationship
            student.save()
            return Response({'message': 'Student Linked Successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def update_resources(self, request, pk=None):
        user = self.get_object()
        user.resources_link = request.data.get('resourcesLink', user.resources_link)
        user.submission_folder_link = request.data.get('submissionFolderLink', user.submission_folder_link)
        user.resource_upload_link = request.data.get('resourceUploadLink', user.resource_upload_link)
        user.save()
        return Response(UserSerializer(user).data)

class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return Assignment.objects.filter(teacher=user)
        return Assignment.objects.filter(student=user)

    def create(self, request, *args, **kwargs):
        # Map camelCase to snake_case for creation
        data = request.data.copy()
        data['teacher'] = request.user.id
        data['student'] = data.get('studentId')
        data['instruction_link'] = data.get('instructionLink', '')
        data['submission_link'] = data.get('submissionLink', '')
        data['due_date'] = data.get('dueDate')
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data
        
        if 'studentWorkLink' in data:
            instance.student_work_link = data['studentWorkLink']
        if 'checkedLink' in data:
            instance.checked_link = data['checkedLink']
        if 'status' in data:
            instance.status = data['status']
        if 'submittedDate' in data:
            instance.submitted_date = data['submittedDate']
            
        instance.save()
        return Response(self.get_serializer(instance).data)

class ResourceQueryViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceQuerySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'teacher':
            return ResourceQuery.objects.filter(teacher=user)
        return ResourceQuery.objects.filter(student=user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data['student'] = request.user.id
        
        # Logic for multiple teachers: 
        # For now, pick the first teacher or require 'teacher_id' from frontend.
        # Ideally, student picks which teacher to ask.
        # Fallback: Pick the first linked teacher.
        if 'teacher_id' in data:
             data['teacher'] = data['teacher_id']
        else:
             first_teacher = request.user.teachers.first()
             if first_teacher:
                  data['teacher'] = first_teacher.id
             else:
                  return Response({'detail': 'No teacher linked to send query to.'}, status=400)

        if not data['teacher']:
            return Response({'detail': 'No teacher selected'}, status=400)
            
        data['file_link'] = data.get('fileLink', '')
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if 'status' in request.data:
            instance.status = request.data['status']
            instance.save()
        return Response(self.get_serializer(instance).data)
