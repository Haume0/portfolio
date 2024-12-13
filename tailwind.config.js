/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "#292929",
        dark: "#121212",
        grey: "#22252A",
        main: "#3737C3",
        works: "#7C71DB",
        about: "#3F1FF1",
        milk: "#E8E4F5",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        lato: ["Lato", "sans-serif"],
      },
      transitionTimingFunction: {
        // Bounce: Zıplama etkisi, vurgu animasyonları için kullanılır.
        // cubic-bezier(0.34, 1.56, 0.64, 1)
        // 0.34: Başlangıçtaki yatay hareket (x1), animasyonun hızlı bir başlangıç yapmasını sağlar.
        // 1.56: Başlangıçtaki dikey hız (y1), animasyonun zıplayarak hızlanmasına neden olur.
        // 0.64: Bitişe yakın yatay hareket (x2), zıplamanın daha küçük bir yay gibi hissedilmesini sağlar.
        // 1: Bitiş noktası (y2), animasyonun tamamen tamamlandığını belirtir.
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",

        // Spring: Yaylı bir hareket, doğal bir hissiyat verir.
        // cubic-bezier(0.5, 1.25, 0.75, 1.25)
        // 0.5: Başlangıçtaki yatay hareket (x1), yavaş ama belirgin bir başlangıç sağlar.
        // 1.25: Başlangıçtaki dikey hız (y1), yaylı bir ivme kazandırır.
        // 0.75: Bitişe yakın yatay hareket (x2), geçişin son aşamada daha akıcı olmasını sağlar.
        // 1.25: Bitiş noktası (y2), yay hissini daha güçlü bir şekilde vurgular.
        spring: "cubic-bezier(0.5, 1.25, 0.75, 1.25)",

        // Smooth: Akıcı ve doğal geçişler sağlar.
        // cubic-bezier(0.22, 0.61, 0.36, 1)
        // 0.22: Başlangıçtaki yatay hareket (x1), animasyonun daha yavaş başlamasını sağlar.
        // 0.61: Başlangıçtaki dikey hız (y1), hızlanmanın orta düzeyde hissedilmesini sağlar.
        // 0.36: Bitişe yakın yatay hareket (x2), geçişin akıcı bir şekilde tamamlanmasını sağlar.
        // 1: Bitiş noktası (y2), animasyonun tamamen sona erdiğini ifade eder.
        smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",

        // Gentle: Hassas ve yumuşak geçişler sağlar.
        // cubic-bezier(0.25, 0.46, 0.45, 0.94)
        // 0.25: Başlangıçtaki yatay hareket (x1), animasyonun rahat bir şekilde başlamasını sağlar.
        // 0.46: Başlangıçtaki dikey hız (y1), ivmenin daha az agresif olmasını sağlar.
        // 0.45: Bitişe yakın yatay hareket (x2), geçişin yavaşça tamamlanmasını sağlar.
        // 0.94: Bitiş noktası (y2), hafif bir ivme ile sona erer.
        gentle: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },
  },
  plugins: [],
};
