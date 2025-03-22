from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('bitkiler/', views.bitki_listesi, name='bitki_listesi'),
    path('bitki/<int:pk>/', views.bitki_detay, name='bitki_detay'),
    path('bitki/ekle/', views.bitki_ekle, name='bitki_ekle'),
    path('bitki/<int:pk>/duzenle/', views.bitki_duzenle, name='bitki_duzenle'),
    path('bitki/<int:pk>/sil/', views.bitki_sil, name='bitki_sil'),
    path('tedavi/', views.tedavi_form, name='tedavi_form'),
    path('tedavi/oneri/', views.tedavi_form, name='tedavi_oneri'),
    path('search/', views.search_bitkiler, name='search_bitkiler'),
    path('rahatsizliklar/', views.rahatsizlik_listesi, name='rahatsizlik_listesi'),
] 