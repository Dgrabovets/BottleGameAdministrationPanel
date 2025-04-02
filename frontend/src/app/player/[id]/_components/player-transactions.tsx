import { PlayerTransactionsTable } from "@/components/Tables/player-transactions";
import { PlayerData } from "@/components/types";

interface PlayerTransactionsProps {
  data: PlayerData;
}

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
