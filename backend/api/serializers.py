from rest_framework import serializers
from .models import User, Assignment, ResourceQuery

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'unique_id', 'teachers', 'resources_link', 'submission_folder_link', 'resource_upload_link']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Map snake_case to frontend camelCase expectations
        return {
            'id': str(instance.id),
            'name': f"{instance.first_name} {instance.last_name}".strip() or instance.username,
            'email': instance.email,
            'role': instance.role,
            'uniqueId': instance.unique_id,
            'teacherIds': [str(t.id) for t in instance.teachers.all()],
            'resourcesLink': instance.resources_link,
            'submissionFolderLink': instance.submission_folder_link,
            'resourceUploadLink': instance.resource_upload_link,
        }

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'studentId': str(instance.student.id),
            'teacherId': str(instance.teacher.id),
            'subject': instance.subject,
            'chapter': instance.chapter,
            'instructionLink': instance.instruction_link,
            'submissionLink': instance.submission_link,
            'studentWorkLink': instance.student_work_link,
            'checkedLink': instance.checked_link,
            'dueDate': instance.due_date,
            'status': instance.status,
            'assignedDate': instance.assigned_date,
            'submittedDate': instance.submitted_date,
        }

class ResourceQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ResourceQuery
        fields = '__all__'

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'studentId': str(instance.student.id),
            'teacherId': str(instance.teacher.id),
            'subject': instance.subject,
            'topic': instance.topic,
            'fileLink': instance.file_link,
            'status': instance.status,
            'date': instance.date,
        }
