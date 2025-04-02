import { PlayerRefferalTable } from "@/components/Tables/player-refferal";
import { PlayerData } from "@/components/types";

interface PlayerRefferalProps {
  data: PlayerData; // Ожидаем, что пропс будет с именем 'data' и типом 'PlayerData'
}

const PlayerRefferal = ({ data }: PlayerRefferalProps) => {
  if (!data) {
    return <div></div>;
  }
  return (
    <>
      <div className="mt-10 space-y-10">
        <PlayerRefferalTable data={data} />
      </div>
    </>
  );
};

export default PlayerRefferal;
