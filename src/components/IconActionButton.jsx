import classNames from "classnames";
import PropTypes from "prop-types";

function IconActionButton({
  isActive = false,
  isLoading = false,
  icon,
  activeIcon = null,
  onClick,
  tooltip = "",
  activeClass = "border-danger text-danger",
}) {
  return (
    <button
      type="button"
      className={classNames("icon-btn", { [activeClass]: isActive })}
      disabled={isLoading}
      onClick={onClick}
      title={tooltip}
    >
      {isLoading ? (
        <span className="spinner-border spinner-border-sm text-gray-400" />
      ) : isActive ? (
        activeIcon
      ) : (
        icon
      )}
    </button>
  );
}

IconActionButton.propTypes = {
  isActive: PropTypes.bool,
  isLoading: PropTypes.bool,
  icon: PropTypes.element.isRequired,
  activeIcon: PropTypes.element,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  activeClass: PropTypes.string,
};

export default IconActionButton;
