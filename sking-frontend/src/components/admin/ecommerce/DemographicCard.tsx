"use client";
import Image from "next/image";
import CountryMap from "./CountryMap";
import { useEffect, useState, useMemo } from "react";
import { MoreDotIcon } from "@/icons";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { adminDashboardApiService, DemographicData, StateDemographic } from "@/services/admin/adminDashboardApiService";
import { Modal } from "../ui/modal";

export default function DemographicCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [demographics, setDemographics] = useState<DemographicData[]>([]);
  const [stateDemographics, setStateDemographics] = useState<StateDemographic[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapType, setMapType] = useState<"world" | "india">("india");

  useEffect(() => {
    const fetchDemographics = async () => {
      try {
        const data = await adminDashboardApiService.getDashboardStats();
        setDemographics(data.demographics || []);
        setStateDemographics(data.stateDemographics || []);
      } catch (error) {
        console.error("Error fetching demographics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDemographics();
  }, []);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const openModal = () => {
    setIsModalOpen(true);
    closeDropdown();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const switchMap = (type: "world" | "india") => {
    setMapType(type);
    closeDropdown();
  };

  // Memoize map data based on active switch
  const activeMapData = useMemo(() => {
    if (mapType === "world") {
      return demographics.map(d => ({
        code: d.code || "",
        name: d.country,
        value: d.orderCount
      }));
    } else {
      return stateDemographics.map(s => ({
        code: s.code || "",
        name: s.state,
        value: s.orderCount
      }));
    }
  }, [mapType, demographics, stateDemographics]);

  /**
   * Helper to get a live flag URL from FlagCDN
   */
  const getFlag = (countryName: string) => {
    if (!countryName) return "https://flagcdn.com/w80/un.png";
    const name = countryName.toLowerCase().trim();
    const mapping: Record<string, string> = {
      "india": "in", "usa": "us", "united states": "us", "uk": "gb", "france": "fr",
      "canada": "ca", "germany": "de", "china": "cn", "japan": "jp", "uae": "ae"
    };
    const code = mapping[name] || "un";
    return `https://flagcdn.com/w80/${code}.png`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      <div className="flex justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Orders Demographic
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Current view: <span className="capitalize text-brand-500 font-medium">{mapType} Heatmap</span>
          </p>
        </div>

        <div className="relative inline-block">
          <button onClick={toggleDropdown} className="dropdown-toggle">
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
          </button>
          <Dropdown
            isOpen={isOpen}
            onClose={closeDropdown}
            className="w-40 p-2"
          >
            <DropdownItem
              onItemClick={() => switchMap(mapType === "india" ? "world" : "india")}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Switch to {mapType === "india" ? "World" : "India"}
            </DropdownItem>
            <DropdownItem
              onItemClick={openModal}
              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 border-t border-gray-100 dark:border-gray-800 mt-1 pt-2"
            >
              Full Statistics
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      <div className="px-4 py-6 my-6 overflow-hidden border border-gary-200 rounded-2xl bg-gray-50 dark:border-gray-800 dark:bg-gray-900 sm:px-6">
        <div
          id="mapOne"
          className="mapOne map-btn -mx-4 -my-6 h-[212px] w-[252px] 2xsm:w-[307px] xsm:w-[358px] sm:-mx-6 md:w-[668px] lg:w-[634px] xl:w-[393px] 2xl:w-[554px]"
        >
          <CountryMap type={mapType} data={activeMapData} />
        </div>
      </div>

      <div className="space-y-5">
        {loading ? (
          <div className="py-4 text-center text-gray-500">Loading demographics...</div>
        ) : demographics.length === 0 ? (
          <div className="py-4 text-center text-gray-500">No order data available.</div>
        ) : (
          demographics.slice(0, 3).map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-100 flex-shrink-0">
                  <Image
                    fill
                    src={getFlag(item.country)}
                    alt={item.country}
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {item.country}
                  </p>
                  <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                    {item.orderCount.toLocaleString()} {item.orderCount === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>
              </div>

              <div className="flex w-full max-w-[140px] items-center gap-3">
                <div className="relative block h-2 w-full max-w-[100px] rounded-sm bg-gray-200 dark:bg-gray-800">
                  <div
                    className="absolute left-0 top-0 h-full rounded-sm bg-brand-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {Math.round(item.percentage)}%
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View More Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} className="max-w-[500px] p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white/90">
            Full Demographic Breakdown
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Current Analysis: {mapType === "india" ? "State-wise (India)" : "Country-wise (Global)"}
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
          {(mapType === "india" ? stateDemographics : demographics).map((item, index) => (
            <div key={index} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-100 flex-shrink-0 bg-gray-50">
                  {mapType === "world" ? (
                    <Image
                      fill
                      src={getFlag((item as DemographicData).country)}
                      alt={(item as DemographicData).country}
                      className="object-cover"
                      unoptimized={true}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-[10px] font-bold text-brand-500">
                      {(item as StateDemographic).code?.split('-')[1]}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-white/90">
                    {mapType === "india" ? (item as StateDemographic).state : (item as DemographicData).country}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.orderCount.toLocaleString()} total orders
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 min-w-[100px]">
                <span className="text-sm font-bold text-brand-500">
                  {item.percentage.toFixed(1)}%
                </span>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
