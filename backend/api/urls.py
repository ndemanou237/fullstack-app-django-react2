
from django.urls import path
from . import views

urlpatterns = [
    path('transaction/', views.TransactionListCreateView.as_view())
    
]