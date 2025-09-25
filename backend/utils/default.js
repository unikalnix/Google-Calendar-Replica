export const calendar = {
  color: "#155DFC",
  isShared: false,
  roles: ["viewer", "editor", "owner"],
  defaultRole: "viewer",
  autoRemove: false,
  isDefault: false,
};

export const event = {
  repeat: ["none", "daily", "weekly", "monthly", "yearly"],
  defaultRepeat: "none",
  reminderMinutes: [10, 30, 60],
  defaultReminderMinutes: 10,
};

export const notification = {
  types: ["notify", "reminder"],
  defaultType: "notify",
  defaultColor: "#2463EB", // blue,
};

export const defaultCalendar = {
  name: "My Calendar",
  color: "#155DFC",
  isShared: false,
  autoRemove: false,
  isDefault: true,
};

export const requestCalendar = {
  status: ["granted", "pending", "revoked"],
  defaultStatus: "pending",
  defaultType: "general",
  defaultRead: false,
  defaultRole: "viewer"
};
