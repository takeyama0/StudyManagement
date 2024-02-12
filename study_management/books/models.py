from django.db import models

# Create your models here.
from django.db import models
from django.utils import timezone


class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)  # New field for author
    start_date = models.DateField(default=timezone.now)
    total_pages = models.PositiveIntegerField()
    pages_read = models.PositiveIntegerField(default=0)
    tags = models.ManyToManyField(Tag, blank=True)  # New field for tags
    order = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.title} - {self.author}"


class Note(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    page = models.IntegerField()
    text = models.TextField()

    def __str__(self):
        return f"{self.book.title} - Page {self.page}"
