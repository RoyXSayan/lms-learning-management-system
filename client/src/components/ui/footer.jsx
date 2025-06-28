import { Link } from "react-router-dom";
import { DIcons } from "dicons";

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: "smooth",
  });
}

const navigation = {
  categories: [
    {
      id: "general",
      name: "General",
      sections: [
        {
          id: "about",
          name: "About",
          items: [
            { name: "About", href: "/about" },
            { name: "Works", href: "/agency/works" },
            { name: "Pricing", href: "/pricing" },
          ],
        },
        {
          id: "features",
          name: "Features",
          items: [
            { name: "Products", href: "/products" },
            { name: "Agency", href: "/agency" },
            { name: "Dashboard", href: "/dashboard" },
          ],
        },
        {
          id: "company",
          name: "Company",
          items: [
            { name: "Contact", href: "/contact" },
            { name: "Terms", href: "/terms" },
            { name: "Privacy", href: "/privacy" },
          ],
        },
      ],
    },
  ],
};

const Underline = `hover:-translate-y-1 border border-dotted rounded-xl p-2.5 transition-transform`;

const Footer = () => {
  return (
    <footer className="bg-gray-100 dark:bg-[#0a0a1a] text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        {/* Logo & About */}
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <Link to="/">
            <img
              src="/assets/logo.svg"
              alt="CoreGyan Logo"
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-sm max-w-2xl leading-6">
            {/* write a learning management system bio  */}
            Coregyan is a modern Learning Management System designed to empower
            educators and learners. Our platform offers intuitive course
            creation, interactive lessons, progress tracking, and collaborative
            tools to make online education engaging and effective. Whether
            you're a teacher, student, or organization, Coregyan provides
            everything you need to achieve your learning goals.
          </p>
        </div>

        {/* Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 text-center md:text-left">
          {navigation.categories[0].sections.map((section) => (
            <div key={section.id}>
              <h4 className="text-base font-semibold mb-3">{section.name}</h4>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link to={item.href} className="text-sm hover:underline">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <a href="#" target="_blank" rel="noreferrer" className={Underline}>
            <DIcons.Mail strokeWidth={1.5} className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noreferrer" className={Underline}>
            <DIcons.X className="h-5 w-5" />
          </a>
          <a href="#" target="_blank" rel="noreferrer" className={Underline}>
            <DIcons.Instagram className="h-5 w-5" />
          </a>
          {/* Add more as needed */}
        </div>

        {/* Bottom Text */}
        <div className="text-center text-xs pt-4 border-t border-dotted border-gray-300 dark:border-gray-600">
          <p className="flex flex-wrap justify-center items-center gap-1 text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Made with
            <DIcons.Heart className="text-red-600 h-4 w-4 animate-pulse" />
            by{" "}
            <a
              href="https://www.instagram.com/aliimam.in/"
              className="font-bold hover:text-red-500"
            >
              Sayan Roy
            </a>
            -{" "}
            <Link to="/" className="hover:text-blue-500">
              Coregyan
            </Link>
          </p>
          <button
            onClick={handleScrollTop}
            className="mt-2 text-sm underline hover:text-blue-500"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
