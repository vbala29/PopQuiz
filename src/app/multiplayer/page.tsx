import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>

      <main className="min-h-screen bg-night">
        <div className="flex font-mono">
          <div className="w-1/3"></div>

          <div className="w-1/3 flex-col justify-center bg-black mx-3.5 mt-10 rounded-md font-mono">
            <h1 className="text-white text-xl my-7 text-center">
              <b>Welcome to Multiplayer!</b>
            </h1>

            <div className="flex text-center">
              <a
                href="/multiplayer/create"
                className="bg-blue w-1/2 text-white text-sm rounded-md h-fit py-4 mx-3 my-0.5 hover:bg-night transition-colors duration-200"
              >
                <button>Create New Game</button>
              </a>

              <a
                href="/multiplayer/join"
                className="bg-blue w-1/2 text-white text-sm rounded-md h-fit py-4 mx-3 my-0.5 hover:bg-night transition-colors duration-200"
              >
                <button>Join Existing Game</button>
              </a>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-white text-lg mt-5 mb-3">
                <b>How To Play</b>
              </h2>
              <p className="text-sm text-white">
                1. Have friends. <br />
                2. Ask friends to play with you (see step one if FriendNotFound
                exception thrown). <br />
                3. Throw a tantrum if friends beat you. <br />
                4. After friends abandon you, return to step one.
              </p>
            </div>
          </div>

          <div className="w-1/3"></div>
        </div>
      </main>
    </>
  );
}
