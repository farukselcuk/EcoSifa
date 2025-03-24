from typing import List, Optional
from ..repositories.bitki_repository import BitkiRepository
from ..models import Bitki
from django.core.cache import cache
from django.conf import settings

class BitkiService:
    def __init__(self):
        self.repository = BitkiRepository()
        self.cache_timeout = getattr(settings, 'BITKI_CACHE_TIMEOUT', 3600)  # 1 saat

    def get_bitki(self, id: str) -> Optional[Bitki]:
        cache_key = f'bitki_{id}'
        bitki = cache.get(cache_key)
        if not bitki:
            bitki = self.repository.get_by_id(id)
            if bitki:
                cache.set(cache_key, bitki, self.cache_timeout)
        return bitki

    def get_all_bitkiler(self) -> List[Bitki]:
        cache_key = 'all_bitkiler'
        bitkiler = cache.get(cache_key)
        if not bitkiler:
            bitkiler = self.repository.get_all()
            cache.set(cache_key, bitkiler, self.cache_timeout)
        return bitkiler

    def create_bitki(self, bitki_data: dict) -> Bitki:
        bitki = Bitki(**bitki_data)
        created_bitki = self.repository.create(bitki)
        cache.delete('all_bitkiler')
        return created_bitki

    def update_bitki(self, id: str, bitki_data: dict) -> Optional[Bitki]:
        bitki = self.repository.get_by_id(id)
        if not bitki:
            return None

        for key, value in bitki_data.items():
            setattr(bitki, key, value)

        updated_bitki = self.repository.update(bitki)
        cache.delete(f'bitki_{id}')
        cache.delete('all_bitkiler')
        return updated_bitki

    def delete_bitki(self, id: str) -> bool:
        result = self.repository.delete(id)
        if result:
            cache.delete(f'bitki_{id}')
            cache.delete('all_bitkiler')
        return result

    def search_bitkiler(self, query: str) -> List[Bitki]:
        cache_key = f'search_bitkiler_{query}'
        results = cache.get(cache_key)
        if not results:
            results = self.repository.search(query)
            cache.set(cache_key, results, 300)  # 5 dakika cache
        return results

    def get_bitkiler_by_tip(self, tip: str) -> List[Bitki]:
        cache_key = f'bitkiler_tip_{tip}'
        results = cache.get(cache_key)
        if not results:
            results = self.repository.get_by_tip(tip)
            cache.set(cache_key, results, self.cache_timeout)
        return results

    def get_bitkiler_by_mevsim(self, mevsim: str) -> List[Bitki]:
        cache_key = f'bitkiler_mevsim_{mevsim}'
        results = cache.get(cache_key)
        if not results:
            results = self.repository.get_by_mevsim(mevsim)
            cache.set(cache_key, results, self.cache_timeout)
        return results 