"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GoldIcon } from "@/components/gold-icon"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function MainNav() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      label: "Ana Sayfa",
      active: pathname === "/dashboard",
    },
    {
      href: "/events",
      label: "Etkinliklerim",
      active: pathname === "/events",
    },
    {
      href: "/events/new",
      label: "Etkinlik Ekle",
      active: pathname === "/events/new",
    },
    {
      href: "/gifts",
      label: "Hediye Ekle",
      active: pathname === "/gifts",
    },
    {
      href: "/reports",
      label: "Raporlar",
      active: pathname === "/reports",
    },
    {
      href: "/settings",
      label: "Ayarlar",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6 lg:gap-10">
        <Link href="/dashboard" className="flex items-center gap-2">
          <GoldIcon className="h-6 w-6 text-amber-600" />
          <span className="font-bold text-xl hidden md:inline-block">Düğün Hesap</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-amber-600",
                route.active ? "text-amber-600" : "text-muted-foreground",
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="text-muted-foreground hover:text-amber-600" onClick={() => signOut()}>
          Çıkış Yap
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {routes.map((route) => (
              <DropdownMenuItem key={route.href} asChild>
                <Link href={route.href}>{route.label}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem onClick={() => signOut()}>Çıkış Yap</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
