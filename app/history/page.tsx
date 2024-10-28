// app/history/page.tsx
'use client'

import { useEffect, useState } from 'react';
import styles from './history.module.scss';

interface ChatMessage {
  userId: string;
  groupId: number | null;
  jarvisMessage: string;
  userMessage: string;
  createdDate: number[];
}

export default function HistoryPage() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchChatHistory = async () => {
      try {
        const response = await fetch('https://moneygement-api.o-r.kr/api/history/bobsbeautifulife');
        if (!response.ok) {
          throw new Error('Failed to fetch chat history');
        }
        const data = await response.json();
        if (isMounted) {
          setChatHistory(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError('채팅 내역을 불러오는데 실패했습니다.');
          console.error('Error:', err);
          setLoading(false);
        }
      }
    };

    fetchChatHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRecommendationClick = (groupId: number) => {
    // 클릭 시 해당 그룹 ID를 사용하여 페이지 이동
    window.location.href = `/?gid=${groupId}`;
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.errorContainer}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Chat History</h1>
      
      <div className={styles.chatContainer}>
        {chatHistory.map((chat, index) => (
          <div 
            key={`${chat.userId}-${index}`} 
            className={styles.chatBlock}
          >
            <div className={styles.userMessage}>
              <div className={styles.messageContent}>
                {chat.userMessage}
              </div>
            </div>

            <div 
              className={`${styles.jarvisMessage} ${chat.groupId !== null ? styles.clickableMessage : ''}`}
              onClick={chat.groupId !== null ? () => handleRecommendationClick(chat.groupId!) : undefined}
              role={chat.groupId !== null ? "button" : undefined}
              tabIndex={chat.groupId !== null ? 0 : undefined}
            >
              <div className={styles.messageHeader}></div>
              <div className={styles.messageContent}>
                {chat.jarvisMessage}
                {chat.groupId !== null && (
                  <div className={styles.recommendationIndicator}>
                    🧐3D SIMULATION →
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}