from django.urls import path

from . import views

app_name = 'task'

urlpatterns = [
    path('', views.index, name='index'),
    path('add/', views.add, name='add'),
    path('update/', views.update, name='update'),
    path('delete/', views.delete, name='delete'),
    path('get-tasks/', views.get_task, name='get-tasks'),
    path('get-chart-data/', views.get_chart_data, name='get-chart-data'),
]