from django.urls import include, path
from .views import RenterApiView

urlpatterns = [
    path("", RenterApiView.as_view())
]

