import { redirect, notFound } from "next/navigation";
import { getCallData } from "@/actions/call";

import CallRoom from "@/app/(main)/call/[callId]/_components/CallRoom";
import CallUI from "@/app/(main)/call/[callId]/_components/CallUI";
import AIQuestions from "@/app/(main)/call/[callId]/_components/AIQuestions";
import ChatBox from "@/components/chat/ChatBox";

export default async function CallPage({ params }) {
  const { callId } = await params;

  if (!callId) return notFound();

  const result = await getCallData(callId);

  if (result?.error) return redirect("/");

  const { token, currentUser, booking, isInterviewer } = result;

  return (
    <div className="flex h-screen">

      {/* LEFT SIDE */}
      <div className="flex-1">
        <CallRoom
          callId={callId}
          token={token}
          apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
          currentUser={currentUser}
          booking={booking}
          isInterviewer={isInterviewer}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[350px] border-l p-4 overflow-y-auto">
        <CallUI callId={callId} booking={booking} />

        <AIQuestions categories={booking?.interviewer?.categories || []} />

        <ChatBox callId={callId} userId={currentUser?.id} />
      </div>

    </div>
  );
}