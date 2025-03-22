from django import forms
from .models import Bitki, Rahatsizlik

class BitkiForm(forms.ModelForm):
    class Meta:
        model = Bitki
        fields = ['isim', 'tip', 'resim', 'faydalar', 'kullanim', 'hazirlama', 'uyarilar', 'doz', 'rahatsizliklar']
        widgets = {
            'isim': forms.TextInput(attrs={'class': 'form-control'}),
            'tip': forms.Select(attrs={'class': 'form-select'}),
            'resim': forms.FileInput(attrs={'class': 'form-control'}),
            'faydalar': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'kullanim': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'hazirlama': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'uyarilar': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'doz': forms.Textarea(attrs={'class': 'form-control', 'rows': 4}),
            'rahatsizliklar': forms.SelectMultiple(attrs={'class': 'form-select', 'size': '5'})
        }

class RahatsizlikForm(forms.ModelForm):
    class Meta:
        model = Rahatsizlik
        fields = ['isim', 'aciklama']
        widgets = {
            'isim': forms.TextInput(attrs={'class': 'form-control'}),
            'aciklama': forms.Textarea(attrs={'class': 'form-control', 'rows': 4})
        }

class TedaviForm(forms.Form):
    rahatsizlik = forms.ModelChoiceField(
        queryset=Rahatsizlik.objects.all(),
        widget=forms.Select(attrs={'class': 'form-select'}),
        empty_label="Rahatsızlık Seçin"
    )
    tekli_bitki = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )
    karisim = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={'class': 'form-check-input'})
    )

    def clean(self):
        cleaned_data = super().clean()
        tekli_bitki = cleaned_data.get('tekli_bitki')
        karisim = cleaned_data.get('karisim')

        if not tekli_bitki and not karisim:
            raise forms.ValidationError("En az bir tedavi tipi seçmelisiniz.")

        return cleaned_data 