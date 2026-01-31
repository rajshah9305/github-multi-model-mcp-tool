import { Toaster as Sonner } from "sonner"
import React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return <Sonner className="toaster group" {...props} />
}

export { Toaster }
