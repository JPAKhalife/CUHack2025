import { getHtmlTags, getViteConfig } from "./helpers";
import { GadgetPluginOptions } from "./types";
import { patchOverlay } from "../core/errors/overlay";

/**
 * Vite plugin that is used to configure the Vite build process for the Gadget application.
 */
export const gadget = (options?: GadgetPluginOptions) => {
  

  /**
   * Available frontend type:
   * - "remix"
   * - "react-router-framework"
   * - "vite"
   */
  let frontendType: any;
  let command: "serve" | "build";

  return {
    name: "gadget-vite-plugin",
    config: async (config: any, env: any) => {
      
        const result = await getViteConfig(config, env, {
          plugin: options,
          params: {
            assetsBucketDomain: "app-assets.gadget.dev",
            applicationId: "217028",
            productionEnvironmentId: "436384",
            developmentEnvironmentVariables: {"GADGET_APP":"shapesplosion","GADGET_ENV":"jpa-khalife-dev","GADGET_PUBLIC_APP_SLUG":"shapesplosion","GADGET_PUBLIC_APP_ENV":"jpa-khalife-dev"},
            productionEnvironmentVariables: {"GADGET_APP":"shapesplosion","GADGET_ENV":"production","GADGET_PUBLIC_APP_SLUG":"shapesplosion","GADGET_PUBLIC_APP_ENV":"production"},
          },
        });

        frontendType = result.type;
        command = result.command;

        return result.config;
      
    },
    transformIndexHtml: {
      order: "pre",
      handler: (html: string, { server }: any) => {
        
        if(frontendType !== "vite") {
          return [];
        }

        const tags = getHtmlTags({
          hasAppBridgeV4: false,
          hasBigCommerceConnection: false,
          assetsDomain: "assets.gadget.dev",
          hasShopifyConnection: false,
        }, !!server);

        return tags;
        
      }
    },
    transform(src: any, id: any, opts: any) {
      
      if (id.includes("vite/dist/client/client.mjs")) {
        if (opts.ssr) return;
        return {
          code: patchOverlay(src, "jpa-khalife-dev"),
          };
        }
      

      if(frontendType !== "vite" && command === "serve" && (id.endsWith("/web/root.tsx") || id.endsWith("/web/root.jsx"))) {
        return {
          code: src + `
if(typeof window !== "undefined") {
  const script = window.document.createElement("script");
  script.src = "https://assets.gadget.dev/assets/devHarness.min.js";
  window.document.head.appendChild(script);


}
`
        }
      }
    }
  } as any;
}
