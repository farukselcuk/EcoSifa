from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import User, Group
from .models import Bitki, Rahatsizlik

class EcoSifaAdminSite(AdminSite):
    site_header = 'EcoSifa Yönetim Paneli'
    site_title = 'EcoSifa Admin'
    index_title = 'EcoSifa Yönetim Paneli'

    def get_app_list(self, request):
        app_list = super().get_app_list(request)
        return app_list

    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }

admin_site = EcoSifaAdminSite(name='ecosifa_admin')

# Kullanıcı ve Grup yönetimini ekle
admin_site.register(User)
admin_site.register(Group)

@admin.register(Bitki, site=admin_site)
class BitkiAdmin(admin.ModelAdmin):
    list_display = ('isim', 'tip', 'bilimsel_ad', 'olusturulma_tarihi')
    list_filter = ('tip', 'etiketler')
    search_fields = ('isim', 'bilimsel_ad', 'aciklama')
    filter_horizontal = ('rahatsizliklar',)
    date_hierarchy = 'olusturulma_tarihi'
    ordering = ('-olusturulma_tarihi',)

@admin.register(Rahatsizlik, site=admin_site)
class RahatsizlikAdmin(admin.ModelAdmin):
    list_display = ('isim', 'seviye', 'yayginlik', 'olusturulma_tarihi')
    list_filter = ('seviye', 'yayginlik', 'etiketler')
    search_fields = ('isim', 'aciklama', 'belirtiler')
    date_hierarchy = 'olusturulma_tarihi'
    ordering = ('-olusturulma_tarihi',)
