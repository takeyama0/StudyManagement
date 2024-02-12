from django.db import models
from django.utils.timezone import now

class Task(models.Model):
    COMPLETE = "Complete"
    INCOMPLETE = "Incomplete"
    STATUS = [
        (COMPLETE, "Complete"),
        (INCOMPLETE, "Incomplete")
    ]

    detail = models.CharField(max_length=200, null=False, blank=False)
    status = models.CharField(max_length=200, choices=STATUS,default=INCOMPLETE)
    category = models.CharField(max_length=200, default=None)
    creation_date = models.DateTimeField('Creation Date', default=now)

    def __str__(self):
        return self.detail