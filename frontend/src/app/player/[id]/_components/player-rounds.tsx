import { PlayerRoundsTable } from "@/components/Tables/player-rounds";
import { PlayerData } from "@/components/types";

interface PlayerRoundsProps {
  data: PlayerData; // Ожидаем, что пропс будет с именем 'data' и типом 'PlayerData'
}

const PlayerRounds = ({ data }: PlayerRoundsProps) => {
  if (!data) {
    return <div></div>;
  }
  return (
    <>
      <div className="mt-10 space-y-10">
        <PlayerRoundsTable data={data} />
      </div>
    </>
  );
};

export default PlayerRounds;
