from django.db import models
from django.utils import timezone

# Create your models here.

class Rahatsizlik(models.Model):
    isim = models.CharField(max_length=100, unique=True)
    aciklama = models.TextField(blank=True)
    belirtiler = models.TextField(help_text="Rahatsızlığın belirtilerini yazın", blank=True)
    risk_faktorleri = models.TextField(help_text="Risk faktörlerini yazın", blank=True)
    onlemler = models.TextField(help_text="Alınması gereken önlemleri yazın", blank=True)
    olusturulma_tarihi = models.DateTimeField(default=timezone.now)
    guncellenme_tarihi = models.DateTimeField(auto_now=True)
    
    # Etiketler ve kategoriler
    etiketler = models.TextField(blank=True, help_text="Etiketleri virgülle ayırarak yazın")
    seviye = models.CharField(max_length=20, choices=[
        ('hafif', 'Hafif'),
        ('orta', 'Orta'),
        ('ciddi', 'Ciddi'),
        ('acil', 'Acil')
    ], default='orta')
    yayginlik = models.CharField(max_length=20, choices=[
        ('nadir', 'Nadir'),
        ('az', 'Az'),
        ('orta', 'Orta'),
        ('yaygin', 'Yaygın'),
        ('cok_yaygin', 'Çok Yaygın')
    ], default='orta')

    class Meta:
        verbose_name = "Rahatsızlık"
        verbose_name_plural = "Rahatsızlıklar"
        ordering = ['isim']
        indexes = [
            models.Index(fields=['isim']),
            models.Index(fields=['seviye']),
        ]

    def __str__(self):
        return self.isim

    def get_etiketler_list(self):
        """Etiketleri liste olarak döndürür"""
        return [tag.strip() for tag in self.etiketler.split(',') if tag.strip()]

    def set_etiketler_list(self, etiketler_list):
        """Etiketler listesini string olarak kaydeder"""
        self.etiketler = ', '.join(etiketler_list)

class Bitki(models.Model):
    isim = models.CharField(max_length=100)
    tip = models.CharField(max_length=50, choices=[
        ('ot', 'Ot'),
        ('agac', 'Ağaç'),
        ('cicek', 'Çiçek'),
        ('meyve', 'Meyve'),
        ('kök', 'Kök'),
        ('tohum', 'Tohum'),
        ('yaprak', 'Yaprak'),
        ('diger', 'Diğer')
    ])
    resim = models.ImageField(upload_to='bitkiler/', blank=True, null=True)
    faydalar = models.TextField()
    kullanim = models.TextField()
    hazirlama = models.TextField()
    uyarilar = models.TextField(blank=True)
    doz = models.TextField(blank=True)
    rahatsizliklar = models.ManyToManyField(Rahatsizlik, related_name='bitkiler')
    olusturulma_tarihi = models.DateTimeField(default=timezone.now)
    guncellenme_tarihi = models.DateTimeField(auto_now=True)
    
    # Ek bilgiler
    etiketler = models.TextField(blank=True, help_text="Etiketleri virgülle ayırarak yazın")
    mevsim = models.TextField(blank=True, help_text="Mevsimleri virgülle ayırarak yazın")
    yan_etkiler = models.TextField(blank=True, help_text="Yan etkileri virgülle ayırarak yazın")
    kontrendikasyonlar = models.TextField(blank=True, help_text="Kontrendikasyonları virgülle ayırarak yazın")
    saklama_kosullari = models.TextField(blank=True)
    raf_omru = models.CharField(max_length=50, blank=True)
    kaynak = models.CharField(max_length=200, blank=True)
    bilimsel_ad = models.CharField(max_length=100, blank=True)
    aile = models.CharField(max_length=100, blank=True)
    cins = models.CharField(max_length=100, blank=True)
    tur = models.CharField(max_length=100, blank=True)

    class Meta:
        verbose_name = "Bitki"
        verbose_name_plural = "Bitkiler"
        ordering = ['isim']
        indexes = [
            models.Index(fields=['isim']),
            models.Index(fields=['tip']),
            models.Index(fields=['bilimsel_ad']),
        ]

    def __str__(self):
        return self.isim

    def get_etiketler_list(self):
        """Etiketleri liste olarak döndürür"""
        return [tag.strip() for tag in self.etiketler.split(',') if tag.strip()]

    def set_etiketler_list(self, etiketler_list):
        """Etiketler listesini string olarak kaydeder"""
        self.etiketler = ', '.join(etiketler_list)

    def get_mevsim_list(self):
        """Mevsimleri liste olarak döndürür"""
        return [season.strip() for season in self.mevsim.split(',') if season.strip()]

    def set_mevsim_list(self, mevsim_list):
        """Mevsimler listesini string olarak kaydeder"""
        self.mevsim = ', '.join(mevsim_list)

    def get_yan_etkiler_list(self):
        """Yan etkileri liste olarak döndürür"""
        return [effect.strip() for effect in self.yan_etkiler.split(',') if effect.strip()]

    def set_yan_etkiler_list(self, yan_etkiler_list):
        """Yan etkiler listesini string olarak kaydeder"""
        self.yan_etkiler = ', '.join(yan_etkiler_list)

    def get_kontrendikasyonlar_list(self):
        """Kontrendikasyonları liste olarak döndürür"""
        return [contra.strip() for contra in self.kontrendikasyonlar.split(',') if contra.strip()]

    def set_kontrendikasyonlar_list(self, kontrendikasyonlar_list):
        """Kontrendikasyonlar listesini string olarak kaydeder"""
        self.kontrendikasyonlar = ', '.join(kontrendikasyonlar_list)
