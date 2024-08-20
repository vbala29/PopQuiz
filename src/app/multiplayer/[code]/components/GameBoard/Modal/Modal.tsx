import React, { useState, useEffect, act } from "react";
import { Guess, MAX_TILE_COUNT, TileCount } from "../GameBoard";
import styles from "../styles.module.css";
import {
  Points,
  Score,
  UserName,
  MultiplayerGame,
  SCORE_INFO_BODY,
} from "../../../../../../../socket-types";
import { DailyInfo } from "@/lib/redis";

type Props = {
  gameOver: boolean;
  actualAnswer: Guess;
  clientAnswer: Guess;
  answerTileCount: TileCount;
  guessInfo: [Guess, TileCount][];
  openStartModal: boolean;
  setStartModal: (arg0: boolean) => void;
  openRoundStartModal: boolean;
  roundNumber: number;
  openRoundEndModal: boolean;
  openScoreModal: boolean;
  participants: MultiplayerGame;
  sortedRoundResults: SCORE_INFO_BODY;
  countryInfo: DailyInfo;
};

export default function Modal({
  gameOver,
  actualAnswer,
  clientAnswer,
  answerTileCount,
  guessInfo,
  openStartModal,
  setStartModal,
  openRoundStartModal,
  roundNumber,
  openRoundEndModal,
  openScoreModal,
  participants,
  sortedRoundResults,
  countryInfo,
}: Props) {
  const [openModal, setModal] = useState(false);

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    setModal(gameOver);
  }, [gameOver]);

  const copyResults = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const year = now.getFullYear();

    let guessesOutput = "";
    for (let [_, tileCount] of guessInfo) {
      guessesOutput += "🟩".repeat(tileCount);
      guessesOutput += "⬜️".repeat(MAX_TILE_COUNT - tileCount);
      guessesOutput += "\n";
    }

    navigator.clipboard.writeText(
      `PopQuiz™ (${month}/${day}/${year})\n` +
        `${
          answerTileCount === MAX_TILE_COUNT ? guessInfo.length : "X"
        }/${MAX_TILE_COUNT} ` +
        `(${(100 * (clientAnswer / actualAnswer)).toFixed(2)}%)\n` +
        `${guessesOutput}`
    );
  };

  let roundResults: [UserName, Score, Points, Guess, TileCount][] = (() => {
    let output: [UserName, Score, Points, Guess, TileCount][] = [];
    for (const i of sortedRoundResults) {
      const [name, score]: [UserName, Score] = i;
      const points: Points = participants[name].points;
      const [guess, tileCount]: [Guess, TileCount] =
        participants[name].guessInfo;
      output.push([name, score, points, guess, tileCount]);
    }
    return output;
  })();

  let roundResultsJsx: JSX.Element[] = roundResults.map((res, i) => {
    let [name, score, points, guess, tileCount]: [
      UserName,
      Score,
      Points,
      Guess,
      TileCount
    ] = res;
    let width = 2;
    let height = 2;
    return (
      <tr key={i} className="text-sm">
        <td className="text-center">
          <b>(+{score})</b> <span className="text-green-500">{name}</span>
        </td>
        <td>
          <div className="flex text-sm *:items-center justify-center">
            <div className="flex mr-2">
              {[...Array(MAX_TILE_COUNT)].map((_, i) => {
                if (i < tileCount) {
                  return (
                    <div
                      key={i}
                      className={`bg-grey w-${width} h-${height} mx-2 ${styles.flip}`}
                      style={{
                        animationDelay: `${(i + 1) * 100}ms`,
                        height: height * 4,
                        width: width * 4,
                      }}
                    ></div>
                  );
                } else {
                  return (
                    <div
                      key={i}
                      className={`bg-grey w-${width} h-${height} mx-2`}
                      style={{ height: height * 4, width: width * 4 }}
                    ></div>
                  );
                }
              })}
            </div>
            <div className="ml-2">{guess.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
          </div>
        </td>
        <td className="text-center">
          <b>{points}</b>
        </td>
      </tr>
    );
  });

  const width = 5;
  const height = 5;

  return (
    <>
      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-50 z-30"
            onClick={closeModal}
          ></div>

          <div className="fixed inset-0 flex px-4 z-30 items-center justify-center font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex p-2 font-mono">
                <button
                  onClick={closeModal}
                  className="bg-night hover:shadow-lg shadow-grey text-white w-8 h-8 ml-1 mr-6 my-1 rounded-md hover:bg-blue-600"
                >
                  X
                </button>
                <div className="flex flex-col p-4">
                  <h2 className="text-lg font-semibold">
                    {answerTileCount === MAX_TILE_COUNT
                      ? "Winner!"
                      : "Try Again Tomorrow!"}
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Your Answer:{" "}
                    {clientAnswer
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <br />
                    Actual Answer:{" "}
                    {actualAnswer
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                  <div className="mt-4 text-blue">
                    <b> Result</b>
                    <div className="flex text-sm *:items-center justify-center m-2">
                      <div className="mr-1">
                        {`${
                          answerTileCount === MAX_TILE_COUNT
                            ? guessInfo.length
                            : "X"
                        }/${MAX_TILE_COUNT} (${(
                          100 *
                          (clientAnswer / actualAnswer)
                        ).toFixed(2)}%)`}
                      </div>
                      {[...Array(MAX_TILE_COUNT)].map((_, i) => {
                        if (i < answerTileCount) {
                          return (
                            <div
                              key={i}
                              className={`bg-grey w-${width} h-${height} mx-2 ${styles.flip}`}
                              style={{
                                animationDelay: `${(i + 1) * 100}ms`,
                                height: height * 4,
                                width: width * 4,
                              }}
                            ></div>
                          );
                        } else {
                          return (
                            <div
                              key={i}
                              className={`bg-grey w-${width} h-${height} mx-2`}
                              style={{ height: height * 4, width: width * 4 }}
                            ></div>
                          );
                        }
                      })}
                    </div>
                    <button
                      onClick={copyResults}
                      className="bg-blue hover:shadow-lg shadow-blue text-white rounded-md w-32 h-8 mt-3 px-2 text-sm"
                    >
                      <b>Copy Results</b>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {openStartModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-30"></div>
          <div className="z-30 flex px-4 items-center justify-center inset-0 absolute font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg font-semibold">Get Ready!</h2>
                <p className="mt-2 text-gray-600">
                  Click start once everyone has joined.
                </p>
                <div className="mt-2 text-blue">
                  <button
                    className="bg-blue hover:shadow-lg shadow-blue text-white rounded-md w-32 h-8 mt-3 px-2 text-sm"
                    onClick={() => setStartModal(false)}
                  >
                    <b>Start</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {openRoundStartModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-20"></div>
          <div className="z-20 flex px-4 items-center justify-center inset-0 absolute font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg font-semibold">
                  Round {roundNumber} is about to start!
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
      {openRoundEndModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-20"></div>
          <div className="z-20 flex px-4 items-center justify-center inset-0 absolute font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-md font-semibold">
                  Round {roundNumber} has ended! Calculating scores...
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
      {openScoreModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-10"></div>
          <div className="z-10 flex px-4 items-center justify-center inset-0 absolute font-mono">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg text-black bg-yellow-500 rounded-md font-semibold text-center mb-1">
                  Round {roundNumber} Results!
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Guess</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>{roundResultsJsx}</tbody>
                </table>
                <div className="mt-4 text-center text-blue">
                  {countryInfo.country}'s population is{" "}
                  {countryInfo.population
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
