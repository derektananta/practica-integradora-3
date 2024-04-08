export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
      if (!req.isAuthenticated()) {
          return res.send("You must be logged in to view this"); 
      }

      const userRole = req.user.rol;
      
      const roleHierarchy = {
          'user': 1,
          'premium': 2,
          'admin': 3
      };

      const userRolePriority = roleHierarchy[userRole];
      const allowedRolesPriorities = allowedRoles.map(role => roleHierarchy[role]);

      if (userRolePriority && allowedRolesPriorities.some(priority => priority <= userRolePriority)) {
          return next();
      } else {
          return res.status(403).send('Access Denied');
      }
  };
};
