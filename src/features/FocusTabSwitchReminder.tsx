interface FocusTabSwitchReminderProps {
  show: boolean;
  message: string;
}

const FocusTabSwitchReminder: React.FC<FocusTabSwitchReminderProps> = ({
  show,
  message,
}) => {
  if (!show) return null;
  return (
    <div className="focus-tab-switch-reminder animate-pulse">{message}</div>
  );
};

export default FocusTabSwitchReminder;
