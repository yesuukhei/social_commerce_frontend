export const useAuth = () => {
  const token = useCookie<string | null>("auth_token", {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    watch: true, // Бусад хуудаснууд дээр cookie өөрчлөгдөхөд мэдрэх
  });

  // Төлөвийг shared болгохын тулд useState ашиглана
  const user = useState<any | null>("auth_user", () => null);
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
    } catch (error: any) {
      console.error("Login error:", error.data || error.message);
      return false;
    }
  };

  const logout = async () => {
    // Cookie-г устгахын тулд null биш undefined болгоно
    token.value = null;
    user.value = null;

    // Redirect хийхээс өмнө төлөвүүд цэвэрлэгдсэн эсэхийг баталгаажуулна
    await navigateTo("/login", { replace: true });
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
    } catch (error: any) {
      console.error("Fetch user error:", error.data || error.message);
      // Хэрэв токен хүчингүй болсон бол цэвэрлэнэ
      if (error.status === 401 || error.status === 403) {
        token.value = null;
        user.value = null;
      }
    }
    return null;
  };

  return {
    token,
    user,
    loginWithFacebook,
    logout,
    fetchUser,
    isAuthenticated: computed(() => !!token.value && !!user.value),
  };
};
