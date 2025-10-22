from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user_Insta'

router = DefaultRouter()
router.register('insta_post', views.InstaPostViewSet)
router.register('insta_comment', views.InstaCommentViewSet)

urlpatterns = [
    path('', include(router.urls))
]
