import React from "react";

export const SiteFooter = React.memo(function SiteFooter() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-3">
          <p lang="he">
            © {new Date().getFullYear()} אפרסמון - כל הזכויות שמורות
          </p>
          <p lang="he">
            פלטפורמת AI מתקדמת לעסקים ישראלים
          </p>
        </div>
      </div>
    </footer>
  );
});
