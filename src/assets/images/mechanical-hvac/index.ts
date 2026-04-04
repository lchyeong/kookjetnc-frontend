import automaticControlBrochurePage14 from '@/assets/images/mechanical-hvac/automatic-control/brochure-page-14.png';
import automaticControlGuidePage25 from '@/assets/images/mechanical-hvac/automatic-control/guide-page-25.png';
import heatingCoolingBrochurePage10 from '@/assets/images/mechanical-hvac/heating-cooling/brochure-page-10.png';
import heatingCoolingBrochurePage11 from '@/assets/images/mechanical-hvac/heating-cooling/brochure-page-11.png';
import heatingCoolingGuidePage22 from '@/assets/images/mechanical-hvac/heating-cooling/guide-page-22.png';
import hvacBrochurePage12 from '@/assets/images/mechanical-hvac/hvac/brochure-page-12.png';
import hvacGuidePage23 from '@/assets/images/mechanical-hvac/hvac/guide-page-23.png';
import brochurePage09BusinessArea from '@/assets/images/mechanical-hvac/overview/brochure-page-09-business-area.png';
import brochurePage17OperatingConsulting from '@/assets/images/mechanical-hvac/overview/brochure-page-17-operating-consulting.png';
import guidePage21 from '@/assets/images/mechanical-hvac/overview/guide-page-21.png';
import plumbingBrochurePage13 from '@/assets/images/mechanical-hvac/plumbing/brochure-page-13.png';
import plumbingGuidePage24 from '@/assets/images/mechanical-hvac/plumbing/guide-page-24.png';

export const mechanicalHvacImages = {
  automaticControl: {
    brochurePage14: automaticControlBrochurePage14,
    guidePage25: automaticControlGuidePage25,
  },
  heatingCooling: {
    brochurePage10: heatingCoolingBrochurePage10,
    brochurePage11: heatingCoolingBrochurePage11,
    guidePage22: heatingCoolingGuidePage22,
  },
  hvac: {
    brochurePage12: hvacBrochurePage12,
    guidePage23: hvacGuidePage23,
  },
  overview: {
    brochurePage09BusinessArea,
    brochurePage17OperatingConsulting,
    guidePage21,
  },
  plumbing: {
    brochurePage13: plumbingBrochurePage13,
    guidePage24: plumbingGuidePage24,
  },
} as const;
