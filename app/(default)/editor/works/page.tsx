import Footer from "@/layouts/footer";
import Header from "@/layouts/header";
import { getAllProjects } from "@/lib/projects";

import { toggleProjectPublished } from "./action";
import AddProjectForm from "./form";
import DeleteProjectButton from "./delete-button";

export default function WorksEditor() {
    const projects = getAllProjects({ includeDrafts: true });

    return (
        <>
            <div className="p-4 space-y-6 sm:p-6 md:p-8">
                <div className="bg-main p-4 sm:p-6 md:p-8 z-50 flex flex-col rounded-3xl w-full relative">
                    <Header hideStar />
                </div>

                <section className="bg-works overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                        <span>
                            <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
                                Project Import
                            </h1>
                            <p className="font-medium text-lg sm:text-xl mt-2">
                                Project card bilgisini frontmatter olarak kaydet. ✦
                            </p>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                Notion export opsiyonel. Markdown içerik ileride
                                Behance tarzı proje detay sayfasında kullanılacak.
                            </p>
                        </span>
                    </div>
                    <AddProjectForm />
                </section>

                <section className="bg-grey overflow-hidden p-4 sm:p-6 md:p-8 flex flex-col rounded-3xl size-full gap-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-between w-full">
                        <span>
                            <h1 className="font-extrabold text-5xl sm:text-7xl lg:text-8xl">
                                Projeler
                            </h1>
                            <p className="font-light text-lg sm:text-xl max-w-3xl mt-2">
                                public/works altındaki statik projeleri yönet.
                            </p>
                        </span>
                        <span className="main-button bg-dark! hover:bg-white! hover:text-black!">
                            {projects.length} Proje
                        </span>
                    </div>

                    {projects.length > 0 ? (
                        <ul className="flex flex-col gap-4">
                            {projects.map((project) => (
                                <li
                                    key={project.id}
                                    className="bg-dark rounded-3xl p-4 sm:p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                                >
                                    <span className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                        <a
                                            href={project.link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="relative flex size-32 shrink-0 overflow-hidden rounded-3xl bg-body sm:size-40"
                                        >
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                className="size-full object-cover object-center"
                                            />
                                        </a>

                                        <span className="flex flex-col gap-2">
                                            <span className="flex flex-wrap gap-2 items-center">
                                                <span
                                                    className={`font-light text-sm md:text-base rounded-full py-0.5 px-2 ${
                                                        project.published
                                                            ? "bg-works"
                                                            : "bg-body text-white/60"
                                                    }`}
                                                >
                                                    {project.published
                                                        ? "Yayında"
                                                        : "Taslak"}
                                                </span>
                                                <span className="font-light text-sm md:text-base rounded-full bg-body py-0.5 px-2 text-white/60">
                                                    {project.id}
                                                </span>
                                            </span>
                                            <a
                                                href={project.link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-extrabold text-3xl sm:text-5xl hover:text-white/60 ease-smooth duration-300"
                                            >
                                                {project.title}
                                            </a>
                                            <p className="font-light text-lg md:text-xl text-white/60 line-clamp-2 max-w-4xl">
                                                {project.description}
                                            </p>
                                        </span>
                                    </span>

                                    <span className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:items-end">
                                        <form action={toggleProjectPublished}>
                                            <input
                                                type="hidden"
                                                name="id"
                                                value={project.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="published"
                                                value={
                                                    project.published
                                                        ? "false"
                                                        : "true"
                                                }
                                            />
                                            <button className="main-button w-full! sm:w-max!">
                                                {project.published
                                                    ? "Yayından Kaldır"
                                                    : "Yayına Al"}
                                            </button>
                                        </form>

                                        <DeleteProjectButton
                                            id={project.id}
                                            title={project.title}
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="bg-dark rounded-3xl p-4 sm:p-6">
                            <h2 className="font-extrabold text-3xl sm:text-5xl">
                                Henüz proje yok
                            </h2>
                            <p className="font-light text-lg md:text-xl mt-2 text-white/60">
                                İlk projeni eklediğinde burada listelenecek.
                            </p>
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </>
    );
}
