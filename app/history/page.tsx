// app/history/page.tsx
'use client'

import { useEffect, useState } from 'react';
import styles from './history.module.scss';
import { ChatMessage } from '../types/chat';

export default function HistoryPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 임시 데이터로 UI 구현 (실제로는 backend.co.kr API 호출)
    const mockData: ChatMessage[] = [
      {
        recommendationGroupId: "1",
        userMessage: "안녕하세요!",
        jarvisMessage: "안녕하세요, 무엇을 도와드릴까요?"
      },
      {
        recommendationGroupId: "2",
        userMessage: "오늘 날씨 어때요?",
        jarvisMessage: "오늘은 맑은 날씨가 예상됩니다."
      },
      {
        recommendationGroupId: "3",
        userMessage: "근처 맛집 추천해주세요",
        jarvisMessage: "현재 위치 근처에 평점이 높은 레스토랑들을 찾아보았습니다. 이탈리안 레스토랑 \"La Cucina\", 한식당 \"맛있는 밥상\", 일식당 \"스시마루\"가 있습니다."
      }
    ];

    // 실제 구현시에는 아래 주석을 해제하고 사용
    // const fetchChatHistory = async () => {
    //   try {
    //     const response = await fetch('backend.co.kr?userid=user123');
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch chat history');
    //     }
    //     const data = await response.json();
    //     setChatHistory(data);
    //   } catch (err) {
    //     setError('채팅 내역을 불러오는데 실패했습니다.');
    //     console.error('Error:', err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchChatHistory();

    // 임시 데이터 사용
    setChatHistory(mockData);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className={styles.loadingContainer}>로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chat History</h1>
      
      <div className={styles.chatContainer}>
        {chatHistory.map((chat) => (
          <div key={chat.recommendationGroupId} className={styles.chatBlock}>
            <div className={styles.userMessage}>
              <div className={styles.messageContent}>
                {chat.userMessage}
              </div>
            </div>

            <div className={styles.jarvisMessage}>
              <div className={styles.messageHeader}></div>
              <div className={styles.messageContent}>
                {chat.jarvisMessage}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}