"use client"

import { useRef, useState, useEffect, useCallback } from "react"

export default function RegistrationForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [drawing, setDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [signatureStatus, setSignatureStatus] = useState("")
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [signatureData, setSignatureData] = useState("")

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#000"
  }, [])

  useEffect(() => {
    initCanvas()
    window.addEventListener("resize", initCanvas)
    return () => window.removeEventListener("resize", initCanvas)
  }, [initCanvas])

  // Get canvas coordinates from event
  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()

    if ("touches" in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }

    if ("nativeEvent" in e && "offsetX" in e.nativeEvent) {
      return {
        x: (e.nativeEvent as MouseEvent).offsetX,
        y: (e.nativeEvent as MouseEvent).offsetY,
      }
    }

    return { x: 0, y: 0 }
  }

  // Drawing function
  const drawLine = (x: number, y: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
    setHasSignature(true)
  }

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setDrawing(true)
    const coords = getCanvasCoordinates(e)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) return

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
  }

  // Stop drawing
  const stopDrawing = () => {
    if (drawing) {
      setDrawing(false)
      const canvas = canvasRef.current
      const ctx = canvas?.getContext("2d")
      if (ctx) {
        ctx.beginPath()
      }
      if (hasSignature) {
        setSignatureStatus("Signature captured")
      }
    }
  }

  // Draw while moving
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawing) return
    e.preventDefault()
    const coords = getCanvasCoordinates(e)
    drawLine(coords.x, coords.y)
  }

  // Clear signature
  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setSignatureStatus("Signature cleared")
    setSignatureData("")
  }

  // Handle photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const canvas = canvasRef.current
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png")
      setSignatureData(dataUrl)
    }

    if (!hasSignature) {
      const confirmSubmit = window.confirm(
        "You haven't added a signature. Do you want to continue without a signature?"
      )
      if (!confirmSubmit) {
        e.preventDefault()
        return
      }
    }

    // For demo purposes, prevent actual form submission
    e.preventDefault()
    alert("Form submitted successfully! (Demo mode - no actual submission)")
  }

  return (
    <main className="min-h-screen bg-muted p-4">
      <form
        id="registrationForm"
        onSubmit={handleSubmit}
        className="mx-auto max-w-3xl rounded-lg bg-background p-5 shadow-md"
        aria-labelledby="form-title"
      >
        {/* HEADER */}
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex h-16 w-48 items-center justify-center rounded border border-border bg-muted text-sm text-muted-foreground">
            HSE Drive Logo
          </div>
          <address className="text-sm not-italic">
            <p>
              Tel: <a href="tel:0302712082" className="text-primary hover:underline">0302712082</a> /{" "}
              <a href="tel:0501398025" className="text-primary hover:underline">0501398025</a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:info@hsedrivegh.com" className="text-primary hover:underline">
                info@hsedrivegh.com
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://hsedrivegh.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                hsedrivegh.com
              </a>
            </p>
            <p>Loc: Sakumono Estate junction, adjacent C&J Hospital</p>
          </address>
        </header>

        {/* PHOTO UPLOAD */}
        <div className="float-right mb-4 ml-4 w-36 rounded border-2 border-foreground bg-muted p-2 text-center">
          <label htmlFor="photoUpload" className="mb-2 block font-bold">
            Passport Photo
          </label>
          <input
            type="file"
            id="photoUpload"
            name="photoUpload"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="w-full text-xs"
            aria-describedby="photo-hint"
          />
          <span id="photo-hint" className="sr-only">
            Upload a passport-sized photo in JPG, PNG, or GIF format
          </span>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview of uploaded passport photo"
              className="mt-2 h-28 w-full border border-border object-cover"
            />
          )}
        </div>

        <h1 id="form-title" className="my-5 text-center text-2xl font-bold underline">
          REGISTRATION FORM
        </h1>

        {/* PERSONAL INFORMATION */}
        <fieldset className="mb-5 rounded border border-foreground p-4">
          <legend className="px-2 font-bold">Personal Information</legend>

          <div className="mb-4">
            <label htmlFor="surname" className="mb-1 block font-medium">
              Surname: <span className="font-bold text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="surname"
              name="surname"
              required
              aria-required="true"
              autoComplete="family-name"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="firstname" className="mb-1 block font-medium">
              First Name: <span className="font-bold text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              required
              aria-required="true"
              autoComplete="given-name"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="othernames" className="mb-1 block font-medium">
              Other Names:
            </label>
            <input
              type="text"
              id="othernames"
              name="othernames"
              autoComplete="additional-name"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <fieldset className="mb-4 border-none p-0" role="radiogroup" aria-labelledby="sex-label">
            <legend id="sex-label" className="mb-2 font-medium">
              Sex:
            </legend>
            <div className="flex flex-wrap gap-6">
              <label htmlFor="male" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
                <input type="radio" name="sex" value="Male" id="male" className="cursor-pointer" />
                <span>Male</span>
              </label>
              <label htmlFor="female" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
                <input type="radio" name="sex" value="Female" id="female" className="cursor-pointer" />
                <span>Female</span>
              </label>
            </div>
          </fieldset>

          <div className="mb-4">
            <label htmlFor="nationality" className="mb-1 block font-medium">
              Nationality:
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              autoComplete="country-name"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="dob" className="mb-1 block font-medium">
              Date of Birth:
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              autoComplete="bday"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="telephone" className="mb-1 block font-medium">
              Telephone:
            </label>
            <input
              type="tel"
              id="telephone"
              name="phone"
              autoComplete="tel"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-1 block font-medium">
              Email: <span className="font-bold text-destructive" aria-hidden="true">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              aria-required="true"
              autoComplete="email"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </fieldset>

        {/* EMERGENCY CONTACT */}
        <fieldset className="mb-5 rounded border border-foreground p-4">
          <legend className="px-2 font-bold">Emergency Contact</legend>

          <div className="mb-4">
            <label htmlFor="emergency_name" className="mb-1 block font-medium">
              Name:
            </label>
            <input
              type="text"
              id="emergency_name"
              name="emergency_name"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="emergency_phone" className="mb-1 block font-medium">
              Telephone:
            </label>
            <input
              type="tel"
              id="emergency_phone"
              name="emergency_phone"
              className="w-full rounded border border-input bg-background px-3 py-2 text-base transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </fieldset>

        {/* SIGNATURE SECTION */}
        <fieldset className="mb-5 rounded border border-foreground p-4">
          <legend id="signature-label" className="px-2 font-bold">
            Signature
          </legend>
          <p id="signature-instructions" className="mb-3 text-sm text-muted-foreground">
            Use your mouse, finger, or stylus to draw your signature in the box below.
          </p>
          <div className="mb-3">
            <canvas
              ref={canvasRef}
              id="signaturePad"
              className="block h-36 w-full cursor-crosshair touch-none rounded border-2 border-foreground bg-background focus:outline-2 focus:outline-primary"
              role="img"
              aria-labelledby="signature-label"
              aria-describedby="signature-instructions"
              tabIndex={0}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
            <p className="sr-only" aria-live="polite">
              {signatureStatus}
            </p>
          </div>
          <button
            type="button"
            onClick={clearSignature}
            className="rounded border border-input bg-muted px-4 py-2 text-foreground transition-colors hover:bg-muted/80 focus:outline-2 focus:outline-primary"
          >
            Clear Signature
          </button>
          <input type="hidden" id="signatureData" name="signatureData" value={signatureData} />
        </fieldset>

        {/* TRAINING CHOICES */}
        <fieldset className="mb-5 rounded border border-foreground p-4">
          <legend id="training-label" className="px-2 font-bold">
            Choice of Training
          </legend>
          <div className="flex flex-col gap-3" role="group" aria-labelledby="training-label">
            <label htmlFor="super-express" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
              <input type="checkbox" id="super-express" name="training" value="Super-Express" className="cursor-pointer" />
              <span>Super-Express Driving</span>
            </label>
            <label htmlFor="express" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
              <input type="checkbox" id="express" name="training" value="Express" className="cursor-pointer" />
              <span>Express Driving</span>
            </label>
            <label htmlFor="normal" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
              <input type="checkbox" id="normal" name="training" value="Normal" className="cursor-pointer" />
              <span>Normal Driving</span>
            </label>
            <label htmlFor="hourly" className="flex cursor-pointer items-center gap-2 rounded p-1 hover:bg-muted">
              <input type="checkbox" id="hourly" name="training" value="Hourly" className="cursor-pointer" />
              <span>Hourly Drive</span>
            </label>
          </div>
        </fieldset>

        {/* BUTTONS */}
        <div className="mt-5 flex flex-wrap gap-3" role="group" aria-label="Form actions">
          <button
            type="submit"
            className="rounded bg-primary px-5 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-2 focus:outline-primary focus:outline-offset-2"
          >
            Submit Registration
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            aria-label="Print this registration form"
            className="rounded border border-input bg-muted px-5 py-3 text-foreground transition-colors hover:bg-muted/80 focus:outline-2 focus:outline-primary focus:outline-offset-2"
          >
            Print
          </button>
        </div>
      </form>
    </main>
  )
}
