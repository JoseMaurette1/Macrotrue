import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 108,
          background: "#36343d",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: "18%",
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        M
      </div>
    ),
    {
      ...size,
    }
  );
}
