import {
    Html,
    Head,
    Preview,
    Section,
    Row,
    Column,
    Text,
    Button,
  } from "@react-email/components";
  
  export default function WelcomeUser({ username = "user" }: { username: string }) {
    return (
      <Html style={{ colorScheme: "light" }}>
        <Head />
        <Preview>{username}님, LinkVerse에 오신 걸 환영해요!</Preview>
  
        <Section style={styles.wrapper}>
          <Row>
            <Column>
              <Text style={styles.heading}>🎉 {username}님, LinkVerse에 오신 걸 환영해요!</Text>
  
              <Text style={styles.text}>
                안녕하세요 <strong>{username}</strong>님 😊<br />
                LinkVerse에 함께하게 되어 정말 반가워요!
              </Text>
  
              <Text style={styles.text}>
                요즘 웹은 정말 넓고, 정보도 넘치죠.<br />
                그래서 우리, 종종 이런 고민을 하게 돼요:
              </Text>
  
              <Text style={styles.quote}>
                “그때 봤던 글, 어디서 본 거였지?”<br />
                “자료는 많은데 정리가 안 돼…”<br />
                “즐겨찾기는 많은데 찾기는 더 힘들어…”
              </Text>
  
              <Text style={styles.text}>
                이제는 <strong>LinkVerse</strong>로 간편하게 정리해보세요.<br />
                카테고리, 태그, 메모로 필요한 정보를 쏙쏙 꺼내 쓸 수 있어요.
              </Text>
  
              <Text style={styles.text}>
                자주 보는 사이트, 나중에 읽고 싶은 글,<br />
                관심 있는 콘텐츠들을 깔끔하게 모아두고<br />
                언제든 다시 꺼내볼 수 있는 <strong>나만의 지식 공간</strong>을 만들어보세요!
              </Text>
  
              <Button
                href="https://linkverse.app/"
                style={styles.button}
              >
                👉 첫 북마크 추가하러 가기
              </Button>
  
              <Text style={styles.footer}>감사합니다!<br />– LinkVerse 팀 드림</Text>
            </Column>
          </Row>
        </Section>
      </Html>
    );
  }
  
  const styles = {
    wrapper: {
      backgroundColor: "#f8fafc", // 더 밝은 배경
      padding: "40px 24px",
      fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(60, 80, 180, 0.08)",
      maxWidth: "480px",
      margin: "40px auto",
      border: "1px solid #e5e7eb",
    },
    heading: {
      fontSize: "22px",
      fontWeight: "bold" as const,
      marginBottom: "24px",
      color: "#2563eb", // 포인트 컬러
      letterSpacing: "-0.5px",
      textAlign: "center" as const,
    },
    text: {
      fontSize: "15px",
      lineHeight: "1.7",
      color: "#22223b",
      marginBottom: "18px",
      textAlign: "left" as const,
    },
    quote: {
        fontSize: "15px",
        lineHeight: "1.7",
        color: "#1e293b", // text-slate-800
        fontStyle: "italic",
        backgroundColor: "#f1f5f9", // slate-100
        padding: "16px 18px",
        borderLeft: "4px solid #3b82f6",
        borderRadius: "8px",
        marginBottom: "18px",
        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.06)",
      },
    button: {
      display: "inline-block",
      padding: "14px 32px",
      background: "linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)",
      color: "#fff",
      borderRadius: "8px",
      fontWeight: "bold" as const,
      fontSize: "15px",
      textDecoration: "none",
      marginTop: "28px",
      boxShadow: "0 2px 8px rgba(59, 130, 246, 0.10)",
      border: "none",
      transition: "background 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    },
    footer: {
      fontSize: "13px",
      color: "#64748b",
      marginTop: "44px",
      textAlign: "center" as const,
      letterSpacing: "0.1px",
    },
  };
  