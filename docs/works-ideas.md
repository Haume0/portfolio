# /works — Yedek Layout Fikirleri

`/works` sayfası için "Deste" konsepti (A) uygulandı: parallax sütunlu grid + Locomotive tarzı index listesi.
Aşağıdakiler denenmek üzere bekleyen alternatifler.

Sitenin dili referans olarak: `#292929` zemin üzerinde `rounded-3xl` renkli slab'lar
(`main`, `works`, `about`, `blog`, `grey`), Lato Black büyük harf hero, Sora extrabold başlıklar, ✦ motifi,
spring animasyonlar (`damping 25 / stiffness 100`), FanList'teki eğik kart hissi, grain overlay.

---

## B — Bento Mozaik

Sitenin "renkli slab'lar" dilini grid'in içine taşır: her iş, kendi küçük slab'ı gibi davranır.

```
┌──────────────────────────┬─────────────┐
│                          │   02        │
│   01  FEATURED (2x2)     ├─────────────┤
│                          │   03        │
├────────────┬─────────────┴─────────────┤
│   04       │   05  WIDE (2x1)          │
├────────────┼─────────────┬─────────────┤
│   06       │   07        │   08        │
└────────────┴─────────────┴─────────────┘
```

- Kart çerçeve rengi palet üzerinden döner: `bg-main → bg-about → bg-blog → bg-works → bg-grey`.
  Görsel çerçevenin içinde `rounded-2xl` olarak oturur (hero'daki slab-içi-slab hissi).
- Span deseni sabit bir ritimle tekrar eder (ör. 6'lık blok: 2x2, 1, 1, 1, 2x1, 1) — rastgele değil,
  böylece sıralama değişince layout öngörülebilir kalır.
- İlk (en yeni) iş her zaman 2x2 "featured".
- Hover: çerçeve rengi `milk`'e döner, metin `dark` olur (blog satırlarındaki invert davranışı).
- Mobil: tek sütun, span'ler sıfırlanır; renk ritmi korunur.

**Artı:** En marka-uyumlu seçenek, ana sayfayla aynı görsel aile.
**Eksi:** Kapaklar ~1.28:1 oranında; 2x1 ve 2x2 hücrelerde `object-cover` kırpması kapaktaki
başlık yazılarını kesebilir. Kapak başına `object` (focal point) ayarı gerekebilir.

---

## C — Sürüklenebilir Sonsuz Kanvas

Awwwards'taki deneysel index'lerin klasiği: tüm işler büyük bir 2D yüzeye dağılmış, kullanıcı
her yöne sürükleyerek gezer.

```
        ┌────┐            ┌────┐
  ┌────┐│ 04 │   ┌────┐   │ 09 │
  │ 01 │└────┘   │ 06 │   └────┘      ← her yöne sürükle
  └────┘   ┌────┐└────┘ ┌────┐
           │ 02 │       │ 07 │  ✦
  ┌────┐   └────┘ ┌────┐└────┘
  │ 05 │          │ 03 │
  └────┘          └────┘
```

- Kartlar hafif eğik (±6°, FanList açısı) ve deterministik offsetlerle yerleşir; kanvas kenarlarda
  wrap-around ile sonsuz görünür (21 iş → 3x3 tile tekrarı).
- Sürükleme ataletli (momentum), mevcut `DragWrapper` mantığının 2D + inertia versiyonu.
- Merkeze yakın kart büyür/netleşir, uzaktakiler hafif blur + küçülme (derinlik).
- Arka planda grain + dev "WORKS" yazısı yavaş parallax.
- Sağ altta "Liste görünümü" fallback butonu.

**Artı:** En deneysel ve akılda kalan seçenek; "I create imaginative ideas" mesajına çok uygun.
**Eksi:** Mobilde ve klavyeyle gezinmede zayıf; erişilebilirlik için liste fallback'i zorunlu.
21 iş için tekrar eden tile'lar "aynı şeyi tekrar görüyorum" hissi verebilir. Performans
(çok sayıda görsel + transform) ölçülmeli.
