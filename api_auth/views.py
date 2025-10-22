from django.shortcuts import render
from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile


class CreateUserView(generics.CreateAPIView):
    """ Everyone can access to create user.-> AllowAny
        only create method: generics.CreateAPIView
    """
    serializer_class = serializers.UserSerializer
    permission_classes = (AllowAny, )


class ProfileViewSet(viewsets.ModelViewSet):
    """
    CRUD already defined: viewsets.ModelViewSet
    """
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def perform_create(self, serializer):
        """When creating a user, override the perform_create method
            to automatically assign the logged-in user from the request
            on the API side."""
        serializer.save(userProfile=self.request.user)


class MyProfileListView(generics.ListAPIView):
    """Return the profile of the logged-in user
       only get method: generics.ListAPIView
    """
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer

    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)

