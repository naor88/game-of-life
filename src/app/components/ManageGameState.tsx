import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
  saveGameState: () => void;
  savedGames: string[];
  loadGameState: (gameTS: string) => void;
}

export const ManageGamsStats = ({
  saveGameState,
  savedGames,
  loadGameState,
}: Props) => {
  return (
    <div className="drawer">
      <input id="my-saved-games" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <label
          htmlFor="my-saved-games"
          className="btn btn-primary drawer-button"
        >
          Mange Games States
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-saved-games"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <button className="btn btn-outline" onClick={saveGameState}>
            <FontAwesomeIcon icon={faCirclePlus} className="m-0" />
            Save Game State
          </button>

          <div className="flex flex-col mt-6">
            {savedGames.length>0 && savedGames.map((item: string) => (
              <button
                onClick={() => loadGameState(item)}
                key={item}
                className="btn btn-outline"
              >
                {new Date(+item).toLocaleTimeString()}
              </button>
            ))}
          </div>
        </ul>
      </div>
    </div>
  );
};
