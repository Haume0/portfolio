---
title: "Teknoloji Ağacım"
slug: "teknoloji-agacim"
date: "2025-12-01"
updated: "2026-04-25T15:58:30.575Z"
published: true
cover: "/blogs/teknoloji-agacim/cover.png"
---
Seçtiğiniz ve kullandığınız teknolojiler sizi yansıtıyor, neyi seviyorsunuz, neyi sevmiyorsunuz, işteki öncelikleriniz, olmazsa olmazlarınız, hepsi.

Kimileri sade ve minimalist teknoloji ağaçları tercih ediyor kimi ise çok iyi düşünülmüş özelliklerle dolu. Ben iste bu iki uç yaklaşım arasında 2025’de kendimi nasıl konumlandırıyorum, ve bu işe başladığımdan beri neleri öğrendiğim için neleri seçiyorum size anlatıyorum.

Bu yazıda 3 katman olacak, `tasarım ve düşünce aşaması` `programlama` ve son olarak `yayınlama`.

# Tasarlama ve Düşünce Aşaması

<aside>
✒️

### **Notion, Affine ve Apple Notes**

Öncelikle neden üç tane onu bi netleştirelim. Apple Notes hızlı anlık fikirleri depolamak için, Notion ve Affine uzun vadeli depolama, proje yönetimi ve dökümantasyon için.
Notion şahsi projelerim ve kendim için kullandığım bir uygulama, Affine ise ekip içerisinde self-hosted ile tüm üyeler ile kullandığımız not uygulaması.

</aside>

<aside>
🖌️

### Figma

Figma benim için programlamadan önceki en önemli aşama.

Uygulamanın yapabildiği tüm tasarım işlerini, Arayüz Tasarımı, Basit Grafik Tasarımları, Basit Logolar tarzı şeyleri yaptığım evimde hissettiğim tasarım uygulamam.

### Affinity Uygulamaları

Figmanın sağlayamadığı tam özellikli tasarım araçlarını Affinity ile karşılıyorum, Marka Kimliği, logolar, grafik tasarım, bannerlar vs.

</aside>

# Programlama

<aside>
📘

### JavaScript/TypeScript

Front-end için gereken ana programlama dili, hem front-end hem back-end için kullanıyorum ve benim için güvenli seçim diyebilirim, kolay oluşu ve konforu hoşuma gidiyor. Aynı zamanda ilk öğrendiğim programlama dili o yüzden sempatim var kusurlarına rağmen.

</aside>

<aside>
📘

### Go Programlama Dili

Go benim için ilk görüşte aşktı, nereden başlasam bilmiyorum.

Fonksiyonel programlama dili, bu nedemek şimdi. Herkesin duyduğu OOP(Object Oriented Programming) nesne tabanlı programlama paterni javascript gibi birçok dilin kullandığı bir pratik fakat go burada onlardan ayrılıp fonksiyonel yani bir nesenin prototipi ile değil de bir fonksiyon ile işleri hallediyor. Yani:

```jsx
// OOP
sayi.toString();
// Fonksiyonel
strconv.Itoa(sayi)
```

Performansı, makine diline derlenmesi ile gelen büyük güç, cross-compile ile tek cihazdan tüm işletim sistemlerine embedded sistemlere bile build alabilmek.

Mükemmel çoklu çekirdek işlemleri yönetmesi, basitçe go yazarak bir fonksiyonu farklı bir thread’e aktarabilmek, channel’lar…

Çok şey var.

</aside>

<aside>
⚙

### Next.js & React | Web Framework’ü

Müşterilerime daha stabil ve standart bir hizmet verebilmek için sektör standartlarının en güncel ve uç teknolojisi olarak Next’i tercih ediyorum.

Benim hoşuma gidecek kadar modern ve yenilikçi ama yine de stabil ve standart bir tecrübeye sahip, uçsuz bucaksız eklenti desteği ile işlerim ve teslim sürelerime katkısı büyük.

Tabiki tek sebebi bu değil, full-stack bir meta framework olması ve geliştirme sürecinin sancısız ve görece kolay olması da tercih sebeplerim arasında.

</aside>

<aside>
🖌️

### TailwindCSS | CSS Framework’ü

Tailwind benim için bir bağımlılık, tsx dosyamdan hiç çıkmadan html, js ve css işlerimi halletmek ilk başladığımdan beri aşık olduğum bir durum.

Aranızdan ama css ile hazır classlar tanımlamak tekrar eden kodu azaltır vs. diye düşünceler oluşabilir, fakat bu problemi zaten React veya herhangi bir front-end framework’ü zaten çözüyor ektra olarak neden böyle bişiye gerek duyalım.

Ayrıca tailwind ile uzun süredir `@apply` ile class tanımlaması yapabiliyorsunuz eğer çok isterseniz, ki beni de kullanırken görmüşsünüzdür.

</aside>

<aside>
🔮

### Motion / Framer-Motion | Animasyon Kütüphanesi

Uzun araştırmalar sonucu keşfettiğim ve diğerlerine göre oldukça kolay olmasına rağmen daha başarılı bulduğum bir kütüphane, ekstra olarak daha yeni JS ve VUE.js desteği eklendi büyüyen ve gelişen bir kütüphane tavsiye ederim.

Özellikle layout animasyon sistemi büyü gibi resmen.

</aside>

<aside>
💾

### Drizzle ve GORM

Bu iki kütüphane benim severek kullandığım iki dil olan GO ve JS için yazılmış orm kütüphaneleri. İkisi de harikalar anlatabileceğim çok bir şey yok kesinlikle araştırın derim.

</aside>

<aside>
💾

### PocketBase

Back-end yazmak her zaman uğraşmak istediğiniz bir şey olmuyor, özellikle çok işiniz varken ve bu yazmanız gereken şey bir hobi projesiyse.

Bu durumda Firebase veya Supabase gibi araçlar devreye giriyor fakat, bir self-host sevdalısı olarak self-host yapabildiğim bir alternatif, kendisi favorim olan GO ile yazılmış aşırı hızlı ve kurması çok basit, bir şans verin.

</aside>

# Yayınlama

<aside>
☁️

### Docker & Dokploy

Projeleri konteynerler ile yayınlamak öyle herkesin anlattığı gibi, benim makinamda çalışıyor ama sunucumda çalışmıyor sorunundan öte.

Gereksinimler, otomatik build almak, birden fazla sunucuya deploy etmek, birden fazla ekip arkadaşı ile çalışmak gibi tek pratik yolunun otomasyon olduğu sorunlarla dolu.

Ben bu sorunları Dockerfile ve Docker Compose yazarak çözüyorum, her projemde Dockerfile ile en optimal önerilen dockerfile ile kurulumlarımı yapıyorum.

Dokploy burada devreye giriyor, git’e yaptığımız her commit & push’dan sonra otomatik olarak projelerimizi dockerfile ve compose ile build alıp yayına veriyor. Bu sıklığı istersek her sürüm geçişi gibi ayarlamak falan mümkün.

Sadece bu da değil birden fazla sunucu kontrol etme, tarayıcı üzerinden tüm sisteme erişebilme gibi yaparken ve kullanırken zevk aldığım nerdy IT özellikleri de var araştırın derim.

</aside>

Bu yazıyı değiştikçe ya da aklıma yeni bir şey geldikçe güncelleyip yayınlayacağım…
