import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ message: "Token ve şifre gereklidir." }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Şifre en az 6 karakter olmalıdır." }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Verify the token from the database
    const { data: resetToken, error: tokenError } = await supabase
      .from("password_reset_tokens")
      .select("*")
      .eq("token", token)
      .single()

    if (tokenError || !resetToken) {
      return NextResponse.json({ message: "Geçersiz veya süresi dolmuş token." }, { status: 400 })
    }

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      // Delete expired token
      await supabase.from("password_reset_tokens").delete().eq("token", token)
      return NextResponse.json({ message: "Şifre sıfırlama bağlantısının süresi dolmuş." }, { status: 400 })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the user's password in the database
    const { error: updateError } = await supabase.auth.admin.updateUserById(resetToken.user_id, {
      password: hashedPassword,
    })

    if (updateError) {
      return NextResponse.json({ message: "Şifre güncellenirken bir hata oluştu." }, { status: 500 })
    }

    // Delete the used token
    await supabase.from("password_reset_tokens").delete().eq("token", token)

    return NextResponse.json({ message: "Şifre başarıyla güncellendi." })
  } catch (error) {
    console.error("Error resetting password:", error)
    return NextResponse.json({ message: "Şifre güncellenirken bir hata oluştu." }, { status: 500 })
  }
}
