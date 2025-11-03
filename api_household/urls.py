from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HouseHoldTransactionsViewSet

app_name = 'household_app'

router = DefaultRouter()
router.register('transactions', HouseHoldTransactionsViewSet)


urlpatterns = [
    path('', include(router.urls))
]