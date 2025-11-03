from django.shortcuts import render

from rest_framework import viewsets
from .models import HouseHoldTransactions
from .serializers import HouseHoldTransactionsSerializer


class HouseHoldTransactionsViewSet(viewsets.ModelViewSet):
    queryset = HouseHoldTransactions.objects.all()
    serializer_class = HouseHoldTransactionsSerializer

    def perform_create(self, serializer):
        serializer.save(user_household=self.request.user)

