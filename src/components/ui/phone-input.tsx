import Inputmask from "inputmask"
import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"

export function MaskedPhoneInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (ref.current) {
      Inputmask("(99) 99999-9999").mask(ref.current)
    }
  }, [])

  return (
    <Input
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
