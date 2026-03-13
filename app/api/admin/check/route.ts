import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ isAdmin: false }, { status: 401 })
  }
  return NextResponse.json({ isAdmin: session.user.isAdmin })
}
