export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-[99999]">
      <div className="text-center">
        <h1 className="font-serif text-[clamp(3rem,10vw,6rem)] font-extrabold bg-gradient-to-r from-[var(--text-primary)] to-[var(--text-secondary)] bg-clip-text text-transparent mb-8 animate-[logoPulse_2s_infinite_ease-in-out]">AirNews</h1>
        <div className="w-[200px] h-1 bg-[var(--bg-tertiary)] rounded-sm mx-auto overflow-hidden">
          <div className="w-full h-full bg-[var(--accent-color)] animate-[loadingProgress_2s_infinite_ease-in-out] origin-left"></div>
        </div>
      </div>
    </div>
  );
}
