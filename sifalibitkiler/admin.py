from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Bitki, Rahatsizlik, TedaviOnerisi

class EcoSifaaAdmin(AdminSite):
    site_header = 'EcoSifaa Yönetim Paneli'
    site_title = 'EcoSifaa Admin'
    index_title = 'Yönetim Paneli'
    site_url = '/'

admin_site = EcoSifaaAdmin(name='ecosifaa_admin')

@admin.register(Bitki)
class BitkiAdmin(admin.ModelAdmin):
    list_display = ('isim', 'tip', 'bilimsel_ad', 'olusturulma_tarihi')
    list_filter = ('tip',)
    search_fields = ('isim', 'bilimsel_ad', 'faydalar', 'kullanim')
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi')
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('isim', 'tip', 'bilimsel_ad', 'etiketler', 'mevsim')
        }),
        ('Detaylı Bilgiler', {
            'fields': ('faydalar', 'kullanim', 'hazirlama', 'uyarilar', 'doz')
        }),
        ('Ek Bilgiler', {
            'fields': ('yan_etkiler', 'kontrendikasyonlar', 'saklama_kosullari', 'raf_omru')
        }),
        ('Sınıflandırma', {
            'fields': ('aile', 'cins', 'tur')
        }),
        ('Görsel ve Kaynak', {
            'fields': ('resim', 'kaynak')
        }),
        ('Zaman Bilgileri', {
            'fields': ('olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',)
        })
    )
    ordering = ('-olusturulma_tarihi',)

@admin.register(Rahatsizlik)
class RahatsizlikAdmin(admin.ModelAdmin):
    list_display = ('isim', 'seviye', 'yayginlik', 'olusturulma_tarihi')
    list_filter = ('seviye', 'yayginlik')
    search_fields = ('isim', 'belirtiler', 'risk_faktorleri', 'onlemler')
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi')
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('isim', 'seviye', 'yayginlik')
        }),
        ('Detaylı Bilgiler', {
            'fields': ('aciklama', 'belirtiler', 'risk_faktorleri', 'onlemler')
        }),
        ('Etiketler', {
            'fields': ('etiketler',)
        }),
        ('Zaman Bilgileri', {
            'fields': ('olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',)
        })
    )
    ordering = ('-olusturulma_tarihi',)

@admin.register(TedaviOnerisi)
class TedaviOnerisiAdmin(admin.ModelAdmin):
    list_display = ('bitki', 'rahatsizlik', 'olusturulma_tarihi')
    list_filter = ('bitki', 'rahatsizlik')
    search_fields = ('bitki__isim', 'rahatsizlik__isim', 'aciklama')
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi')
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('bitki', 'rahatsizlik')
        }),
        ('Tedavi Detayları', {
            'fields': ('aciklama',)
        }),
        ('Zaman Bilgileri', {
            'fields': ('olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',)
        })
    )
    ordering = ('-olusturulma_tarihi',)

# Register models with custom admin site
admin_site.register(User, UserAdmin)
admin_site.register(Bitki, BitkiAdmin)
admin_site.register(Rahatsizlik, RahatsizlikAdmin)
admin_site.register(TedaviOnerisi, TedaviOnerisiAdmin)
