from django.core.cache import cache
from typing import Any, Optional

class CacheManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CacheManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.default_timeout = 3600  # 1 saat
            self._initialized = True

    def get(self, key: str) -> Optional[Any]:
        return cache.get(key)

    def set(self, key: str, value: Any, timeout: Optional[int] = None) -> None:
        timeout = timeout or self.default_timeout
        cache.set(key, value, timeout)

    def delete(self, key: str) -> None:
        cache.delete(key)

    def clear(self) -> None:
        cache.clear()

    def get_or_set(self, key: str, default: Any, timeout: Optional[int] = None) -> Any:
        timeout = timeout or self.default_timeout
        return cache.get_or_set(key, default, timeout)

    def increment(self, key: str) -> int:
        return cache.incr(key)

    def decrement(self, key: str) -> int:
        return cache.decr(key)

    def add(self, key: str, value: Any, timeout: Optional[int] = None) -> bool:
        timeout = timeout or self.default_timeout
        return cache.add(key, value, timeout)

    def get_many(self, keys: list) -> dict:
        return cache.get_many(keys)

    def set_many(self, data: dict, timeout: Optional[int] = None) -> None:
        timeout = timeout or self.default_timeout
        cache.set_many(data, timeout)

    def delete_many(self, keys: list) -> None:
        cache.delete_many(keys)

    def touch(self, key: str, timeout: Optional[int] = None) -> bool:
        timeout = timeout or self.default_timeout
        return cache.touch(key, timeout) 