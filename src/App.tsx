import "./App.css";
import logo from "./assets/wordmark-white-text.svg";

import { FormattedMessage } from "react-intl";

import { ShareSheet } from "./ShareSheet";
import { Instructions } from "./Instructions";
import { useTextParam } from "./utils";

const Logo = () => (
  <div className="relative mb-12 sm:mb-30 font-manrope">
    <img src={logo} alt="Mastodon" className="h-14" />
    <span className="block absolute font-bold text-black text-xs bottom-0 -end-1">
      Where conversations happen.
    </span>
  </div>
);

function App() {
  const hasText = useTextParam() !== null;

  return (
    <div className="w-full sm:max-w-lg py-12 sm:py-20 sm:m-auto flex flex-col items-center">
      <Logo />

      <div className="p-8 sm:min-w-lg rounded-2xl sm:bg-white">
        {hasText ? <ShareSheet /> : <Instructions />}
      </div>

      <div className="mt-12 sm:mt-30 text-slate-500 text-sm">
        <FormattedMessage
          defaultMessage="This website is <a>open-source</a>."
          values={{
            a: (str) => (
              <a
                href="https://github.com/mastodon/share"
                target="_blank"
                rel="noopener"
                className="hover:underline"
              >
                {str}
              </a>
            ),
          }}
        />
      </div>
    </div>
  );
}

export default App;
