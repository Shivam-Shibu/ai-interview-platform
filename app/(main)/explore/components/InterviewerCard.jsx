"use client";

import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ ADD
import { Video } from "lucide-react"; // ✅ ADD

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CATEGORY_LABEL } from "@/lib/data";
import { formatTime } from "@/lib/helpers";

export default function InterviewerCard({ interviewer }) {
  const router = useRouter(); // ✅ ADD

  const {
    id,
    name,
    imageUrl,
    title,
    company,
    yearsExp,
    bio,
    categories,
    creditRate,
    availabilities,
    streamCallId, // ✅ IMPORTANT (agar DB me hai)
  } = interviewer;

  const availability = availabilities?.[0];

  return (
    <Card className="relative border border-white/10 hover:border-amber-400/20">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-amber-400/5 via-transparent to-transparent" />

      <CardContent className="flex flex-col gap-5">
        {/* Top */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 border border-white/10 shrink-0">
              <AvatarImage src={imageUrl} alt={name} />
              <AvatarFallback className="bg-amber-400/10 border border-amber-400/20 text-amber-400 text-sm font-medium">
                {name?.[0] ?? "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="text-sm font-medium text-stone-200">
                {name}
              </p>
              {title && company && (
                <p className="text-xs text-stone-500">
                  {title} · {company}
                </p>
              )}
            </div>
          </div>

          {yearsExp && (
            <Badge
              variant="outline"
              className="border-white/10 text-stone-500 text-xs"
            >
              {yearsExp}+ yrs
            </Badge>
          )}
        </div>

        {/* Bio */}
        {bio && (
          <p className="text-xs text-stone-400 line-clamp-2">
            {bio}
          </p>
        )}

        {/* Categories */}
        {categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className="text-xs px-2.5 py-1 rounded-lg border border-amber-400/20 bg-amber-400/5 text-amber-400"
              >
                {CATEGORY_LABEL[cat] ?? cat}
              </span>
            ))}

            {categories.length > 4 && (
              <span className="text-xs px-2.5 py-1 rounded-lg border border-white/10 text-stone-600">
                +{categories.length - 4} more
              </span>
            )}
          </div>
        )}

        <Separator />

        {/* Bottom */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-lg font-serif bg-gradient-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent">
              {creditRate ?? 10}
              <span className="text-xs text-stone-500 ml-1">
                credits / session
              </span>
            </p>

            {availability ? (
              <p className="text-xs text-stone-600">
                🟢 {formatTime(availability.startTime)} –{" "}
                {formatTime(availability.endTime)}
              </p>
            ) : (
              <p className="text-xs text-stone-700">
                No availability set
              </p>
            )}
          </div>

          {/* 👉 RIGHT SIDE BUTTONS */}
          <div className="flex gap-2">
            {/* 🔥 START CALL BUTTON */}
            <Button
              size="sm"
              onClick={() =>
                router.push(`/call/${streamCallId || "test123"}`)
              }
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
            >
              <Video size={16} />
            </Button>

            {/* PROFILE BUTTON */}
            <Link href={`/interviewers/${id}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-amber-400/20 text-amber-400 hover:bg-amber-400/10 hover:border-amber-400/40"
              >
                View →
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}