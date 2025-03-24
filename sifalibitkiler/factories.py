from typing import Dict, Any
from .models import Bitki, Rahatsizlik, TedaviOnerisi

class BitkiFactory:
    @staticmethod
    def create_bitki(data: Dict[str, Any]) -> Bitki:
        # Temel alanları ayır
        basic_fields = {
            'isim': data.get('isim'),
            'tip': data.get('tip'),
            'bilimsel_ad': data.get('bilimsel_ad', ''),
            'aciklama': data.get('aciklama', '')
        }

        # Bitki nesnesini oluştur
        bitki = Bitki.objects.create(**basic_fields)

        # Liste tipindeki alanları işle
        if 'etiketler' in data:
            bitki.set_etiketler_list(data['etiketler'])
        
        if 'mevsim' in data:
            bitki.set_mevsim_list(data['mevsim'])
        
        if 'yan_etkiler' in data:
            bitki.set_yan_etkiler_list(data['yan_etkiler'])
        
        if 'kontrendikasyonlar' in data:
            bitki.set_kontrendikasyonlar_list(data['kontrendikasyonlar'])

        # İlişkili rahatsızlıkları ekle
        if 'rahatsizliklar' in data:
            for rahatsizlik_id in data['rahatsizliklar']:
                try:
                    rahatsizlik = Rahatsizlik.objects.get(id=rahatsizlik_id)
                    bitki.rahatsizliklar.add(rahatsizlik)
                except Rahatsizlik.DoesNotExist:
                    continue

        bitki.save()
        return bitki

class RahatsizlikFactory:
    @staticmethod
    def create_rahatsizlik(data: Dict[str, Any]) -> Rahatsizlik:
        # Temel alanları ayır
        basic_fields = {
            'isim': data.get('isim'),
            'seviye': data.get('seviye'),
            'yayginlik': data.get('yayginlik'),
            'aciklama': data.get('aciklama', '')
        }

        # Rahatsızlık nesnesini oluştur
        rahatsizlik = Rahatsizlik.objects.create(**basic_fields)

        # Liste tipindeki alanları işle
        if 'etiketler' in data:
            rahatsizlik.set_etiketler_list(data['etiketler'])

        rahatsizlik.save()
        return rahatsizlik

class TedaviOnerisiFactory:
    @staticmethod
    def create_tedavi_onerisi(data: Dict[str, Any]) -> TedaviOnerisi:
        # Gerekli nesneleri al
        try:
            bitki = Bitki.objects.get(id=data['bitki_id'])
            rahatsizlik = Rahatsizlik.objects.get(id=data['rahatsizlik_id'])
        except (Bitki.DoesNotExist, Rahatsizlik.DoesNotExist):
            raise ValueError("Geçersiz bitki veya rahatsızlık ID'si")

        # Tedavi önerisi oluştur
        tedavi_onerisi = TedaviOnerisi.objects.create(
            bitki=bitki,
            rahatsizlik=rahatsizlik,
            aciklama=data.get('aciklama', '')
        )

        return tedavi_onerisi 