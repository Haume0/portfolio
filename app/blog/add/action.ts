"use server";

import PocketBase from "pocketbase";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import AdmZip from "adm-zip";
import path from "path";

// Kodun daha okunabilir olması için arayüzler tanımlıyoruz.
interface FileData {
    buffer: Buffer;
    name: string;
}

interface BlogData {
    title: string;
    content: string;
    embeds: FileData[];
    mdFileFound: boolean;
}

export async function addBlog(formdata: FormData) {
    const processZipEntries = (zip: AdmZip, blogData: BlogData) => {
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
                processZipEntries(nestedZip, blogData);
            }
            // Markdown dosyasını bul ve içeriğini ayrıştır. Sadece ilk bulduğunu işle.
            else if (baseName.endsWith(".md") && !blogData.mdFileFound) {
                blogData.mdFileFound = true; // Bulundu olarak işaretle ki başkasını aramasın.
                const fileContent = entry.getData().toString("utf8");
                const lines = fileContent.split(/\r?\n/);
                blogData.title =
                    lines.shift()?.replace(/^#\s*/, "") || "Başlıksız";
                blogData.content = lines.join("\n").trim();
            }
            // Diğer her şeyi 'embeds' listesine ekle.
            else {
                // Ana içerik olarak kullanılan .md dosyasının 'embeds' listesine eklenmesini önleyelim.
                if (!baseName.endsWith(".md")) {
                    blogData.embeds.push({
                        buffer: entry.getData(),
                        name: fullPath,
                    });
                }
            }
        }
    };
    const secret = formdata.get("secret") as string;
    if (secret !== process.env.SECRET) {
        throw new Error("Geçersiz güvenlik anahtarı.");
    }

    const blogFile = formdata.get("blog") as File;
    if (!blogFile || blogFile.size === 0) {
        throw new Error("Blog için bir zip dosyası yüklenmelidir.");
    }

    // Kapak görselini formdan al. Bu alan opsiyonel olabilir.
    const thumbFile = formdata.get("thumb") as File | null;

    const blogData: BlogData = {
        title: "",
        content: "",
        embeds: [],
        mdFileFound: false,
    };

    try {
        const fileBuffer = Buffer.from(await blogFile.arrayBuffer());
        const mainZip = new AdmZip(fileBuffer);

        // Zip dosyasını ve içindekileri işle.
        processZipEntries(mainZip, blogData);

        if (!blogData.mdFileFound) {
            throw new Error(
                "Zip arşivi içinde .md uzantılı bir dosya bulunamadı.",
            );
        }

        const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);
        // İsteğe bağlı: Koleksiyonunuz korumalı ise admin olarak giriş yapmanız gerekebilir.
        // await pb.admins.authWithPassword(process.env.PB_ADMIN_EMAIL!, process.env.PB_ADMIN_PASSWORD!);

        const dataForPb = new FormData();
        dataForPb.append("title", blogData.title);
        dataForPb.append("content", blogData.content);
        dataForPb.append("likes", "0");
        dataForPb.append("views", "0");
        dataForPb.append("is_published", "true");

        // Formdan bir kapak görseli yüklendiyse, onu ekle.
        if (thumbFile && thumbFile.size > 0) {
            dataForPb.append("image", thumbFile);
        }

        // Zip'ten çıkarılan gömülü dosyaları ekle.
        for (const embed of blogData.embeds) {
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

        await pb.collection("blogs").create(dataForPb, {
            query: {
                auth: secret,
            },
        });
    } catch (error) {
        console.error("Blog eklenirken bir hata oluştu:", error);
        throw new Error(
            "Blog oluşturulamadı. Lütfen daha sonra tekrar deneyin.",
        );
    }

    revalidatePath("/blog");
    redirect("/blog");
}
