import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { loadSavedFont } from "@/lib/customFont";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/store/cart";

import appCss from "../styles.css?url";


function NotFoundComponent() {
  return (
    <div dir="rtl" className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">٤٠٤</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">الصفحة مش موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الرابط اللي دخلتيه غلط أو الصفحة اتشالت. يلا نرجعك عالرئيسية.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          صار خلل بسيط 😅
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          ما قدرنا نحمّل هالصفحة. جرّبي تحدّثي الصفحة، وإذا ضلّت المشكلة ارجعي للرئيسية أو راسلينا على واتساب.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            جرّبي مرة ثانية
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            الرجوع للرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#3E4A2E" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "جيران" },
      { name: "mobile-web-app-capable", content: "yes" },
      { title: "جيران — سوق الملابس المحتشمة المستعملة في الأردن" },
      { name: "description", content: "جيران: سوق أردني للملابس المحتشمة المستعملة بحالة ممتازة — قطعة واحدة لكل عرض، أسعار تناسب جيبك، والدفع عند الاستلام." },
      { property: "og:title", content: "جيران — سوق الملابس المستعملة" },
      { property: "og:description", content: "ملابس محتشمة مستعملة نظيفة من بيوتنا الأردنية. قطعة وحدة لكل عرض." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "جيران" },
      { name: "twitter:description", content: "سوق الملابس المحتشمة المستعملة في الأردن." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/11b73a9b-e479-4cc7-abb6-07b3a0ee1f36/id-preview-3afec974--9b852e9d-2d33-46d7-b5e0-e15ce6ea8fc9.lovable.app-1778482751168.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/11b73a9b-e479-4cc7-abb6-07b3a0ee1f36/id-preview-3afec974--9b852e9d-2d33-46d7-b5e0-e15ce6ea8fc9.lovable.app-1778482751168.png" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Aref+Ruqaa:wght@400;700&display=swap" },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { loadSavedFont(); installErrorMonitoring(); }, []);

  useEffect(() => {
    const { mergeLocalWishlistToDB, hydrateWishlistFromDB } = useCart.getState();
    // Initial hydration if a session already exists
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        mergeLocalWishlistToDB().then(() => hydrateWishlistFromDB());
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        mergeLocalWishlistToDB().then(() => hydrateWishlistFromDB());
      } else if (event === "SIGNED_OUT") {
        useCart.setState({ wishlist: [] });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-center" dir="rtl" richColors />
    </QueryClientProvider>
  );
}

