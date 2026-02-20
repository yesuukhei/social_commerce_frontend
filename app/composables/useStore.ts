export const useStore = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  // Selected store ID: null means "All Stores"
  const selectedStoreId = useCookie<string | null>("selectedStoreId", {
    default: () => null,
    path: "/",
  });
  const stores = useState<any[]>("stores", () => []);
  const loadingStores = useState<boolean>("loadingStores", () => false);

  const fetchStores = async () => {
    if (!token.value || loadingStores.value) return;

    loadingStores.value = true;
    try {
      const res: any = await $fetch(`${config.public.apiBase}/stores/my`, {
        headers: { Authorization: `Bearer ${token.value}` },
      });
      if (res.success) {
        stores.value = res.data;

        // Auto-select first store if none selected
        if (!selectedStoreId.value && stores.value.length > 0) {
          selectedStoreId.value = stores.value[0]._id;
        }
      }
    } catch (err) {
      console.error("Failed to fetch stores", err);
    } finally {
      loadingStores.value = false;
    }
  };

  const currentStore = computed(() => {
    if (!selectedStoreId.value) return null;
    return stores.value.find((s) => s._id === selectedStoreId.value);
  });

  const selectStore = (id: string | null, shouldReload = true) => {
    selectedStoreId.value = id;
    if (shouldReload) {
      window.location.reload();
    }
  };

  const createNewStore = async (name: string) => {
    if (!token.value) return null;

    try {
      const res: any = await $fetch(`${config.public.apiBase}/stores`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { name },
      });

      if (res.success) {
        stores.value.push(res.data);
        selectStore(res.data._id);
        return res.data;
      }
    } catch (err) {
      console.error("Failed to create store", err);
      throw err;
    }
    return null;
  };

  return {
    stores,
    selectedStoreId,
    currentStore,
    loadingStores,
    fetchStores,
    selectStore,
    createNewStore,
  };
};
