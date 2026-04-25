---
title: "Hi!"
slug: "hi"
date: "2026-04-25"
updated: "2026-04-25T12:31:54.742Z"
published: true
cover: "/blogs/hi/cover.jpg"
---
![/blogs/hi/assets/hello.gif](/blogs/hi/assets/hello.gif)

<aside>
<img src="/blogs/hi/assets/glorp-skin.jpg" alt="/blogs/hi/assets/glorp-skin.jpg" width="40px" />

Hello, I'm Emin Erçoban a **full stack web developer & designer** in Turkey/Antalya. My mission is to enhance projects, applications with creative design and modern technologies.

</aside>

# 🪐 About Me

I'm currently working as a freelancer alongside my best friend on platforms like Fiverr and Bionluk, where we deliver **websites, web applications, desktop and mobile applications**. I also experianced in **UI/UX design, graphic design, and brand identity development.**

# 💼 Experience

### Full-Stack Developer

- I’m using JavaScript/TypeScript, Go programming languages.
- For front-end currently using Next/React but in the past i used Nuxt/Vue and Svelte.
- For back-end i use nodejs and go, but i prefer go for poerformance/dev experiance.

### Graphic Designer

- I’m designing Brand Identities, Logos, Banners, User Interfaces.
- I’m using Figma for UI/UX projects and Affinity products for Graphic Design

*Burayı boşver ya deneme yapıyoruz ne bakıyosun.*

Normal

*Italic*

**Bold**

~~Overline~~

# heading 1

## heading 2

### heading 3

test

---

- list a
    - sea
- list b
    - aa
        - vvv
        - v
- list c

---

1. numlistt a
    1. 2111
    2. 123
        1. 3344
2. numlistt b
3. numlistt c

---

- [ ]  todo
    - [ ]  2343
- [x]  todo 2

---

- Naber?
    
    İyidir senden?
    
    e1edwf
    
    adsadf
    

`setBlogs(datas as BlogPost[]);`

---

> **"Türk, Öğün, Çalış, Güven" - Mustafa Kemal Atatürk**
> 

| a | 1 | q |
| --- | --- | --- |
| b | 2 | w |
| c | 3 | e |

```jsx
// useEffect içerisinde async/await kullanmak için yaptığım taklalar :P
  useEffect(() => {
    (async () => {
      const datas = await pb.collection("blogs").getFullList({
        filter: "is_published=true",
      });
      setBlogs(datas as BlogPost[]);
    })();
  }, []);
```
