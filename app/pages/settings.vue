<template>
  <div class="max-w-4xl space-y-8">
    <header>
      <h1
        class="text-3xl font-black tracking-tighter text-neutral-900 dark:text-white"
      >
        Тохиргоо
      </h1>
      <p class="text-neutral-500 mt-2 font-medium">
        Системийн холболт болон AI-ийн зан араншинг тохируулах
      </p>
    </header>

    <div class="space-y-6">
      <!-- Google Sheets Connection -->
      <UCard
        :ui="{ header: { base: 'bg-neutral-50/50 dark:bg-neutral-900/50' } }"
      >
        <template #header>
          <h3
            class="font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white flex items-center"
          >
            <div
              class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3"
            >
              <span
                class="material-symbols-rounded text-sm text-neutral-500 dark:text-neutral-400"
                >leaderboard</span
              >
            </div>
            Google Sheets Холболт
          </h3>
        </template>

        <div class="space-y-6">
          <div class="space-y-3">
            <label
              class="text-xs font-bold uppercase tracking-wider text-neutral-500"
              >Spreadsheet URL</label
            >
            <div class="flex flex-col sm:flex-row gap-3">
              <UInput
                v-model="sheetUrl"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                class="flex-1"
                size="lg"
              />
              <UButton @click="testConnection" :loading="loading">
                Холболт шалгах
              </UButton>
            </div>

            <div
              class="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800"
            >
              <div class="flex items-start gap-3">
                <span
                  class="material-symbols-rounded text-amber-500 text-lg mt-0.5"
                  >info</span
                >
                <div class="space-y-2 flex-1">
                  <p
                    class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed"
                  >
                    Манай үйлчилгээний хаягийг Sheets-дээ
                    <span class="font-bold text-neutral-900 dark:text-white"
                      >Editor</span
                    >
                    эрхээр нэмнэ үү:
                  </p>
                  <div
                    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  >
                    <code
                      class="flex-1 bg-white dark:bg-neutral-800 px-3 py-2.5 rounded-xl text-primary-500 font-bold text-[11px] border border-neutral-100 dark:border-neutral-700 break-all sm:truncate text-center sm:text-left"
                    >
                      bot-service@info-automation.iam.gserviceaccount.com
                    </code>
                    <UButton
                      color="neutral"
                      variant="subtle"
                      size="md"
                      @click="copyEmail"
                      class="justify-center"
                    >
                      <span class="material-symbols-rounded text-sm mr-1">{{
                        copied ? "check" : "content_copy"
                      }}</span>
                      {{ copied ? "Хууллаа!" : "Хуулах" }}
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connection Status Alert -->
          <UAlert
            v-if="status"
            :title="status.title"
            :description="status.message"
            :icon="
              status.success
                ? 'i-heroicons-check-circle'
                : 'i-heroicons-x-circle'
            "
            :color="status.success ? 'success' : 'error'"
            variant="subtle"
          />
        </div>
      </UCard>

      <!-- AI Personality -->
      <UCard
        :ui="{ header: { base: 'bg-neutral-50/50 dark:bg-neutral-900/50' } }"
      >
        <template #header>
          <h3
            class="font-black text-xs uppercase tracking-widest text-neutral-900 dark:text-white flex items-center"
          >
            <div
              class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mr-3"
            >
              <span
                class="material-symbols-rounded text-sm text-neutral-500 dark:text-neutral-400"
                >smart_toy</span
              >
            </div>
            AI Зан араншин (Tone of Voice)
          </h3>
        </template>

        <div class="space-y-8">
          <div class="space-y-6">
            <!-- Personality Templates -->
            <div class="space-y-3">
              <span
                class="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center"
              >
                Загвар ашиглах
              </span>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="t in templates"
                  :key="t.name"
                  variant="subtle"
                  color="neutral"
                  size="xs"
                  class="rounded-xl px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  @click="instructions = t.value"
                >
                  {{ t.name }}
                </UButton>
              </div>
            </div>

            <!-- Instruction Box -->
            <div class="space-y-3 flex flex-col min-h-[300px]">
              <label
                class="text-xs font-bold uppercase tracking-wider text-neutral-500"
              >
                System Instructions
              </label>
              <UTextarea
                v-model="instructions"
                placeholder="Чи бол найрсаг, залуулаг дэлгүүрийн туслах..."
                class="grow"
                :rows="10"
                :ui="{ base: 'h-full resize-none' }"
              />
              <p class="text-[10px] text-neutral-400">
                Зааварчилгаа нь AI-ийн хэрэглэгчтэй харилцах үндсэн дүрмийг
                тодорхойлно.
              </p>
            </div>
          </div>

          <div class="flex justify-end pt-6">
            <UButton size="lg" class="w-full sm:w-auto px-12" color="primary">
              Тохиргоог Хадгалах
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const sheetUrl = ref("");
const instructions = ref("");
const loading = ref(false);
const status = ref(null);
const copied = ref(false);

const templates = [
  {
    name: "Найрсаг 🌟",
    value: "Найрсаг, залуулаг, туслахдаа бэлэн зан араншин. Эможи их ашиглана.",
  },
  {
    name: "Мэргэжлийн 💼",
    value: "Боловсон, цэгцтэй, албаны хэллэгтэй харилцана.",
  },
  {
    name: "Шууд & Хурдан ✨",
    value: "Богино, тодорхой, хамгийн гол мэдээллийг хурдан өгнө.",
  },
];

const copyEmail = () => {
  navigator.clipboard.writeText(
    "bot-service@info-automation.iam.gserviceaccount.com",
  );
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const testConnection = () => {
  loading.value = true;
  status.value = null;
  setTimeout(() => {
    loading.value = false;
    status.value = {
      success: true,
      title: "Холболт амжилттай",
      message: 'Таны "Summer Sale 2024" spreadsheet-ээс 42 бараа олдлоо.',
    };
  }, 1500);
};
</script>
