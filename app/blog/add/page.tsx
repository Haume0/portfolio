import Header from "@/layouts/header";
import Footer from "@/layouts/footer";
import { addBlog } from "./action";

export interface BlogPost {
    id: string;
    title: string;
    content: string;
    image: string | null;
    is_published: boolean;
    created: string;
    updated: string;
    collectionId: string;
    collectionName: string;
    embeds: string[];
}

export default function Blogs() {
    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>
                {/*CONTENT*/}
                <section className="bg-blog p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full">
                    <form
                        action={addBlog}
                        className="flex flex-col gap-2 sm:justify-between w-full"
                    >
                        <span className="flex gap-2">
                            <input
                                type="text"
                                name="secret"
                                required
                                placeholder="Güvenlik kodunu girin."
                                className="text-field"
                            />
                            <label
                                htmlFor="blog"
                                className="main-button relative shrink-0 !gap-0 flex-col !items-start text-start"
                            >
                                Blog Yükle
                                <input
                                    type="file"
                                    className="appearance-none leading-3 text-xs"
                                    name="blog"
                                    id="blog"
                                    accept=".zip"
                                />
                            </label>
                            <label
                                htmlFor="thumb"
                                className="main-button relative shrink-0 !gap-0 flex-col !items-start text-start"
                            >
                                Kapak Görseli
                                <input
                                    type="file"
                                    className="appearance-none leading-3 text-xs"
                                    name="thumb"
                                    id="thumb"
                                    accept="image/*"
                                />
                            </label>
                            <button className="main-button shrink-0 leading-0 col-span-2">
                                Yayınla
                            </button>
                        </span>
                    </form>
                </section>
                {/*CONTENTEND*/}
            </div>
            <Footer />
        </>
    );
}
