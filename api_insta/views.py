from django.shortcuts import render
from rest_framework import viewsets
from . import serializers
from .models import InstaPost, InstaComment


class InstaPostViewSet(viewsets.ModelViewSet):
    queryset = InstaPost.objects.all()
    serializer_class = serializers.InstaPostSerializer

    def perform_create(self, serializer):
        serializer.save(userPost=self.request.user)


class InstaCommentViewSet(viewsets.ModelViewSet):
    queryset = InstaComment.objects.all()
    serializer_class = serializers.InstaCommentSerializer

    def perform_create(self, serializer):
        serializer.save(userComment=self.request.user)

