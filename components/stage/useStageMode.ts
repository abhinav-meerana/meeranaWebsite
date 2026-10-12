"use client";

import { useCallback, useEffect, useState } from "react";
import { MQ } from "@/lib/breakpoints";

/* ============================================================================
   Which layout the product story uses (FINAL-SPEC §4.1).

     pending  server HTML and before hydration: rail styles, or list styles
              when <html data-view="list"> was set before first paint
     stage    MQ.stage and list view not chosen: the scrubbed horizontal film.
              ProductStage writes data-mode="stage" only once GSAP has built,
              so a failed import leaves the page in the rail.
     rail     everything else with height ≥500: touch, <1024 wide, 500–519
              tall, reduced motion. A native horizontal snap rail.
     list     ≤499 tall (CSS alone handles it before hydration), the List
              view toggle (stored), or print.

   Every storage access is wrapped: a private window or blocked storage must
   never break the page, it only forgets the choice.
   ========================================================================== */

export type StageMode = "pending" | "stage" | "rail" | "list";

const VIEW_KEY = "meerana:view";

/** Media-query state the stage and the dock both need. */
type Env = { reduced: boolean; coarse: boolean; autoList: boolean };

export function useStageMode() {
  const [mode, setMode] = useState<StageMode>("pending");
  const [list, setList] = useState(false);
  const [env, setEnv] = useState<Env>({ reduced: false, coarse: false, autoList: false });

  useEffect(() => {
    try {
      setList(localStorage.getItem(VIEW_KEY) === "list");
    } catch {
      /* storage blocked: the default view */
    }
  }, []);

  useEffect(() => {
    const st = window.matchMedia(MQ.stage);
    const lo = window.matchMedia(MQ.listOnly);
    const rd = window.matchMedia(MQ.reduced);
    const fp = window.matchMedia(MQ.finePointer);
    const decide = () => {
      setMode(list || lo.matches ? "list" : st.matches ? "stage" : "rail");
      setEnv((e) =>
        e.reduced === rd.matches && e.coarse === !fp.matches && e.autoList === lo.matches
          ? e
          : { reduced: rd.matches, coarse: !fp.matches, autoList: lo.matches },
      );
    };
    decide();
    const all = [st, lo, rd, fp];
    all.forEach((m) => m.addEventListener("change", decide));
    return () => all.forEach((m) => m.removeEventListener("change", decide));
  }, [list]);

  const setListView = useCallback((v: boolean) => {
    setList(v);
    try {
      localStorage.setItem(VIEW_KEY, v ? "list" : "deck");
    } catch {
      /* not remembered, still applied */
    }
    try {
      if (v) document.documentElement.dataset.view = "list";
      else delete document.documentElement.dataset.view;
    } catch {
      /* no document: nothing to mark */
    }
  }, []);

  return { mode, setListView, ...env };
}
