// app/api/draft-mode/disable/route.ts
//
// Called when the marketer exits the live preview / closes the preview panel.
// Disables Next.js Draft Mode so normal published content is shown again.

import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const redirectTo = searchParams.get("redirect") || "/";

    (await draftMode()).disable();
    redirect(redirectTo);
}
