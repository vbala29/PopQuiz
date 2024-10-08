import Guess from "@/app/multiplayer/[code]/components/GameBoard/GuessBoard/Guess";
import { Guess as GuessType, TileCount } from "../GameBoard";

type Props = {
  guessInfo: [GuessType, TileCount][];
};

export const GUESSES_ALLOWED = 3;

export default function GuessBoard({ guessInfo }: Props) {
  return (
    <>
      {
        guessInfo.map(([population, tilesToFill], index) => (
            <Guess key={index} population={population} tilesToFill={tilesToFill} />
        ))
      }
      {(() => {
            if (guessInfo.length < GUESSES_ALLOWED) {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-fit py-1 mt-1 mb-3 mx-1">
                        Guess {guessInfo.length + 1} / {GUESSES_ALLOWED}
                        </div>
                    </div>
                </>
                );
            } else {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-fit py-1 mt-1 mb-3 mx-1">
                        No Guesses Remaining
                        </div>
                    </div>
                </>
                );
            }
        })()
      }
    </>
  );
}
