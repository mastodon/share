import { useCallback } from "react";
import { removeAccount } from "./actions";
import { useAppDispatch } from "./store";
import DeleteIcon from "./assets/delete.svg?react";
import { useIntl, defineMessages } from "react-intl";
import { useTextParam } from "./utils";

const messages = defineMessages({
  delete: { id: "", defaultMessage: "Delete" },
});

export const SavedAccount: React.FC<{
  domain: string;
  username: string;
  avatar?: string;
  displayName: string;
}> = ({ domain, username, avatar, displayName }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const text = useTextParam();

  const handleClick = useCallback(() => {
    dispatch(removeAccount({ username, domain }));
  }, [dispatch, username, domain]);

  return (
    <div className="flex w-full gap-3 items-center p-4">
      <a
        className="flex flex-grow gap-3 items-center"
        href={`https://${domain}/share?text=${encodeURIComponent(text ?? "")}`}
      >
        {avatar ? (
          <img src={avatar} alt="" className="rounded-lg aspect-square h-12" />
        ) : (
          <div className="rounded-lg bg-slate-200 aspect-square h-12" />
        )}
        <div>
          <div className="text-base text-slate-800 font-bold">
            {displayName}
          </div>
          <div className="text-sm font-semibold text-slate-500">
            @{username}@{domain}
          </div>
        </div>
      </a>

      <button
        className="text-slate-300 cursor-pointer p-2 hover:text-slate-400"
        onClick={handleClick}
        title={intl.formatMessage(messages.delete)}
      >
        <DeleteIcon className="icon" />
      </button>
    </div>
  );
};
