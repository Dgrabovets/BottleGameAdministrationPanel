"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useParams } from "next/navigation";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import PlayerRounds from "./_components/player-rounds";
import InputGroup from "@/components/FormElements/InputGroup";
import { UserIcon } from "@/assets/icons";
import { PlayerData } from "@/components/types";
import { useSession } from "@/hooks/use-session";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  const [moderationLoading, setModerationLoading] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banError, setBanError] = useState<string | null>(null);
  const { session } = useSession();
  const userRole = session?.role ?? null;

  const loadPlayer = useCallback(async () => {
    if (!idNumber) return;

    try {
      const response = await playersApi.getPlayerDetails(idNumber);
      setData(response);
    } catch (err) {
      console.error(err);
    }
  }, [idNumber]);

  useEffect(() => {
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

    loadPlayer();
    fetchTransactions();
  }, [idNumber, loadPlayer]);

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

  const onBalanceUpdate = async () => {
    try {
      if (idNumber) {
        const balanceNum = parseFloat(balance.replace(",", "."));
        if (Number.isNaN(balanceNum)) return;
        await playersApi.editPlayerBalance(idNumber, balanceNum);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const closeBanModal = () => {
    setShowBanModal(false);
    setBanReason("");
    setBanError(null);
  };

  const onBanSubmit = async () => {
    if (!idNumber) return;

    const reason = banReason.trim();
    if (!reason) {
      setBanError("Укажите причину бана");
      return;
    }
    if (reason.length > 255) {
      setBanError("Причина не должна превышать 255 символов");
      return;
    }

    setModerationLoading(true);
    setBanError(null);
    try {
      await playersApi.banPlayer(idNumber, reason);
      closeBanModal();
      await loadPlayer();
    } catch (err) {
      console.error(err);
      setBanError("Не удалось забанить игрока");
    } finally {
      setModerationLoading(false);
    }
  };

  const onUnban = async () => {
    if (!idNumber) return;

    setModerationLoading(true);
    try {
      await playersApi.unbanPlayer(idNumber);
      await loadPlayer();
    } catch (err) {
      console.error(err);
    } finally {
      setModerationLoading(false);
    }
  };

  if (!data) {
    return <div></div>;
  }

  const isDisabled = userRole !== "Admin";
  const isBanned = data.bannedAt != null;

  return (
    <div className="mx-auto w-full max-w-[1080px]">
      <Breadcrumb pageName={`Пользователь №${id}`} />

      <div className="grid grid-cols-5 gap-8 xl:items-stretch">
        <div className="col-span-5 flex xl:col-span-3">
          <ShowcaseSection
            title="Информация пользователя"
            className="!p-7 flex w-full flex-col"
          >
            <form className="flex flex-1 flex-col">
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
              <div className="mt-auto flex justify-end gap-3">
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

        <div className="col-span-5 flex flex-col gap-8 xl:col-span-2">
          <ShowcaseSection
            title="Баланс"
            className="!p-7 flex flex-1 flex-col"
          >
            <div className="mb-5.5 flex-1">
              <InputGroup
                className="w-full"
                type="number"
                name="balance"
                label="Текущий баланс"
                placeholder="0.00"
                value={balance}
                handleChange={(e) => setBalance(e.target.value)}
                disabled={isDisabled}
                height="sm"
              />
            </div>
            {!isDisabled && (
              <div className="mt-auto flex justify-end">
                <button
                  className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
                  type="button"
                  onClick={onBalanceUpdate}
                >
                  Сохранить баланс
                </button>
              </div>
            )}
          </ShowcaseSection>

          {!isDisabled && (
            <ShowcaseSection
              title="Модерация"
              className="!p-7 flex flex-1 flex-col justify-center"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {isBanned ? (
                    <>
                      <span className="rounded-full bg-[#D34053]/[0.08] px-3 py-1 text-sm font-medium text-[#D34053]">
                        Забанен
                      </span>
                      <span className="text-sm text-dark-6">
                        с{" "}
                        {new Date(data.bannedAt!).toLocaleDateString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-dark-6">Статус: активен</span>
                  )}
                </div>

                {isBanned ? (
                  <button
                    type="button"
                    onClick={onUnban}
                    disabled={moderationLoading}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#219653] px-4 text-sm font-medium text-[#219653] transition hover:bg-[#219653]/[0.08]",
                      moderationLoading && "cursor-not-allowed opacity-50",
                    )}
                  >
                    Разбанить
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setShowBanModal(true);
                      setBanReason("");
                      setBanError(null);
                    }}
                    disabled={moderationLoading}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#D34053] px-4 text-sm font-medium text-[#D34053] transition hover:bg-[#D34053]/[0.08]",
                      moderationLoading && "cursor-not-allowed opacity-50",
                    )}
                  >
                    Забанить
                  </button>
                )}
              </div>
            </ShowcaseSection>
          )}
        </div>
      </div>

      <PlayerRounds data={data} />
      {transactionsData && <PlayerTransactions data={transactionsData} />}
      <PlayerRefferal data={data} />

      {showBanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-md rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
            role="dialog"
            aria-labelledby="ban-dialog-title"
          >
            <h3
              id="ban-dialog-title"
              className="mb-1 text-lg font-bold text-dark dark:text-white"
            >
              Забанить игрока
            </h3>
            <p className="mb-4 text-sm text-dark-6">
              {data.player.name} (ID {data.player.telegramId})
            </p>

            <label className="mb-2 block text-sm font-medium text-dark dark:text-white">
              Причина бана
            </label>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              rows={3}
              maxLength={255}
              className="mb-2 w-full rounded-lg border border-stroke bg-transparent px-4 py-2 text-sm text-dark outline-none focus:border-primary dark:border-dark-3 dark:text-white"
              placeholder="Опишите причину"
            />
            {banError && (
              <p className="mb-3 text-sm text-[#D34053]">{banError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeBanModal}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-stroke px-4 text-sm font-medium text-dark transition hover:bg-gray-2 dark:border-dark-3 dark:text-white"
              >
                Отмена
              </button>
              <button
                type="button"
                onClick={onBanSubmit}
                disabled={moderationLoading}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#D34053] px-4 text-sm font-semibold text-white transition hover:bg-[#D34053]/90 disabled:opacity-50"
              >
                Забанить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
