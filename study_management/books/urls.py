from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('edit_book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('update_book_order/', views.update_book_order, name='update_book_order'),
    path('update_pages_read/<int:book_id>/', views.update_pages_read, name='update_pages_read'),
]
