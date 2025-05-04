export default function TechCard(props: {
  className?: string;
  name: string;
  image: string;
}) {
  return (
    <span className="relative shrink-0 flex flex-col group hover:p-2 w-36 h-36 bg-dark ease-smooth duration-300 rounded-3xl">
      <div className="size-max absolute flex flex-col p-2 justify-end w-full left-0 top-0 h-full group-hover:mt-[1.75rem] ease-smooth duration-300 bg-dark rounded-3xl pt-4">
        <h1 className="text-center font-medium text-xl leading-3">
          {props.name}
        </h1>
      </div>
      <div className="w-full relative aspect-square rounded-3xl shrink-0 group-hover:rounded-[1.175rem] ease-smooth duration-300 bg-white flex items-center justify-center p-4">
        <img src={props.image} alt={props.name} />
      </div>
    </span>
  );
}
