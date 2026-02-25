import { useCallback } from "react";
import { addDomain, removeDomain } from "./actions";
import { useAppDispatch } from "./store";
import DeleteIcon from "./assets/delete.svg?react";
import { useIntl, defineMessages } from "react-intl";
import { useTextParam } from "./utils";

const messages = defineMessages({
  delete: { id: "", defaultMessage: "Delete" },
});

export const SavedDomain: React.FC<{
  domain: string;
}> = ({ domain }) => {
  const dispatch = useAppDispatch();
  const intl = useIntl();
  const text = useTextParam();

  const handleClick = useCallback(() => {
    dispatch(addDomain(domain));
  }, [dispatch, domain]);

  const handleDeleteClick = useCallback(() => {
    dispatch(removeDomain(domain));
  }, [dispatch, domain]);

  return (
    <div className="flex bg-blurple-500 hover:bg-blurple-600 text-white rounded-4xl w-full gap-2 items-center">
      <a
        className="block w-full px-5 py-4"
        href={`https://${domain}/share?text=${encodeURIComponent(text ?? "")}`}
        onClick={handleClick}
      >
        <div className="font-bold">{domain}</div>
      </a>

      <button
        className="text-white cursor-pointer p-4"
        onClick={handleDeleteClick}
        title={intl.formatMessage(messages.delete)}
      >
        <DeleteIcon className="icon" />
      </button>
    </div>
  );
};
