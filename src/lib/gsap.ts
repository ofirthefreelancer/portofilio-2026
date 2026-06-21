"use client";

// Single place that registers GSAP plugins, so components don't each repeat it.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin };
