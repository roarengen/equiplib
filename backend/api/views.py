from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from .models import Renter
from .serializers import RenterSerializer

class RenterApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        renter = Renter.objects.filter()
        serializer = RenterSerializer(renter, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
