export default function Contact(props: { className?: string }) {
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          //get values
          const target = e.target as HTMLFormElement;
          const name = (target.elements.namedItem("name") as HTMLInputElement)
            .value;
          const title = (target.elements.namedItem("title") as HTMLInputElement)
            .value;
          const message = target.message.value;
          const mailto = `mailto:haume341@outlook.com?subject=${encodeURIComponent(
            title
          )}&body=${encodeURIComponent(`🪐 ${name},\n\n${message}`)}`;
          window.open(mailto);
        }}
        className={`grid grid-cols-2 bg-dark p-2 gap-2 w-full sm:w-[44rem] rounded-2xl ${props.className}`}>
        <input
          type="text"
          name="name"
          required
          placeholder="Name & Surname"
          className="px-5 h-16 gap-2 flex w-full outline-hidden items-center justify-center text-white bg-body focus:bg-milk focus:text-body rounded-xl font-medium text-xl font-sora ease-in-out duration-200"
        />
        <input
          type="text"
          name="title"
          required
          placeholder="Title"
          className="px-5 h-16 gap-2 flex w-full outline-hidden items-center justify-center text-white bg-body focus:bg-milk focus:text-body rounded-xl font-medium text-xl font-sora ease-in-out duration-200"
        />
        <textarea
          required
          name="message"
          placeholder="Message"
          className="p-5 h-16 col-span-2 min-h-32 gap-2 flex w-full outline-hidden items-center justify-center text-white bg-body focus:bg-milk focus:text-body rounded-xl font-medium text-xl font-sora ease-in-out duration-200"></textarea>
        <button className="main-button w-full! col-span-2">Submit</button>
      </form>
    </>
  );
}
