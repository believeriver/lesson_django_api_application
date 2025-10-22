from rest_framework import serializers
from .models import InstaPost, InstaComment


class InstaPostSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = InstaPost
        fields = ('id', 'title', 'userPost', 'created_on', 'img', 'liked')
        extra_kwargs = {'userPost': {'read_only': True}}


class InstaCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstaComment
        fields = ('id', 'text', 'userComment','post')
        extra_kwargs = {'userComment': {'read_only': True}}


