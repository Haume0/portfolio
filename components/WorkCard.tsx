export default function WorkCard(props: {
  id: string;
  image: string;
  title: string;
  description: string;
  link: {
    name: string;
    url: string;
  };
  className?: string;
}) {
  return (
    <span
      className={` size-80 sm:size-[32rem] group hover:p-3 flex flex-col ease-smooth duration-500 bg-dark relative rounded-3xl z-10 overflow-hidden p-0 gap-3 ${props.className}`}
    >
      <div className="w-full group-hover:h-4/5 group-hover:shrink ease-smooth duration-500 size-full shrink-0 rounded-2xl overflow-hidden p-3 relative">
        <img
          src={props.image}
          className=" absolute inset-0 object-cover size-full -z-10"
          alt={props.title}
        />
        <a
          target="_blank"
          rel="noreferrer"
          href={props.link.url}
          aria-label={props.link.name}
          className="flex justify-end group/ext size-max ml-auto gap-2"
        >
          <span className="h-12 px-5 mr-8 group-hover/ext:translate-x-2 opacity-0 group-hover:opacity-100 group-hover:mr-0 ease-smooth duration-500 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
            {props.link.name}
          </span>
          <div className="size-12 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center">
            <svg
              width="16"
              height="16"
              className="rotate-45 group-hover/ext:rotate-0 ease-in-out duration-300"
              viewBox="0 0 17 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.78389 17.1406L0.0078125 15.3645L12.1867 3.1857H1.27644V0.648438H16.5V15.872H13.9627V4.96178L1.78389 17.1406Z"
                fill="white"
              />
            </svg>
          </div>
        </a>
      </div>
      <div className="flex flex-col p-3">
        <h1 className=" font-bold text-3xl sm:text-[2rem] line-clamp-1">
          {props.title}
        </h1>
        <p className="text-base sm:text-xl hover:cursor-help line-clamp-2 peer">
          {props.description}
        </p>
        <p className="text-base sm:text-xl absolute pointer-events-none inset-0 mt-auto mx-auto size-max bg-dark/10 backdrop-blur-3xl peer-hover:opacity-100 peer-hover:blur-none peer-hover:translate-y-0 opacity-0 translate-y-4 blur ease-gentle duration-500 rounded-3xl peer-hover:delay-500 max-w-full w-full p-6">
          <h1 className=" font-bold text-3xl sm:text-[2rem] line-clamp-1">
            {props.title}
          </h1>
          {props.description}
        </p>
      </div>
    </span>
  );
}
