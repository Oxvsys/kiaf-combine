from rest_framework.pagination import PageNumberPagination


class FarmerPagination(PageNumberPagination):
    page_size = 5
