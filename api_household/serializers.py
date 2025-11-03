from rest_framework import serializers
from .models import HouseHoldTransactions


class HouseHoldTransactionsSerializer(serializers.ModelSerializer):
    # date = serializers.DateTimeField(format='%Y-%m-%d', read_only=True)

    class Meta:
        model = HouseHoldTransactions
        fields = ('id', 'amount', 'type', 'date', 'category', 'content', 'user_household')
        extra_kwargs = {
            'user_household': {'read_only': True}}
