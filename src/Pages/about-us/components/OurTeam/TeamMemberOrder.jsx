import { useRef, useState } from "react";

export default function TeamMemberOrder({ members, onEdit, onSave }) {
  const [draft, setDraft] = useState(members);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dragged = useRef(null);
  const changed = draft.some((member, index) => member.id !== members[index]?.id);

  function move(from, to) {
    if (pending || from === null || from === to || to < 0 || to >= draft.length) return;
    setDraft((current) => {
      const next = [...current];
      const [member] = next.splice(from, 1);
      next.splice(to, 0, member);
      return next;
    });
    setError("");
  }

  async function saveOrder() {
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/team-members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: draft.map((member) => member.id) }),
      });
      if (!response.ok) throw new Error();
      onSave(draft);
    } catch {
      setError("ذخیرهٔ ترتیب انجام نشد. دوباره تلاش کن.");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <p className="text-sm">اعضا را بکش یا با دکمه‌های بالا و پایین جابه‌جا کن.</p>
      <ul className="grid gap-2">
        {draft.map((member, index) => (
          <li key={member.id} draggable={!pending}
            onDragStart={(event) => {
              dragged.current = index;
              event.dataTransfer.setData("text/plain", String(index));
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => {
              if (dragged.current !== null) event.preventDefault();
            }}
            onDragEnd={() => { dragged.current = null; }}
            onDrop={(event) => {
              event.preventDefault();
              move(dragged.current, index);
              dragged.current = null;
            }}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-400 px-3 py-2">
            <span className="cursor-grab">{member.name}</span>
            <div className="flex gap-2">
              <button type="button" disabled={pending || index === 0} onClick={() => move(index, index - 1)}
                aria-label={`بالا بردن ${member.name}`} className="rounded-lg border px-3 py-1 disabled:opacity-40">↑</button>
              <button type="button" disabled={pending || index === draft.length - 1} onClick={() => move(index, index + 1)}
                aria-label={`پایین بردن ${member.name}`} className="rounded-lg border px-3 py-1 disabled:opacity-40">↓</button>
              <button type="button" disabled={pending || changed} onClick={() => onEdit(member.id)}
                className="rounded-lg border px-3 py-1 disabled:opacity-40">ویرایش</button>
            </div>
          </li>
        ))}
      </ul>
      {changed && (
        <div className="flex gap-2">
          <button type="button" disabled={pending} onClick={saveOrder} className="rounded-lg bg-[#596348] px-4 py-2 text-white">
            {pending ? "در حال ذخیره…" : "ذخیرهٔ ترتیب"}
          </button>
          <button type="button" disabled={pending} onClick={() => {
            setDraft(members);
            setError("");
          }} className="rounded-lg border px-4 py-2">انصراف</button>
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
