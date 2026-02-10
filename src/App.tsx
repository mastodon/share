import "./App.css";
import logo from "./assets/wordmark-white-text.svg";

import { ShareSheet } from "./ShareSheet";
import { Instructions } from "./Instructions";

const Logo = () => (
  <div className="relative mb-30 font-manrope">
    <img src={logo} alt="Mastodon" className="h-14" />
    <span className="block absolute font-bold text-black text-xs bottom-0 -end-1">
      Where conversations happen.
    </span>
  </div>
);

function App() {
  const params = new URLSearchParams(window.location.search);
  const hasText = params.get("text")?.length > 0;

  return (
    <div className="w-full max-w-lg py-20 m-auto flex flex-col items-center">
      <Logo />

      <div className="p-8 rounded-2xl bg-white">
        {hasText ? <ShareSheet /> : <Instructions />}
      </div>
    </div>
  );
}

export default App;
