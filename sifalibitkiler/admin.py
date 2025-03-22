from django.contrib import admin
from .models import Bitki, Rahatsizlik

@admin.register(Rahatsizlik)
class RahatsizlikAdmin(admin.ModelAdmin):
    list_display = ('isim', 'olusturulma_tarihi', 'guncellenme_tarihi')
    search_fields = ('isim', 'aciklama', 'belirtiler')
    list_filter = ('olusturulma_tarihi', 'guncellenme_tarihi')
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi')
    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('isim', 'aciklama')
        }),
        ('Detaylı Bilgiler', {
            'fields': ('belirtiler', 'risk_faktorleri', 'onlemler'),
            'classes': ('collapse',)
        }),
        ('Zaman Bilgileri', {
            'fields': ('olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Bitki)
class BitkiAdmin(admin.ModelAdmin):
    list_display = ('isim', 'tip', 'olusturulma_tarihi', 'guncellenme_tarihi')
    list_filter = ('tip', 'olusturulma_tarihi', 'rahatsizliklar')
    search_fields = ('isim', 'faydalar', 'kullanim', 'hazirlama')
    filter_horizontal = ('rahatsizliklar',)
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi')
