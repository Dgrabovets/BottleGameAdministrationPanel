"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import PlayerRounds from "./_components/player-rounds";
import InputGroup from "@/components/FormElements/InputGroup";
import { UserIcon } from "@/assets/icons";
import { PlayerData, Transaction } from "@/components/types";
import { useEffect, useState } from "react";
import { playersApi } from "@/api/playersApi";
import PlayerTransactions from "./_components/player-transactions";
import PlayerRefferal from "./_components/player-refferal";

export default function SettingsPage() {
  const { id } = useParams();
  const idString = Array.isArray(id) ? id[0] : id;
  const idNumber = idString ? parseInt(idString, 10) : undefined;
  const [data, setData] = useState<PlayerData>();
  const [transactionsData, setTransactionsData] = useState<PlayerData>();

  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [winChance, setWinChance] = useState<number>(0);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        setUserRole(user.role);
      } catch (err) {
        console.error("Ошибка при разборе user", err);
      }
    }

    const fetchUsers = async () => {
      try {
        if (idNumber) {
          const response = await playersApi.getPlayerDetails(idNumber);
          setData(response);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchTransactions = async () => {
      try {
        if (idNumber) {
          const response = await playersApi.getPlayerTransactions(idNumber);
          setTransactionsData(response);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (data) {
      setName(data.player.name);
      setBalance(String(data.balance));
      setAvatarUrl(data.player.avatarUrl);
      setWinChance(data?.options?.winChance ?? 0);
    }
  }, [data]);

  const onPlayerUpdate = async () => {
    try {
      if (idNumber) {
        await playersApi.editPlayer(idNumber, name, avatarUrl, winChance);

        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!data) {
    return <div></div>;
  }

  const isDisabled = userRole !== "Admin";

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName={`Пользователь №${id}`} />

      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <ShowcaseSection title="Информация пользователя" className="!p-7">
            <form>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <InputGroup
                  className="w-full sm:w-1/2"
                  type="text"
                  name="fullName"
                  label="Имя пользователя"
                  placeholder="Имя пользователя"
                  value={name}
                  handleChange={(e) => setName(e.target.value)}
                  icon={<UserIcon />}
                  iconPosition="left"
                  disabled={isDisabled}
                  height="sm"
                />
                <InputGroup
                  className="w-full sm:w-1/2"
                  type="url"
                  name="profileImgUrl"
                  placeholder="Ссылка на аватар пользователя"
                  label="Аватар пользователя"
                  value={avatarUrl}
                  handleChange={(e) => setAvatarUrl(e.target.value)}
                  disabled={isDisabled}
                  height="sm"
                />
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <InputGroup
                  className="w-full sm:w-1/2"
                  type="number"
                  name="profileImgUrl"
                  placeholder="Шанс выигрыша пользователя"
                  label="Шанс выигрыша"
                  value={winChance}
                  handleChange={(e) => setWinChance(Number(e.target.value))}
                  disabled={isDisabled}
                  height="sm"
                />
              </div>
              <div className="flex justify-end gap-3">
                {!isDisabled && (
                  <button
                    className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                    type="button"
                    onClick={() => onPlayerUpdate()}
                  >
                    Сохранить
                  </button>
                )}
              </div>
            </form>
          </ShowcaseSection>
        </div>
      </div>
      <PlayerRounds data={data} />
      {transactionsData && <PlayerTransactions data={transactionsData} />}
      <PlayerRefferal data={data} />
    </div>
  );
}
