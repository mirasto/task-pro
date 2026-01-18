"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string
    alt?: string
    fallback?: string
    size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
        const [imageError, setImageError] = React.useState(false)
        const showFallback = !src || imageError

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex shrink-0 overflow-hidden rounded-full bg-muted",
                    sizeClasses[size],
                    className
                )}
                {...props}
            >
                {!showFallback ? (
                    <img
                        src={src}
                        alt={alt || "Avatar"}
                        onError={() => setImageError(true)}
                        className="aspect-square h-full w-full object-cover"
                    />
                ) : (
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 font-medium text-primary-foreground">
                        {fallback || "?"}
                    </span>
                )}
            </div>
        )
    }
)
Avatar.displayName = "Avatar"

export { Avatar }
