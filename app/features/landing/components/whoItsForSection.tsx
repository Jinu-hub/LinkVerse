// app/features/landing/components/WhoItsForSection.tsx

export default function WhoItsForSection() {
    const users = [
      {
        title: "👩‍💻 개발자",
        desc: "기술 문서, 오픈소스 링크를 태그와 함께 정리하고 빠르게 복기할 수 있어요.",
      },
      {
        title: "🎨 디자이너",
        desc: "레퍼런스 링크를 모으고, 메모로 아이디어를 덧붙여요.",
      },
      {
        title: "🧠 창작자 & 블로거",
        desc: "콘텐츠 아이디어를 북마크와 함께 메모로 정리할 수 있어요.",
      },
      {
        title: "📚 학생",
        desc: "학습 자료를 링크 + 메모 형태로 정리하며 복습을 돕습니다.",
      },
    ]
  
    return (
      <section className="bg-white dark:bg-zinc-900 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">누구를 위한 서비스인가요?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
            {users.map((user, idx) => (
              <div key={idx} className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{user.title}</h3>
                <p className="text-sm text-muted-foreground dark:text-zinc-300">{user.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  