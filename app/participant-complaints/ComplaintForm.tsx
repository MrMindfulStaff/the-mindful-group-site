"use client";

import { useState, useRef } from "react";

export default function ComplaintForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const sigCanvas = useRef<HTMLCanvasElement>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Signature pad logic
  function startSign(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    setIsSigning(true);
    const canvas = sigCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function drawSign(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isSigning) return;
    const canvas = sigCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.strokeStyle = "#1F2937";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSigned(true);
  }

  function endSign() { setIsSigning(false); }

  function clearSignature() {
    const canvas = sigCanvas.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const getValue = (name: string) => (form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)?.value || "";

    // Collect all checked checkboxes for rights violated and harm caused
    const rightsViolated = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="rightsViolated"]:checked')).map(cb => cb.value);
    const harmCaused = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="harmCaused"]:checked')).map(cb => cb.value);

    const data = {
      // Contact Information
      firstName: getValue("firstName"),
      lastName: getValue("lastName"),
      streetAddress: getValue("streetAddress"),
      city: getValue("city"),
      state: getValue("state"),
      zipCode: getValue("zipCode"),
      email: getValue("email"),
      phone: getValue("phone"),
      // Complaint Information
      complaintAbout: getValue("complaintAbout"),
      funderResponse: getValue("funderResponse"),
      rightsViolated,
      funderServiceProvider: getValue("funderServiceProvider"),
      trainingProvider: getValue("trainingProvider"),
      harmCaused,
      powerOfAttorney: getValue("powerOfAttorney"),
      meetingDate: getValue("meetingDate"),
      otherTrainingProvider: getValue("otherTrainingProvider"),
      desiredCourse: getValue("desiredCourse"),
      remedySeeking: getValue("remedySeeking"),
      otherExplanation: getValue("otherExplanation"),
      fileWithWorkforceBoard: getValue("fileWithWorkforceBoard"),
      hasSigned,
    };

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong.");
        return;
      }
      setStatus("success");
      form.reset();
      clearSignature();
    } catch {
      setStatus("error");
      setErrorMsg("Failed to send. Please call us at 833-414-MIND (6463).");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-text text-lg font-heading mb-2">Complaint Received</h3>
        <p className="text-text-light text-sm">
          Thank you for sharing your feedback. Your voice is important and we want you to be heard. Our team will review your complaint and respond within 3 business days.
        </p>
        <button onClick={() => setStatus("idle")} className="mt-4 text-primary text-sm uppercase tracking-wider hover:text-primary-light transition-colors">
          Submit Another Complaint
        </button>
      </div>
    );
  }

  const inputClass = "w-full bg-white border border-border-light rounded-md px-4 py-3 text-text text-sm focus:border-primary focus:outline-none transition-colors";
  const labelClass = "text-text-light text-xs uppercase tracking-wider block mb-2 font-semibold";
  const selectClass = `${inputClass} appearance-none`;
  const sectionClass = "mb-8";
  const sectionTitle = "text-text text-lg font-heading mb-4 pb-2 border-b border-border-light";

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* ── Contact Information ── */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>Contact Information</h2>
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name <span className="text-accent">*</span></label>
              <input id="firstName" name="firstName" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name <span className="text-accent">*</span></label>
              <input id="lastName" name="lastName" type="text" required className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="streetAddress" className={labelClass}>Street Address <span className="text-accent">*</span></label>
            <input id="streetAddress" name="streetAddress" type="text" required className={inputClass} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className={labelClass}>City <span className="text-accent">*</span></label>
              <input id="city" name="city" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="state" className={labelClass}>Region/State/Province <span className="text-accent">*</span></label>
              <input id="state" name="state" type="text" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="zipCode" className={labelClass}>Postal / Zip Code <span className="text-accent">*</span></label>
              <input id="zipCode" name="zipCode" type="text" required className={inputClass} />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className={labelClass}>Email <span className="text-accent">*</span></label>
              <input id="email" name="email" type="email" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone <span className="text-accent">*</span></label>
              <input id="phone" name="phone" type="tel" required className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Complaint Information ── */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>Complaint Information</h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="complaintAbout" className={labelClass}>Is this complaint about the training provider or a funding organization/service provider? <span className="text-accent">*</span></label>
            <select id="complaintAbout" name="complaintAbout" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="Funding Organization/Service Provider">Funding Organization/Service Provider</option>
              <option value="The Mindful Group/Training Provider">The Mindful Group/Training Provider</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="funderResponse" className={labelClass}>What response have you received from the Funder/Service Provider? <span className="text-accent">*</span></label>
            <select id="funderResponse" name="funderResponse" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="No response">No response</option>
              <option value="Delayed">Delayed</option>
              <option value="Told I've been waitlisted">Told I&apos;ve been waitlisted</option>
              <option value="Redirected">Redirected</option>
              <option value="Does not qualify for funding">Does not qualify for funding</option>
              <option value="Appt Scheduled for Months in the future">Appt Scheduled for Months in the future</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>What right do you believe was violated? <span className="text-accent">*</span></label>
            <div className="space-y-2 mt-1">
              {["Enrollment Delay", "Denial of Consumer Choice", "Failure to honor Authorized Representative", "Failure to process Eligibility", "Denial of Training Services", "Other"].map((right) => (
                <label key={right} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rightsViolated" value={right} className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                  <span className="text-text text-sm">{right}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="funderServiceProvider" className={labelClass}>Who is your Funder/Service Provider? <span className="text-accent">*</span></label>
            <select id="funderServiceProvider" name="funderServiceProvider" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="Dynamic Workforce Solutions">Dynamic Workforce Solutions</option>
              <option value="Maximus">Maximus</option>
              <option value="America Works">America Works</option>
              <option value="Ross">Ross</option>
              <option value="UMOS">UMOS</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="trainingProvider" className={labelClass}>Who is your chosen training provider? <span className="text-accent">*</span></label>
            <select id="trainingProvider" name="trainingProvider" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="The Mindful Group">The Mindful Group</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>What specific harm did this cause you? <span className="text-accent">*</span></label>
            <div className="space-y-2 mt-1">
              {["Missed Training Start Date", "Lost Wages", "Had to rearrange childcare", "Quit Job in anticipation of Training", "Other"].map((harm) => (
                <label key={harm} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="harmCaused" value={harm} className="w-4 h-4 rounded border-border-light text-primary focus:ring-primary" />
                  <span className="text-text text-sm">{harm}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="powerOfAttorney" className={labelClass}>Do you have a Limited Power of Attorney on file with The Mindful Group? <span className="text-accent">*</span></label>
            <select id="powerOfAttorney" name="powerOfAttorney" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label htmlFor="meetingDate" className={labelClass}>When did you meet with your Funder/Service Provider? <span className="text-accent">*</span></label>
            <input id="meetingDate" name="meetingDate" type="date" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="otherTrainingProvider" className={labelClass}>If other, provide training provider name.</label>
            <input id="otherTrainingProvider" name="otherTrainingProvider" type="text" className={inputClass} />
          </div>

          <div>
            <label htmlFor="desiredCourse" className={labelClass}>What is your desired training course? <span className="text-accent">*</span></label>
            <select id="desiredCourse" name="desiredCourse" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="CNA/CBRF">CNA/CBRF</option>
              <option value="Phlebotomy">Phlebotomy</option>
              <option value="Construction/Building Trades">Construction/Building Trades</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="remedySeeking" className={labelClass}>What remedy are you seeking? <span className="text-accent">*</span></label>
            <select id="remedySeeking" name="remedySeeking" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="Written Explanation of Delay">Written Explanation of Delay</option>
              <option value="Enrollment Processing">Enrollment Processing</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="otherExplanation" className={labelClass}>If Other, Please Explain.</label>
            <textarea id="otherExplanation" name="otherExplanation" rows={3} maxLength={2000} className={`${inputClass} resize-none`} />
          </div>

          <div>
            <label htmlFor="fileWithWorkforceBoard" className={labelClass}>Would you also like us to file this complaint with the Workforce Board (Employ Milwaukee)? <span className="text-accent">*</span></label>
            <select id="fileWithWorkforceBoard" name="fileWithWorkforceBoard" required className={selectClass}>
              <option value="">Choose an option</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Signature ── */}
      <div className={sectionClass}>
        <h2 className={sectionTitle}>Your Signature</h2>
        <div className="border border-border-light rounded-md bg-white p-1 mb-2">
          <canvas
            ref={sigCanvas}
            width={500}
            height={150}
            className="w-full cursor-crosshair touch-none"
            onMouseDown={startSign}
            onMouseMove={drawSign}
            onMouseUp={endSign}
            onMouseLeave={endSign}
            onTouchStart={startSign}
            onTouchMove={drawSign}
            onTouchEnd={endSign}
          />
        </div>
        <button type="button" onClick={clearSignature} className="text-accent text-xs uppercase tracking-wider hover:text-accent-light transition-colors">
          Clear Signature
        </button>

        <div className="mt-4 bg-surface rounded-md p-4">
          <p className="text-text-light text-xs leading-relaxed">
            I certify that the information provided is true and accurate. I voluntarily authorize The Mindful Group to submit this complaint to Wisconsin DWD and/or Employ Milwaukee on my behalf as my designated representative.
          </p>
        </div>
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full px-8 py-4 bg-accent text-white font-semibold text-sm uppercase tracking-wider rounded-md hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Submitting..." : "Submit"}
      </button>

      <p className="text-center text-text-light text-xs mt-4">
        Your voice is important and we want you to be heard!
      </p>
    </form>
  );
}
