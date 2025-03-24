from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from .models import Bitki, Rahatsizlik, TedaviOnerisi
from .forms import BitkiForm, RahatsizlikForm, TedaviForm
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login

def home(request):
    return render(request, 'sifalibitkiler/home.html')

def bitki_listesi(request):
    bitkiler = Bitki.objects.all().order_by('isim')
    search_query = request.GET.get('q', '')
    tip_filter = request.GET.get('tip', '')

    if search_query:
        bitkiler = bitkiler.filter(
            Q(isim__icontains=search_query) |
            Q(faydalar__icontains=search_query) |
            Q(kullanim__icontains=search_query)
        )

    if tip_filter:
        bitkiler = bitkiler.filter(tip=tip_filter)

    paginator = Paginator(bitkiler, 9)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    context = {
        'page_obj': page_obj,
        'search_query': search_query,
        'tip_filter': tip_filter
    }
    return render(request, 'sifalibitkiler/bitki_listesi.html', context)

def bitki_detay(request, pk):
    bitki = get_object_or_404(Bitki, pk=pk)
    return render(request, 'sifalibitkiler/bitki_detay.html', {'bitki': bitki})

def bitki_ekle(request):
    if request.method == 'POST':
        form = BitkiForm(request.POST, request.FILES)
        if form.is_valid():
            bitki = form.save()
            messages.success(request, 'Bitki başarıyla eklendi.')
            return redirect('bitki_detay', pk=bitki.pk)
    else:
        form = BitkiForm()
    
    return render(request, 'sifalibitkiler/bitki_form.html', {
        'form': form,
        'title': 'Yeni Bitki Ekle'
    })

def bitki_duzenle(request, pk):
    bitki = get_object_or_404(Bitki, pk=pk)
    
    if request.method == 'POST':
        form = BitkiForm(request.POST, request.FILES, instance=bitki)
        if form.is_valid():
            bitki = form.save()
            messages.success(request, 'Bitki başarıyla güncellendi.')
            return redirect('bitki_detay', pk=bitki.pk)
    else:
        form = BitkiForm(instance=bitki)
    
    return render(request, 'sifalibitkiler/bitki_form.html', {
        'form': form,
        'title': 'Bitki Düzenle'
    })

def bitki_sil(request, pk):
    bitki = get_object_or_404(Bitki, pk=pk)
    
    if request.method == 'POST':
        bitki.delete()
        messages.success(request, 'Bitki başarıyla silindi.')
        return redirect('bitki_listesi')
    
    return render(request, 'sifalibitkiler/bitki_sil.html', {'bitki': bitki})

def tedavi_form(request):
    if request.method == 'POST':
        form = TedaviForm(request.POST)
        if form.is_valid():
            rahatsizlik = form.cleaned_data['rahatsizlik']
            tekli_bitki = form.cleaned_data['tekli_bitki']
            karisim = form.cleaned_data['karisim']
            
            bitkiler = Bitki.objects.filter(rahatsizliklar=rahatsizlik)
            
            if tekli_bitki and not karisim:
                bitkiler = bitkiler.filter(tip='tekli')
            elif karisim and not tekli_bitki:
                bitkiler = bitkiler.filter(tip='karisim')
            
            return render(request, 'sifalibitkiler/tedavi_oneri.html', {
                'rahatsizlik': rahatsizlik,
                'bitkiler': bitkiler
            })
    else:
        form = TedaviForm()
    
    return render(request, 'sifalibitkiler/tedavi_form.html', {'form': form})

def search_bitkiler(request):
    query = request.GET.get('q', '')
    if query:
        bitkiler = Bitki.objects.filter(
            Q(isim__icontains=query) |
            Q(faydalar__icontains=query) |
            Q(kullanim__icontains=query)
        )[:5]
        
        results = []
        for bitki in bitkiler:
            results.append({
                'name': bitki.isim,
                'type': bitki.get_tip_display(),
                'image': bitki.resim.url if bitki.resim else '/static/images/default-plant.jpg',
                'url': f'/bitki/{bitki.pk}/'
            })
        
        return JsonResponse(results, safe=False)
    
    return JsonResponse([], safe=False)

def rahatsizlik_listesi(request):
    rahatsizliklar = Rahatsizlik.objects.all()
    return render(request, 'sifalibitkiler/rahatsizlik_listesi.html', {
        'rahatsizliklar': rahatsizliklar
    })

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'Hesabınız başarıyla oluşturuldu!')
            return redirect('home')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})

def iletisim(request):
    if request.method == 'POST':
        # Form verilerini al
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Burada e-posta gönderme işlemi yapılabilir
        # Şimdilik sadece başarılı mesajı gösterelim
        messages.success(request, 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.')
        return redirect('iletisim')
    
    return render(request, 'iletisim.html')

def tedavi_onerileri(request):
    oneriler = TedaviOnerisi.objects.all().order_by('-olusturulma_tarihi')
    return render(request, 'tedavi_onerileri.html', {'oneriler': oneriler})

def tedavi_onerisi_detay(request, pk):
    oneri = get_object_or_404(TedaviOnerisi, pk=pk)
    return render(request, 'tedavi_onerisi_detay.html', {'oneri': oneri})

def hakkimizda(request):
    return render(request, 'hakkimizda.html')

def gizlilik(request):
    return render(request, 'gizlilik.html')
