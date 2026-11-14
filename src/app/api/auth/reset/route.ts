import { NextResponse } from "next/server";
import { getCurrentMember, getSession, SESSION_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSession();

  if (session?.role === "owner") {
    return NextResponse.redirect(new URL("/owner", request.url), 303);
  }

  if (session?.role === "member" && (await getCurrentMember())) {
    return NextResponse.redirect(new URL("/profil", request.url), 303);
  }

  const response = NextResponse.redirect(
    new URL(session ? "/masuk?expired=1" : "/masuk", request.url),
    303,
  );
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}