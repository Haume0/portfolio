"use client";

import { deleteBlog } from "./action";

export default function DeleteBlogButton(props: { slug: string; title: string }) {
    return (
        <form
            action={deleteBlog}
            onSubmit={(event) => {
                const confirmed = window.confirm(
                    `"${props.title}" blog yazısını silmek istediğine emin misin?`,
                );

                if (!confirmed) {
                    event.preventDefault();
                }
            }}
        >
            <input type="hidden" name="slug" value={props.slug} />
            <button className="main-button w-full! bg-body! hover:bg-white! hover:text-black! sm:w-max!">
                Sil
            </button>
        </form>
    );
}
