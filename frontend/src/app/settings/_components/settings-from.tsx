"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { inputFields } from "./data";
import { settingsApi } from "@/api/settingsApi";
import { GameSettings } from "@/components/types";

/** Application balance with its lower threshold */
interface AppBalanceData {
  amount: number;
  balanceAmountUpdatedAt: string;
  balanceAmountAdminIdUpdatedBy: number;
  balanceAmountAdminLoginUpdatedBy: string;
  lowerThreshold: number;
  lowerThresholdUpdatedAt: string;
  lowerThresholdAdminIdUpdatedBy: number;
  lowerThresholdAdminLoginUpdatedBy: string;
}

/** Form to edit the game settings and the lower threshold of the application balance */
export function SettingsForm() {
  const [formData, setFormData] = useState(
    inputFields.reduce<Record<string, any>>((acc, section) => {
      section.fields.forEach(({ name, defaultValue }) => {
        acc[name] = defaultValue;
      });
      return acc;
    }, {}),
  );
  const [balanceData, setBalanceData] = useState<AppBalanceData | null>(null);
  const [lowerThreshold, setLowerThreshold] = useState<number | "">("");

  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const data: GameSettings = await settingsApi.getSettingsList();

        setFormData((prevData) =>
          Object.fromEntries(
            Object.entries(prevData).map(([key, defaultValue]) => [
              key,
              data[key as keyof GameSettings] !== undefined
                ? String(data[key as keyof GameSettings])
                : defaultValue,
            ]),
          ),
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Request failed:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await settingsApi.getAppBalance();
        setBalanceData(data);
      } catch (error) {
        console.error("Failed to load the balance:", error);
      }
    };

    fetchBalance();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: GameSettings = {
      id: 1,
      ...Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          parseFloat(value),
        ]),
      ),
    } as unknown as GameSettings;

    try {
      await settingsApi.editSettings(payload);
      toast.success("Settings updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleSubmitThreshold = async (e: React.FormEvent) => {
    e.preventDefault();

    const lowerThreshold = balanceData?.lowerThreshold;

    if (
      lowerThreshold === undefined ||
      lowerThreshold === null ||
      lowerThreshold < 0
    ) {
      alert("Enter a valid threshold value");
      return;
    }

    try {
      const updated = await settingsApi.updateThreshold(lowerThreshold);
      alert("Threshold updated");
    } catch (err) {
      alert("Failed to update the threshold");
      console.error(err);
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <ShowcaseSection title="Settings">
        <form onSubmit={handleSubmit}>
          {inputFields.map((section, index) => (
            <div key={section.title} className="flex-column">
              <div className="mb-2.5 mt-2.5">
                <p>{section.title}</p>
              </div>
              <div className="mb-5.5 flex flex-row gap-3.5 sm:flex-row">
                {section.fields.map(({ name, label, placeholder }) => (
                  <InputGroup
                    key={name}
                    className="w-full sm:w-1/2"
                    type="number"
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    value={formData[name] || ""}
                    handleChange={handleChange} // onChange added
                    height="sm"
                  />
                ))}
              </div>
              {index !== inputFields.length - 1 && <hr />}
            </div>
          ))}
          <div className="mt-4 flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </ShowcaseSection>

      <div style={{ marginTop: "50px" }}>
        <ShowcaseSection title="Application balance">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 flex flex-col">
              <label
                className="mb-2 text-sm font-semibold"
                htmlFor="lowerThreshold"
              >
                Lower balance threshold
              </label>
              <InputGroup
                type="number"
                className="w-full sm:w-1/2"
                label="Enter the lower threshold"
                placeholder="Enter the lower threshold"
                value={balanceData?.lowerThreshold ?? ""}
                handleChange={(e) => {
                  const val = e.target.value;
                  setBalanceData((prev) =>
                    prev
                      ? {
                          ...prev,
                          lowerThreshold: val === "" ? 0 : Number(val),
                        }
                      : null,
                  );
                }}
                height="sm"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleSubmitThreshold}
                className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              >
                Save
              </button>
            </div>
          </form>
        </ShowcaseSection>
      </div>
    </div>
  );
}
