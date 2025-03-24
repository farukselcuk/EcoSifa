from typing import List, Optional
from .base import BaseRepository
from ..models import Bitki
from django.db import models

class BitkiRepository(BaseRepository[Bitki]):
    def get_by_id(self, id: str) -> Optional[Bitki]:
        try:
            return Bitki.objects.get(id=id)
        except Bitki.DoesNotExist:
            return None

    def get_all(self) -> List[Bitki]:
        return list(Bitki.objects.all())

    def create(self, entity: Bitki) -> Bitki:
        entity.save()
        return entity

    def update(self, entity: Bitki) -> Bitki:
        entity.save()
        return entity

    def delete(self, id: str) -> bool:
        try:
            bitki = Bitki.objects.get(id=id)
            bitki.delete()
            return True
        except Bitki.DoesNotExist:
            return False

    def filter(self, **kwargs) -> List[Bitki]:
        return list(Bitki.objects.filter(**kwargs))

    # Özel metodlar
    def get_by_tip(self, tip: str) -> List[Bitki]:
        return list(Bitki.objects.filter(tip=tip))

    def get_by_mevsim(self, mevsim: str) -> List[Bitki]:
        return list(Bitki.objects.filter(mevsim__contains=mevsim))

    def search(self, query: str) -> List[Bitki]:
        return list(Bitki.objects.filter(
            models.Q(isim__icontains=query) |
            models.Q(bilimsel_ad__icontains=query) |
            models.Q(aciklama__icontains=query)
        )) 