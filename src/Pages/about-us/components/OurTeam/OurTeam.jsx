import { motion } from "framer-motion";
import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../../../context/SessionContext";
import { Carousel } from "../../../../components/carousel/carousel";
import TeamCarousel from "./TeamCarousel";
import TeamMemberEditor from "./TeamMemberEditor";
const SortableOrder = lazy(() => import("../../../../components/SortableOrder"));

export default function OurTeam({ embedded = false }) {
  const [team, setTeam] = useState({ status: "loading", members: [] });
  const { status, members } = team;
  const { user } = useContext(SessionContext);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const editingMember = members.find((member) => member.id === editingId);

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

  function saveMember(updated) {
    setTeam((current) => ({
      ...current,
      members: current.members.map((member) => member.id === updated.id ? updated : member),
    }));
    setEditingId(null);
    setMessage("تغییرات عضو ذخیره شد.");
  }

  function saveOrder(orderedMembers) {
    setTeam((current) => ({ ...current, members: orderedMembers }));
    setMessage("ترتیب اعضا ذخیره شد.");
  }

  return (
    <section className={embedded ? "" : "pt-10 bg-[#fbf6f0] dark:bg-gray-800 overflow-hidden transition-colors duration-500"}>
      {!embedded && <>
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
      </>}
      {embedded && status === "loading" && <p role="status">در حال بارگذاری اعضا…</p>}
      {embedded && status === "error" && <p role="alert">بارگذاری اعضا انجام نشد.</p>}
      {embedded && status === "ready" && members.length === 0 && <p>عضوی برای نمایش وجود ندارد.</p>}
      {embedded && user?.role === "superadmin" && status === "ready" && members.length > 0 && (
        <div className="grid gap-3 font-estedad dark:text-white">
          {message && <p role="status">{message}</p>}
          {editingMember ? (
            <TeamMemberEditor member={editingMember} onSave={saveMember} onCancel={() => setEditingId(null)} />
          ) : (
            <Suspense fallback={<p role="status">در حال بارگذاری فهرست…</p>}>
              <SortableOrder items={members} endpoint="/api/team-members" onSave={saveOrder} onEdit={(id) => {
                setMessage("");
                setEditingId(id);
              }} />
            </Suspense>
          )}
        </div>
      )}
    </section>
  );
}
