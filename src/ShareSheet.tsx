import { useState, useCallback } from "react";
import { NewAccount } from "./NewAccount";
import { useAppSelector } from "./store";
import { SavedAccount } from "./SavedAccount";
import AddIcon from "./assets/add.svg?react";

export const ShareSheet = () => {
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
    <>
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
    </>
  );
};
