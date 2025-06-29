import React from "react";

export function highlightText(text: string, keyword: string) {
    if (!keyword) return text
    const regex = new RegExp(
      `(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
      'gi',
    )
    const parts = text.split(regex)
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-black px-0 rounded-sm">
          {part}
        </mark>
      ) : (
        <span key={i}>{part}</span>
      ),
    )
  }
  