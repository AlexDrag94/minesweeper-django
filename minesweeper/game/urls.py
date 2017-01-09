from django.conf.urls import url
from . import views
from django.views.generic import ListView
from game.models import Entry

urlpatterns = [
   
    url(r'^$', ListView.as_view(queryset=Entry.objects.all(), template_name="game/index.html"))]
