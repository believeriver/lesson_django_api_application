from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'irbank'

router = DefaultRouter()
router.register(r'companies', views.CompanyViewSet)
router.register(r'financials', views.FinancialViewSet)
router.register(r'information', views.InformationViewSet)

urlpatterns = [
    path('', include(router.urls))
]
