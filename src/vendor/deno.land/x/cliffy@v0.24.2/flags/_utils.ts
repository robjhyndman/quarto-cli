import type { IFlagOptions } from "./types.ts";
import { distance } from "../_utils/distance.ts";

/** Convert param case string to camel case. */
export function paramCaseToCamelCase(str: string): string {
  return str.replace(
    /-([a-z])/g,
    (g) => g[1].toUpperCase(),
  );
}

/** Convert underscore case string to camel case. */
export function underscoreToCamelCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase()
    .replace(
      /_([a-z])/g,
      (g) => g[1].toUpperCase(),
    );
}

/**
 * Find option by flag, name or alias.
 *
 * @param flags Source options array.
 * @param name  Name of the option.
 */
export function getOption<O extends IFlagOptions>(
  flags: Array<O>,
  name: string,
): O | undefined {
  while (name[0] === "-") {
    name = name.slice(1);
  }

  for (const flag of flags) {
    if (isOption(flag, name)) {
      return flag;
    }
  }

  return;
}

export function didYouMeanOption(
  option: string,
  options: Array<IFlagOptions>,
): string {
  const optionNames = options
    .map((option) => [option.name, ...(option.aliases ?? [])])
    .flat()
    .map((option) => getFlag(option));
  return didYouMean(" Did you mean option", getFlag(option), optionNames);
}

export function didYouMeanType(type: string, types: Array<string>): string {
  return didYouMean(" Did you mean type", type, types);
}

export function didYouMean(
  message: string,
  type: string,
  types: Array<string>,
): string {
  const match: string | undefined = closest(type, types);
  return match ? `${message} "${match}"?` : "";
}

export function getFlag(name: string) {
  if (name.startsWith("-")) {
    return name;
  }
  if (name.length > 1) {
    return `--${name}`;
  }
  return `-${name}`;
}

/**
 * Check if option has name or alias.
 *
 * @param option    The option to check.
 * @param name      The option name or alias.
 */
function isOption(option: IFlagOptions, name: string) {
  return option.name === name ||
    (option.aliases && option.aliases.indexOf(name) !== -1);
}

export function matchWildCardOptions(
  name: string,
  flags: Array<IFlagOptions>,
): IFlagOptions | undefined {
  for (const option of flags) {
    if (option.name.indexOf("*") === -1) {
      continue;
    }
    let matched = matchWildCardOption(name, option);
    if (matched) {
      matched = { ...matched, name };
      flags.push(matched);
      return matched;
    }
  }
}

function matchWildCardOption(
  name: string,
  option: IFlagOptions,
): IFlagOptions | false {
  const parts = option.name.split(".");
  const parts2 = name.split(".");
  if (parts.length !== parts2.length) {
    return false;
  }
  const count = Math.max(parts.length, parts2.length);
  for (let i = 0; i < count; i++) {
    if (parts[i] !== parts2[i] && parts[i] !== "*") {
      return false;
    }
  }
  return option;
}

function closest(str: string, arr: string[]): string | undefined {
  let minDistance = Infinity;
  let minIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    const dist = distance(str, arr[i]);
    if (dist < minDistance) {
      minDistance = dist;
      minIndex = i;
    }
  }
  return arr[minIndex];
}

export function getDefaultValue(option: IFlagOptions): unknown {
  return typeof option.default === "function"
    ? option.default()
    : option.default;
}
