export default function VerticalMarquee({
  children,
  speed = '40s',
  reverse = false,
}) {
  return (
    <div className="relative overflow-hidden h-full flex flex-col items-center">
      <div
        className={`flex flex-col items-center gap-6 animate-vertical-marquee ${reverse ? 'animate-vertical-reverse' : ''}`}
        style={{ animationDuration: speed }}
      >
        {children}
      </div>
    </div>
  );
}
