/// <reference types="bun" />
import { describe, expect, test } from "bun:test";
import { safeAssetName, unreferencedAssets } from "./content-assets";

describe("unreferencedAssets", () => {
  const url = "/blogs/hi/assets/";

  test("encode edilmiş ve edilmemiş adlar kullanılıyor sayılır", () => {
    const markdown =
      "![a](/blogs/hi/assets/kapak.png)\n\n![b](/blogs/hi/assets/ekran%20resmi.png)\n\n![c](</blogs/hi/assets/eski dosya.png>)";
    expect(
      unreferencedAssets(markdown, url, [
        "kapak.png",
        "ekran resmi.png",
        "eski dosya.png",
        "artik.png",
      ]),
    ).toEqual(["artik.png"]);
  });

  test("callout'un görsel ikonu kullanılıyor sayılır", () => {
    const markdown =
      '<aside>\n<img src="/blogs/hi/assets/glorp-skin.jpg" alt="x" width="40px" />\n\nMerhaba\n\n</aside>';
    expect(unreferencedAssets(markdown, url, ["glorp-skin.jpg"])).toEqual([]);
  });

  test("iki kez geçen dosya bir kez sayılır ve tutulur", () => {
    const markdown =
      "![a](/blogs/hi/assets/a.png)\n\n![a](/blogs/hi/assets/a.png)";
    expect(unreferencedAssets(markdown, url, ["a.png", "b.png"])).toEqual([
      "b.png",
    ]);
  });

  test("yalnızca başka yazının yolunda geçen dosya kullanılmıyor sayılır", () => {
    const markdown = "![a](/blogs/baska/assets/a.png)";
    expect(unreferencedAssets(markdown, url, ["a.png"])).toEqual(["a.png"]);
  });
});

test("safeAssetName zip import'u ile aynı adlandırır", () => {
  expect(safeAssetName("Ekran Görüntüsü 2025.PNG")).toBe(
    "ekran-goruntusu-2025.png",
  );
  expect(safeAssetName("şğü.jpg")).toBe("sgu.jpg");
  expect(safeAssetName("!!!.webp")).toBe("gorsel.webp");
});
