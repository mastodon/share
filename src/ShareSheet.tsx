import { useState, useCallback } from "react";
import { NewDomain } from "./NewDomain";
import { useAppSelector } from "./store";
import { SavedDomain } from "./SavedDomain";
import { FormattedMessage } from "react-intl";
import { Preview } from "./Preview";

export const ShareSheet = () => {
  const domains = useAppSelector((state) => state.domains);
  const [adding, setAdding] = useState(false);
  const displayForm = adding || domains.length === 0;

  const handleClick = useCallback(() => {
    setAdding(true);
  }, []);

  const handleDismiss = useCallback(() => {
    setAdding(false);
  }, []);

  return (
    <>
      <h1 className="text-black text-xl font-bold mb-8 text-center">
        <FormattedMessage defaultMessage="Share to Mastodon" />
      </h1>

      <Preview />

      {displayForm ? (
        <NewDomain onDismiss={handleDismiss} />
      ) : (
        <>
          <div className="mb-4 flex justify-between">
            <h2 className="font-bold">
              <FormattedMessage id="" defaultMessage="Your Mastodon domain" />
            </h2>

            <button
              className="inline text-sm text-blurple-500 cursor-pointer hover:underline"
              onClick={handleClick}
            >
              <FormattedMessage defaultMessage="Add another domain" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {domains
              .sort((a, b) => b.used - a.used)
              .map((domain) => (
                <SavedDomain key={domain.domain} {...domain} />
              ))}
          </div>
        </>
      )}
    </>
  );
};
