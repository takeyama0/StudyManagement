import json

from django.db.models import F
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.core import serializers
from django.views.decorators.http import require_POST

from .forms import BookForm, NoteForm, TagForm
from .models import Book


@csrf_exempt
def index(request):
    if request.method == 'POST':
        if 'add_book' in request.POST:
            form = BookForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error'})

        elif 'add_note' in request.POST:
            form = NoteForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error'})

        elif 'add_tag' in request.POST:
            form = TagForm(request.POST)
            if form.is_valid():
                form.save()
                return JsonResponse({'status': 'success'})
            else:
                return JsonResponse({'status': 'error'})

    books_in_progress = Book.objects.filter(pages_read__lt=F('total_pages')).order_by('order')
    completed_books = Book.objects.filter(pages_read=F('total_pages')).order_by('order')
    book_form = BookForm()
    note_form = NoteForm()
    tag_form = TagForm()
    return render(request, 'books/index.html',
                  {'books_in_progress': books_in_progress,
                   'completed_books': completed_books,
                   'book_form': book_form,
                   'note_form': note_form,
                   'tag_form': tag_form})


@csrf_exempt
def edit_book(request, book_id):
    book = get_object_or_404(Book, pk=book_id)

    if request.method == 'POST':
        print("edit_book tags:", request.POST.get("tags"))
        form = BookForm(request.POST, instance=book)
        if form.is_valid():
            form.save()
            data = {
                "status": "success",
                'id': book.id,
                'title': book.title,
                'author': book.author, # Add this line
                'start_date': book.start_date.strftime('%Y-%m-%d'),
                'total_pages': book.total_pages,
                'pages_read': book.pages_read,
            }
            return JsonResponse(data)
        else:
            return JsonResponse({'status': 'error'})
    else:
        # Serialize book data and send it as a JSON response
        book_data = {
            'id': book.id,
            'title': book.title,
            'author': book.author, # Add this line
            'start_date': book.start_date.strftime('%Y-%m-%d'),
            'total_pages': book.total_pages,
            'pages_read': book.pages_read,
        }
        return JsonResponse(book_data)


@require_POST
@csrf_exempt
def update_book_order(request):
    order_data = request.POST.get('order_data')
    if order_data:
        order_data = json.loads(order_data)
        for book_id, order in order_data.items():
            book = Book.objects.get(id=book_id)
            book.order = order
            book.save()
        return JsonResponse({"status": "success"})
    else:
        return JsonResponse({"status": "error"})


@require_POST
@csrf_exempt
def update_pages_read(request, book_id):
    delta = int(request.POST.get('delta', 0))
    book = get_object_or_404(Book, pk=book_id)

    book.pages_read = max(0, book.pages_read + delta)
    book.pages_read = min(book.pages_read, book.total_pages)
    book.save()

    return JsonResponse({"status": "success", "pages_read": book.pages_read})
