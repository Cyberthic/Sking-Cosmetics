import React from "react";
import { worldMill } from "@react-jvectormap/world";
import { inMill } from "@react-jvectormap/india";
import dynamic from "next/dynamic";

const VectorMap = dynamic(
  () => import("@react-jvectormap/core").then((mod) => mod.VectorMap),
  { ssr: false }
);

interface CountryMapProps {
  mapColor?: string;
  type?: "world" | "india";
}

type MarkerStyle = {
  initial: {
    fill: string;
    r: number;
  };
};

type Marker = {
  latLng: [number, number];
  name: string;
  style?: {
    fill: string;
    borderWidth: number;
    borderColor: string;
    stroke?: string;
    strokeOpacity?: number;
  };
};

const CountryMap: React.FC<CountryMapProps> = ({ mapColor, type = "world" }) => {
  const mapData = type === "india" ? inMill : worldMill;

  const worldMarkers: Marker[] = [
    {
      latLng: [37.2580397, -104.657039],
      name: "United States",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    },
    {
      latLng: [20.7504374, 73.7276105],
      name: "India",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    },
    {
      latLng: [53.613, -11.6368],
      name: "United Kingdom",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    }
  ];

  const indiaMarkers: Marker[] = [
    {
      latLng: [28.6139, 77.2090], // New Delhi
      name: "New Delhi",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    },
    {
      latLng: [19.0760, 72.8777], // Mumbai
      name: "Mumbai",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    },
    {
      latLng: [12.9716, 77.5946], // Bangalore
      name: "Bangalore",
      style: { fill: "#465FFF", borderWidth: 1, borderColor: "white" },
    }
  ];

  return (
    <VectorMap
      map={mapData}
      key={type} // Force re-render when switching maps
      backgroundColor="transparent"
      markerStyle={
        {
          initial: {
            fill: "#465FFF",
            r: type === "india" ? 5 : 4,
          },
        } as MarkerStyle
      }
      markersSelectable={true}
      markers={type === "india" ? indiaMarkers : worldMarkers}
      zoomOnScroll={false}
      zoomMax={12}
      zoomMin={1}
      zoomAnimate={true}
      zoomStep={1.5}
      regionStyle={{
        initial: {
          fill: mapColor || "#D0D5DD",
          fillOpacity: 1,
          fontFamily: "Outfit",
          stroke: "none",
          strokeWidth: 0,
          strokeOpacity: 0,
        },
        hover: {
          fillOpacity: 0.7,
          cursor: "pointer",
          fill: "#465fff",
          stroke: "none",
        },
        selected: {
          fill: "#465FFF",
        },
        selectedHover: {},
      }}
    />
  );
};

export default CountryMap;
