"use client";

export default function Newsletter() {
    return (
        <div className="p-4 sm:p-6 md:p-8 !pt-0">
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const mail = (e.target as HTMLFormElement).mail.value;
                    const subject = encodeURIComponent("Newsletter subscription");
                    const body = encodeURIComponent(`Subscribe this email: ${mail}`);

                    window.open(`mailto:haume341@outlook.com?subject=${subject}&body=${body}`);
                }}
                className=" bg-about overflow-hidden pl-6 p-4 gap-6 flex flex-col md:flex-row justify-between rounded-3xl size-full"
            >
                <h1 className="font-light text-4xl flex gap-6 items-center justify-center text-center md:text-left">
                    <img src="/star.svg" alt="" className="size-10" />
                    Subscribe for stay tuned!
                    <img src="/star.svg" alt="" className="size-10" />
                </h1>
                <span className="flex gap-4 md:max-w-2/5 w-full">
                    <input
                        type="email"
                        name="mail"
                        required
                        placeholder="E-mail address"
                        className="text-field"
                    />
                    <button className="main-button shrink-0 col-span-2">
                        Subscribe
                    </button>
                </span>
            </form>
        </div>
    );
}
