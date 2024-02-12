from django import forms
from .models import Book, Note, Tag


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ['title', 'author', 'start_date', 'total_pages', 'pages_read', 'tags']  # Include new fields
        widgets = {
            'tags': forms.CheckboxSelectMultiple,  # Use checkboxes for tags
        }

    # Add this method to dynamically populate the tags field
    def __init__(self, *args, **kwargs):
        super(BookForm, self).__init__(*args, **kwargs)
        self.fields['tags'].queryset = Tag.objects.all()


class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['book', 'page', 'text']


class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['name']
