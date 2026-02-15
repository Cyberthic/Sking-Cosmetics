import React, { useMemo } from "react";
import { worldMill } from "@react-jvectormap/world";
import { inMill } from "@react-jvectormap/india";
import dynamic from "next/dynamic";

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);

interface MapStats {
  [key: string]: number;
}

interface CountryMapProps {
  mapColor?: string;
  type?: "world" | "india";
  data?: { code: string; name: string; value: number }[];
}

const CountryMap: React.FC<CountryMapProps> = ({ mapColor, type = "world", data = [] }) => {
  const mapData = type === "india" ? inMill : worldMill;

  // Prepare series data for heatmap
  const seriesData = useMemo(() => {
    const stats: MapStats = {};
    data.forEach((item) => {
      if (item.code) {
        stats[item.code] = item.value;
      }
    });
    return stats;
  }, [data]);

  return (
    <div className="w-full h-full">
      <VectorMap
        map={mapData}
        key={type} // Force re-render when switching maps
        backgroundColor="transparent"
        zoomOnScroll={false}
        zoomMax={8}
        zoomMin={1}
        zoomAnimate={true}
        zoomStep={1.5}
        regionStyle={{
          initial: {
            fill: mapColor || "#E5E7EB",
            fillOpacity: 1,
            stroke: "#FFFFFF",
            strokeWidth: 0.5,
          },
          hover: {
            fillOpacity: 0.8,
            cursor: "pointer",
          },
        }}
        series={{
          regions: [
            {
              values: seriesData,
              scale: ["#E0E7FF", "#465FFF"], // Light to Brand color
              normalizeFunction: "polynomial",
              attribute: "fill",
            },
          ],
        }}
        onRegionTipShow={(_e: any, el: any, code: string) => {
          // Robust lookup for the code (try exact, then upper, then normalized name)
          const value = seriesData[code] || seriesData[code.toUpperCase()] || 0;
          const name = el.html();
          el.html(
            `<div style="background-color: #111827; color: white; padding: 8px; border-radius: 6px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); font-size: 12px; line-height: 1;">
              <span style="font-weight: bold; display: block; margin-bottom: 4px;">${name}</span>
              <span>${value.toLocaleString()} Orders</span>
            </div>`
          );
        }}
      />
    </div>
  );
};

export default CountryMap;
