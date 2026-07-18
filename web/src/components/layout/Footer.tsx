import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-accent text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-2xl font-semibold">Festive Clothing</p>
          <p className="mt-3 text-sm text-gray-300">
            Rent premium festive wear for every celebration. Quality outfits,
            easy booking, hassle-free returns.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li>
              <Link href="/clothes" className="hover:text-white">
                Browse Collection
              </Link>
            </li>
            <li>
              <Link href="/clothes?festival=Diwali" className="hover:text-white">
                Diwali Collection
              </Link>
            </li>
            <li>
              <Link href="/clothes?festival=Navratri" className="hover:text-white">
                Navratri Collection
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-300">
            <li>Phone: +91 98765 43210</li>
            <li>Email: hello@festiveclothing.com</li>
            <li>Pickup available in your city</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Festive Clothing. All rights reserved.
      </div>
    </footer>
  );
}
