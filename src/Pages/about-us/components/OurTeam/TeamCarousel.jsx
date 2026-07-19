import { teamMembers } from "../../../../../data/db";

export default function TeamCarousel() {
  return (
    <>
      {teamMembers.map((item) => (
        <div
          key={item.id}
          className="flex-[0_0_100%] min-w-0 pr-4 sm:flex-[0_0_50%] md:flex-[0_0_33.33%]  lg:flex-[0_0_25%] xl:flex-[0_0_20%]"
        >
          <div className="bg-white dark:bg-gray-600 rounded-xl rounded-t-full shadow-lg p-6 text-center h-full transition-[background-color,translate]  hover:-translate-y-3 duration-500">
            <img
              src={item.image}
              alt={item.name}
              className="w-40 h-40 rounded-full object-cover mx-auto"
            />

            <h3 className="mt-4 text-xl font-estedad-bold dark:text-white">
              {item.name}
            </h3>

            <p className="text-[#869074] font-estedad mt-2">{item.role}</p>

            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2 leading-7 font-estedad">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
