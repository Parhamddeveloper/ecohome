import { ClientStories } from "../../../../../data/db";
export default function ClientCarousel() {
  return (
    <>
      {ClientStories.map((item) => (
        <div
          key={item.id}
          className="flex-[0_0_100%] min-w-0 pr-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
        >
          <div className="bg-transparent p-6 flex flex-col justify-between h-full">
            <p className="text-gray-600 text-md leading-relaxed mb-6 text-right lg:text-sm dark:text-white font-estedad italic">
              "{item.client_message}"
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <img
                src={item.client_img}
                alt={item.clientname}
                className="w-13 h-13 rounded-full object-cover"
              />
              <span className="font-bold text-sm text-gray-800 dark:text-white">
                {item.clientname}
              </span>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
