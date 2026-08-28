"use client";

import LandingCtaBand from "./landing/LandingCtaBand";
import MoreThanDelivery from "./landing/MoreThanDelivery";
import QuietOrbitHero from "./landing/QuietOrbitHero";
import ScrollJourney from "./landing/ScrollJourney";

export default function MarketplaceHome() {
  return (
    <main className="quiet-orbit-page overflow-x-clip bg-dispatch-ground text-dispatch-ink">
      <QuietOrbitHero />
      <MoreThanDelivery />
      <ScrollJourney />
      <LandingCtaBand />
    </main>
  );
}
