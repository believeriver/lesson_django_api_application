from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'irbank'

router = DefaultRouter()
router.register('companies', views.CompanyViewSet)
router.register('financials', views.FinancialsViewSet)

urlpatterns = [
    path('', include(router.urls))
]
