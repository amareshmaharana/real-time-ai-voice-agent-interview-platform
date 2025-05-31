import InterviewCard from "@/components/InterviewCard"
import { Button } from "@/components/ui/button"
import { dummyInterviews } from "@/constants/index"

import Image from "next/image"
import Link from "next/link"

const page = () => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 mx-w-lg">
          <h2>Get interview-ready with AI-powered practice & feedback.</h2>
          <p className="text-lg">Practice on real time interview questions & get instant feedback.</p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">
              Start an Interview
            </Link>
          </Button>
        </div>

        <Image src="/robot.png" alt="robo" width={400} height={400} className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interview sessions</h2>

        <div className="interviews-section">
          {/* <p>You haven&apos;t taken any interviews yet!!</p> */}
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
          {/* <p>There are no interviews available!!</p> */}
        </div>
      </section>
    </>
  )
}

export default page