import type { Metadata } from "next";
import Link from "next/link";
import { QCNA } from "@/lib/orientation-dates";
import { SPEAK_UP_TO, SPEAK_UP_CC, SPEAK_UP_SUBJECT, SPEAK_UP_BODY, speakUpCopyText, speakUpMailto } from "@/lib/speak-up";
import CopyButton from "./CopyButton";

export const metadata: Metadata = {
  title: "Speak Up | The Mindful Group",
  description: "Why The Mindful Group had to stop training, and a ready-to-send email you can use to speak up.",
  robots: { index: false, follow: false },
};

export default function SpeakUpPage() {
  return (
    <>
      <section className="pt-32 pb-10">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-primary text-sm uppercase tracking-[0.3em] mb-6 font-semibold">Speak Up</p>
          <h1 className="text-4xl md:text-5xl font-heading text-text leading-tight mb-8">
            Why we had to stop training, and <span className="text-accent">how you can speak up</span>
          </h1>
          <div className="space-y-4 text-text-light text-lg leading-relaxed">
            <p>
              <strong className="text-text">This was not our choice.</strong> For almost two years, the local workforce
              board, Employ Milwaukee, and the funding system around it have blocked students who chose The Mindful
              Group from being enrolled with us. Without those enrollments, we cannot keep training.
            </p>
            <p>
              We have fought for this community for 10 years. In 2023, our CNA/CBRF students completed training at a
              higher rate than the Milwaukee-area average (82.8% vs. 77.6%). We invested to move our training center
              closer to the inner city and quadrupled our training capacity. We still have not been told why our
              students are now being blocked. Unfortunately, some people don&apos;t like that, and the system is built in
              a way that keeps our people trapped.
            </p>
            <p>
              We will keep fighting for you, but we have to do it differently. As long as they control the flow of
              students, they hold the power.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-lg border border-border-light shadow-sm p-6 md:p-8">
            <h2 className="text-2xl font-heading text-text mb-3">You have a voice in this</h2>
            <p className="text-text-light mb-4">
              Under the federal Workforce Innovation and Opportunity Act (WIOA), you have the right to choose your
              training provider from the state&apos;s approved list, and the right to file a complaint if you believe
              that choice was blocked. If you want to speak up, send the email below. Fill in the brackets and change
              anything that isn&apos;t true for you. <strong className="text-text">Please keep reginald@mindfulstaff.com
              on CC</strong> so we have a record.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <a
                href={speakUpMailto()}
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
              >
                Open it in my email app
              </a>
              <CopyButton text={speakUpCopyText()} />
            </div>

            <div className="rounded-md border border-border-light bg-surface p-4 text-sm text-text space-y-2 overflow-x-auto">
              <p className="break-words"><strong>To:</strong> {SPEAK_UP_TO.join("; ")}</p>
              <p className="break-words"><strong>CC:</strong> {SPEAK_UP_CC}</p>
              <p className="break-words"><strong>Subject:</strong> {SPEAK_UP_SUBJECT}</p>
              <pre className="whitespace-pre-wrap font-sans pt-2 border-t border-border-light">{SPEAK_UP_BODY}</pre>
            </div>

            <p className="text-text-light text-sm mt-6">
              Other ways to file a formal complaint, including with the State and the U.S. Department of Labor, are on
              our <Link href="/participant-complaints" className="text-primary font-semibold underline">complaints page</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <div className="rounded-lg border border-border-light bg-surface p-6 text-text-light">
            <p>
              If you still want CNA/CBRF training now, contact our training partner{" "}
              <strong className="text-text">{QCNA.name}</strong> at{" "}
              <a href={QCNA.phoneHref} className="text-primary font-semibold underline">{QCNA.phone}</a> or{" "}
              <a href={`mailto:${QCNA.email}`} className="text-primary font-semibold underline">{QCNA.email}</a>, and tell
              them The Mindful Group sent you.
            </p>
            <p className="mt-3">
              Questions? Call <a href="tel:8334146463" className="text-primary font-semibold underline">833-414-MIND (6463)</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
