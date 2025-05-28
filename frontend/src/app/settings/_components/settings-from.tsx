"use client";
import InputGroup from "@/components/FormElements/InputGroup";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { inputFields } from "./data";
import { settingsApi } from "@/api/settingsApi";
import { GameSettings } from "@/components/types";

export function SettingsForm() {
  const [formData, setFormData] = useState(
    inputFields.reduce<Record<string, any>>((acc, section) => {
      section.fields.forEach(({ name, defaultValue }) => {
        acc[name] = defaultValue;
      });
      return acc;
    }, {}),
  );
  const [lowerThreshold, setLowerThreshold] = useState("");
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
        console.error("Ошибка запроса:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: GameSettings = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, parseFloat(value)]),
    ) as unknown as GameSettings;

    try {
      await settingsApi.editSettings(payload);
      toast.success("Настройки обновлены");
    } catch (err) {
      toast.error("Ошибка при обновлении");
    }
  };

  if (isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <ShowcaseSection title="Настройки">
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
                    handleChange={handleChange} // Добавлен onChange
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
              Отменить
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
            >
              Сохранить
            </button>
          </div>
        </form>
      </ShowcaseSection>

      <div style={{ marginTop: "50px" }}>
        <ShowcaseSection title="Баланс приложения">
          <form action="">
            <div key="Порог" className="flex-column">
              <div className="mb-2.5 mt-2.5">
                <p>Тайтл</p>
              </div>
              <div className="mb-5.5 flex flex-row gap-3.5 sm:flex-row">
                <InputGroup
                  key="Порог"
                  className="w-full sm:w-1/2"
                  type="number"
                  name="Нижний порог баланса"
                  label="Нижний порог баланса"
                  placeholder="Нижний порог баланса"
                  value={lowerThreshold}
                  handleChange={(e) => setLowerThreshold(e.target.value)}
                  height="sm"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
                type="button"
              >
                Отменить
              </button>

              <button
                className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                type="submit"
              >
                Сохранить
              </button>
            </div>
          </form>
        </ShowcaseSection>
      </div>
    </div>
  );
}
