import { PlayerRefferalTable } from "@/components/Tables/player-refferal";
import { PlayerData } from "@/components/types";

/** Props of the referral block of the player page */
interface PlayerRefferalProps {
  data: PlayerData; // The prop is expected to be named 'data' and typed 'PlayerData'
}

/** Referral block of the player page */
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
