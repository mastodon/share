import { useState, useCallback, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import { addDomain } from "./actions";
import { useAppDispatch } from "./store";
import { FormattedMessage } from "react-intl";
import { useTextParam } from "./utils";

interface ServerResponseJSON {
  domain: string;
}

const isValidDomain = (str: string): boolean => {
  try {
    const url = new URL(`https://${str}`);
    return url.hostname === str;
  } catch {
    return false;
  }
};

export const NewDomain: React.FC<{ onDismiss: () => void }> = () => {
  const dispatch = useAppDispatch();
  const text = useTextParam();

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const accessibilityId = useId();
  const domain = value.trim();

  const serversQuery = useQuery<ServerResponseJSON[]>({
    queryKey: ["servers"],

    queryFn: async () => {
      const response = await fetch(
        "https://api.joinmastodon.org/servers?registrations=all",
      );

      if (!response.ok) {
        throw new Error("Unexpected response");
      }

      return response.json();
    },
  });

  const results = useFuzzySearchList({
    list: serversQuery.data ?? [],
    queryText: domain ?? "",
    key: "domain",
    mapResultItem: ({ item, matches: [highlightRanges] }) => ({
      item,
      highlightRanges,
    }),
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    if (e.target.value.length > 0) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setFocused(false);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const domain = e.currentTarget.getAttribute("data-domain") ?? "";

      setValue(domain);
      setShowResults(false);

      const redirectUrl = `https://${domain}/share?text=${encodeURIComponent(text)}`;

      setSubmitting(true);
      dispatch(addDomain(domain));

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    },
    [dispatch, text],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!domain || !isValidDomain(domain)) {
        return;
      }

      const redirectUrl = `https://${domain}/share?text=${encodeURIComponent(text)}`;

      setSubmitting(true);
      dispatch(addDomain(domain));

      setTimeout(() => {
        window.location.href = redirectUrl;
      }, 100);
    },
    [dispatch, text, domain],
  );

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="relative">
          <label htmlFor={accessibilityId} className="block font-bold mb-4">
            <p>
              <FormattedMessage id="" defaultMessage="Your Mastodon domain" />
            </p>
            <p className="text-sm font-normal text-slate-500 mt-2">
              <FormattedMessage
                defaultMessage="If your handle is <samp>@alice@mastodon.social</samp>, the domain is <samp>mastodon.social</samp>. You will be redirected to a page on your Mastodon server."
                values={{
                  samp: (str) => (
                    <samp className="font-mono text-xs border border-slate-200 bg-white rounded-xs px-1 py-[0.17rem]">
                      {str}
                    </samp>
                  ),
                }}
              />
            </p>
          </label>

          <div
            className={`w-full flex items-center border bg-white rounded-md ${focused ? "border-blurple-500" : "border-slate-200"} ${showResults ? "rounded-b-none" : ""}`}
          >
            <input
              className="text-black flex-grow p-3 border-0 focus:outline-0"
              type="text"
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              id={accessibilityId}
            />
          </div>

          {showResults && results.length > 0 && (
            <div
              className={`absolute top-full mt-[-1px] w-full flex flex-col bg-white border border-t-0 rounded-b-md p-1 ${focused ? "border-blurple-500" : "border-slate-200"}`}
            >
              {results.slice(0, 5).map(({ item, highlightRanges }) => (
                <button
                  type="button"
                  key={item.domain}
                  className="block rounded-md p-2 text-start cursor-pointer hover:bg-blurple-500 hover:text-white"
                  data-domain={item.domain}
                  onClick={handleClick}
                >
                  <Highlight
                    text={item.domain}
                    ranges={highlightRanges}
                    style={{}}
                    className="font-bold"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="mt-4 flex-none w-full bg-blurple-500 text-white text-base text-center font-bold px-4 py-3 rounded-md cursor-pointer hover:bg-blurple-600"
          type="submit"
        >
          <FormattedMessage id="" defaultMessage="Continue to Mastodon" />
          {submitting && "..."}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        <FormattedMessage
          id=""
          defaultMessage="Not on Mastodon yet? <a>Create an account</a>"
          values={{
            a: (f) => (
              <a
                href="https://mastodon.social/auth/sign_up"
                className="text-blurple-500 hover:underline"
              >
                {f}
              </a>
            ),
          }}
        />
      </p>
    </>
  );
};
