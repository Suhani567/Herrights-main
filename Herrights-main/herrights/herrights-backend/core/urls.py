from django.urls import path
from .views import ask_ai, get_laws, get_law_detail, submit_complaint, get_complaints, get_complaint_detail, update_complaint_status, get_document_templates, get_document_template_detail, generate_document, get_generated_documents, get_generated_document_detail, submit_story, get_rewards

urlpatterns = [
    path('ask-ai/', ask_ai, name='ask-ai'),
    path('laws/', get_laws, name='get-laws'),
    path('laws/<int:law_id>/', get_law_detail, name='get-law-detail'),
    path('complaints/', get_complaints, name='get-complaints'),
    path('complaints/submit/', submit_complaint, name='submit-complaint'),
    path('complaints/<str:complaint_id>/', get_complaint_detail, name='get-complaint-detail'),
    path('complaints/<str:complaint_id>/status/', update_complaint_status, name='update-complaint-status'),
    path('documents/templates/', get_document_templates, name='get-document-templates'),
    path('documents/templates/<int:template_id>/', get_document_template_detail, name='get-document-template-detail'),
    path('documents/generate/', generate_document, name='generate-document'),
    path('documents/generated/', get_generated_documents, name='get-generated-documents'),
    path('documents/generated/<str:document_id>/', get_generated_document_detail, name='get-generated-document-detail'),
    path('submit-story/', submit_story, name='submit-story'),
    path('get-rewards/', get_rewards, name='get-rewards'),
]
