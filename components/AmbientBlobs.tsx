"use client";

export default function AmbientBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      {/* Primary indigo blob — top left */}
      <div
        className="absolute rounded-full opacity-[0.12] blur-[100px]"
        style={{
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, #6C74E8 0%, #4C54C8 50%, transparent 70%)",
          top: "-150px",
          left: "-100px",
          animation: "float-slow 18s ease-in-out infinite",
        }}
      />
      {/* Teal blob — top right */}
      <div
        className="absolute rounded-full opacity-[0.09] blur-[120px]"
        style={{
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, #0EA5C9 0%, #0284A0 50%, transparent 70%)",
          top: "100px",
          right: "-80px",
          animation: "float-slow-2 22s ease-in-out infinite",
        }}
      />
      {/* Violet blob — center */}
      <div
        className="absolute rounded-full opacity-[0.07] blur-[140px]"
        style={{
          width: "700px",
          height: "700px",
          background: "radial-gradient(circle, #8B5CF6 0%, #6C74E8 40%, transparent 70%)",
          top: "40%",
          left: "30%",
          transform: "translate(-50%, -50%)",
          animation: "float-slow-3 26s ease-in-out infinite",
        }}
      />
      {/* Gold accent — bottom right */}
      <div
        className="absolute rounded-full opacity-[0.06] blur-[100px]"
        style={{
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)",
          bottom: "10%",
          right: "10%",
          animation: "float-slow 30s ease-in-out infinite reverse",
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(108,116,232,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(108,116,232,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
