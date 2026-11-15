import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Carousel } from "../../../../components/carousel/carousel";
import TeamCarousel from "./TeamCarousel";
export default function OurTeam() {
  const [team, setTeam] = useState({ status: "loading", members: [] });
  const { status, members } = team;

  useEffect(() => {
    const controller = new AbortController();

    async function loadTeam() {
      try {
        const response = await fetch("/api/team-members", { signal: controller.signal });
        if (!response.ok) throw new Error("Could not load team members");
        const members = await response.json();
        if (!controller.signal.aborted) setTeam({ status: "ready", members });
      } catch {
        if (!controller.signal.aborted) setTeam({ status: "error", members: [] });
      }
    }

    loadTeam();
    return () => controller.abort();
  }, []);

  return (
    <section className="pt-10 bg-[#fbf6f0] dark:bg-gray-800 overflow-hidden transition-colors duration-500">
      <motion.h2
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        className="text-center text-4xl font-estedad-bold dark:text-white"
      >
        اعضای تیم ما
      </motion.h2>
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.7 }}
        className="max-w-7xl mx-auto"
      >
        {status === "loading" ? (
          <p role="status" className="py-10 text-center dark:text-white">
            در حال بارگذاری اعضای تیم…
          </p>
        ) : status === "error" ? (
          <p role="alert" className="py-10 text-center dark:text-white">
            بارگذاری اعضای تیم انجام نشد. لطفاً صفحه را دوباره باز کنید.
          </p>
        ) : members.length === 0 ? (
          <p className="py-10 text-center dark:text-white">عضوی برای نمایش وجود ندارد.</p>
        ) : (
          <Carousel>
            <TeamCarousel members={members} />
          </Carousel>
        )}
      </motion.div>
    </section>
  );
}
