import React from "react";
import HeroSection from "./HeroSection";
import StatsPreview from "./StatsPreview";
import EventsPreview from "./EventsPreview";
import CtaSection from "./CtaSection";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StatsPreview />
      <EventsPreview />
      <CtaSection />
    </div>
  );
};

export default HomePage;
