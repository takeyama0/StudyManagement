from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.core import serializers
import json
import string
from .models import Task
from django.db.models import Count, Q
from django.contrib import messages
 

def index(request):
    task_list = Task.objects.order_by('-creation_date')
    context = {'task_list': task_list}
    return render(request, 'task/index.html', context)

def add(request):
    if request.method == "POST":
        if(request.POST['detail'] != "" and request.POST['category'] != ""):
            task = Task(detail=request.POST['detail'], status=Task.INCOMPLETE, category=string.capwords(request.POST['category']))
            task.save()
            return HttpResponseRedirect(reverse('task:index'));

        messages.error(request, "Task Detail & Category can't be blank" )
    else:
        messages.error(request, "Wrong Method" )
    return HttpResponseRedirect(reverse('task:index'));


def delete(request):
    if request.method == "POST":
        post_body = json.loads(request.body)
        task = get_object_or_404(Task, pk=post_body.get("id"))
        task.delete()    
        return HttpResponse(json.dumps({
            "success": "deleted"
        }), content_type="application/json")  

    return HttpResponse(json.dumps({
            "error": "Method Not Supported"
        }), content_type="application/json")      

    
def update(request):
    if request.method == "POST":
        post_body = json.loads(request.body)
        task = get_object_or_404(Task, pk=post_body.get("id"))
        task.status = Task.COMPLETE if post_body.get("status") == "True" else Task.INCOMPLETE
        task.save(update_fields=['status'])
        return HttpResponse(json.dumps({
            "success": "updated"
        }), content_type="application/json")    

    return HttpResponse(json.dumps({
            "error": "Method Not Supported"
        }), content_type="application/json")    

def get_chart_data(request):
    task =  Task.objects.values('category').annotate(complete=Count("status", filter=Q(status=Task.COMPLETE)), incomplete=Count("status", filter=Q(status=Task.INCOMPLETE)))
    return HttpResponse(json.dumps(list(task)), content_type="application/json")

def get_task(request):
    task_list = Task.objects.order_by('-creation_date')
    task_list_json = serializers.serialize('json', task_list)

    return HttpResponse(task_list_json, content_type="application/json")
