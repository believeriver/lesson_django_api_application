from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Company, Financial
from .serializers import CompanySerializer, FinancialSerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer


class FinancialsViewSet(viewsets.ModelViewSet):
    queryset = Financial.objects.all()
    serializer_class = FinancialSerializer



