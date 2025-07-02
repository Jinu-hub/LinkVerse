import { Button } from "~/core/components/ui/button"
import { Link } from "react-router"

export default function FinalCTASection() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 dark:from-zinc-900 dark:to-zinc-950 py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">지금 바로 시작해보세요</h2>
        <p className="text-muted-foreground dark:text-zinc-300">
          복잡한 정리는 이제 그만. 북마크의 새로운 방식, 지금 경험해보세요.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/join" viewTransition>
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600 dark:text-zinc-900">시작하기</Button>
          </Link>
          <Link to="/login" viewTransition>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-zinc-300 text-gray-900 dark:border-zinc-700 dark:text-zinc-100">로그인</Button> 
          </Link>
        </div>
      </div>
    </section>
  )
}
