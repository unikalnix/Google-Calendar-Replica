const roleAuth = (action) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      const calendar = req.calendar;

      if (!calendar) {
        return res.status(404).json({
          success: false,
          message: "Calendar not found",
        });
      }

      let role = "none";

      if (String(calendar.owner) === String(user._id)) {
        role = "owner";
      } else {
        const sharedEntry = calendar.sharedWith.find(
          (u) => u.email === user.email
        );
        if (sharedEntry) role = sharedEntry.role;
      }

      if (role === "none") {
        return res.status(403).json({
          success: false,
          message: "You do not have access to this calendar",
        });
      }

      const permissions = {
        deleteCalendar: ["owner"],
        createEvent: ["owner"],
        deleteEvent: ["owner"],
        updateEvent: ["owner", "editor"],
        viewEvent: ["owner", "editor", "viewer"],
      };

      const allowedRoles = permissions[action] || [];

      if (!allowedRoles.includes(role)) {
        return res.json({
          success: false,
          message: `You do not have permission to ${action}`,
        });
      }

      req.role = role;
      next();
    } catch (error) {
      return res.json({
        success: false,
        message: error.message,
      });
    }
  };
};

export { roleAuth };
