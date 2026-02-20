<template>
  <div class="h-[calc(100vh-140px)] flex gap-6 overflow-hidden">
    <!-- Sidebar: Conversation List -->
    <div class="w-80 flex flex-col gap-4 shrink-0 overflow-hidden">
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
            <!-- Status indicator -->
            <div
              v-if="chat.status === 'waiting_for_info'"
              class="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"
            ></div>

            <div class="flex gap-3 items-center">
              <UAvatar
                :src="chat.customer?.avatar"
                :alt="chat.customer?.name"
                :text="chat.customer?.name?.substring(0, 2)"
                size="sm"
                :ui="{
                  wrapper:
                    selectedId === chat._id
                      ? 'ring-2 ring-white/50'
                      : 'ring-1 ring-zinc-200 dark:ring-zinc-700',
                }"
              />
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start">
                  <p
                    class="text-xs font-black truncate"
                    :class="
                      selectedId === chat._id
                        ? 'text-white'
                        : 'text-zinc-900 dark:text-white'
                    "
                  >
                    {{ chat.customer?.name || "Тодорхойгүй" }}
                  </p>
                  <span class="text-[9px] font-bold opacity-60">
                    {{ formatTime(chat.lastActivity) }}
                  </span>
                </div>
                <p class="text-[10px] font-medium truncate opacity-70 mt-0.5">
                  {{
                    chat.messages[chat.messages.length - 1]?.text ||
                    "Мессеж байхгүй"
                  }}
                </p>
                <div class="flex gap-2 mt-1.5 items-center">
                  <UBadge
                    v-if="chat.currentIntent"
                    size="xs"
                    variant="subtle"
                    :color="
                      chat.selectedId === chat._id
                        ? 'neutral'
                        : getIntentColor(chat.currentIntent)
                    "
                    class="text-[8px] px-1 font-black uppercase tracking-tighter"
                  >
                    {{ chat.currentIntent }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Main Area: Chat Window -->
    <div class="flex-1 flex flex-col h-full">
      <UCard
        v-if="selectedConversation"
        class="h-full flex flex-col"
        :ui="{ body: { padding: 'p-0 h-full flex flex-col' } }"
      >
        <!-- Chat Header -->
        <header
          class="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md shrink-0"
        >
          <div class="flex items-center gap-4">
            <UAvatar
              :src="selectedConversation.customer?.avatar"
              :alt="selectedConversation.customer?.name"
              :text="selectedConversation.customer?.name?.substring(0, 2)"
              size="md"
              class="ring-2 ring-primary-500/20"
            />
            <div>
              <h2 class="text-sm font-black text-zinc-900 dark:text-white">
                {{ selectedConversation.customer?.name }}
              </h2>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span
                  class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest"
                  >Messenger Идэвхтэй</span
                >
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              variant="soft"
              color="neutral"
              icon="material-symbols:refresh"
              size="sm"
              @click="loadConversationDetails(selectedId)"
              :loading="loadingDetails"
            />
            <USelect
              v-model="selectedConversation.status"
              :options="[
                'active',
                'waiting_for_info',
                'order_created',
                'closed',
              ]"
              size="sm"
              class="w-36"
              @update:model-value="updateStatus"
            />
          </div>
        </header>

        <!-- Messages Area -->
        <div
          ref="messageContainer"
          class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-50/30 dark:bg-zinc-950/20"
        >
          <div
            v-for="(msg, i) in selectedConversation.messages"
            :key="i"
            class="flex flex-col"
            :class="[msg.sender === 'customer' ? 'items-start' : 'items-end']"
          >
            <div
              class="max-w-[80%] px-4 py-2.5 rounded-3xl text-sm font-medium shadow-sm transition-all duration-300"
              :class="[
                msg.sender === 'customer'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                  : msg.sender === 'bot'
                    ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-tr-none'
                    : 'bg-primary-500 text-white rounded-tr-none shadow-primary-500/20',
              ]"
            >
              {{ msg.text }}
            </div>
            <span
              class="text-[9px] font-bold text-zinc-400 dark:text-zinc-600 mt-1 uppercase tracking-tighter px-1"
            >
              {{ formatDateTime(msg.timestamp) }} •
              {{
                msg.sender === "bot"
                  ? "AI"
                  : msg.sender === "admin"
                    ? "Админ"
                    : "Хэрэглэгч"
              }}
            </span>
          </div>
        </div>

        <!-- Chat Input -->
        <footer
          class="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0"
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
                  'bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl ring-0 focus:ring-2 focus:ring-primary-500 transition-all p-1',
              }"
              @keydown.enter.prevent="sendMessage"
            />
            <UButton
              color="primary"
              variant="solid"
              icon="material-symbols:send"
              size="lg"
              class="rounded-2xl h-[42px] px-4 shadow-lg shadow-primary-500/20 animate-in fade-in"
              :loading="sending"
              :disabled="!newMessage.trim()"
              @click="sendMessage"
            >
              Илгээх
            </UButton>
          </div>
          <p
            class="text-[9px] text-zinc-400 font-bold mt-2 ml-4 flex items-center gap-1"
          >
            <span class="material-symbols-rounded text-[10px]">info</span>
            Таны мессеж Messenger рүү шууд илгээгдэнэ.
          </p>
        </footer>
      </UCard>

      <!-- Empty State for Chat Window -->
      <div
        v-else
        class="h-full flex flex-col items-center justify-center p-10 text-center opacity-40"
      >
        <div
          class="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-6"
        >
          <span class="material-symbols-rounded text-4xl text-zinc-400"
            >forum</span
          >
        </div>
        <h2
          class="text-xl font-black text-zinc-900 dark:text-white mb-2 underline decoration-primary-500 underline-offset-4 decoration-4"
        >
          Харилцаа сонгоно уу
        </h2>
        <p class="text-sm text-zinc-500 max-w-xs font-semibold">
          Зүүн гар талын жагсаалтаас хэрэглэгчээ сонгон чатны түүхийг харна уу.
        </p>
      </div>
    </div>

    <!-- Right Area: Summary -->
    <div
      v-if="selectedConversation"
      class="w-64 shrink-0 space-y-4 overflow-y-auto no-scrollbar hidden xl:block"
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

const updateStatus = async (newStatus) => {
  try {
    await $fetch(
      `${config.public.apiBase}/conversations/${selectedId.value}/status`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token.value}` },
        body: { status: newStatus },
      },
    );
    refresh();
    toast.add({ title: "Шинэчлэгдлээ", color: "green", size: "xs" });
  } catch (err) {}
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
