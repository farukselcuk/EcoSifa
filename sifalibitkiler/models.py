from django.db import models
from django.utils import timezone
from djongo import models as djongo_models

# Create your models here.

class Rahatsizlik(djongo_models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    isim = djongo_models.CharField(max_length=100, unique=True)
    aciklama = djongo_models.TextField(blank=True)
    belirtiler = djongo_models.TextField(help_text="Rahatsızlığın belirtilerini yazın", blank=True)
    risk_faktorleri = models.TextField(help_text="Risk faktörlerini yazın", blank=True)
    onlemler = models.TextField(help_text="Alınması gereken önlemleri yazın", blank=True)
    olusturulma_tarihi = djongo_models.DateTimeField(default=timezone.now)
    guncellenme_tarihi = djongo_models.DateTimeField(auto_now=True)
    
    # Etiketler ve kategoriler
    etiketler = djongo_models.TextField(blank=True)
    seviye = djongo_models.CharField(max_length=50, choices=[
        ('hafif', 'Hafif'),
        ('orta', 'Orta'),
        ('ciddi', 'Ciddi'),
        ('kronik', 'Kronik'),
        ('akut', 'Akut')
    ])
    yayginlik = djongo_models.CharField(max_length=50, choices=[
        ('nadir', 'Nadir'),
        ('az', 'Az'),
        ('orta', 'Orta'),
        ('yaygin', 'Yaygın'),
        ('cok_yaygin', 'Çok Yaygın')
    ])

    def __str__(self):
        return self.isim

    def get_etiketler_list(self):
        """Etiketleri liste olarak döndürür"""
        return [etiket.strip() for etiket in self.etiketler.split(',') if etiket.strip()]

    def set_etiketler_list(self, etiketler_list):
        """Etiketler listesini string olarak kaydeder"""
        self.etiketler = ', '.join(etiketler_list)

class Bitki(djongo_models.Model):
    id = djongo_models.ObjectIdField(primary_key=True)
    isim = djongo_models.CharField(max_length=100)
    tip = djongo_models.CharField(max_length=50, choices=[
        ('tek_yillik', 'Tek Yıllık'),
        ('cok_yillik', 'Çok Yıllık'),
        ('agac', 'Ağaç'),
        ('cicek', 'Çiçek'),
        ('sarmaşık', 'Sarmaşık'),
        ('sukulent', 'Sukulent'),
        ('kaktus', 'Kaktüs'),
        ('ot', 'Ot'),
        ('cim', 'Çim'),
        ('yosun', 'Yosun'),
        ('mantar', 'Mantar'),
        ('diger', 'Diğer')
    ])
    resim = djongo_models.ImageField(upload_to='bitkiler/', blank=True, null=True)
    faydalar = models.TextField()
    kullanim = models.TextField()
    hazirlama = models.TextField()
    uyarilar = models.TextField(blank=True)
    doz = models.TextField(blank=True)
    rahatsizliklar = djongo_models.ManyToManyField(Rahatsizlik, related_name='bitkiler')
    olusturulma_tarihi = djongo_models.DateTimeField(default=timezone.now)
    guncellenme_tarihi = djongo_models.DateTimeField(auto_now=True)
    
    # Ek bilgiler
    etiketler = djongo_models.TextField(blank=True)
    mevsim = djongo_models.TextField(blank=True)
    yan_etkiler = models.TextField(blank=True, help_text="Yan etkileri virgülle ayırarak yazın")
    kontrendikasyonlar = models.TextField(blank=True, help_text="Kontrendikasyonları virgülle ayırarak yazın")
    saklama_kosullari = models.TextField(blank=True)
    raf_omru = models.CharField(max_length=50, blank=True)
    kaynak = models.CharField(max_length=200, blank=True)
    bilimsel_ad = djongo_models.CharField(max_length=100, blank=True)
    aile = djongo_models.CharField(max_length=100, blank=True)
    cins = djongo_models.CharField(max_length=100, blank=True)
    tur = djongo_models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.isim

    def get_etiketler_list(self):
        """Etiketleri liste olarak döndürür"""
        return [etiket.strip() for etiket in self.etiketler.split(',') if etiket.strip()]

    def set_etiketler_list(self, etiketler_list):
        """Etiketler listesini string olarak kaydeder"""
        self.etiketler = ', '.join(etiketler_list)

    def get_mevsim_list(self):
        """Mevsimleri liste olarak döndürür"""
        return [mevsim.strip() for mevsim in self.mevsim.split(',') if mevsim.strip()]

    def set_mevsim_list(self, mevsim_list):
        """Mevsimler listesini string olarak kaydeder"""
        self.mevsim = ', '.join(mevsim_list)

    def get_yan_etkiler_list(self):
        """Yan etkileri liste olarak döndürür"""
        return [etki.strip() for etki in self.yan_etkiler.split(',') if etki.strip()]

    def set_yan_etkiler_list(self, yan_etkiler_list):
        """Yan etkiler listesini string olarak kaydeder"""
        self.yan_etkiler = ', '.join(yan_etkiler_list)

    def get_kontrendikasyonlar_list(self):
        """Kontrendikasyonları liste olarak döndürür"""
        return [kontrendikasyon.strip() for kontrendikasyon in self.kontrendikasyonlar.split(',') if kontrendikasyon.strip()]

    def set_kontrendikasyonlar_list(self, kontrendikasyonlar_list):
        """Kontrendikasyonlar listesini string olarak kaydeder"""
        self.kontrendikasyonlar = ', '.join(kontrendikasyonlar_list)
