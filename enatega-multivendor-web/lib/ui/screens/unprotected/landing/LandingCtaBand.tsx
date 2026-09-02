import Link from "next/link";
import { useTranslations } from "next-intl";
import { FiArrowUpRight } from "react-icons/fi";

export default function LandingCtaBand() {
  const t = useTranslations("Landing");

  return (
    <section className="bg-[#151914] text-white" aria-label={t("cta.label")}>
      <div className="mx-auto grid max-w-dispatch-page md:grid-cols-2">
        <article className="px-6 py-14 md:px-10 md:py-16 lg:px-16">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-color">
            {t("cta.business.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            {t("cta.business.title")}
          </h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-white/68 sm:text-base">
            {t("cta.business.body")}
          </p>
          <Link
            href="/restaurantInfo"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl border border-primary-dark px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark hover:text-[#151914] focus-visible:outline-none"
          >
            {t("cta.business.action")}
            <FiArrowUpRight aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-rotate-90" />
          </Link>
        </article>

        <article className="border-t border-white/12 px-6 py-14 md:border-l md:border-t-0 md:px-10 md:py-16 lg:px-16 rtl:md:border-l-0 rtl:md:border-r">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-color">
            {t("cta.rider.eyebrow")}
          </p>
          <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] sm:text-4xl">
            {t("cta.rider.title")}
          </h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-6 text-white/68 sm:text-base">
            {t("cta.rider.body")}
          </p>
          <Link
            href="/rider"
            className="group mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-primary-color px-5 text-sm font-semibold text-[#151914] transition-colors hover:bg-primary-hover focus-visible:outline-none"
          >
            {t("cta.rider.action")}
            <FiArrowUpRight aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-rotate-90" />
          </Link>
        </article>
      </div>
    </section>
  );
}
