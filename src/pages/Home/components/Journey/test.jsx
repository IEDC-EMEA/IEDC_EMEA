import React from "react";
import { Timeline } from "@/components2/ui/timeline.jsx";

export function TimelineDemo() {
    const data = [
        {
            title: "Welcome",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        New members are <span className="text-orange-500 font-semibold">welcomed</span> into our
                        student community, guided through onboarding, and begin forming connections
                        with peers across diverse departments.
                    </p>
                </div>
            ),
        },
        {
            title: "Explore",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Students <span className="text-orange-500 font-semibold">discover</span> clubs, hackathons,
                        events, and workshops that align with their passions — from{" "}
                        <span className="italic">technology</span> to{" "}
                        <span className="italic">arts and entrepreneurship</span>.
                    </p>
                </div>
            ),
        },
        {
            title: "Build",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Members <span className="text-orange-500 font-semibold">collaborate</span> on projects,
                        competitions, and research, strengthening both{" "}
                        <span className="font-semibold">technical expertise</span> and{" "}
                        <span className="font-semibold">leadership skills</span>.
                    </p>
                </div>
            ),
        },
        {
            title: "Learn",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Through <span className="text-orange-500 font-semibold">workshops</span>, peer-to-peer
                        sessions, and mentorship, students continuously expand their academic
                        knowledge and professional growth.
                    </p>
                </div>
            ),
        },
        {
            title: "Refine",
            content: (
                <div>
                    <p className="mb-4 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Students polish their portfolios and sharpen their skills by engaging in:
                    </p>
                    <div className="mb-8 space-y-2 text-neutral-700 dark:text-neutral-300">
                        <div className="flex items-center gap-2 text-sm">✅ Contributing to open-source</div>
                        <div className="flex items-center gap-2 text-sm">✅ Presenting research papers</div>
                        <div className="flex items-center gap-2 text-sm">✅ Attending mock interviews</div>
                        <div className="flex items-center gap-2 text-sm">✅ Hosting community events</div>
                    </div>
                </div>
            ),
        },
        {
            title: "Lead",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Senior members step into <span className="text-orange-500 font-semibold">leadership roles</span>,
                        mentoring juniors, organizing campus-wide events, and driving initiatives
                        that shape the student community.
                    </p>
                </div>
            ),
        },
        {
            title: "Graduate",
            content: (
                <div>
                    <p className="mb-8 text-sm leading-relaxed text-neutral-800 dark:text-neutral-200">
                        Students graduate not only with{" "}
                        <span className="text-orange-500 font-semibold">degrees</span>, but also with lifelong
                        networks, real-world experiences, and unforgettable community-driven
                        memories.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <div className="relative w-full overflow-clip">
            <Timeline data={data} />
        </div>
    );
}
