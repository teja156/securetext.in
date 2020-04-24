from django.db import models

# Create your models here.

class Sites(models.Model):
	site_url = models.CharField(max_length=30,unique=True)
	cipher = models.TextField()
	hashcontent = models.TextField()
	created_on = models.DateTimeField(auto_now_add=True)
	last_updated = models.DateTimeField(auto_now=True)
	version = models.IntegerField(default=0)