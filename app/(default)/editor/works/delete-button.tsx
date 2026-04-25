"use client";

import { deleteProject } from "./action";

export default function DeleteProjectButton(props: { id: string; title: string }) {
    return (
        <form
            action={deleteProject}
            onSubmit={(event) => {
                const confirmed = window.confirm(
                    `"${props.title}" projesini silmek istediğine emin misin?`,
                );

                if (!confirmed) {
                    event.preventDefault();
                }
            }}
        >
            <input type="hidden" name="id" value={props.id} />
            <button className="main-button w-full! bg-body! hover:bg-white! hover:text-black! sm:w-max!">
                Sil
            </button>
        </form>
    );
}
