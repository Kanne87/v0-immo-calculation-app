import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || ""
const PAYLOAD_KEY = process.env.PAYLOAD_API_KEY || ""

// ─── GET: Fetch advisor profile for current user ─────────────────
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sub = session.user.id

  // Try Payload CMS
  if (PAYLOAD_URL && PAYLOAD_KEY) {
    try {
      const res = await fetch(
        `${PAYLOAD_URL}/api/advisor-profiles?where[authentikSub][equals]=${encodeURIComponent(sub)}&limit=1`,
        {
          headers: { Authorization: `users API-Key ${PAYLOAD_KEY}` },
          cache: "no-store",
        }
      )
      if (res.ok) {
        const data = await res.json()
        if (data.docs?.length > 0) {
          const doc = data.docs[0]
          return NextResponse.json({
            profile: {
              authentikSub: doc.authentikSub,
              firstName: doc.firstName,
              lastName: doc.lastName,
              email: doc.email,
              phone: doc.phone,
              street: doc.street,
              zip: doc.zip,
              city: doc.city,
              createdAt: doc.createdAt,
              updatedAt: doc.updatedAt,
            },
          })
        }
      }
    } catch (e) {
      console.error("Payload fetch error:", e)
    }
  }

  // No profile found
  return NextResponse.json({ profile: null })
}

// ─── POST: Create or update advisor profile ──────────────────────
export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sub = session.user.id
  const body = await request.json()

  const profile = {
    authentikSub: sub,
    firstName: body.firstName || "",
    lastName: body.lastName || "",
    email: body.email || session.user.email || "",
    phone: body.phone || "",
    street: body.street || "",
    zip: body.zip || "",
    city: body.city || "",
  }

  // Try Payload CMS
  if (PAYLOAD_URL && PAYLOAD_KEY) {
    try {
      // Check if profile exists
      const checkRes = await fetch(
        `${PAYLOAD_URL}/api/advisor-profiles?where[authentikSub][equals]=${encodeURIComponent(sub)}&limit=1`,
        {
          headers: { Authorization: `users API-Key ${PAYLOAD_KEY}` },
          cache: "no-store",
        }
      )

      if (checkRes.ok) {
        const checkData = await checkRes.json()

        if (checkData.docs?.length > 0) {
          // Update existing
          const docId = checkData.docs[0].id
          const updateRes = await fetch(
            `${PAYLOAD_URL}/api/advisor-profiles/${docId}`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `users API-Key ${PAYLOAD_KEY}`,
              },
              body: JSON.stringify(profile),
            }
          )
          if (updateRes.ok) {
            const updated = await updateRes.json()
            return NextResponse.json({ profile: { ...profile, updatedAt: updated.updatedAt } })
          }
        } else {
          // Create new
          const createRes = await fetch(
            `${PAYLOAD_URL}/api/advisor-profiles`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `users API-Key ${PAYLOAD_KEY}`,
              },
              body: JSON.stringify(profile),
            }
          )
          if (createRes.ok) {
            const created = await createRes.json()
            return NextResponse.json({ profile: { ...profile, createdAt: created.createdAt } })
          }
        }
      }
    } catch (e) {
      console.error("Payload save error:", e)
    }
  }

  // Fallback: return profile anyway (stored client-side via localStorage)
  return NextResponse.json({ profile })
}
