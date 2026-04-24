"use server";

import PocketBase from "pocketbase";
import { revalidatePath } from "next/cache";

import AdmZip from "adm-zip";
import path from "path";

// Kodun daha okunabilir olması için arayüzler tanımlıyoruz.
interface FileData {
  buffer: Buffer;
  name: string;
}

interface IWorks {
  title: string;
  description: string;
  content: string;
  slug: string;
  object: string;
  link: {
    name: string;
    url: string;
  };
  embeds: FileData[];
  mdFileFound: boolean;
}

export async function addWork(formdata: FormData) {
  const processZipEntries = (zip: AdmZip, workData: IWorks) => {
    const zipEntries = zip.getEntries();

    for (const entry of zipEntries) {
      if (entry.isDirectory) {
        continue;
      }

      const fullPath = entry.entryName;
      const baseName = path.basename(fullPath);

      // Eğer girdi başka bir zip dosyasıysa, özyinelemeli olarak onu da işle.
      if (baseName.endsWith(".zip")) {
        const nestedZip = new AdmZip(entry.getData());
        processZipEntries(nestedZip, workData);
      }
      // Markdown dosyasını bul ve içeriğini ayrıştır. Sadece ilk bulduğunu işle.
      else if (baseName.endsWith(".md") && !workData.mdFileFound) {
        workData.mdFileFound = true; // Bulundu olarak işaretle ki başkasını aramasın.
        const fileContent = entry.getData().toString("utf8");
        const lines = fileContent.split(/\r?\n/);
        const firstLine = lines.shift() || "";
        const remainingContent = lines.join("\n").trimStart();
        const contentLines = remainingContent.split(/\r?\n/);

        workData.title = firstLine.replace(/^#\s*/, "") || "Başlıksız";
        workData.description = contentLines.shift()?.trim() || "";
        workData.content = contentLines.join("\n").trim();
      }
      // Diğer her şeyi 'embeds' listesine ekle.
      else {
        // Ana içerik olarak kullanılan .md dosyasının 'embeds' listesine eklenmesini önleyelim.
        if (!baseName.endsWith(".md")) {
          workData.embeds.push({
            buffer: entry.getData(),
            name: fullPath,
          });
        }
      }
    }
  };
  const secret = formdata.get("secret") as string;
  const manualSlug = ((formdata.get("id") as string) || "")
    .trim()
    .toLowerCase();
  const manualTitle = ((formdata.get("title") as string) || "").trim();
  const manualDescription =
    ((formdata.get("description") as string) || "").trim();
  const object = ((formdata.get("object") as string) || "center").trim();
  const linkName = ((formdata.get("linkName") as string) || "Visit").trim();
  const linkUrl = ((formdata.get("linkUrl") as string) || "").trim();
  // if (secret !== process.env.SECRET) {
  //   throw new Error("Geçersiz güvenlik anahtarı.");
  // }

  const workFile = formdata.get("work") as File;
  const hasWorkFile = !!workFile && workFile.size > 0;

  // Kapak görselini formdan al. Bu alan opsiyonel olabilir.
  const thumbFile = formdata.get("thumb") as File | null;

  const workData: IWorks = {
    title: "",
    description: "",
    content: "",
    slug: manualSlug,
    object,
    link: {
      name: linkName || "Visit",
      url: linkUrl,
    },
    embeds: [],
    mdFileFound: false,
  };

  try {
    if (hasWorkFile) {
      const fileBuffer = Buffer.from(await workFile.arrayBuffer());
      const mainZip = new AdmZip(fileBuffer);

      // Zip dosyasını ve içindekileri işle.
      processZipEntries(mainZip, workData);

      if (!workData.mdFileFound) {
        throw new Error("Zip arşivi içinde .md uzantılı bir dosya bulunamadı.");
      }
    }

    workData.title = manualTitle || workData.title;
    workData.description = manualDescription || workData.description;

    if (!workData.title) {
      throw new Error("Proje basligi zorunludur.");
    }

    const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
    // İsteğe bağlı: Koleksiyonunuz korumalı ise admin olarak giriş yapmanız gerekebilir.
    // await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL!, process.env.PB_ADMIN_PASSWORD!);

    const dataForPb = new FormData();
    if (workData.slug) {
      dataForPb.append("slug", workData.slug);
    }
    dataForPb.append("title", workData.title);
    dataForPb.append("description", workData.description);
    dataForPb.append("content", workData.content);
    dataForPb.append("object", workData.object);
    dataForPb.append("link", JSON.stringify(workData.link));
    dataForPb.append("likes", "0");
    dataForPb.append("views", "0");
    dataForPb.append("is_published", "true");

    // Formdan bir kapak görseli yüklendiyse, onu ekle.
    if (thumbFile && thumbFile.size > 0) {
      dataForPb.append("image", thumbFile);
    }

    // Zip'ten çıkarılan gömülü dosyaları ekle.
    for (const embed of workData.embeds) {
      //@ts-ignore
      const blob = new Blob([embed.buffer]);
      dataForPb.append(
        "embeds",
        blob,
        embed.name.includes("/")
          ? embed.name.split("/")[embed.name.split("/").length - 1]
          : embed.name,
      );
    }

    await pb.collection("works").create(dataForPb, {
      query: {
        auth: secret,
      },
    });
  } catch (error) {
    console.error("Proje eklenirken bir hata oluştu:", error);
    const pbError = error as {
      message?: string;
      response?: {
        message?: string;
        data?: Record<string, { message?: string }>;
      };
    };
    const fieldErrors = pbError.response?.data
      ? Object.values(pbError.response.data)
          .map((item) => item?.message)
          .filter(Boolean)
          .join(" ")
      : "";
    throw new Error(
      fieldErrors ||
        pbError.response?.message ||
        pbError.message ||
        "Proje oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
    );
  }

  revalidatePath("/");
}
