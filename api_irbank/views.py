from django.db.models import Prefetch, Q
from django.http import Http404

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny

from django_filters.rest_framework import DjangoFilterBackend

from .models import Company, Financial
from .serializers import CompanyListSerializer, CompanyDetailSerializer


class CompanyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Company API要件：
    - 一覧：Company + Information（全件）
    - 詳細：Company + Information + 全Financial履歴
    """

    permission_classes = [AllowAny]
    queryset = Company.objects.select_related('information').prefetch_related('financials')
    serializer_class = CompanyListSerializer

    def get_object(self):
        """code=PKで詳細取得（idではない）"""
        code = self.kwargs['pk']  # URL末尾の3205を取得
        queryset = self.get_queryset()
        try:
            return queryset.get(code=code)  # codeで検索！
        except Company.DoesNotExist:
            raise Http404(f"Company code '{code}' not found")

    def get_serializer_class(self):
        """一覧=Company+Information、詳細=全データ"""
        if self.action == 'retrieve':
            return CompanyDetailSerializer
        return CompanyListSerializer

    def get_queryset(self):
        """企業名・コード検索 + 最適プリロード"""
        if self.action == 'retrieve':
            return self.queryset

        # リストのみ検索ソート
        queryset = self.queryset
        # 検索：企業名 or コード（部分一致）
        query = self.request.query_params.get('search', '').strip()
        if query:
            queryset = queryset.filter(
                Q(code__icontains=query) | Q(name__icontains=query)
            )

        # ソート：配当 or コード
        sort = self.request.query_params.get('sort', 'code')
        if sort == 'dividend':
            queryset = queryset.order_by('-dividend', 'code')
        else:
            queryset = queryset.order_by('code')

        return queryset

    def get_serializer_context(self):
        """クエリパラメータ伝播"""
        context = super().get_serializer_context()
        context.update({'request': self.request})
        return context

    @action(detail=False, methods=['get'])
    def search(self, request):
        """検索（銘柄名・コード）"""
        query = request.query_params.get('q', '')
        if not query:
            return Response([])

        companies = Company.objects.select_related('information').filter(
            Q(code__icontains=query) | Q(name__icontains=query)
        )[:20]  # 検索結果上限

        serializer = CompanyListSerializer(companies, many=True)
        return Response(serializer.data)

