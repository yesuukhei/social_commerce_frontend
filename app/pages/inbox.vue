<template>
  <div
    class="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 overflow-hidden relative"
  >
    <!-- Sidebar: Conversation List -->
    <div
      class="flex flex-col gap-4 shrink-0 overflow-hidden transition-all duration-300"
      :class="[selectedId ? 'hidden md:flex md:w-80' : 'w-full md:w-80 flex']"
    >
      <header class="flex flex-col gap-1">
        <h1
          class="text-2xl font-black tracking-tight text-zinc-900 dark:text-white flex items-center gap-2"
        >
          <span class="material-symbols-rounded text-primary-500">forum</span>
          Чат
        </h1>
        <p
          class="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest"
        >
          {{ conversations.length }} Идэвхтэй харилцаа
        </p>
      </header>

      <UCard
        class="flex-1 overflow-hidden"
        :ui="{ body: { padding: 'p-0 h-full flex flex-col' } }"
      >
        <!-- Search -->
        <div class="p-3 border-b border-zinc-100 dark:border-zinc-800">
          <UInput
            v-model="search"
            icon="material-symbols:search"
            placeholder="Хэрэглэгч хайх..."
            size="sm"
            variant="none"
            class="bg-zinc-50 dark:bg-zinc-900 rounded-xl"
            :ui="{ icon: { trailing: { pointer: '' } } }"
          >
            <template #trailing v-if="search">
              <UButton
                color="gray"
                variant="link"
                icon="material-symbols:close"
                :padded="false"
                @click="search = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          <div
            v-for="chat in filteredConversations"
            :key="chat._id"
            @click="selectConversation(chat)"
            class="group p-3 rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden"
            :class="[
              selectedId === chat._id
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 active:scale-[0.98]'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/50',
            ]"
          >
            <!-- Senior UX: Conversation status indicators removed for ultimate simplicity -->

            <div class="flex gap-3 items-center">
              <UAvatar
                :src="chat.customer?.avatar"
                :alt="chat.customer?.name"
                :text="chat.customer?.name?.substring(0, 2)"
                size="sm"
                class="transition-transform group-hover:scale-105"
                :ui="{
                  wrapper:
                    selectedId === chat._id
                      ? 'ring-2 ring-white/50 bg-white/20'
                      : 'ring-1 ring-zinc-200 dark:ring-zinc-700 bg-zinc-100 dark:bg-zinc-800',
                  text: 'font-black',
                }"
              />
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline mb-0.5">
                  <p
                    class="text-xs font-black truncate leading-none"
                    :class="
                      selectedId === chat._id
                        ? 'text-white'
                        : 'text-zinc-900 dark:text-zinc-100'
                    "
                  >
                    {{ chat.customer?.name || "Тодорхойгүй" }}
                  </p>
                  <span
                    class="text-[9px] font-bold opacity-60 ml-2 whitespace-nowrap"
                  >
                    {{ formatTime(chat.lastActivity) }}
                  </span>
                </div>
                <p
                  class="text-[10px] font-medium truncate mt-0.5 leading-tight"
                  :class="
                    selectedId === chat._id
                      ? 'text-white/80'
                      : 'text-zinc-500 dark:text-zinc-400'
                  "
                >
                  {{
                    chat.messages[chat.messages.length - 1]?.text ||
                    "Мессеж байхгүй"
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Area: Chat Window -->
    <div
      class="flex-1 flex flex-col h-full overflow-hidden"
      :class="{ 'hidden md:flex': !selectedId }"
    >
      <UCard
        v-if="selectedConversation"
        class="h-full flex flex-col"
        :ui="{ body: { padding: 'p-0 h-full flex flex-col' } }"
      >
        <!-- Chat Header -->
        <header
          class="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md shrink-0"
        >
          <div class="flex items-center gap-2 md:gap-4 min-w-0">
            <!-- Back Button for Mobile -->
            <UButton
              variant="ghost"
              color="gray"
              icon="material-symbols:arrow-back"
              class="md:hidden -ml-2 shrink-0"
              @click="selectedId = null"
            />
            <UAvatar
              :src="selectedConversation.customer?.avatar"
              :alt="selectedConversation.customer?.name"
              :text="selectedConversation.customer?.name?.substring(0, 2)"
              size="sm"
              class="ring-2 ring-primary-500/20 shrink-0"
            />
            <div class="truncate">
              <h2
                class="text-xs md:text-sm font-black text-zinc-900 dark:text-white truncate"
              >
                {{ selectedConversation.customer?.name }}
              </h2>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span
                  class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                ></span>
                <span
                  class="text-[8px] md:text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate"
                  >Live</span
                >
              </div>
            </div>
          </div>
          <div class="flex items-center gap-1.5 md:gap-3 shrink-0">
            <!-- Senior UX: Logical Grouping of Header Actions -->
            <div
              class="hidden sm:flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200/50 dark:border-zinc-700/50"
            >
              <UButton
                variant="ghost"
                :color="selectedConversation.isManualMode ? 'orange' : 'gray'"
                :icon="
                  selectedConversation.isManualMode
                    ? 'material-symbols:smart-toy-off-outline'
                    : 'material-symbols:smart-toy-outline'
                "
                size="xs"
                class="rounded-lg font-black text-[9px] uppercase tracking-tighter px-2 h-7"
                @click="toggleManualMode"
                :loading="togglingManual"
              >
                {{ selectedConversation.isManualMode ? "Manual" : "AI Live" }}
              </UButton>
              <div class="w-px h-3 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
              <UButton
                variant="ghost"
                color="gray"
                icon="material-symbols:refresh"
                size="xs"
                class="rounded-lg h-7 w-7"
                @click="loadConversationDetails(selectedId)"
                :loading="loadingDetails"
              />
            </div>
          </div>
        </header>

        <!-- Messages Area -->
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/20"
        >
          <!-- Manual Mode Warning -->
          <div
            v-if="selectedConversation.isManualMode"
            class="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/50 p-3 rounded-2xl flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2 duration-500"
          >
            <div
              class="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center shrink-0"
            >
              <span
                class="material-symbols-rounded text-orange-600 dark:text-orange-400 text-lg"
                >smart_toy</span
              >
            </div>
            <div>
              <p
                class="text-[11px] font-black text-orange-900 dark:text-orange-300 uppercase tracking-tighter"
              >
                AI Түр зогссон (Manual Mode)
              </p>
              <p
                class="text-[10px] font-semibold text-orange-700 dark:text-orange-400 opacity-80"
              >
                Энэ хэрэглэгчид AI хариулахгүй тул та гараар хариулна уу.
              </p>
            </div>
          </div>

          <div
            v-for="(msg, i) in selectedConversation.messages"
            :key="i"
            class="flex flex-col group/msg"
            :class="[msg.sender === 'customer' ? 'items-start' : 'items-end']"
          >
            <div
              class="max-w-[85%] md:max-w-[70%] px-4 py-2.5 rounded-2xl md:rounded-[1.5rem] text-xs md:text-sm font-semibold transition-all duration-300"
              :class="[
                msg.sender === 'customer'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-none border border-zinc-100 dark:border-zinc-700 shadow-sm'
                  : msg.sender === 'bot'
                    ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-tr-none border border-zinc-200/50 dark:border-zinc-700/50 italic opacity-90'
                    : 'bg-primary-500 text-white rounded-tr-none shadow-lg shadow-primary-500/20',
              ]"
            >
              {{ msg.text }}
            </div>
            <div
              class="flex items-center gap-1.5 mt-1 px-1 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300"
            >
              <span
                class="text-[8px] font-black text-zinc-400 uppercase tracking-tighter"
              >
                {{ formatDateTime(msg.timestamp) }}
              </span>
              <span
                v-if="msg.sender === 'bot'"
                class="text-[8px] font-black text-primary-500 uppercase tracking-tighter"
                >AI</span
              >
              <span
                v-if="msg.sender === 'admin'"
                class="text-[8px] font-black text-zinc-500 uppercase tracking-tighter"
                >Admin</span
              >
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <footer
          class="p-3 md:p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0"
        >
          <div class="flex items-end gap-2">
            <UTextarea
              v-model="newMessage"
              placeholder="Мессеж бичих..."
              autoresize
              :rows="1"
              :max-rows="4"
              class="flex-1"
              variant="none"
              :ui="{
                wrapper:
                  'bg-zinc-100 dark:bg-zinc-800/50 rounded-xl md:rounded-2xl ring-0 focus:ring-2 focus:ring-primary-500 p-1',
              }"
              @keydown.enter.prevent="sendMessage"
            />
            <UButton
              color="primary"
              variant="solid"
              icon="material-symbols:send"
              size="md"
              class="rounded-xl md:rounded-2xl h-[38px] md:h-[42px] px-4 shadow-lg shadow-primary-500/20"
              :loading="sending"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
            />
          </div>
        </footer>
      </UCard>

      <!-- Empty State -->
      <div
        v-else
        class="h-full flex flex-col items-center justify-center p-12 text-center"
      >
        <div class="relative mb-8">
          <div
            class="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full scale-150"
          ></div>
          <div
            class="relative w-24 h-24 rounded-[2.5rem] bg-white dark:bg-zinc-800 shadow-2xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-center animate-bounce-slow"
          >
            <span class="material-symbols-rounded text-5xl text-primary-500"
              >forum</span
            >
          </div>
          <div
            class="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center shadow-lg border-2 border-white dark:border-zinc-900"
          >
            <span
              class="material-symbols-rounded text-xl text-primary-600 dark:text-primary-400"
              >add</span
            >
          </div>
        </div>
        <h2
          class="text-2xl font-black text-zinc-900 dark:text-white mb-3 tracking-tight"
        >
          Харилцаа сонгох
        </h2>
        <p
          class="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs font-bold leading-relaxed uppercase tracking-wide opacity-60"
        >
          Зүүн гар талын жагсаалтаас хэрэглэгчээ сонгон <br />
          чатны түүхийг бүрэн харна уу.
        </p>
      </div>
    </div>

    <!-- Right Area: Summary (Hidden on smaller screens) -->
    <div
      v-if="selectedConversation"
      class="w-64 shrink-0 space-y-4 overflow-y-auto no-scrollbar hidden xl:block transition-all duration-300"
    >
      <UCard :ui="{ body: { padding: 'p-4' } }">
        <h3
          class="font-black text-[10px] uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"
        >
          <span class="material-symbols-rounded text-sm">person</span>
          Хэрэглэгчийн мэдээлэл
        </h3>
        <div class="space-y-4">
          <div class="flex flex-col">
            <span
              class="text-[9px] font-black uppercase text-zinc-400 tracking-tighter"
              >Нэр</span
            >
            <span class="text-sm font-bold text-zinc-800 dark:text-zinc-200">{{
              selectedConversation.customer?.name
            }}</span>
          </div>
          <div class="flex flex-col">
            <span
              class="text-[9px] font-black uppercase text-zinc-400 tracking-tighter"
              >Сүүлд холбогдсон</span
            >
            <span class="text-xs font-bold text-zinc-600 dark:text-zinc-400">{{
              formatDateTime(selectedConversation.lastActivity)
            }}</span>
          </div>
        </div>
      </UCard>

      <UCard
        v-if="selectedConversation.orders?.length"
        :ui="{ body: { padding: 'p-4' } }"
      >
        <h3
          class="font-black text-[10px] uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2"
        >
          <span class="material-symbols-rounded text-sm">shopping_cart</span>
          Захиалга
        </h3>
        <div class="space-y-3">
          <div
            v-for="order in selectedConversation.orders"
            :key="order._id"
            class="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"
          >
            <div class="flex justify-between items-center mb-1">
              <span class="text-[10px] font-black text-primary-500"
                >₮{{ order.totalAmount?.toLocaleString() }}</span
              >
              <UBadge
                size="xs"
                variant="subtle"
                :color="order.status === 'completed' ? 'success' : 'warning'"
                class="text-[8px] px-1 uppercase tracking-tighter"
              >
                {{ order.status }}
              </UBadge>
            </div>
            <p class="text-[9px] text-zinc-500 font-bold truncate">
              {{ order.items?.map((i) => i.itemName).join(", ") }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const config = useRuntimeConfig();
const { token } = useAuth();
const { selectedStoreId } = useStore();
const toast = useToast();

const search = ref("");
const selectedId = ref(null);
const selectedConversation = ref(null);
const newMessage = ref("");
const sending = ref(false);
const loadingDetails = ref(false);
const togglingManual = ref(false);
const messageContainer = ref(null);

// Fetch all conversations
const { data, refresh } = await useFetch(
  () => {
    let url = `${config.public.apiBase}/conversations`;
    if (selectedStoreId.value) {
      url += `?storeId=${selectedStoreId.value}`;
    }
    return url;
  },
  {
    headers: { Authorization: `Bearer ${token.value}` },
    watch: [selectedStoreId],
  },
);

const conversations = computed(() => data.value?.data || []);

const filteredConversations = computed(() => {
  if (!search.value) return conversations.value;
  return conversations.value.filter((c) =>
    c.customer?.name?.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const selectConversation = async (chat) => {
  selectedId.value = chat._id;
  await loadConversationDetails(chat._id);
};

const loadConversationDetails = async (id) => {
  loadingDetails.value = true;
  try {
    const res = await $fetch(`${config.public.apiBase}/conversations/${id}`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });
    if (res.success) {
      selectedConversation.value = res.data;
      nextTick(() => scrollToBottom());
    }
  } catch (error) {
    toast.add({
      title: "Алдаа",
      description: "Мэдээлэл авахад алдаа гарлаа.",
      color: "red",
    });
  } finally {
    loadingDetails.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;

  sending.value = true;
  const text = newMessage.value;
  newMessage.value = "";

  try {
    const res = await $fetch(
      `${config.public.apiBase}/conversations/${selectedId.value}/message`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { text },
      },
    );

    if (res.success) {
      // Refresh local view immediately
      await loadConversationDetails(selectedId.value);
      refresh(); // Refresh sidebar list
    }
  } catch (error) {
    toast.add({
      title: "Илгээж чадсангүй",
      description: error.data?.message,
      color: "red",
    });
    newMessage.value = text;
  } finally {
    sending.value = false;
  }
};

const toggleManualMode = async () => {
  if (!selectedId.value || togglingManual.value) return;

  togglingManual.value = true;
  try {
    const res = await $fetch(
      `${config.public.apiBase}/conversations/${selectedId.value}/toggle-manual`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token.value}` },
      },
    );

    if (res.success) {
      selectedConversation.value.isManualMode = res.isManualMode;
      if (res.isManualMode) {
        selectedConversation.value.status = "active";
      }
      toast.add({
        title: res.isManualMode ? "AI Түр зогслоо" : "AI Идэвхжлээ",
        description: res.isManualMode
          ? "Та энэ хэрэглэгчтэй гараар харилцана уу."
          : "AI хэрэглэгчид хариулж эхэлнэ.",
        color: res.isManualMode ? "orange" : "green",
      });
      refresh();
    }
  } catch (error) {
    toast.add({
      title: "Алдаа гарлаа",
      description: error.data?.message,
      color: "red",
    });
  } finally {
    togglingManual.value = false;
  }
};

// Utils
const formatTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return (
    d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
};

const getIntentColor = (intent) => {
  const map = {
    ordering: "primary",
    browsing: "neutral",
    inquiry: "blue",
    complaint: "red",
    other: "gray",
  };
  return map[intent] || "gray";
};

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

// Polling for new messages (keep it simple for now)
let pollTimer;
onMounted(() => {
  pollTimer = setInterval(() => {
    refresh();
    if (selectedId.value) {
      // Optionally poll details if needed, but sidebar refresh is a good start
    }
  }, 10000); // 10s
});

onUnmounted(() => {
  clearInterval(pollTimer);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e4e4e7;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #27272a;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
