import { useState } from "react";
import { createPortal } from "react-dom";
import {
  closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { LuGripVertical } from "react-icons/lu";

const rowStyle = "flex min-h-16 items-center gap-2 rounded-xl border px-3 py-2 sm:gap-3";
const rowSurface = "bg-white text-gray-900 dark:bg-gray-700 dark:text-white";
const buttonStyle = "rounded-md px-2 py-1 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-sky-600 disabled:opacity-35 dark:hover:bg-white/10";

function MemberName({ member }) {
  return (
    <>
      <span className="min-w-0 flex-1 truncate font-estedad-bold">{member.name}</span>
      {member.image && <img src={member.image} alt="" draggable={false} className="size-8 shrink-0 rounded-full object-cover" />}
    </>
  );
}

function SortableMember({ member, index, count, pending, changed, move, onEdit }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging, isOver } =
    useSortable({ id: member.id, disabled: pending });

  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`${rowStyle} ${rowSurface} ${isOver ? "border-sky-600 ring-1 ring-sky-500/35" : "border-gray-300 dark:border-gray-500"} ${isDragging ? "opacity-35" : ""}`}>
      <button ref={setActivatorNodeRef} type="button" disabled={pending} {...attributes} {...listeners}
        aria-label={`جابه‌جایی ${member.name}`}
        className="grid size-9 shrink-0 touch-none cursor-grab place-items-center rounded-md text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-sky-600 active:cursor-grabbing dark:text-gray-300 dark:hover:bg-gray-600">
        <LuGripVertical aria-hidden="true" className="size-5" />
      </button>
      <MemberName member={member} />
      <button type="button" disabled={pending || index === 0} onClick={() => move(index, index - 1)}
        aria-label={`بالا بردن ${member.name}`} className={buttonStyle}>↑</button>
      <button type="button" disabled={pending || index === count - 1} onClick={() => move(index, index + 1)}
        aria-label={`پایین بردن ${member.name}`} className={buttonStyle}>↓</button>
      {onEdit && <button type="button" disabled={pending || changed} onClick={() => onEdit(member.id)}
        className={`${buttonStyle} shrink-0 text-sm`}>ویرایش</button>}
    </li>
  );
}

export default function SortableOrder({ items: members, endpoint, onEdit, onSave }) {
  const [draft, setDraft] = useState(members);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState(null);
  const activeMember = draft.find((member) => member.id === activeId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const changed = draft.some((member, index) => member.id !== members[index]?.id);

  function move(from, to) {
    if (pending || from < 0 || from === to || to < 0 || to >= draft.length) return;
    setDraft((current) => arrayMove(current, from, to));
    setError("");
  }

  async function saveOrder() {
    setPending(true);
    setError("");
    try {
      const response = await fetch(endpoint, {
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
      <p className="text-sm">ردیف‌ها را بکش یا با دکمه‌های بالا و پایین جابه‌جا کن.</p>
      <DndContext sensors={sensors} collisionDetection={closestCenter}
        onDragStart={({ active }) => setActiveId(active.id)}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={({ active, over }) => {
          setActiveId(null);
          if (over) move(draft.findIndex(({ id }) => id === active.id), draft.findIndex(({ id }) => id === over.id));
        }}>
        <SortableContext items={draft.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
          <ul className="grid gap-2">
            {draft.map((member, index) => (
              <SortableMember key={member.id} member={member} index={index} count={draft.length}
                pending={pending} changed={changed} move={move} onEdit={onEdit} />
            ))}
          </ul>
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeMember && (
              <div dir="rtl" aria-hidden="true" className={`${rowStyle} ${rowSurface} border-sky-600 font-estedad shadow-xl ring-1 ring-sky-500/30`}>
                <LuGripVertical className="mx-2 size-5 shrink-0 text-gray-500" />
                <MemberName member={activeMember} />
              </div>
            )}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
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
