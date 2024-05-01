import { MultiChatSocket, MultiChatWindow, useMultiChatLogic } from "react-chat-engine-advanced";

const ChatsPage = (props) => {
  const chatProps = useMultiChatLogic('7e2cd24a-1ede-48c3-beb9-9ff56f2e5ef6',props.user.username, props.user.secret);
  return (
    <div style={{height:'100vh'}}> 
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow {...chatProps} style={{height: '100%'}} />
    </div>
  );
};

export default ChatsPage;