import { useState, useCallback, useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFuzzySearchList, Highlight } from "@nozbe/microfuzz/react";
import { addAccount } from "./actions";
import { useAppDispatch } from "./store";
import { useIntl, defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  placeholder: { id: "", defaultMessage: "E.g. username@somewhere.social" },
});

interface WebfingerResponseJSON {
  links: {
    rel: string;
    type: string;
    href: string;
  }[];
}

interface ActorResponseJSON {
  name: string;
  preferredUsername: string;
  icon?: {
    url: string;
  };
}

interface ServerResponseJSON {
  domain: string;
}

export const NewAccount: React.FC<{ onDismiss: () => void }> = () => {
  const dispatch = useAppDispatch();
  const intl = useIntl();

  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const accessibilityId = useId();
  const cleanValue = value.replace(/^@/, "");
  const domain = cleanValue.split("@")[1];

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

    if (e.target.value.replace(/^@/, "").includes("@")) {
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
      const username = cleanValue.split("@")[0];
      const newValue = `${username}@${domain}`;

      setValue(newValue);
      setShowResults(false);
    },
    [cleanValue],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const [username, domain] = cleanValue.split("@");

      if (!domain) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const redirectUrl = `https://${domain}/share?text=${encodeURIComponent(params.get("text") ?? "")}`;

      setSubmitting(true);

      fetch(
        `https://${domain}/.well-known/webfinger?resource=acct:${cleanValue}`,
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unexpected response");
          }

          return response.json();
        })
        .then((json: WebfingerResponseJSON) => {
          const link = json.links.find(
            ({ rel, type }) =>
              rel === "self" && type === "application/activity+json",
          );

          if (!link) {
            throw new Error("Unexpected response");
          }

          return fetch(link.href, {
            headers: {
              Accept: "application/activity+json",
            },
          });
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Unexpected response");
          }

          return response.json();
        })
        .then((json: ActorResponseJSON) => {
          const displayName = json.name ?? json.preferredUsername;
          const avatar = json.icon?.url;

          dispatch(
            addAccount({
              domain,
              displayName,
              avatar,
              username: json.preferredUsername,
            }),
          );

          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 100);
        })
        .catch(() => {
          dispatch(
            addAccount({
              domain,
              displayName: username,
              username,
            }),
          );

          setTimeout(() => {
            window.location.href = redirectUrl;
          }, 100);
        });
    },
    [dispatch, cleanValue],
  );

  return (
    <>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="relative">
          <label htmlFor={accessibilityId} className="block font-bold mb-2">
            <FormattedMessage id="" defaultMessage="Your address on Mastodon" />
          </label>

          <div
            className={`w-full flex items-center border bg-white rounded-md ${focused ? "border-blurple-500" : "border-slate-200"} ${showResults ? "rounded-b-none" : ""}`}
          >
            <input
              className="text-black flex-grow p-3 border-0 focus:outline-0"
              type="text"
              placeholder={intl.formatMessage(messages.placeholder)}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              id={accessibilityId}
            />
          </div>

          {showResults && (
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
                  {cleanValue.split("@")[0]}@
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
          <FormattedMessage id="" defaultMessage="Continue" />
          {submitting && "..."}
        </button>
      </form>

      <p className="text-center mt-3">
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
