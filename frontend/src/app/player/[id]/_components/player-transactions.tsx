import { PlayerTransactionsTable } from "@/components/Tables/player-transactions";
import { PlayerData } from "@/components/types";

/** Props of the transactions block of the player page */
interface PlayerTransactionsProps {
  data: PlayerData;
}

/** Transactions block of the player page */
const PlayerTransactions = ({ data }: PlayerTransactionsProps) => {
  if (!data) {
    return <div></div>;
  }
  return (
    <>
      <div className="mt-10 space-y-10">
        <PlayerTransactionsTable data={data} />
      </div>
    </>
  );
};

export default PlayerTransactions;
