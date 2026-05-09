'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

// Approximate hex for oklch(0.66 0.12 194) — site accent teal
const ACCENT = '#3ecfca';
const ARC_COLOR_START = `${ACCENT}99`;
const ARC_COLOR_END = `${ACCENT}22`;

type ArcDatum = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  animateTime: number;
  initialGap: number;
};

type PointDatum = {
  lat: number;
  lng: number;
};

function makeArcs(n: number): ArcDatum[] {
  return Array.from({ length: n }, () => ({
    startLat: (Math.random() - 0.5) * 180,
    startLng: (Math.random() - 0.5) * 360,
    endLat: (Math.random() - 0.5) * 180,
    endLng: (Math.random() - 0.5) * 360,
    animateTime: 4000 + Math.random() * 5000, // 4s–9s, each arc different
    initialGap: Math.random(),                // stagger so pulses don't sync up
  }));
}

function makePoints(n: number): PointDatum[] {
  return Array.from({ length: n }, () => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
  }));
}

export default function NetworkGlobe() {
  const globeEl = useRef<any>(null);
  const [arcs] = useState<ArcDatum[]>(() => makeArcs(20));
  const [points] = useState<PointDatum[]>(() => makePoints(50));

  useEffect(() => {
    let controls: any = null;

    // After the user releases the globe, resume rotation after a short pause
    const onDragEnd = () => {
      setTimeout(() => { if (controls) controls.autoRotate = true; }, 1500);
    };

    const timer = setTimeout(() => {
      const globe = globeEl.current;
      if (!globe?.controls) return;
      controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.25;
      controls.enableZoom = false;
      controls.addEventListener('end', onDragEnd);



    }, 300);

    return () => {
      clearTimeout(timer);
      if (controls) controls.removeEventListener('end', onDragEnd);
    };
  }, []);

  return (
    <div className="globe-wrap">
      <Globe
        ref={globeEl}
        width={500}
        height={500}
        globeImageUrl={null}
        backgroundColor="rgba(0,0,0,0)"
        showGraticules
        showAtmosphere
        atmosphereColor={ACCENT}
        atmosphereAltitude={0.2}
        arcsData={arcs}
        arcStartLat="startLat"
        arcStartLng="startLng"
        arcEndLat="endLat"
        arcEndLng="endLng"
        arcColor={() => [ARC_COLOR_START, ARC_COLOR_END]}
        arcDashLength={0.25}
        arcDashGap={0.85}
        arcDashInitialGap={(arc: any) => arc.initialGap}
        arcDashAnimateTime={(arc: any) => arc.animateTime}
        arcStroke={0.4}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => ACCENT}
        pointAltitude={0.01}
        pointRadius={0.35}
        enablePointerInteraction
      />
    </div>
  );
}
