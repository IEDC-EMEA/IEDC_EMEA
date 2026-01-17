import Logo from "@/assets/icons/FooterLogo.png";
import socialLink from "@/const/socialLinks";
import navLinks from "@/const/navLinks";

function Footer() {
  return (
    <footer className="bg-black text-white p-8 pb-4 rounded-t-[50px] bottom-0">
      <section className="flex flex-col gap-10 w-limit">
        <h1 className="mx-auto text-xl md:text-[35px] font-semibold text-center">
          <span className="text-orange-500 mr-1">Join us</span>
          to start your journey.
        </h1>

        <div className="flex justify-between flex-col md:flex-row gap-10">
          {/* Left side nav */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-xl md:text-2xl">ConnectEMEA</h1>
            {navLinks.map((link, index) => (
              <div
                key={index}
                className="flex text-sm md:text-md items-start justify-start gap-4"
              >
                <a href={link.href} aria-label={link.label}>
                  {link.label}
                </a>
              </div>
            ))}
          </div>

          {/* Right side logo + socials */}
          <div className="flex flex-col gap-4 items-start md:items-end">
            <img
              draggable={false}
              onDragStart={(e) => e.preventDefault()}
              src={Logo}
              alt="logo"
              className="h-8 md:h-10"
            />
            <div className="flex items-center justify-end gap-4">
              {socialLink.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${item.label} page`}
                >
                  <item.Icon className="w-4 md:w-5 h-4 md:h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom gray bar */}
      <div className="mt-4 border-t border-gray-800 pt-4">
        <p className="text-center text-xs md:text-sm text-gray-400">
          Crafted by{" "}
          <a
            href="https://zamil.vercel.app"
            target="_blank"
            className="text-orange-500 cursor-pointer hover:text-orange-600 transition-all ease-in-out"
          >
            Shamil
          </a>{" "}
          &{" "}
          <a
            href="https://www.linkedin.com/in/muhammed-saleel-cp-84064524b/"
            target="_blank"
            className="text-orange-500 cursor-pointer hover:text-orange-600 transition-all ease-in-out"
          >
            Saleel
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
