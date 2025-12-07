from django.shortcuts import render
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Prefetch
from .models import Company, Financial
from .serializers import CompanySerializer, FinancialSerializer


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['code', 'industry']
    search_fields = ['name', 'code']


class FinancialsViewSet(viewsets.ReadOnlyModelViewSet):
    # queryset = Financial.objects.all()
    serializer_class = FinancialSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]

    def get_queryset(self):
        # company_codeでフィルタリング → Companyデータも同時取得
        queryset = Financial.objects.filter(company_code__isnull=False)

        company_code = self.request.query_params.get('company_code')
        fiscal_year = self.request.query_params.get('fiscal_year')

        if company_code:
            queryset = queryset.filter(company_code=company_code)
        if fiscal_year:
            queryset = queryset.filter(fiscal_year=fiscal_year)

        # Companyデータをプリフェッチ（N+1回避）
        return queryset.prefetch_related(
            Prefetch('company_code', queryset=Company.objects.all(), to_attr='company_obj')
        )

    filterset_fields = ['company_code', 'fiscal_year']
    search_fields = ['company_code']




