/**
 * Application Routes Configuration
 * 
 * This file defines all routes for the application using React Router's
 * file-based routing system. Routes are organized by feature and access level.
 * 
 * The structure uses layouts for shared UI elements and prefixes for route grouping.
 * This approach creates a hierarchical routing system that's both maintainable and scalable.
 */
import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  route("/robots.txt", "core/screens/robots.ts"),
  route("/sitemap.xml", "core/screens/sitemap.ts"),
  /*
  ...prefix("/debug", [
    // You should delete this in production.
    route("/sentry", "debug/sentry.tsx"),
    route("/analytics", "debug/analytics.tsx"),
  ]),
  */
  // API Routes. Routes that export actions and loaders but no UI.
  ...prefix("/api", [
    ...prefix("/settings", [
      route("/theme", "features/settings/api/set-theme.tsx"),
      route("/locale", "features/settings/api/set-locale.tsx"),
    ]),
    ...prefix("/users", [
      index("features/users/api/delete-account.tsx"),
      route("/password", "features/users/api/change-password.tsx"),
      route("/email", "features/users/api/change-email.tsx"),
      route("/profile", "features/users/api/edit-profile.tsx"),
      route("/providers", "features/users/api/connect-provider.tsx"),
      route(
        "/providers/:provider",
        "features/users/api/disconnect-provider.tsx",
      ),
    ]),
    ...prefix("/cron", [route("/mailer", "features/cron/api/mailer.tsx")]),
    ...prefix("/blog", [route("/og", "features/blog/api/og.tsx")]),
    ...prefix("/bookmarks", [
      route("/top", "features/bookmark/api/bookmarks-top.tsx"),
      route("/recent", "features/bookmark/api/bookmarks-recent.tsx"),
    ]),
  ]),

  layout("core/layouts/navigation.layout.tsx", [
    route("/auth/confirm", "features/auth/screens/confirm.tsx"),
    index("features/home/screens/home.tsx"),
    route("/error", "core/screens/error.tsx"),
    layout("core/layouts/public.layout.tsx", [
      // Routes that should only be visible to unauthenticated users.
      route("/login", "features/auth/screens/login.tsx"),
      route("/join", "features/auth/screens/join.tsx"),
      ...prefix("/auth", [
        route("/api/resend", "features/auth/api/resend.tsx"),
        route(
          "/forgot-password/reset",
          "features/auth/screens/forgot-password.tsx",
        ),
        route("/magic-link", "features/auth/screens/magic-link.tsx"),
        ...prefix("/otp", [
          route("/start", "features/auth/screens/otp/start.tsx"),
          route("/complete", "features/auth/screens/otp/complete.tsx"),
        ]),
        ...prefix("/social", [
          route("/start/:provider", "features/auth/screens/social/start.tsx"),
          route(
            "/complete/:provider",
            "features/auth/screens/social/complete.tsx",
          ),
        ]),
      ]),
    ]),
    layout("core/layouts/private.layout.tsx", { id: "private-auth" }, [
      ...prefix("/auth", [
        route(
          "/forgot-password/create",
          "features/auth/screens/new-password.tsx",
        ),
        route("/email-verified", "features/auth/screens/email-verified.tsx"),
      ]),
      // Routes that should only be visible to authenticated users.
      route("/logout", "features/auth/screens/logout.tsx"),
    ]),
    route("/contact", "features/contact/screens/contact-us.tsx"),
    route("/faq", "features/contact/screens/faq.tsx"),
    ...prefix("/payments", [
      route("/checkout", "features/payments/screens/checkout.tsx"),
      layout("core/layouts/private.layout.tsx", { id: "private-payments" }, [
        route("/success", "features/payments/screens/success.tsx"),
        route("/failure", "features/payments/screens/failure.tsx"),
      ]),
    ]),
  ]),

  layout("core/layouts/private.layout.tsx", { id: "private-dashboard" }, [
    layout("features/users/layouts/dashboard.layout.tsx", [
      /*
      ...prefix("/dashboard", [
        index("features/users/screens/dashboard.tsx"),
        route("/payments", "features/payments/screens/payments.tsx"),
      ]),
      */
      route("/account/edit", "features/users/screens/account.tsx"),
      route("/settings", "features/users/screens/settings.tsx"),
    ]),
  ]),

  ...prefix("/users/:username", [
    route("/welcome", "features/users/mail/welcome.tsx"),
  ]),

  ...prefix("/legal", [route("/:slug", "features/legal/screens/policy.tsx")]),

  /*
  layout("features/blog/layouts/blog.layout.tsx", [
    ...prefix("/blog", [
      index("features/blog/screens/posts.tsx"),
      route("/:slug", "features/blog/screens/post.tsx"),
    ]),
  ]),
  */

  layout("features/home/layouts/home.layout.tsx", [
    route("/space", "features/home/screens/space.tsx"),
  ]),

  layout("features/bookmark/layouts/bookmark.layout.tsx", {id: "bookmark-layout"}, [
    ...prefix("/bookmarks", [
      index("features/bookmark/screens/bookmarks.tsx"),
      route("/api/category", "features/bookmark/api/category-add.tsx"),
      route("/api/category/:id", "features/bookmark/api/category-edit.tsx"),
      route("/api/bookmark/add", "features/bookmark/api/bookmark-add.tsx"),
      route("/api/bookmark/:id", "features/bookmark/api/bookmark-edit.tsx"),
      route("/api/bookmark-click/:id", "features/bookmark/api/bookmark-click.tsx"),
    ]),
  ]),

  layout("features/tag/layouts/tag.layout.tsx", [
    ...prefix("/tags", [
      index("features/tag/screens/tags.tsx"),
      route("/:id", "features/tag/screens/tag-contents.tsx"),
      route("/api/tag/:id", "features/tag/api/tag-edit.tsx"),
      route("/api/untag/:id", "features/tag/api/untag-add.tsx"),
    ]),
  ]),

  layout("features/memo/layouts/memo.layout.tsx", [
    ...prefix("/memos", [
      index("features/memo/screens/memos.tsx"),
      route("/:id", "features/memo/screens/memo-detail.tsx"),
      route("/api/memo/:id", "features/memo/api/memo-edit.tsx"),
    ]),
  ]),

  layout("features/tag/layouts/untag.layout.tsx", [
    ...prefix("/untagged", [
      index("features/tag/screens/untagged.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
