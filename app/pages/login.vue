<template>
  <div
    class="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden"
  >
    <!-- Premium Background Effects -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]"
    ></div>
    <div
      class="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px]"
    ></div>

    <UCard
      class="w-full max-auto max-w-md relative z-10 border-zinc-200/50 dark:border-zinc-800/50 shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl"
    >
      <div class="p-8 space-y-8 text-center">
        <!-- Logo/Icon Section -->
        <div class="flex flex-col items-center space-y-4">
          <div
            class="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-800 ring-1 ring-zinc-200/50 dark:ring-zinc-700 flex items-center justify-center shadow-inner"
          >
            <span
              class="material-symbols-rounded text-4xl text-primary-500 animate-pulse"
              >smart_toy</span
            >
          </div>
          <div class="space-y-1">
            <h1
              class="text-3xl font-black tracking-tight text-zinc-900 dark:text-white uppercase"
            >
              Smart Order
            </h1>
            <p
              class="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase"
            >
              AI Social Commerce
            </p>
          </div>
        </div>

        <div class="space-y-2 pt-4">
          <h2 class="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            Тавтай морил
          </h2>
          <p class="text-sm text-zinc-500 dark:text-zinc-400">
            Өөрийн Facebook хаягаар нэвтэрч системээ удирдана уу.
          </p>
        </div>

        <div class="pt-6">
          <UButton
            block
            size="xl"
            color="primary"
            variant="solid"
            class="font-black rounded-full! py-4 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/30 transition-all active:scale-[0.98] relative group overflow-hidden"
            :loading="loading"
            @click="handleFacebookLogin"
          >
            <template #leading>
              <UIcon name="i-logos-facebook" class="text-xl" />
            </template>
            Facebook-ээр нэвтрэх

            <!-- Hover Effect Reveal -->
            <div
              class="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
            ></div>
          </UButton>

          <p
            class="mt-8 text-[10px] text-zinc-400 uppercase font-black tracking-widest leading-loose"
          >
            Та нэвтэрснээр манай <br />
            <a href="#" class="text-primary-500 hover:underline"
              >Үйлчилгээний нөхцөл</a
            >
            болон
            <a href="#" class="text-primary-500 hover:underline"
              >Нууцлалын бодлого</a
            >-г зөвшөөрч буй хэрэг юм.
          </p>
        </div>
      </div>
    </UCard>

    <!-- Footer Branding -->
    <div class="absolute bottom-8 left-0 right-0 text-center">
      <p
        class="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-300 dark:text-zinc-800"
      >
        Engineered by yesuukhei
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "blank",
});

const { loginWithFacebook } = useAuth();
const toast = useToast();
const loading = ref(false);

const config = useRuntimeConfig();

// Initialize Facebook SDK
onMounted(() => {
  window.fbAsyncInit = function () {
    FB.init({
      appId: config.public.facebookAppId, // Your APP ID
      cookie: true,
      xfbml: true,
      version: "v18.0",
    });
  };

  (function (d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
});

const handleFacebookLogin = () => {
  loading.value = true;

  if (typeof FB === "undefined") {
    toast.add({
      title: "Алдаа",
      description: "Facebook SDK ачаалж байна, түр хүлээнэ үү.",
      color: "red",
    });
    loading.value = false;
    return;
  }

  FB.login(
    (response) => {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;
        processLogin(accessToken);
      } else {
        loading.value = false;
        toast.add({
          title: "Цуцлагдсан",
          description: "Facebook-ээр нэвтрэх үйлдлийг цуцаллаа.",
          color: "amber",
        });
      }
    },
    { scope: "public_profile,email" },
  );
};

const processLogin = async (accessToken) => {
  const success = await loginWithFacebook(accessToken);
  if (success) {
    toast.add({
      title: "Амжилттай",
      description: "Системд нэвтэрлээ.",
      color: "green",
    });
    navigateTo("/");
  } else {
    loading.value = false;
    toast.add({
      title: "Алдаа",
      description: "Нэвтрэхэд алдаа гарлаа. Дахин оролдоно уу.",
      color: "red",
    });
  }
};
</script>

<style scoped>
.font-black {
  font-family: "Inter", sans-serif;
}
</style>
