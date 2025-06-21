import classNames from "classnames";
import { bool, element, func, string } from "prop-types";

function IconActionButton({
  isActive = false,
  isLoading = false,
  icon,
  activeIcon = null,
  onClick,
  tooltip = "",
  activeColor = "danger",
}) {
  const getBtnIcon = () => {
    if (isLoading)
      return (
        <span
          className={`spinner-border spinner-border-sm text-${isActive ? activeColor : "gray-400"}`}
        />
      );
    if (isActive && activeIcon) return activeIcon;
    return icon;
  };

  return (
    <button
      type="button"
      className={classNames("icon-btn", {
        [`border-${activeColor} text-${activeColor}`]: isActive,
      })}
      disabled={isLoading}
      onClick={onClick}
      title={tooltip}
    >
      {getBtnIcon()}
    </button>
  );
}

IconActionButton.propTypes = {
  isActive: bool,
  isLoading: bool,
  icon: element.isRequired,
  activeIcon: element,
  onClick: func.isRequired,
  tooltip: string,
  activeColor: string,
};

export default IconActionButton;
