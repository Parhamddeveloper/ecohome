import {
  FaAmazon,
  FaFacebook,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaPhoneFlip,
  FaYoutube,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { IoMdMail } from "react-icons/io";

export default function Footer() {
  return (
    <>
      <footer className="bg-[#ebdbc8] dark:bg-gray-700 dark:text-white pt-7 transition-colors duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 max-w-7xl mx-5 xl:mx-auto text-center md:text-start gap-y-6">
          <div>
            <h2 className="text-xl font-bold">لینک های پر استفاده</h2>
            <nav className="grid grid-cols-2 mt-5">
              <ul className="gap-y-2 flex flex-col">
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>خانه</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>نمونه کار ها</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>سبد خرید</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>آدرس</Link>
                </li>
              </ul>
              <ul className="gap-y-2 flex flex-col">
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>درباره ما</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>رضایت مشتری</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>ارتباط با ما</Link>
                </li>
                <li className="hover:dark:text-[#ebdbc8] hover:text-[#8c7171] transition-colors">
                  <Link>راه های ارتباطی</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div>
            <h2 className="text-xl font-bold">ارتباط با ما</h2>
            <ul className="flex flex-col gap-y-3 mt-5 items-center lg:items-start">
              <li className="flex items-center gap-x-2">
                <FaPhoneFlip /> <span dir="ltr">+989125898651</span>{" "}
              </li>
              <li className="flex items-center gap-x-2">
                <IoMdMail /> parhamdaneshnejad@gmail.com
              </li>
              <li className="flex items-center gap-x-2">
                <FaInstagram /> <span dir="ltr">@parham___danesh</span>
              </li>
              <li className="flex items-center gap-x-2">
                <FaGithub /> <span dir="ltr">@parhamddeveloper</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-bold">شبکه های اجتماعی</h2>
            <p className="mt-5">@parham___danesh</p>
            <p>@parhamddeveloper</p>
            <div className="flex gap-x-4 mt-7 text-xl justify-center md:justify-normal ">
              <Link className="dark:bg-black p-1.5 rounded-2xl bg-[#fbf6f0] transition-colors">
                <FaFacebookF />
              </Link>
              <Link className="dark:bg-black p-1.5 rounded-2xl bg-[#fbf6f0] transition-colors">
                <FaInstagram />
              </Link>
              <Link className="dark:bg-black p-1.5 rounded-2xl bg-[#fbf6f0] transition-colors">
                <FaYoutube />
              </Link>
              <Link className="dark:bg-black p-1.5 rounded-2xl bg-[#fbf6f0] transition-colors">
                <FaAmazon />
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">باشگاه مشتریان</h2>
            <div className="mt-5">
              <h3> برای عضویت در باشگاه ایمیل خود را وارد کنید</h3>
              <div className="flex mt-4 justify-center">
                <input type="text" className="bg-white w-3/4 rounded-r-2xl text-black p-2 focus:outline-none" name="" id="" placeholder="ایمیل خود را وارد کنید"/>
                <button className="bg-[#869074] rounded-l-xl p-2 text-white">ثبت نام</button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-t-gray-500 flex flex-col gap-y-3 text-center md:flex-row md:justify-between md:items-center max-w-7xl mx-auto mt-7 py-2">
          <p>اکوهوم (این سایت تنها به عنوان نمونه کار است)</p>
          <p>ساخته شده با ❤️ توسط پرهام دانش نژاد 2026</p>
        </div>
      </footer>
    </>
  );
}
