/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as cabins from "../cabins.js";
import type * as crons from "../crons.js";
import type * as dashboard from "../dashboard.js";
import type * as lib_audit from "../lib/audit.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_dates from "../lib/dates.js";
import type * as lib_payments from "../lib/payments.js";
import type * as lib_plans from "../lib/plans.js";
import type * as lib_validate from "../lib/validate.js";
import type * as members from "../members.js";
import type * as memberships from "../memberships.js";
import type * as payments from "../payments.js";
import type * as seed from "../seed.js";
import type * as staff from "../staff.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  cabins: typeof cabins;
  crons: typeof crons;
  dashboard: typeof dashboard;
  "lib/audit": typeof lib_audit;
  "lib/auth": typeof lib_auth;
  "lib/dates": typeof lib_dates;
  "lib/payments": typeof lib_payments;
  "lib/plans": typeof lib_plans;
  "lib/validate": typeof lib_validate;
  members: typeof members;
  memberships: typeof memberships;
  payments: typeof payments;
  seed: typeof seed;
  staff: typeof staff;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
