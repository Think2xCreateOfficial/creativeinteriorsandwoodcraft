"use client";

import { useEffect, useLayoutEffect } from "react";

/** useLayoutEffect on the client, useEffect during SSR (avoids hydration warnings). */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
