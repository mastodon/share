import { useState, useCallback } from "react";
import "./App.css";
import logo from "./assets/wordmark-white-text.svg";
import { NewAccount } from "./NewAccount";
import { useAppSelector } from "./store";
import { SavedAccount } from "./SavedAccount";
import AddIcon from "./assets/add.svg?react";

function App() {
  const accounts = useAppSelector((state) => state.accounts);
  const [adding, setAdding] = useState(false);
  const displayForm = adding || accounts.length === 0;

  const handleClick = useCallback(() => {
    setAdding(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setAdding(false);
  }, []);

  return (
    <div className="w-full max-w-lg py-20 m-auto flex flex-col items-center">
      <div className="relative mb-30 font-manrope">
        <img src={logo} alt="Mastodon" className="h-14" />
        <span className="block absolute font-bold text-black text-xs bottom-0 -end-1">
          Where conversations happen.
        </span>
      </div>

      <div className="p-8 rounded-2xl bg-white">
        <h1 className="text-black text-xl font-bold mb-8 text-center">
          Which account would you like to share from?
        </h1>

        {displayForm ? (
          <NewAccount onDismiss={handleDismiss} />
        ) : (
          <div className="w-full overflow-hidden mb-4 divide-slate-200 divide-y-1">
            {accounts.map((account) => (
              <SavedAccount
                key={`${account.domain}/${account.username}`}
                {...account}
              />
            ))}

            <button
              className="w-full flex gap-2 items-center p-4 font-bold cursor-pointer hover:bg-slate-50"
              onClick={handleClick}
            >
              <AddIcon className="icon" /> Add another account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
