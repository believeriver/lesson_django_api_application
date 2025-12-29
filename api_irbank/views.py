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
        # if self.action == 'retrieve':
        #     return CompanyDetailSerializer
        # return CompanyListSerializer

    def get_queryset(self):
        """企業名・コード検索 + 最適プリロード"""
        if self.action == 'retrieve':
            return self.queryset
            # # 詳細：Financial年度降順(検索パラメータ無視、コード単体取得)
            # return self.queryset.prefetch_related(
            #     Prefetch('financials', queryset=Financial.objects.order_by('-fiscal_year')))

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
        # """最適プリロード"""
        # if self.action == 'list':
        #     # 一覧：Informationのみ（高速）
        #     return Company.objects.select_related('information').order_by('code')
        #
        # # 詳細：Information + 全Financial（年度降順）
        # return Company.objects.select_related('information').prefetch_related(
        #     Prefetch(
        #         'financials',
        #         queryset=Financial.objects.order_by('-fiscal_year')
        #     )
        # )

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


# class CompanyViewSet(viewsets.ModelViewSet):
#     """
#     GET    /api_irbank/company/          # ← 全件リスト（これが欲しい！）
#     GET    /api_irbank/company/{pk}/     # 詳細
#     ?search=トヨタ                        # 会社名/株価部分一致
#     ?code=1234                           # 完全一致
#     ?ordering=-dividend                  # 配当降順
#     ?page=2                              # 51-100件
#     """
#     permission_classes = [AllowAny]
#
#     queryset = Company.objects.all()
#     serializer_class = CompanySerializer
#     lookup_field = 'code'  # primary key = code
#
#     filter_backends = [
#         DjangoFilterBackend,
#         filters.SearchFilter,
#         filters.OrderingFilter
#     ]
#
#     # ViewSet単位でページサイズ変更
#     pagination_class = PageNumberPagination
#     page_size = 50
#
#     filterset_fields = ['code']
#     search_fields = ['name', 'stock']
#     ordering_fields = ['dividend', 'dividend_rank']
#     ordering = ['dividend_rank']
#
#     # def get_queryset(self):
#     #     # フィルタリング後の会社コードのみ取得
#     #     company_codes = self.queryset.values_list('code', flat=True).distinct()
#     #
#     #     # select_relatedでN+1回避
#     #     information_dataset = Information.objects.filter(
#     #         company_code__in=company_codes
#     #     ).select_related('company').order_by('company_code', '-updated_at')
#     #
#     #     info_dict = {}
#     #     for info in information_dataset:
#     #         code = info.company_code
#     #         if code not in info_dict:
#     #             info_dict[code] = []
#     #         info_dict[code].append(InformationSerializer(info).data)
#     #
#     #     self.request.information_dataset = info_dict
#     #     return super().get_queryset()
#
#     def get_serializer_context(self):
#         context = super().get_serializer_context()
#         context['information_dataset'] = getattr(self.request, 'information_dataset', {})
#         return context
#
#
# # class InformationViewSet(viewsets.ModelViewSet):
# class InformationViewSet(viewsets.ReadOnlyModelViewSet):
#     queryset = Information.objects.all()
#     serializer_class = InformationSerializer
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter]
#     permission_classes = [AllowAny]
#
#     # def get_queryset(self):
#     #     queryset = Information.objects.filter(company_code__isnull=False)
#     #     company_code = self.request.query_params.get('company_code')
#     #     fiscal_year = self.request.query_params.get('fiscal_year')
#     #
#     #     if company_code:
#     #         queryset = queryset.filter(company_code=company_code)
#     #     if fiscal_year:
#     #         queryset = queryset.filter(fiscal_year=fiscal_year)
#     #
#     #     return queryset.prefetch_related(
#     #         Prefetch('company_code', queryset=Company.objects.all(), to_attr='company_obj')
#     #     )
#     #
#     # filterset_fields = ['company_code', 'fiscal_year']
#     # search_fields = ['company_code']
#
#
# class FinancialViewSet(viewsets.ModelViewSet):
#     """
#     GET    /api_irbank/financial/                    # 全件リスト（Company情報付き）
#     GET    /api_irbank/financial/?company_code=2914  # 会社別全年度
#     GET    /api_irbank/financial/?fiscal_year=2024   # 年度別
#     GET    /api_irbank/financial/2914/2024/03/       # 単一詳細
#     ?ordering=-operating_margin                      # 利益率降順
#     ?page=2                                          # ページネーション
#     """
#     permission_classes = [AllowAny]
#
#     queryset = Financial.objects.all()
#     serializer_class = FinancialSerializer
#     lookup_fields = ['company_code', 'fiscal_year']  # 複合ルックアップ
#
#     filter_backends = [
#         DjangoFilterBackend,
#         filters.SearchFilter,
#         filters.OrderingFilter
#     ]
#
#     pagination_class = PageNumberPagination
#     page_size = 50
#
#     # フィルタ（会社コード、年度）
#     filterset_fields = ['company_code', 'fiscal_year']
#
#     # 検索（会社コード、年度）
#     search_fields = ['company_code', 'fiscal_year']
#
#     # ソート（財務指標）
#     ordering_fields = [
#         'operating_margin', 'eps', 'equity_ratio',
#         'operating_cash_flow', 'payout_ratio', 'fiscal_year'
#     ]
#     ordering = ['-fiscal_year']  # 最新年度優先
#
#
# class AdminFinancialViewSet(viewsets.ModelViewSet):
#     """CRUD for admin
#     example)
#     permission_classes = [IsAdminUser]  # 管理者限定
#     queryset = Financial.objects.all()
#     """
#
#     pass




