"use client"
import type React from "react"
import { useRef, useState, useEffect } from "react"
//components
import CustomButton from "@/lib/ui/useable-components/button"
// Icons
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction"
import useToast from "@/lib/hooks/useToast"
import { IVerificationEmailForChangePasswordProps } from "@/lib/utils/interfaces"
import EmailIcon from "@/public/assets/images/svgs/email"

// Hooks
import useVerifyOtp from "@/lib/hooks/useVerifyOtp"
import { useTranslations } from "next-intl"


const VerificationEmailForChangePassword = ({
  handleSubmitAfterVerification,
  handleResendEmailOtp,
  emailOtp,
  setEmailOtp,
  formData
}: IVerificationEmailForChangePasswordProps) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { showToast } = useToast();
  const { verifyOTP, error } = useVerifyOtp();

  // Hooks
  const t = useTranslations();


  // useEffect to handle resend email otp on first render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (formData?.email && isFirstRender.current) {
      handleResendEmailOtp();
      isFirstRender.current = false;
    }
  }, [formData?.email]);
  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)

    // Set initial values from phoneOtp if it exists
    if (emailOtp) {
      const otpArray = emailOtp.split("").slice(0, 6)
      setOtp(otpArray.concat(Array(6 - otpArray.length).fill("")))
    }
  }, [])

  // Update parent component's phoneOtp when our local otp changes
  useEffect(() => {
    setEmailOtp(otp.join(""))
  }, [otp, setEmailOtp])

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Only accept single digit numbers
    if (!/^\d*$/.test(value)) return

    // Update the OTP array
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Take only the last character
    setOtp(newOtp)

    // Auto-focus next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on an empty input
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Only accept digits
    const digits = pastedData.replace(/\D/g, "").slice(0, 6)

    if (digits) {
      const newOtp = [...Array(6).fill("")]
      digits.split("").forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit
      })
      setOtp(newOtp)

      // Focus the next empty input or the last input
      const lastFilledIndex = Math.min(digits.length, 5)
      inputRefs.current[lastFilledIndex]?.focus()
    }
  }

  // Handle form submission
  const handleSubmit = useDebounceFunction(async () => {

try {
  const otpResponse = await verifyOTP({
    variables: {
      otp: emailOtp,
      email: formData?.email
    }
  })

  if (otp.join("").length !== 6 || !otpResponse?.data?.verifyOtp) {
    return showToast({
      type: "error",
      title: "Error",
      message: "Please enter a valid OTP",
    })
  }else{
    handleSubmitAfterVerification()
  }

} catch (error) {
  showToast({
    type: "error",
    title: "Error",
    message: "An error occurred while verifying the phone number",
  })
}
  },
    500, // Debounce time in milliseconds
)
  
      // useEffect for displaying otp verification error
      useEffect(() => {
        if (error) {
          showToast({
            type: "error",
            title: t("OTP Error"),
            message: error.message,
          });
      }
      }, [error])

  return (
<div className="flex flex-col items-start justify-start w-full h-full px-4 py-6 md:px-8">
  <div className="flex flex-col justify-items-start justify-start text-left">
  <div className="mb-4">
    <EmailIcon />
  </div>

  <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
    We have sent OTP code to
  </h2>


  <p className="text-md sm:text-xl font-semibold text-gray-800 mb-3 break-words">
    {formData?.email || "your@email.com"}
  </p>

  <p className="text-base text-gray-600 mb-6">Verify your Email</p>
</div>
  <div className="w-full mb-6">
    <div className="flex justify-center flex-wrap gap-2">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16 text-xl text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#5AC12F] focus:ring-2 focus:ring-[#5AC12F] focus:ring-opacity-20"
          autoFocus={index === 0}
        />
      ))}
    </div>
  </div>

  <p className="text-sm text-gray-500 mb-6 text-center">Valid for 10 minutes</p>

  <CustomButton
    label="Continue"
    className="bg-[#5AC12F] text-white flex items-center justify-center rounded-full p-3 w-full mb-4 h-12 sm:h-14 text-lg sm:text-md font-medium"
    onClick={handleSubmit}
  />

  <CustomButton
    label="Resend OTP"
    className="bg-white text-black flex items-center justify-center rounded-full border border-gray-300 p-3 w-full h-12 sm:h-14 text-lg sm:text-md font-medium"
    onClick={handleResendEmailOtp}
  />
</div>

  )
}

export default VerificationEmailForChangePassword