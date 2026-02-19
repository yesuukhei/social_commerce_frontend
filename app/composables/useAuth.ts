export const useAuth = () => {
  const token = useCookie("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  const user = useState("auth_user", () => null);
  const config = useRuntimeConfig();

  const loginWithFacebook = async (accessToken: string) => {
    try {
      const data: any = await $fetch(`${config.public.apiBase}/auth/facebook`, {
        method: "POST",
        body: { accessToken },
      });

      if (data.success) {
        token.value = data.token;
        user.value = data.user;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    navigateTo("/login");
  };

  const fetchUser = async () => {
    if (!token.value) return null;
    try {
      const data: any = await $fetch(`${config.public.apiBase}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      if (data.success) {
        user.value = data.user;
        return data.user;
      }
    } catch (error) {
      token.value = null;
      user.value = null;
    }
    return null;
  };

  return {
    token,
    user,
    loginWithFacebook,
    logout,
    fetchUser,
    isAuthenticated: computed(() => !!token.value),
  };
};
