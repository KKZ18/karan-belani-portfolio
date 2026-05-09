'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
});

// Approximate hex for oklch(0.66 0.12 194)
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

function makeArcs(points: PointDatum[], n: number): ArcDatum[] {
  return Array.from({ length: n }, () => {
    const start = points[Math.floor(Math.random() * points.length)];
    const end = points[Math.floor(Math.random() * points.length)];

    return {
      startLat: start.lat,
      startLng: start.lng,
      endLat: end.lat,
      endLng: end.lng,
      animateTime: 4000 + Math.random() * 5000,
      initialGap: Math.random(),
    };
  });
}

function makePoints(n: number): PointDatum[] {
  return Array.from({ length: n }, () => ({
    lat: (Math.random() - 0.5) * 180,
    lng: (Math.random() - 0.5) * 360,
  }));
}

export default function NetworkGlobe() {
  const globeEl = useRef<any>(null);

  const [mounted, setMounted] = useState(false);

  const [points] = useState<PointDatum[]>(() => makePoints(50));

  const [arcs] = useState<ArcDatum[]>(() => makeArcs(points, 20));

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timeout = setTimeout(() => {
      if (!globeEl.current) return;

      const controls = globeEl.current.controls();

      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.5;

      controls.enableZoom = false;
      controls.enablePan = false;

      controls.update();

      const onDragStart = () => {
        controls.autoRotate = false;
      };

      const onDragEnd = () => {
        setTimeout(() => {
          controls.autoRotate = true;
          controls.update();
        }, 1500);
      };

      controls.addEventListener('start', onDragStart);
      controls.addEventListener('end', onDragEnd);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="globe-wrap">
      <Globe
        ref={globeEl}
        width={500}
        height={500}
        animateIn={false}
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