"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { CATEGORY_LABEL } from "@/lib/data";
import { generateInterviewQuestions } from "@/actions/aiQuestions";
import useFetch from "@/hooks/use-fetch";

export default function AIQuestionsPanel({ categories }) {
  // ✅ Safe categories fallback
  const safeCategories = useMemo(() => {
    return categories && categories.length > 0
      ? categories
      : ["dsa", "hr", "system_design"];
  }, [categories]);

  // ✅ Always valid default
  const [selectedCategory, setSelectedCategory] = useState(
    safeCategories[0]
  );

  const {
    data,
    loading,
    error,
    fn: generateFn,
  } = useFetch(generateInterviewQuestions);

  const questions = data?.questions ?? [];

  return (
    <div className="flex flex-col gap-4 h-full overflow-hidden text-white">
      
      {/* 🔹 Category selector */}
      <div className="flex flex-wrap gap-2">
        {safeCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
              selectedCategory === cat
                ? "border-amber-400 bg-amber-400/10 text-amber-400"
                : "border-white/10 text-stone-400 hover:border-white/20 hover:text-white"
            }`}
          >
            {CATEGORY_LABEL?.[cat] || cat}
          </button>
        ))}
      </div>

      {/* 🔹 Generate button */}
      <Button
        variant="gold"
        size="sm"
        disabled={loading || !selectedCategory}
        onClick={() => generateFn({ category: selectedCategory })}
        className="self-start gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={14} />
            Generate Questions
          </>
        )}
      </Button>

      {/* 🔹 Error */}
      {error && (
        <p className="text-xs text-red-400">
          {error?.message || "Something went wrong"}
        </p>
      )}

      {/* 🔹 Questions */}
      {questions.length > 0 ? (
        <div className="flex flex-col gap-3 overflow-y-auto flex-1 pr-1">
          {questions.map((q, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-[#141417] p-4"
            >
              <p className="text-sm text-white font-medium">
                {i + 1}. {q.question}
              </p>

              <div className="h-px bg-white/10 my-2" />

              <p className="text-xs text-stone-400">
                <span className="text-amber-400 font-medium">
                  Answer:{" "}
                </span>
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Sparkles size={16} className="text-amber-400" />
          </div>

          <p className="text-xs text-stone-500">
            Select a category and generate interview questions.
          </p>
        </div>
      )}
    </div>
  );
}