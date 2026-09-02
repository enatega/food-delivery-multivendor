import { NextRequest, NextResponse } from "next/server";
import { APP_MODES, getModeEnvironment, isAppMode } from "@/lib/mode";

const errorResponse = (message: string, status: number) =>
  NextResponse.json(
    { success: false, error: { code: "REVERSE_GEOCODE_FAILED", message } },
    { status },
  );

export async function GET(request: NextRequest) {
  const modeValue = request.nextUrl.searchParams.get("mode")?.toUpperCase();
  const mode = isAppMode(modeValue) ? modeValue : APP_MODES.MULTI;
  const latitude = Number(request.nextUrl.searchParams.get("latitude"));
  const longitude = Number(request.nextUrl.searchParams.get("longitude"));

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    return errorResponse("Valid coordinates are required.", 400);
  }

  const target = new URL(
    "maps/reverse-geocode",
    getModeEnvironment(mode).restUrl,
  );
  target.searchParams.set("latitude", String(latitude));
  target.searchParams.set("longitude", String(longitude));
  target.searchParams.set(
    "language",
    request.nextUrl.searchParams.get("language") || "en",
  );

  try {
    const response = await fetch(target, {
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : "Reverse geocoding failed.",
      502,
    );
  }
}
