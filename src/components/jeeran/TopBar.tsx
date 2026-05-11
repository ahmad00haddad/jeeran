export function TopBar() {
  return (
    <div className="bg-deep text-cream text-xs border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center gap-6 flex-wrap">
        <span>✦ ملابس مستعملة نظيفة من بيوتنا الأردنية</span>
        <span className="text-gold hidden md:inline">✦ الدفع كاش عند الاستلام</span>
        <span className="hidden md:inline">✦ كل قطعة مفحوصة قبل ما توصلك</span>
      </div>
    </div>
  );
}
