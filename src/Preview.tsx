import { useTextParam } from "./utils";
import { FormattedMessage } from "react-intl";

export const Preview = () => {
  const text = useTextParam();

  return (
    <div className="mb-4">
      <div className="font-bold">
        <FormattedMessage defaultMessage="The text that will be shared" />
      </div>
      <div className="text-sm text-slate-500 mt-2 mb-4">
        <FormattedMessage defaultMessage="You will have a chance to edit it before posting once you're on your Mastodon server." />
      </div>
      <div className="w-full p-3 bg-white border border-slate-200 rounded-md text-sm text-slate-500">
        {text}
      </div>
    </div>
  );
};
