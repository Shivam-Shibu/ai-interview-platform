import { StreamCall } from '@stream-io/video-react-sdk';
import CallRoom from './CallRoom';

<StreamCall call={call}>
  <CallRoom
    callId={callId}
    token={token}
    apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
    currentUser={currentUser}
  />
</StreamCall>