'use client';

import { HomeHero, HomePartnersStrip } from './home/HomeHero';
import { HomeFoundation, HomeMission, HomeScale, HomeVision } from './home/HomeStory';
import { HomeClosing, HomeExploreCards, HomeValues, HomeWho } from './home/HomeExplore';

// The home page per HomeV2.dc.html ("The initiative"). Section order and the
// ids the nav's Initiative menu links to (#vision, #mission, #foundation,
// #scale, #values, #who) come straight from the design.
export default function HomeSections() {
  return (
    <>
      <HomeHero />
      <HomePartnersStrip />
      <HomeVision />
      <HomeMission />
      <HomeFoundation />
      <HomeScale />
      <HomeExploreCards />
      <HomeValues />
      <HomeWho />
      <HomeClosing />
    </>
  );
}
