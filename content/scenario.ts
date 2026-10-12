/**
 * "From problem to business outcome": the five mandated steps
 * (docs/NEXT-TASK-PROMPT-2026-10-10.md §2). Step copy is verbatim.
 *
 * It is one sample scenario on one product (Yisbir): there is no cross-product
 * claim (DD-20). Steps 02–04 are paired with the real Yisbir screens, each with
 * its own provenance. Steps 01 and 05 carry no screen of their own: the problem
 * is that nobody is watching, and the outcome is the record, which step 04's
 * dashboard keeps showing.
 */

import { SCREENS, type Screen } from "./media";

export type ScenarioStep = {
  step: string;
  label: string;
  copy: string;
  /** The screen this step introduces, if any. */
  screen?: Screen;
};

export const SCENARIO_NOTE = "Sample scenario · illustrative data";

export const SCENARIO: ScenarioStep[] = [
  {
    step: "01",
    label: "Problem",
    copy: "Smoke in a storage bay, after hours. Nobody is watching that camera feed.",
  },
  {
    step: "02",
    label: "AI detects",
    copy: "Yisbir flags smoke on the existing camera.",
    screen: SCREENS.yisbirFireSmokePoster,
  },
  {
    step: "03",
    label: "Automation acts",
    copy: "The duty team gets the alert, the clip and a task.",
    screen: SCREENS.yisbirAlerts,
  },
  {
    step: "04",
    label: "Dashboard shows",
    copy: "Every event, by zone and hour.",
    screen: SCREENS.yisbirPpeWall,
  },
  {
    step: "05",
    label: "Business outcome",
    copy: "A response that starts with the evidence. And one record, first frame to closure, that your auditors can follow.",
  },
];
