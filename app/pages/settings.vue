<template>
  <div class="max-w-4xl space-y-8">
    <header>
      <h1
        class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white"
      >
        Тохиргоо
      </h1>
      <p class="text-zinc-500 mt-2 font-medium">
        Системийн холболт болон AI-ийн зан араншинг тохируулах
      </p>
    </header>

    <div class="space-y-6">
      <!-- Google Sheets Connection -->
      <UCard :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }">
        <template #header>
          <h3
            class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
          >
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 mr-3"
            >
              <span
                class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
                >leaderboard</span
              >
            </div>
            Google Sheets Холболт
          </h3>
        </template>

        <div class="space-y-6">
          <div class="space-y-3">
            <label
              class="text-xs font-bold uppercase tracking-wider text-zinc-500"
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
              class="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <div class="flex items-start gap-3">
                <span
                  class="material-symbols-rounded text-amber-500 text-lg mt-0.5"
                  >info</span
                >
                <div class="space-y-2 flex-1">
                  <p
                    class="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed"
                  >
                    Манай үйлчилгээний хаягийг Sheets-дээ
                    <span class="font-bold text-zinc-900 dark:text-white"
                      >Editor</span
                    >
                    эрхээр нэмнэ үү:
                  </p>
                  <div
                    class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
                  >
                    <code
                      class="flex-1 bg-white dark:bg-zinc-800 px-3 py-2.5 rounded-xl text-primary-500 font-bold text-[11px] border border-zinc-100 dark:border-zinc-700 break-all sm:truncate text-center sm:text-left"
                    >
                      sheets-writer@order-bot-487704.iam.gserviceaccount.com
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

          <!-- AI Mapping Results -->
          <div
            v-if="analysisResult"
            class="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800"
          >
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-black uppercase tracking-widest text-primary-500"
                >AI-ийн таамагласан бүтцийг баталгаажуулах</span
              >
              <UBadge size="xs" color="primary" variant="subtle"
                >Confidence:
                {{
                  (analysisResult.mapping.confidence * 100).toFixed(0)
                }}%</UBadge
              >
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div
                v-for="(col, key) in analysisResult.mapping.mapping"
                :key="key"
                class="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800"
              >
                <p class="text-[9px] font-bold text-zinc-400 uppercase mb-1">
                  {{ key }}
                </p>
                <p
                  class="text-[11px] font-black text-zinc-900 dark:text-white truncate"
                  :title="col"
                >
                  {{ col || "Олдоогүй" }}
                </p>
              </div>
            </div>

            <div
              class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl flex items-center gap-3"
            >
              <span class="material-symbols-rounded text-blue-500 text-sm"
                >task_alt</span
              >
              <p class="text-[11px] text-blue-700 dark:text-blue-300 flex-1">
                AI таны хүснэгтийг задлан шинжиллээ. Зөв бол
                <b>"Хадгалах"</b> товчийг дарж баталгаажуулна уу.
              </p>
              <UButton size="xs" @click="confirmMapping">Зөв байна</UButton>
            </div>
          </div>

          <div class="flex justify-start gap-3 pt-6">
            <UButton
              variant="soft"
              color="neutral"
              icon="material-symbols:sparkles"
              :loading="analyzing"
              @click="analyzeSheet"
            >
              {{
                analysisResult ? "Дахин шинжлэх" : "AI-аар бүтэц тодорхойлох"
              }}
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- Delivery & Pickup Settings -->
      <UCard :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }">
        <template #header>
          <h3
            class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
          >
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 mr-3"
            >
              <span
                class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
                >local_shipping</span
              >
            </div>
            Хүргэлт & Очиж авах хаяг
          </h3>
        </template>

        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <p class="text-sm font-bold text-zinc-900 dark:text-white">
                Хүргэлт хийх үү?
              </p>
              <p class="text-xs text-zinc-500">
                Хэрэв унтраавал AI хэрэглэгчээс хаяг нэхэхгүй, зөвхөн очиж
                авахыг сануулна.
              </p>
            </div>
            <USwitch v-model="hasDelivery" />
          </div>

          <div
            v-if="!hasDelivery"
            class="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800"
          >
            <label
              class="text-xs font-bold uppercase tracking-wider text-zinc-500"
            >
              Очиж авах хаяг, цагийн хуваарь
            </label>
            <UTextarea
              v-model="pickupAddress"
              placeholder="Сүхбаатар дүүрэг, 1-р хороо, Хүүхдийн ордны замын эсрэг талд... (Өдөр бүр 10:00-20:00)"
              size="lg"
              :rows="3"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- AI Personality -->
    <UCard :ui="{ header: { base: 'bg-zinc-50/50 dark:bg-zinc-800/50' } }">
      <template #header>
        <h3
          class="font-black text-xs uppercase tracking-widest text-zinc-900 dark:text-white flex items-center"
        >
          <div
            class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 bg-zinc-100/80 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 group-hover:dark:ring-zinc-500 mr-3"
          >
            <span
              class="material-symbols-rounded text-xl text-zinc-600 dark:text-white transition-transform duration-500 group-hover:scale-110"
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
              class="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center"
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
                class="rounded-xl px-4 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                @click="instructions = t.value"
              >
                {{ t.name }}
              </UButton>
            </div>
          </div>

          <!-- Instruction Box -->
          <div class="space-y-3 flex flex-col min-h-[300px]">
            <label
              class="text-xs font-bold uppercase tracking-wider text-zinc-500"
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
            <p class="text-[10px] text-zinc-400">
              Зааварчилгаа нь AI-ийн хэрэглэгчтэй харилцах үндсэн дүрмийг
              тодорхойлно.
            </p>
          </div>
        </div>

        <div class="flex justify-end pt-6">
          <UButton
            size="lg"
            class="w-full sm:w-auto px-12"
            color="primary"
            :loading="saving"
            @click="saveSettings"
          >
            Тохиргоог Хадгалах
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
const sheetUrl = ref("");
const instructions = ref("");
const columnMapping = ref({
  name: "",
  price: "",
  stock: "",
  category: "",
  description: "",
});
const hasDelivery = ref(true);
const pickupAddress = ref("");
const loading = ref(false);
const saving = ref(false);
const status = ref(null);
const analysisResult = ref(null);
const analyzing = ref(false);
const copied = ref(false);
const config = useRuntimeConfig();

const confirmMapping = () => {
  if (analysisResult.value?.mapping?.mapping) {
    columnMapping.value = { ...analysisResult.value.mapping.mapping };
    useToast().add({
      title: "Баталгаажлаа",
      description:
        "AI-ийн бүтцийг хүлээн авлаа. 'Хадгалах' товчийг дарж дуусгана уу.",
      color: "green",
    });
  }
};

const analyzeSheet = async () => {
  if (!sheetUrl.value) return;
  analyzing.value = true;
  analysisResult.value = null;
  try {
    const response = await $fetch(`${config.public.apiBase}/sync/analyze`, {
      method: "POST",
      body: { sheetUrl: sheetUrl.value },
    });
    if (response.success) {
      analysisResult.value = response.data;
      useToast().add({
        title: "Шинжилгээ дууслаа",
        description: "AI таны хүснэгтийн бүтцийг таньж чадлаа.",
        color: "blue",
      });
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    useToast().add({
      title: "Алдаа",
      description: error.data?.message || "Шинжилхэд алдаа гарлаа.",
      color: "red",
    });
  } finally {
    analyzing.value = false;
  }
};

// Load initial settings
onMounted(async () => {
  try {
    const response = await $fetch(`${config.public.apiBase}/stores/settings`);
    if (response.success) {
      sheetUrl.value = response.data.sheetUrl || "";
      instructions.value = response.data.customInstructions || "";
      if (response.data.columnMapping) {
        columnMapping.value = { ...response.data.columnMapping };
      }
      hasDelivery.value = response.data.hasDelivery ?? true;
      pickupAddress.value = response.data.pickupAddress || "";
    }
  } catch (error) {
    console.error("Failed to load settings:", error);
  }
});

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
    "sheets-writer@order-bot-487704.iam.gserviceaccount.com",
  );
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
};

const saveSettings = async () => {
  saving.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/stores/settings`, {
      method: "PATCH",
      body: {
        customInstructions: instructions.value,
        sheetUrl: sheetUrl.value,
        columnMapping: columnMapping.value,
        hasDelivery: hasDelivery.value,
        pickupAddress: pickupAddress.value,
      },
    });

    if (response.success) {
      useToast().add({
        title: "Амжилттай",
        description: "Тохиргоог хадгаллаа.",
        color: "green",
      });
    }
  } catch (error) {
    console.error("Save failed:", error);
    useToast().add({
      title: "Алдаа",
      description: error.data?.message || "Хадгалахад алдаа гарлаа.",
      color: "red",
    });
  } finally {
    saving.value = false;
  }
};

const testConnection = async () => {
  if (!sheetUrl.value) {
    status.value = {
      success: false,
      title: "Алдаа",
      message: "Spreadsheet URL-г оруулна уу",
    };
    return;
  }

  loading.value = true;
  status.value = null;

  try {
    const config = useRuntimeConfig();
    const response = await $fetch(`${config.public.apiBase}/sync/verify`, {
      method: "POST",
      body: { sheetUrl: sheetUrl.value },
    });

    if (response.success) {
      status.value = {
        success: true,
        title: "Холболт амжилттай",
        message: `Таны "${response.title}" (${response.sheetName}) spreadsheet-ээс ${response.rowCount} мөр олдлоо. Толгой: ${response.headers.join(", ")}`,
      };
    }
  } catch (error) {
    console.error("Connection failed:", error);
    status.value = {
      success: false,
      title: "Холболт амжилтгүй",
      message:
        error.data?.message ||
        "Сервертэй холбогдоход алдаа гарлаа. Та эрхээ шалгана уу.",
    };
  } finally {
    loading.value = false;
  }
};
</script>
