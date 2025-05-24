"use client"

import type React from "react"

import { useState } from "react"
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!email) {
      setError("E-posta adresi gereklidir.")
      setIsLoading(false)
      return
    }

    try {
      const supabase = getSupabaseBrowserClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }

      setIsSuccess(true)
      toast({
        title: "E-posta gönderildi",
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.",
      })
    } catch (err: any) {
      console.error("Password reset error:", err)

      if (err.message === "Failed to fetch") {
        setError("Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.")
      } else {
        setError(err?.message || "Şifre sıfırlama işlemi sırasında bir hata oluştu.")
      }

      toast({
        title: "Hata",
        description: "Şifre sıfırlama bağlantısı gönderilemedi.",
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
          <CardTitle className="text-2xl text-center">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-center">Şifrenizi sıfırlamak için e-posta adresinizi girin</CardDescription>
        </CardHeader>
        {isSuccess ? (
          <CardContent className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-postanızı kontrol edin.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground text-center">
              E-posta gelmedi mi? Spam klasörünüzü kontrol edin veya tekrar deneyin.
            </p>
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
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gönderiliyor...
                  </>
                ) : (
                  "Şifre Sıfırlama Bağlantısı Gönder"
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
