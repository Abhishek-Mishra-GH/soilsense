import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateSalt, hashPassword } from "@/auth/passwordHasher";
import { createUserSession, SESSION_EXPIRATION_SECONDS } from "@/auth/session";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, farmLocation, farmSize } =
      await request.json();

    const salt = generateSalt();
    const hashedPassword = await hashPassword(password, salt);

    // TODO: Save user in DB
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        hashedPassword,
        salt,
        farmLocation,
        farmSize,
      },
    });

    // generate session
    const sessionData = { id: user.id, firstName, lastName, email, farmLocation, farmSize };
    const sessionId = await createUserSession(sessionData);

    const response = NextResponse.json({ message: "User registered!" });
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_EXPIRATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error(
      "signup error",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
