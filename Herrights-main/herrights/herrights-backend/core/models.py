from django.db import models
from django.contrib.auth.models import User

# -------------------
# Law Model
# -------------------
class Law(models.Model):
    title = models.CharField(max_length=500)
    category = models.CharField(max_length=100)
    description = models.TextField()
    content = models.TextField()
    importance = models.CharField(max_length=20, choices=[
        ('High', 'High'),
        ('Medium', 'Medium'),
        ('Low', 'Low')
    ])
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-importance', '-created_date']

    def __str__(self):
        return self.title

# -------------------
# Complaint Model
# -------------------
class Complaint(models.Model):
    COMPLAINT_TYPES = [
        ('Domestic Violence', 'Domestic Violence'),
        ('Sexual Harassment at Workplace', 'Sexual Harassment at Workplace'),
        ('Sexual Assault', 'Sexual Assault'),
        ('Dowry Harassment', 'Dowry Harassment'),
        ('Cyber Crime/Stalking', 'Cyber Crime/Stalking'),
        ('Property Dispute', 'Property Dispute'),
        ('Child Marriage', 'Child Marriage'),
        ('Other', 'Other')
    ]

    URGENCY_LEVELS = [
        ('low', 'Low - Not urgent'),
        ('medium', 'Medium - Needs attention'),
        ('high', 'High - Urgent'),
        ('emergency', 'Emergency')
    ]

    GENDER_CHOICES = [
        ('female', 'Female'),
        ('male', 'Male'),
        ('other', 'Other'),
        ('prefer-not-to-say', 'Prefer not to say')
    ]

    complaint_type = models.CharField(max_length=50, choices=COMPLAINT_TYPES)
    victim_name = models.CharField(max_length=200)
    victim_age = models.IntegerField()
    victim_gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='female')
    contact_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()

    incident_date = models.DateField()
    incident_location = models.CharField(max_length=500)
    incident_description = models.TextField()
    witnesses = models.TextField(blank=True, null=True)

    police_station = models.CharField(max_length=200, blank=True, null=True)
    urgency = models.CharField(max_length=20, choices=URGENCY_LEVELS, default='medium')
    previous_complaints = models.CharField(max_length=50, blank=True, null=True)
    additional_info = models.TextField(blank=True, null=True)

    # Tracking fields
    complaint_id = models.CharField(max_length=20, unique=True, blank=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'Pending Review'),
        ('under_investigation', 'Under Investigation'),
        ('resolved', 'Resolved'),
        ('rejected', 'Rejected')
    ])
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f"Complaint {self.complaint_id} - {self.complaint_type}"

    def save(self, *args, **kwargs):
        if not self.complaint_id:
            import random, string
            while True:
                complaint_id = 'CMP' + ''.join(random.choices(string.digits, k=8))
                if not Complaint.objects.filter(complaint_id=complaint_id).exists():
                    self.complaint_id = complaint_id
                    break
        super().save(*args, **kwargs)

# -------------------
# DocumentTemplate Model
# -------------------
class DocumentTemplate(models.Model):
    TEMPLATE_CATEGORIES = [
        ('complaints', 'Complaints'),
        ('applications', 'Applications'),
        ('legal_claims', 'Legal Claims'),
        ('legal_petitions', 'Legal Petitions'),
        ('other', 'Other')
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=TEMPLATE_CATEGORIES)
    template_content = models.TextField()
    fields = models.JSONField()  # Store form fields configuration
    is_active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['category', 'title']

    def __str__(self):
        return self.title

# -------------------
# GeneratedDocument Model
# -------------------
class GeneratedDocument(models.Model):
    template = models.ForeignKey(DocumentTemplate, on_delete=models.CASCADE)
    user_data = models.JSONField()  # Store the form data used
    generated_content = models.TextField()
    document_id = models.CharField(max_length=20, unique=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_date']

    def __str__(self):
        return f"Generated Document - {self.template.title}"

    def save(self, *args, **kwargs):
        if not self.document_id:
            import random, string
            while True:
                document_id = 'DOC' + ''.join(random.choices(string.digits, k=8))
                if not GeneratedDocument.objects.filter(document_id=document_id).exists():
                    self.document_id = document_id
                    break
        super().save(*args, **kwargs)

# -------------------
# Story Model (User Shared Stories)
# -------------------
class Story(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.title}"

# -------------------
# Reward Model (User Points)
# -------------------
class Reward(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    def add_points(self, pts):
        self.points += pts
        self.save()

    def __str__(self):
        return f"{self.user.username} - {self.points} points"
