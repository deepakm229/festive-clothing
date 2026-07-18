import { Package, Smile, Truck } from "lucide-react";

const features = [
  {
    icon: Package,
    title: "Wide Variety",
    description: "Kurtas, lehengas, and more for every festival and size.",
  },
  {
    icon: Smile,
    title: "Happy Customers",
    description: "Trusted by hundreds of families for festive celebrations.",
  },
  {
    icon: Truck,
    title: "Easy Pickup",
    description: "Convenient pickup and return with flexible rental dates.",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        {features.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider">
                {title}
              </h3>
              <p className="mt-1 text-sm text-muted">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
