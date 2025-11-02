from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'household_app'

router = DefaultRouter()


urlpatterns = [
    path('', include(router.urls))
]