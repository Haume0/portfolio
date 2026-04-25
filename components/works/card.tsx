import { Icon } from "@iconify/react";

export default function WorkCard(props: {
    id: string;
    image: string;
    title: string;
    description: string;
    object?: string;
    link: {
        name: string;
        url: string;
    };
    className?: string;
    onInspect: () => void;
}) {
    return (
        <span
            className={` w-96 sm:w-[32rem] max-w-[86vw] aspect-square! group hover:p-3 flex flex-col ease-smooth duration-500 bg-dark relative rounded-3xl z-10 overflow-hidden p-0 gap-3 ${props.className}`}
        >
            <div className="w-full group-hover:h-4/5 group-hover:shrink ease-smooth duration-500 size-full shrink-0 rounded-2xl overflow-hidden p-3 relative">
                <img
                    src={props.image}
                    className={`absolute inset-0 object-cover size-full -z-10
            ${props.object == "top-left" ? "object-top-left" : "object-center"}
            `}
                    alt={props.title}
                />
                <button
                    onClick={props.onInspect}
                    aria-label={props.link.name}
                    className="flex justify-end group/ext size-max ml-auto gap-2 cursor-pointer"
                >
                    <span className="h-12 px-5 mr-8 group-hover/ext:translate-x-2 opacity-0 group-hover:opacity-100 group-hover:mr-0 ease-smooth duration-500 rounded-full bg-black/50 text-white backdrop-blur-xl flex items-center justify-center">
                        See more
                    </span>
                    <div className="size-12 rounded-full bg-dark/50 backdrop-blur-xl text-2xl text-white flex items-center justify-center">
                        <Icon
                            icon="ion:arrow-forward"
                            className="group-hover:-rotate-45 ease-in-out duration-300"
                        />
                    </div>
                </button>
            </div>
            <div className="flex flex-col p-3">
                <h1 className=" font-bold text-2xl sm:text-[2rem] line-clamp-1">
                    {props.title}
                </h1>
                <p className="text-sm sm:text-xl hover:cursor-help line-clamp-2 peer">
                    {props.description}
                </p>
                <span className="text-sm sm:text-xl absolute pointer-events-none inset-0 mt-auto mx-auto size-max bg-dark/10 backdrop-blur-3xl peer-hover:opacity-100 peer-hover:blur-none peer-hover:translate-y-0 opacity-0 translate-y-4 blur ease-gentle duration-500 rounded-3xl peer-hover:delay-500 max-w-full w-full p-6">
                    <h1 className=" font-bold text-2xl sm:text-[2rem]">
                        {props.title}
                    </h1>
                    {props.description}
                </span>
            </div>
        </span>
    );
}
