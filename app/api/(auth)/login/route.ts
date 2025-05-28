import { comparePasswords } from "@/auth/passwordHasher";
import { createUserSession, SESSION_EXPIRATION_SECONDS } from "@/auth/session";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required!" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User does not exist!" },
        { status: 404 }
      );
    }

    const hashedPassword = user.hashedPassword;
    const salt = user.salt;

    if (!(await comparePasswords({ password, salt, hashedPassword }))) {
      return NextResponse.json(
        { message: "Incorrect Email or Password!" },
        { status: 401 }
      );
    }

    // Create session
    const sessionId = await createUserSession({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email,
    });

    const response = NextResponse.json({ message: "Login successful!" });
    response.cookies.set("session", sessionId, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: SESSION_EXPIRATION_SECONDS,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
