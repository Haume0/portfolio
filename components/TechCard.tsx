export default function TechCard(props: {
    className?: string;
    name: string;
    image: string;
}) {
    return (
        <span className="relative shrink-0 flex flex-col group hover:p-2 w-36 h-36 bg-dark ease-smooth duration-300 rounded-3xl">
            <div className="size-max absolute flex flex-col p-2 justify-end w-full inset-0 h-max pt-[2rem] opacity-0 group-hover:opacity-100 group-hover:top-[calc(100%-2rem)] ease-smooth duration-300 bg-dark rounded-b-3xl">
                <h1 className="text-center font-medium text-lg leading-5">
                    {props.name}
                </h1>
            </div>
            <div className="w-full relative aspect-square rounded-3xl shrink-0 group-hover:rounded-[1.175rem] ease-smooth duration-300 bg-white flex items-center justify-center p-4">
                <img src={props.image} alt={props.name} />
            </div>
        </span>
    );
}
