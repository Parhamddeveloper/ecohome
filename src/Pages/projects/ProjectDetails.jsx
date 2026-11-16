import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi";
import { CategoryTitle } from "./components/ProjectCard/ProjectCard";

function ProjectGallery({ project }) {
  const [selected, setSelected] = useState(0);
  const gallery = Array.isArray(project.gallery) ? project.gallery : [];
  const images = [...new Set([project.thumbnail, ...gallery].filter(
    (image) => typeof image === "string" && image,
  ))];

  if (!images.length) return null;

  return (
    <div className="grid gap-3">
      <div className="flex justify-center overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        <img src={images[selected]} alt={`تصویر پروژهٔ ${project.title}`}
          className="block h-auto max-h-[min(60svh,32rem)] w-auto max-w-full object-contain" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto p-1" role="group" aria-label="تصاویر پروژه">
          {images.map((image, index) => (
            <button key={image} type="button" aria-pressed={selected === index}
              aria-label={`نمایش تصویر ${index + 1}`} onClick={() => setSelected(index)}
              className="shrink-0 overflow-hidden rounded-lg border-2 border-transparent focus-visible:outline-2 focus-visible:outline-offset-2 aria-pressed:border-[#869074]">
              <img src={image} alt="" loading="lazy" className="h-16 w-24 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectContent({ id, article, preview }) {
  const [result, setResult] = useState({ status: "loading" });
  const resource = article ? "weblogs" : "projects";
  const label = article ? "مقاله" : "پروژه";

  useEffect(() => {
    const controller = new AbortController();
    window.scrollTo(0, 0);

    async function loadProject() {
      try {
        const query = new URLSearchParams({ id });
        const response = await fetch(`/api/${preview ? "admin-" : ""}${resource}?${query}`, { signal: controller.signal });
        if (response.status === 401 || response.status === 403) {
          if (!controller.signal.aborted) setResult({ status: "forbidden" });
          return;
        }
        if (response.status === 404 || response.status === 400) {
          if (!controller.signal.aborted) setResult({ status: "missing" });
          return;
        }
        if (!response.ok) throw new Error();
        const project = await response.json();
        if (!controller.signal.aborted) setResult({ status: "ready", project });
      } catch {
        if (!controller.signal.aborted) setResult({ status: "error" });
      }
    }

    loadProject();
    return () => controller.abort();
  }, [id, resource, preview]);

  const { status, project } = result;
  const details = project ? [
    ["دسته‌بندی", CategoryTitle[project.type]],
    ["نویسنده", project.author],
    ["تاریخ انتشار", project.date],
    ["موقعیت", project.location],
    ["سال اجرا", project.year],
    ["مساحت", project.area ? `${project.area} مترمربع` : null],
  ].filter(([, value]) => value) : [];

  return (
    <section dir="rtl" className="mx-auto grid max-w-7xl gap-6 px-4 py-10 font-estedad dark:text-white sm:px-6">
      <Link to={preview ? `/dashboard?section=${resource}` : `/${resource}`}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-current px-3 py-2 text-sm">
        <HiArrowRight aria-hidden="true" /> بازگشت به {preview ? "داشبورد" : article ? "مقاله‌ها" : "پروژه‌ها"}
      </Link>
      {status === "loading" && <p role="status">در حال بارگذاری {label}…</p>}
      {status === "missing" && <h1 className="text-2xl font-estedad-bold">{label} پیدا نشد.</h1>}
      {status === "forbidden" && <p role="alert">پیش‌نمایش فقط برای مدیران قابل مشاهده است.</p>}
      {status === "error" && <p role="alert">بارگذاری {label} انجام نشد. لطفاً صفحه را تازه‌سازی کن.</p>}
      {project && (
        <article className="grid gap-6">
          {preview && <p className="w-fit rounded-full bg-[#869074]/25 px-3 py-1 text-sm">
            پیش‌نمایش {project.status === "draft" ? "پیش‌نویس" : "محتوای منتشرشده"}
          </p>}
          <h1 className="text-3xl font-estedad-bold sm:text-5xl">{project.title}</h1>
          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="order-2 grid min-w-0 gap-6 lg:order-1">
              <ProjectGallery project={project} />
              {(project.description || project.text) && (
                <p className="max-w-3xl whitespace-pre-line break-words leading-8">{project.description || project.text}</p>
              )}
            </div>
            {details.length > 0 && (
            <aside aria-label={`اطلاعات ${label}`} className="order-1 rounded-xl border border-[#869074]/35 bg-[#fbf6f0] p-5 dark:bg-gray-800 lg:sticky lg:top-28 lg:order-2">
            <dl className="grid grid-cols-2 gap-4 lg:grid-cols-1">
              {details.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-gray-600 dark:text-gray-300">{label}</dt>
                  <dd className="mt-1 font-estedad-bold">{value}</dd>
                </div>
              ))}
            </dl>
            </aside>
            )}
          </div>
        </article>
      )}
    </section>
  );
}

export default function ProjectDetails({ article = false }) {
  const { id } = useParams();
  const [params] = useSearchParams();
  const preview = params.get("preview") === "1";
  return <ProjectContent key={`${article}:${id}:${preview}`} id={id} article={article} preview={preview} />;
}
