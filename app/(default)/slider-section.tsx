"use client";

import { useContact } from "@/components/contact";
import Slider from "@/components/slider";

export default function SliderSection() {
    const contact = useContact();
    return (
        <div className="p-4 sm:p-6 md:p-8 pt-0!">
            <section className=" bg-about overflow-hidden p-6 py-4 flex justify-between rounded-3xl size-full">
                <Slider text="Let’s work together">
                    <button
                        onClick={() => {
                            contact.open();
                        }}
                        className="main-button"
                    >
                        Let's Talk
                    </button>
                </Slider>
            </section>
        </div>
    );
}
