import { PlayerRoundsTable } from "@/components/Tables/player-rounds";
import { PlayerData } from "@/components/types";

/** Props of the rounds block of the player page */
interface PlayerRoundsProps {
  data: PlayerData; // The prop is expected to be named 'data' and typed 'PlayerData'
}

/** Rounds block of the player page */
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
