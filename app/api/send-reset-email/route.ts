import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import nodemailer from "nodemailer"
import { getSupabaseServerClient } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ message: "E-posta adresi gereklidir." }, { status: 400 })
    }

    // Check if the user exists in the database
    const supabase = getSupabaseServerClient()
    const { data: userQuery, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .single()

    // For security reasons, don't reveal if the user exists or not
    // Just proceed as if the email was sent
    if (userError) {
      console.log("User not found:", email)
      return NextResponse.json({ message: "Şifre sıfırlama bağlantısı gönderildi." })
    }

    // Generate a unique token
    const token = uuidv4()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1) // Token expires in 1 hour

    // Save the token to the database
    const { error: tokenError } = await supabase.from("password_reset_tokens").insert({
      token,
      user_id: userQuery.id,
      email,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenError) {
      console.error("Error saving token:", tokenError)
      return NextResponse.json(
        { message: "Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu." },
        { status: 500 },
      )
    }

    // Create the reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    // Email content
    const mailOptions = {
      from: `"Düğün Hesap" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Düğün Hesap - Şifre Sıfırlama",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309; text-align: center;">Düğün Hesap</h2>
          <h3>Şifre Sıfırlama</h3>
          <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #d97706; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
              Şifremi Sıfırla
            </a>
          </div>
          <p>Bu bağlantı 1 saat boyunca geçerlidir.</p>
          <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="text-align: center; color: #666; font-size: 12px;">
            © ${new Date().getFullYear()} Düğün Hesap. Tüm hakları saklıdır.
          </p>
        </div>
      `,
    }

    // Send email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ message: "Şifre sıfırlama bağlantısı gönderildi." })
  } catch (error) {
    console.error("Error sending reset email:", error)
    return NextResponse.json({ message: "Şifre sıfırlama bağlantısı gönderilirken bir hata oluştu." }, { status: 500 })
  }
}
