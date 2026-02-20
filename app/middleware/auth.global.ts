export default defineNuxtRouteMiddleware(async (to, from) => {
  const { isAuthenticated, token, user, fetchUser } = useAuth();

  // Load user data if token exists but user is not in state
  if (token.value && !user.value) {
    await fetchUser();
  }

  // Avoid infinite redirect if already on login page
  if (to.path === "/login") {
    if (isAuthenticated.value) {
      return navigateTo("/");
    }
    return;
  }

  if (!isAuthenticated.value) {
    return navigateTo("/login");
  }
});
