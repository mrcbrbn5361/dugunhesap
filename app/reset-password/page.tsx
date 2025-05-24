"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { GoldIcon } from "@/components/gold-icon"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we have the access token in the URL
    const hash = window.location.hash
    if (!hash || !hash.includes("access_token")) {
      setError("Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı.")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.")
      return
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      toast({
        title: "Şifre güncellendi",
        description: "Şifreniz başarıyla güncellendi. Şimdi giriş yapabilirsiniz.",
      })

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err: any) {
      console.error("Password update error:", err)

      if (err.message === "Failed to fetch") {
        setError("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.")
      } else {
        setError(err?.message || "Şifre güncellenirken bir hata oluştu.")
      }

      toast({
        title: "Hata",
        description: "Şifre güncellenemedi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 p-4">
      <Link href="/" className="flex items-center gap-2 mb-8">
        <GoldIcon className="h-8 w-8 text-amber-600" />
        <span className="text-2xl font-bold text-amber-800">Düğün Hesap</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Şifreyi Güncelle</CardTitle>
          <CardDescription className="text-center">Lütfen yeni şifrenizi belirleyin</CardDescription>
        </CardHeader>
        {isSuccess ? (
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...
              </AlertDescription>
            </Alert>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="password">Yeni Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Şifreniz en az 6 karakter olmalıdır.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-700"
                disabled={isLoading || error === "Geçersiz veya süresi dolmuş şifre sıfırlama bağlantısı."}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Güncelleniyor...
                  </>
                ) : (
                  "Şifreyi Güncelle"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
        <CardFooter className="pt-0">
          <Link
            href="/login"
            className="flex items-center text-sm text-amber-600 hover:underline w-full justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Giriş sayfasına dön
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
