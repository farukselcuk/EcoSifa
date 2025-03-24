from typing import Callable, Dict, List, Any
from django.dispatch import Signal, receiver
from django.db.models.signals import post_save, post_delete
from .models import Bitki, Rahatsizlik, TedaviOnerisi

# Custom sinyaller
bitki_viewed = Signal()
rahatsizlik_viewed = Signal()
tedavi_onerisi_created = Signal()

class EventManager:
    _instance = None
    _handlers: Dict[str, List[Callable]] = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EventManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self._handlers = {}
            self._initialized = True

    def subscribe(self, event_type: str, handler: Callable) -> None:
        if event_type not in self._handlers:
            self._handlers[event_type] = []
        self._handlers[event_type].append(handler)

    def unsubscribe(self, event_type: str, handler: Callable) -> None:
        if event_type in self._handlers:
            self._handlers[event_type].remove(handler)

    def notify(self, event_type: str, data: Any = None) -> None:
        if event_type in self._handlers:
            for handler in self._handlers[event_type]:
                handler(data)

# Signal handlers
@receiver(post_save, sender=Bitki)
def bitki_saved_handler(sender, instance, created, **kwargs):
    event_manager = EventManager()
    if created:
        event_manager.notify('bitki_created', instance)
    else:
        event_manager.notify('bitki_updated', instance)

@receiver(post_delete, sender=Bitki)
def bitki_deleted_handler(sender, instance, **kwargs):
    event_manager = EventManager()
    event_manager.notify('bitki_deleted', instance)

@receiver(bitki_viewed)
def bitki_viewed_handler(sender, **kwargs):
    event_manager = EventManager()
    event_manager.notify('bitki_viewed', kwargs.get('bitki'))

@receiver(post_save, sender=Rahatsizlik)
def rahatsizlik_saved_handler(sender, instance, created, **kwargs):
    event_manager = EventManager()
    if created:
        event_manager.notify('rahatsizlik_created', instance)
    else:
        event_manager.notify('rahatsizlik_updated', instance)

@receiver(post_delete, sender=Rahatsizlik)
def rahatsizlik_deleted_handler(sender, instance, **kwargs):
    event_manager = EventManager()
    event_manager.notify('rahatsizlik_deleted', instance)

@receiver(rahatsizlik_viewed)
def rahatsizlik_viewed_handler(sender, **kwargs):
    event_manager = EventManager()
    event_manager.notify('rahatsizlik_viewed', kwargs.get('rahatsizlik'))

@receiver(post_save, sender=TedaviOnerisi)
def tedavi_onerisi_saved_handler(sender, instance, created, **kwargs):
    event_manager = EventManager()
    if created:
        event_manager.notify('tedavi_onerisi_created', instance)
    else:
        event_manager.notify('tedavi_onerisi_updated', instance)

# Örnek kullanım:
"""
def log_bitki_created(bitki):
    print(f"Yeni bitki eklendi: {bitki.isim}")

event_manager = EventManager()
event_manager.subscribe('bitki_created', log_bitki_created)
""" 